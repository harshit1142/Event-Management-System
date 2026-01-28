const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');

const isTimeSubstantiallyDifferent = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return d1.getFullYear() !== d2.getFullYear() ||
        d1.getMonth() !== d2.getMonth() ||
        d1.getDate() !== d2.getDate() ||
        d1.getHours() !== d2.getHours() ||
        d1.getMinutes() !== d2.getMinutes();
};

router.post('/', async (req, res) => {
    const { title, profiles, timezone, startDateTime, endDateTime } = req.body;
    try {
        if (new Date(endDateTime) < new Date(startDateTime)) {
            return res.status(400).json({ error: "End date/time cannot be before start date/time" });
        }
        const newEvent = new Event({ title, profiles, timezone, startDateTime, endDateTime, logs: [] });
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

        const isStartChanged = startDateTime && isTimeSubstantiallyDifferent(startDateTime, existingEvent.startDateTime);
        const isEndChanged = endDateTime && isTimeSubstantiallyDifferent(endDateTime, existingEvent.endDateTime);
        const isTzChanged = timezone && timezone !== existingEvent.timezone;

        if (isStartChanged || isEndChanged || isTzChanged) {
            changes.push("Date/Time updated");
        }
        if (changes.length === 0) {
            const updatedEvent = await Event.findByIdAndUpdate(
                eventId,
                { $set: { title, profiles, timezone, startDateTime, endDateTime } },
                { new: true }
            );
            return res.json(updatedEvent);
        }

        const finalDescription = changes.join(" , ");

        const logEntry = {
            previousValue: {
                title: existingEvent.title,
                profiles: existingEvent.profiles.map(p => p._id),
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
        const events = await Event.find().sort({ createdAt: -1 });
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