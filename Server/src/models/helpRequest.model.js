import mongoose, { Schema } from "mongoose";

const helpRequestSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        typeOfHelp: {
            type: String,
            enum: ["food", "water", "medical", "shelter", "rescue", "other"],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            },
            address: {
                type: String
            }
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "completed"],
            default: "pending"
        },
        assignedVolunteer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },{timestamps: true}
)

helpRequestSchema.index({ location: "2dsphere" }); // for geolocation queries

export const HelpRequest = mongoose.model('HelpRequest',helpRequestSchema)