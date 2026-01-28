import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setEvents } from '../store/eventSlice';
import Dropdown from './EventDropdown';
import '../styles/Dropdown.css';
import ListDropdown from './ListDropdown';

const CreateEventForm = () => {
    const dispatch = useDispatch();
    const { profiles } = useSelector(state => state.events);

    const [formData, setFormData] = useState({
        selectedProfiles: [],
        start: '',
        end: '',
        timezone: 'UTC'
    });

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };
    
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);


    const toggleProfile = (id) => {
        if (!id) return;

        const updated = formData.selectedProfiles.includes(id)
            ? formData.selectedProfiles.filter(p => p !== id)
            : [...formData.selectedProfiles, id];

        setFormData({ ...formData, selectedProfiles: updated });
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (formData.selectedProfiles.length === 0) {
            alert("Please select at least one profile");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/events', {
                profiles: formData.selectedProfiles,
                startDateTime: new Date(formData.start).toISOString(),
                endDateTime: new Date(formData.end).toISOString(),
                timezone: formData.timezone
            });

            const res = await axios.get('http://localhost:5000/api/events');
            dispatch(setEvents(res.data));

            alert("Event Created!");

            setFormData({ title: 'New Event', selectedProfiles: [], start: '', end: '', timezone: 'UTC' });
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || err.message));
        }
    };
    const profilePlaceholder = formData.selectedProfiles.length > 0
        ? `${formData.selectedProfiles.length} profiles selected`
        : "Select profiles...";

    return (
        <form onSubmit={handleCreate} ref={dropdownRef}>
           

            <div className="form-group">
                <label className="form-label">Profiles</label>
                <Dropdown
                    placeholder={profilePlaceholder}
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
                    onChange={(value) => setFormData({ ...formData, timezone: value })}
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