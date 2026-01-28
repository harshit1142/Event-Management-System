const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const mongoose = require('mongoose');

const isTimeSubstantiallyDifferent = (date1, date2) => {
    if (!date1 || !date2) return false;

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
    const t1 = new Date(d1).setSeconds(0, 0);
    const t2 = new Date(d2).setSeconds(0, 0);

    return t1 !== t2;
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

    try {
        const existingEvent = await Event.findById(req.params.id).populate('profiles');
        let changes = [];

        const oldIds = existingEvent.profiles.map(p => p._id.toString()).sort();
        const newIds = [...profiles].sort();
        if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
            const updatedProfiles = await mongoose.model('User').find({ _id: { $in: profiles } });
            changes.push(`Profile changed to: ${updatedProfiles.map(p => p.name).join(', ')}`);
        }

        if (isTimeSubstantiallyDifferent(startDateTime, existingEvent.startDateTime) ||
            isTimeSubstantiallyDifferent(endDateTime, existingEvent.endDateTime) ||
            timezone !== existingEvent.timezone) {
            console.log(isTimeSubstantiallyDifferent(startDateTime, existingEvent.startDateTime));
            console.log(isTimeSubstantiallyDifferent(endDateTime, existingEvent.endDateTime));
            console.log(timezone !== existingEvent.timezone);
                
            changes.push("Date/Time updated");
        }
        const updateData = { title, profiles, timezone, startDateTime, endDateTime };

        if (changes.length > 0) {
            const logEntry = {
                changeDescription: changes.join(" , "),
                updatedAt: new Date(),
            };

            const updatedEvent = await Event.findByIdAndUpdate(
                req.params.id,
                { $set: updateData, $push: { logs: logEntry } },
                { new: true }
            );
            return res.json(updatedEvent);
        } else {
            const updatedEvent = await Event.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true }
            );
            return res.json(updatedEvent);
        }
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