import Event from '../models/event.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
// import Organizer from '../models/organizer.model.js';

// Get all events
export const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find();
    if (!events) throw new ApiError(404, "no event found");
    res.status(200).json(new ApiResponse(200, events, "all events"));

});

// Get event by ID
export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) throw new ApiError(404, "Event not found");
    res.status(200).json(new ApiResponse(200, event, "Events"));


});

// Create a new event
export const createEvent = asyncHandler(async (req, res) => {
    const { name, description, date, location, locationUrl, price, ticketsAvailable, poster, ticketSellingDate, tags, category,organizer } = req.body;

    if ([name, description, date, location, locationUrl, price, ticketsAvailable, poster, ticketSellingDate, category, organizer].some((field) => field?.trim() === "" || field == null))
        throw new ApiError(400, "Enter all fields");

    const event = await Event.create({
       organizer, category, name, description, date, location, locationUrl, price, ticketsAvailable, poster, ticketSellingDate, tags,
    });
    const newEvent = await event.save();
    if (!newEvent) throw new ApiError(500, "Event not created: Error in createEvent")
    res.status(201).json(new ApiResponse(200, newEvent, "New Event created successfully"));
});


// Update an event
const verifyOrganizer = async (eventId, organizerId) => {
    const event = await Event.findById(eventId);
    if (!event) throw new ApiError(404, "Event not found");
    if (event.organizer.toString() !== organizerId) throw new ApiError(403, "You are not authorized to Modify this event");
};

export const updateEvent = asyncHandler(async (req, res) => {
    const organizerId = req.organizer.id;

    await verifyOrganizer(req.params.id, organizerId);

    const updatedData = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { $set: updatedData }, { new: true });

    if (!updatedEvent) {
        return res.status(404).json(new ApiError(404, "Event not found"));
    }
    res.status(200).json(new ApiResponse(200, updatedEvent, "Updated event details successfully"));
});

// Delete an event

export const deleteEvent = asyncHandler(async (req, res) => {
    const organizerId = req.organizer.id;
    await verifyOrganizer(req.params.id, organizerId)

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
        return res.status(404).json(new ApiError(404, "Event not found"));
    }
    res.status(200).json({ message: 'Event deleted successfully' });

});