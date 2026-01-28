import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveProfile } from '../store/eventSlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LogsModal from './LogsModal';
import { Users, Calendar, Clock, Edit3, ClipboardList } from 'lucide-react';
import Dropdown from './ListDropdown';
import EditEventModal from './EditEventModal';

dayjs.extend(utc);
dayjs.extend(timezone);

const EventList = () => {
    const dispatch = useDispatch();
    const { events, activeProfile, profiles } = useSelector(state => state.events);
    const [selectedLogs, setSelectedLogs] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);

    const filtered = events.filter(e =>
        !activeProfile ? true : e.profiles.includes(activeProfile._id)
    );

    const handleTimezoneChange = (newTz) => {
        if (activeProfile) {
            const updatedProfile = { ...activeProfile, timezone: newTz };
            dispatch(setActiveProfile(updatedProfile));
        }
    };

    const getProfileNames = (ids) => {
        return profiles
            .filter(p => ids.includes(p._id))
            .map(p => p.name)
            .join(', ');
    };

    return (
        <>
            <div style={{ marginBottom: '24px' }}>
                <h2>Events</h2>
                <div className="events-header-controls">
                    <span className="events-header-label">View in Timezone</span>
                    <Dropdown
                        value={activeProfile?.timezone || 'UTC'}
                        onChange={handleTimezoneChange}
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
            </div>

            <div className="events-feed">
                {filtered.length === 0 ? (
                    <div className="no-events-container">
                        <p>No events found</p>
                    </div>
                ) : (
                    <div className="events-list">
                        {filtered.map(event => {
                            const userTz = activeProfile?.timezone || 'UTC';

                            return (
                                <div key={event._id} className="event-display-card">
                                    <div className="event-user-row">
                                        <Users size={16} className="icon-purple" />
                                        <span>{getProfileNames(event.profiles)}</span>
                                    </div>

                                    <div className="event-time-grid">
                                        <div className="time-block">
                                            <Calendar size={16} className="icon-gray" />
                                            <div>
                                                <span className="label">Start:</span>
                                                <span className="value">{dayjs.utc(event.startDateTime).tz(userTz).format('MMM DD, YYYY')}</span>
                                                <div className="sub-value">
                                                    <Clock size={12} /> {dayjs.utc(event.startDateTime).tz(userTz).format('hh:mm A')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="time-block">
                                            <Calendar size={16} className="icon-gray" />
                                            <div>
                                                <span className="label">End:</span>
                                                <span className="value">{dayjs.utc(event.endDateTime).tz(userTz).format('MMM DD, YYYY')}</span>
                                                <div className="sub-value">
                                                    <Clock size={12} /> {dayjs.utc(event.endDateTime).tz(userTz).format('hh:mm A')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="event-meta">
                                        <p>Created: {dayjs.utc(event.createdAt).tz(userTz).format('MMM DD, YYYY at hh:mm A')}</p>
                                        <p>Updated: {dayjs.utc(event.updatedAt).tz(userTz).format('MMM DD, YYYY at hh:mm A')}</p>
                                    </div>

                                    <div className="event-actions">
                                        <button className="btn-secondary" onClick={() => setEditingEvent(event)}>
                                            <Edit3 size={14} /> Edit
                                        </button>
                                        <button
                                            className="btn-secondary"
                                            onClick={() => setSelectedLogs(event.logs)}
                                        >
                                            <ClipboardList size={14} /> View Logs
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {editingEvent && (
                    <EditEventModal
                        event={editingEvent}
                        onClose={() => setEditingEvent(null)}
                    />
                )}
                {selectedLogs && <LogsModal logs={selectedLogs} onClose={() => setSelectedLogs(null)} />}
            </div>
        </>
    );
};

export default EventList;