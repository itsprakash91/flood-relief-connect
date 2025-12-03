import { HelpRequest } from "../models/helpRequest.model.js";

// Create a new help request
const createHelpRequest = async (req, res) => {
    console.log("Incoming body:", req.body);
    try {
        const { typeOfHelp, description, location } = req.body;

        // Validate required fields
        if (!typeOfHelp || !description || !location || !location.coordinates) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Create help request
        const helpRequest = await HelpRequest.create({
            user: req.user?._id, // optional: anonymous requests allowed
            typeOfHelp,
            description,
            location: {
                type: "Point",
                coordinates: location.coordinates,
                address: location.address
            }
        });

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.emit('helpRequestCreated', helpRequest);
        }

        return res.status(201).json({
            success: true,
            message: "Help request created successfully",
            helpRequest
        });

    } catch (error) {
        console.error("createHelpRequest error:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating help request",
            error: error.message
        });
    }
}

// Get all help requests (with filters)
const getHelpRequests = async (req, res) => {
    try {
        const { status, type } = req.query;
        
        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.typeOfHelp = type;

        const helpRequests = await HelpRequest.find(filter)
            .populate('user', 'name')
            .populate('assignedVolunteer', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: helpRequests.length,
            helpRequests
        });

    } catch (error) {
        console.error("getHelpRequests error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching help requests",
            error: error.message
        });
    }
}

// Get nearby help requests using geospatial query
const getNearbyRequests = async (req, res) => {
    try {
        const { lat, lng, radius = 5000 } = req.query; // radius in meters, default 5km

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Location coordinates required"
            });
        }

        const helpRequests = await HelpRequest.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            },
            status: { $in: ["pending", "accepted"] }
        })
        .populate('user', 'name')
        .populate('assignedVolunteer', 'name')
        .limit(50);

        return res.status(200).json({
            success: true,
            count: helpRequests.length,
            helpRequests
        });

    } catch (error) {
        console.error("getNearbyRequests error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching nearby requests",
            error: error.message
        });
    }
}

// Get single help request by ID
const getHelpRequestById = async (req, res) => {
    try {
        const helpRequest = await HelpRequest.findById(req.params.id)
            .populate('user', 'name')
            .populate('assignedVolunteer', 'name');

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: "Help request not found"
            });
        }

        return res.status(200).json({
            success: true,
            helpRequest
        });

    } catch (error) {
        console.error("getHelpRequestById error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching help request",
            error: error.message
        });
    }
}

// Update help request (status/volunteer assignment)
const updateHelpRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedVolunteer } = req.body;

        // Only allow specific status transitions
        const allowedStatus = ["pending", "accepted", "completed"];
        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // If updating to accepted, must provide volunteer
        if (status === "accepted" && !assignedVolunteer) {
            return res.status(400).json({
                success: false,
                message: "Volunteer required when accepting request"
            });
        }

        // Update atomically (ensure no race conditions)
        const helpRequest = await HelpRequest.findOneAndUpdate(
            { 
                _id: id,
                // If being accepted, ensure it's still pending
                ...(status === "accepted" ? { status: "pending" } : {})
            },
            {
                $set: {
                    status,
                    ...(assignedVolunteer && { assignedVolunteer }),
                    ...(status === "accepted" && { acceptedAt: new Date() })
                }
            },
            { new: true }
        ).populate('user', 'name')
         .populate('assignedVolunteer', 'name');

        if (!helpRequest) {
            return res.status(404).json({
                success: false,
                message: status === "accepted" 
                    ? "Help request not found or already accepted"
                    : "Help request not found"
            });
        }

        // Emit socket event for real-time updates
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
        console.error("updateHelpRequest error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating help request",
            error: error.message
        });
    }
}

// Get my help requests (as victim)
const getMyHelpRequests = async (req, res) => {
    try {
        const helpRequests = await HelpRequest.find({ user: req.user._id })
            .populate('assignedVolunteer', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: helpRequests.length,
            helpRequests
        });

    } catch (error) {
        console.error("getMyHelpRequests error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching your help requests",
            error: error.message
        });
    }
}

// Get requests I'm helping with (as volunteer)
const getMyAssignedRequests = async (req, res) => {
    try {
        const helpRequests = await HelpRequest.find({ 
            assignedVolunteer: req.user._id,
            status: { $in: ["accepted", "completed"] }
        })
        .populate('user', 'name')
        .sort({ acceptedAt: -1 });

        return res.status(200).json({
            success: true,
            count: helpRequests.length,
            helpRequests
        });

    } catch (error) {
        console.error("getMyAssignedRequests error:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching assigned requests",
            error: error.message
        });
    }
}


export {
    createHelpRequest,
    getHelpRequests,
    getNearbyRequests,
    getHelpRequestById,
    updateHelpRequest,
    getMyHelpRequests,
    getMyAssignedRequests
}