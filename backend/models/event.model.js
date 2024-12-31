import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    ticketsAvailable: {
        type: Number,
        required: true,
        min: 0
    },
},{timestamps:true});

const Event = mongoose.model('Event', eventSchema);

export default Event;