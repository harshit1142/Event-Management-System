import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LogsModal from './LogsModal';

dayjs.extend(utc);
dayjs.extend(timezone);

const EventList = () => {
    const { events, activeProfile } = useSelector(state => state.events);
    const [selectedLogs, setSelectedLogs] = useState(null);

    const filtered = events.filter(e =>
        !activeProfile ? true : e.profiles.includes(activeProfile._id)
    );

    return (
        <div>
            {filtered.length === 0 ? (
                <p className="empty-state">No events found</p>
            ) : (
                <div>
                    {filtered.map(event => (
                        <div key={event._id} className="event-item">
                            <div className="event-info">
                                <div className="event-title">{event.title}</div>
                                <div className="event-details">
                                    <div className="event-detail-line">
                                        Start: {dayjs.utc(event.startDateTime).tz(activeProfile?.timezone || 'UTC').format('DD MMM, hh:mm A')}
                                    </div>
                                    <div className="event-detail-line">
                                        End: {dayjs.utc(event.endDateTime).tz(activeProfile?.timezone || 'UTC').format('DD MMM, hh:mm A')}
                                    </div>
                                </div>
                            </div>
                            <button className="view-logs-btn" onClick={() => setSelectedLogs(event.logs)}>
                                View Logs
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {selectedLogs && <LogsModal logs={selectedLogs} onClose={() => setSelectedLogs(null)} />}
        </div>
    );
};

export default EventList;