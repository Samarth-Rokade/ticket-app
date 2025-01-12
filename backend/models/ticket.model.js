import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const ticketSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    serialNo: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scanned', 'unscanned'],
        default: 'unscanned'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ticketsPurchashed: {
        type: Number,
        required: true
    },
    accessToken: {
        type: String,
    }
}, { timestamps: true });

ticketSchema.methods.generateAccessTicket = function () {
    return jwt.sign(
        {
            _id: this._id,
            eventId: this.eventId,
            serialNo: this.serialNo,
            status: this.status,
            assignedTo: this.assignedTo,
        },
        process.env.ACCESS_TICKET_SECRET,
        {
            expiresIn: process.env.ACCESS_TICKET_EXPIRY,
        }
    );
};
const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;