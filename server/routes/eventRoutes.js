const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


router.post('/', async (req, res) => {
    const { title, profiles, timezone, startDateTime, endDateTime } = req.body;

    try {
        if (new Date(endDateTime) < new Date(startDateTime)) {
            return res.status(400).json({
                error: "End date/time cannot be before start date/time"
            });
        }

        const newEvent = new Event({
            title,
            profiles, 
            timezone,
            startDateTime,
            endDateTime,
            logs: [] 
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/events/:id', async (req, res) => {
    const { title, profiles, timezone, startDateTime, endDateTime } = req.body;
    const eventId = req.params.id;

    try {

        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        const finalStart = startDateTime || existingEvent.startDateTime;
        const finalEnd = endDateTime || existingEvent.endDateTime;

        if (new Date(finalEnd) < new Date(finalStart)) {
            return res.status(400).json({ error: "End date/time cannot be before start date/time" });
        }

        const logEntry = {
            previousValue: {
                title: existingEvent.title,
                profiles: existingEvent.profiles,
                timezone: existingEvent.timezone,
                startDateTime: existingEvent.startDateTime,
                endDateTime: existingEvent.endDateTime
            },
            updatedValue: req.body,
            updatedAt: new Date()
        };

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                $set: { title, profiles, timezone, startDateTime, endDateTime },
                $push: { logs: logEntry }
            },
            { new: true, runValidators: true }
        );

        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/events/profile/:profileId', async (req, res) => {
    try {
        const events = await Event.find({ profiles: req.params.profileId });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;