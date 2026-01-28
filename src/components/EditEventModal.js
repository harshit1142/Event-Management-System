import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setEvents } from '../store/eventSlice';
import Dropdown from './Dropdown';
import ListDropdown from './ListDropdown';

const EditEventModal = ({ event, onClose }) => {
    const dispatch = useDispatch();
    const { profiles } = useSelector(state => state.events);

    const [formData, setFormData] = useState({
        selectedProfiles: event.profiles,
        start: new Date(event.startDateTime).toISOString().slice(0, 16),
        end: new Date(event.endDateTime).toISOString().slice(0, 16),
        timezone: event.timezone
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/events/events/${event._id}`, {
                profiles: formData.selectedProfiles,
                startDateTime: new Date(formData.start).toISOString(),
                endDateTime: new Date(formData.end).toISOString(),
                timezone: formData.timezone
            });

            const res = await axios.get('http://localhost:5000/api/events');
            dispatch(setEvents(res.data));
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || "Update failed");
        }
    };

    const toggleProfile = (id) => {
        const updated = formData.selectedProfiles.includes(id)
            ? formData.selectedProfiles.filter(p => p !== id)
            : [...formData.selectedProfiles, id];
        setFormData({ ...formData, selectedProfiles: updated });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Event</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label className="form-label">Profiles</label>
                        <Dropdown
                            placeholder={`${formData.selectedProfiles.length} profiles selected`}
                            onChange={toggleProfile}
                            options={profiles.map(p => ({
                                value: p._id,
                                label: p.name,
                                isSelected: formData.selectedProfiles.includes(p._id)
                            }))}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Timezone</label>
                        <ListDropdown
                            value={formData.timezone}
                            onChange={(val) => setFormData({ ...formData, timezone: val })}
                            options={[
                                { value: 'UTC', label: 'UTC' },
                                { value: 'America/New_York', label: 'Eastern Time (ET)' },
                                { value: 'America/Chicago', label: 'Central Time (CT)' },
                                { value: 'America/Denver', label: 'Mountain Time (MT)' },
                                { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                                { value: 'Asia/Kolkata', label: 'India (IST)' }
                            ]}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Start Date & Time</label>
                        <input
                            type="datetime-local"
                            value={formData.start}
                            onChange={e => setFormData({ ...formData, start: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">End Date & Time</label>
                        <input
                            type="datetime-local"
                            value={formData.end}
                            onChange={e => setFormData({ ...formData, end: e.target.value })}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Update Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;