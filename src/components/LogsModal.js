import React from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const LogsModal = ({ logs, onClose }) => {
    const activeProfile = useSelector(state => state.events.activeProfile);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Event Update History</h3>
                <hr />
                <div style={{ margin: '20px 0' }}>
                    {logs.length === 0 ? <p style={{ textAlign: 'center', color: '#999' }}>No update history yet</p> :
                        logs.map((log, i) => (
                            <div key={i} style={{ marginBottom: '15px', padding: '10px', background: '#f8f8f8', borderRadius: '8px' }}>
                                <small>{dayjs(log.updatedAt).tz(activeProfile.timezone).format('DD MMM YYYY, hh:mm A')}</small>
                                <p style={{ margin: '5px 0', fontSize: '13px' }}>Event values were updated.</p>
                            </div>
                        ))
                    }
                </div>
                <button onClick={onClose} className="btn-submit">Close</button>
            </div>
        </div>
    );
};

export default LogsModal;