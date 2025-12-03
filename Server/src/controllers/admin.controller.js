import { HelpRequest } from "../models/helpRequest.model.js";
import { User } from "../models/user.model.js";
import { Donation } from "../models/donation.model.js";

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get counts
        const stats = {
            totalHelpRequests: await HelpRequest.countDocuments(),
            pendingRequests: await HelpRequest.countDocuments({ status: "pending" }),
            completedRequests: await HelpRequest.countDocuments({ status: "completed" }),
            totalVolunteers: await User.countDocuments({ role: "volunteer" }),
            totalVictims: await User.countDocuments({ role: "victim" })
        };

        // Get donations stats
        const donationStats = await Donation.aggregate([
            {
                $match: { status: "completed" }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalDonations: { $sum: 1 }
                }
            }
        ]).then(res => res[0] || { totalAmount: 0, totalDonations: 0 });

        // Get recent help requests
        const recentRequests = await HelpRequest.find()
            .populate('user', 'name')
            .populate('assignedVolunteer', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            stats: {
                ...stats,
                ...donationStats
            },
            recentRequests
        });

    } catch (error) {
        console.error("getDashboardStats error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats",
            error: error.message
        });
    }
}

// Get help requests heatmap data
const getHeatmapData = async (req, res) => {
    try {
        const { status } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const heatmapData = await HelpRequest.aggregate([
            {
                $match: filter
            },
            {
                $group: {
                    _id: {
                        coordinates: "$location.coordinates",
                        type: "$typeOfHelp"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    location: "$_id.coordinates",
                    type: "$_id.type",
                    weight: "$count",
                    _id: 0
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            heatmapData
        });

    } catch (error) {
        console.error("getHeatmapData error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching heatmap data",
            error: error.message
        });
    }
}

// Get help requests analytics
const getRequestAnalytics = async (req, res) => {
    try {
        // Get requests by type
        const requestsByType = await HelpRequest.aggregate([
            {
                $group: {
                    _id: "$typeOfHelp",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get requests by status
        const requestsByStatus = await HelpRequest.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get daily requests count (last 7 days)
        const last7Days = await HelpRequest.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            analytics: {
                byType: requestsByType,
                byStatus: requestsByStatus,
                daily: last7Days
            }
        });

    } catch (error) {
        console.error("getRequestAnalytics error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching request analytics",
            error: error.message
        });
    }
}

// Get volunteer performance metrics
const getVolunteerMetrics = async (req, res) => {
    try {
        const volunteerStats = await HelpRequest.aggregate([
            {
                $match: {
                    assignedVolunteer: { $exists: true }
                }
            },
            {
                $group: {
                    _id: "$assignedVolunteer",
                    totalRequests: { $sum: 1 },
                    completedRequests: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "volunteer"
                }
            },
            {
                $unwind: "$volunteer"
            },
            {
                $project: {
                    name: "$volunteer.name",
                    totalRequests: 1,
                    completedRequests: 1,
                    completionRate: {
                        $multiply: [
                            { $divide: ["$completedRequests", "$totalRequests"] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { completedRequests: -1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            volunteerStats
        });

    } catch (error) {
        console.error("getVolunteerMetrics error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching volunteer metrics",
            error: error.message
        });
    }
}

// Update help request status (admin override)
const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedVolunteer, adminNotes } = req.body;

        const helpRequest = await HelpRequest.findByIdAndUpdate(
            id,
            {
                $set: {
                    status,
                    ...(assignedVolunteer && { assignedVolunteer }),
                    ...(adminNotes && { adminNotes })
                }
            },
            { new: true }
        )
        .populate('user', 'name')
        .populate('assignedVolunteer', 'name');

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: "Help request not found"
            });
        }

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('helpRequestUpdated', helpRequest);
        }

        return res.status(200).json({
            success: true,
            message: "Help request updated successfully",
            helpRequest
        });

    } catch (error) {
        console.error("updateRequestStatus error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating request status",
            error: error.message
        });
    }
}

// Get system audit logs (basic version)
const getAuditLogs = async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;

        const filter = {};
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        if (type) filter.type = type;

        // This assumes you have an AuditLog model
        // You'll need to create this and log events
        const logs = await AuditLog.find(filter)
            .sort({ createdAt: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            logs
        });

    } catch (error) {
        console.error("getAuditLogs error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching audit logs",
            error: error.message
        });
    }
}

export {
    getDashboardStats,
    getHeatmapData,
    getRequestAnalytics,
    getVolunteerMetrics,
    updateRequestStatus,
    getAuditLogs
}