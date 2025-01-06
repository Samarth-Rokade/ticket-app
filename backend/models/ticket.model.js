import mongoose from 'mongoose';

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
    }
},{timestamps: true});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;