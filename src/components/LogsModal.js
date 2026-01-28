import React from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { formatTime } from '../utils/dateUtils';

const LogsModal = ({ logs, onClose }) => {
    console.log(logs);
    
    const activeProfile = useSelector((state) => state.events.activeProfile);
    const userTz = activeProfile?.timezone || 'UTC';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Event Update History</h3>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {logs.length === 0 ? (
                        <p className="empty-text">No update history yet</p>
                    ) : (
                        <div className="logs-timeline">
                            {/* Show logs from newest to oldest */}
                            {[...logs].reverse().map((log, index) => (
                                <div key={index} className="log-card">
                                    <div className="log-timestamp">
                                        {formatTime(log.updatedAt, userTz)}
                                    </div>
                                    <div className="log-description">
                                        <p><strong>{log.changeDescription}</strong></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogsModal;