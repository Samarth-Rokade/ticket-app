import Ticket from '../models/ticket.model.js';
import Event from "../models/event.model.js"
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const generateAccessTicketToken = async (ticketId) => {
    try {
        const ticket = await Ticket.findById(ticketId);
        console.log(ticket);
        console.log(ticket.generateAccessTicket())
        const accessToken = ticket.generateAccessTicket();

        return { accessToken };
    } catch (error) {
        throw new ApiError(500,
            "Something went wrong while generating access ticket", error.message)
    }
}
export const buyTicket = asyncHandler(async (req, res) => {
    const { eventId, assignedTo, ticketsPurchashed } = req.body;
    if ([eventId, assignedTo, ticketsPurchashed].some((field) => field?.trim() === "" || field == null))
        throw new ApiError(400, "Enter all fields");
    const event = await Event.findById(eventId);
    const totalTickets = event.ticketsAvailable;
    const totalTicketsSold = event.ticketsSold;
    const totalTicketsAvailable = totalTickets - totalTicketsSold;
    
    if (ticketsPurchashed > totalTicketsAvailable) {
        throw new ApiError(400, "Enough Tickets not available");
    } else {
        const serialNo = totalTicketsSold + 1;
        const ticketsSold = totalTicketsSold + ticketsPurchashed
       await Event.findByIdAndUpdate(
            eventId, { $set: {ticketsSold} }, { new: true }
        );
        if ( Date.now() <= event.ticketSellingDate || Date.now() >= event.date ) throw new ApiError(400, "Ticket cannot be purchashed before event date");
        const ticket = await Ticket.create({
            eventId, assignedTo, ticketsPurchashed, serialNo
        });
        const { accessToken } = await generateAccessTicketToken(ticket._id);
        ticket.accessToken = accessToken;
        const newTicket = await ticket.save();
        res.status(200).json(new ApiResponse(200, newTicket, "Ticket bought successfully"))
    }
});

export const getTicketById = asyncHandler(async (req, res) => {

    const ticket = await Ticket.findById(req.body);
    if (!ticket) throw new ApiError(404, "Ticket not found");
    res.status(200).json(new ApiResponse(200, ticket, "Ticket"));

});


export const getAllTickets = asyncHandler(async (req, res) => {
    const organizer = req.organizer;
    const tickets = await Ticket.find({ eventId: organizer });
    if (!tickets) throw new ApiError(404, "no ticket found");
    res.status(200).json(new ApiResponse(200, tickets, "all tickets"));
});

const verifyUser = async (ticketId, userId) => {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new ApiError(404, "Ticket not found");
    if (ticket.assignedTo.toString() !== userId) throw new ApiError(403, "You are not authorized to Modify this ticket");
};
export const cancelTicket = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const {ticketId, count} = req.body;
    if(count<0) throw new ApiError(400, "Enter a valid count");

    await verifyUser(ticketId, userId);
    const ticket = await Ticket.findById(ticketId);
    const event = await Event.findById(ticket.eventId);
    const ticketsSold = event.ticketsSold;
    const ticketsPurchashed = ticket.ticketsPurchashed;
    console.log("TicketSold", ticketsSold);
    if(ticket.ticketsPurchashed < count) {
        await Event.findByIdAndUpdate(ticket.eventId,{$set: {ticketsSold: ticketsSold - ticketsPurchashed}})
        await Ticket.findByIdAndDelete(ticketId);
    } 
    if (!ticket) throw new ApiError(404, "Ticket not found");
    if (ticket.createdAt > ticket.eventId.date) throw new ApiError(400, "Ticket cannot be cancelled after event date");

    const newTicketsSold = ticketsSold - count;
    await Ticket.findByIdAndUpdate(ticketId, { $set: { ticketsPurchashed: ticketsPurchashed - count } }, { new: true });
    await Event.findByIdAndUpdate(event, { $set: { ticketsSold: newTicketsSold } }, { new: true });
    res.status(200).json(new ApiResponse(200, {}, "Ticket cancelled successfully"));
});

export const updateStatus = asyncHandler(async (req, res) => {
    const {ticketid } = req.body;
    const ticket = await Ticket.findById(ticketid);
    if (!ticket) throw new ApiError(404, "Ticket not found");
    if (ticket.status === "scanned") throw new ApiError(400, "Ticket already scanned");
    const updateTicket = await Ticket.findByIdAndUpdate(ticketid, { $set: {status: "scanned"}  }, { new: true });
    res.status(200).json(new ApiResponse(200, updateTicket, "Ticket status updated successfully"));
}) 