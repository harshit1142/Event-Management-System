import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setEvents } from '../store/eventSlice';
import Dropdown from './Dropdown';

const CreateEventForm = () => {
    const dispatch = useDispatch();
    const profiles = useSelector(state => state.events.profiles);
    const [formData, setFormData] = useState({ title: '', selectedProfiles: [], start: '', end: '', timezone: 'UTC' });

    const toggleProfile = (id) => {
        const updated = formData.selectedProfiles.includes(id)
            ? formData.selectedProfiles.filter(p => p !== id)
            : [...formData.selectedProfiles, id];
        setFormData({ ...formData, selectedProfiles: updated });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/events', {
            title: formData.title,
            profiles: formData.selectedProfiles,
            startDateTime: new Date(formData.start).toISOString(),
            endDateTime: new Date(formData.end).toISOString(),
            timezone: formData.timezone
        });
        const res = await axios.get('http://localhost:5000/api/events');
        dispatch(setEvents(res.data));
        alert("Event Created!");
        setFormData({ title: '', selectedProfiles: [], start: '', end: '', timezone: 'UTC' });
    };

    return (
        <form onSubmit={handleCreate}>
            <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                    type="text"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Profiles</label>
                <Dropdown
                    placeholder="Select profiles..."
                    value=""
                    onChange={() => { }}
                    options={[{ value: '', label: 'Select profiles...' }]}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', marginTop: '12px' }}>
                    {profiles.map(p => (
                        <button
                            key={p._id}
                            type="button"
                            onClick={() => toggleProfile(p._id)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                border: formData.selectedProfiles.includes(p._id) ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: formData.selectedProfiles.includes(p._id) ? 'var(--primary)' : 'white',
                                color: formData.selectedProfiles.includes(p._id) ? 'white' : 'var(--text)',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Timezone</label>
                <Dropdown
                    value={formData.timezone}
                    onChange={(value) => setFormData({ ...formData, timezone: value })}
                    options={[
                        { value: 'UTC', label: 'UTC' },
                        { value: 'EST', label: 'Eastern Time (ET)' },
                        { value: 'CST', label: 'Central Time (CT)' },
                        { value: 'MST', label: 'Mountain Time (MT)' },
                        { value: 'PST', label: 'Pacific Time (PT)' }
                    ]}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Start Date & Time</label>
                <input
                    type="datetime-local"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">End Date & Time</label>
                <input
                    type="datetime-local"
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary">+ Create Event</button>
        </form>
    );
};

export default CreateEventForm;