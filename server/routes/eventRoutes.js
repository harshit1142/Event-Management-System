const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');

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
        const existingEvent = await Event.findById(eventId).populate('profiles');
        if (!existingEvent) return res.status(404).json({ error: "Event not found" });

        let changes = [];

        const oldProfileIds = existingEvent.profiles.map(p => p._id.toString()).sort();
        const newProfileIds = [...profiles].sort();

        if (JSON.stringify(oldProfileIds) !== JSON.stringify(newProfileIds)) {
            const updatedProfiles = await mongoose.model('User').find({ _id: { $in: profiles } });
            const names = updatedProfiles.map(p => p.name).join(', ');
            changes.push(`Profile changed to: ${names}`);
        }
        const isStartChanged = startDateTime && startDateTime !== existingEvent.startDateTime.toISOString();
        const isEndChanged = endDateTime && endDateTime !== existingEvent.endDateTime.toISOString();
        const isTzChanged = timezone && timezone !== existingEvent.timezone;

        if (isStartChanged || isEndChanged || isTzChanged) {
            changes.push("Date/Time updated");
        }

        const finalDescription = changes.length > 0 ? changes.join(" , ") : "Event details updated";

        const logEntry = {
            previousValue: {
                title: existingEvent.title,
                profiles: existingEvent.profiles,
                timezone: existingEvent.timezone,
                startDateTime: existingEvent.startDateTime,
                endDateTime: existingEvent.endDateTime
            },
            updatedValue: req.body,
            changeDescription: finalDescription,
            updatedAt: new Date()
        };

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                $set: { title, profiles, timezone, startDateTime, endDateTime },
                $push: { logs: logEntry }
            },
            { new: true }
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