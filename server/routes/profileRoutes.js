const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Create a profile
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });

        const newProfile = new Profile({
            name,
            timezone: 'UTC'
        });

        await newProfile.save();
        res.status(201).json(newProfile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;