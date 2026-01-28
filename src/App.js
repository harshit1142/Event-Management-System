import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './index.css';
import './App.css';
import { setProfiles, setEvents, setActiveProfile } from './store/eventSlice';
import CreateEventForm from './components/CreateEventForm';
import EventList from './components/EventList';
import Dropdown from './components/Dropdown';

const App = () => {
  const dispatch = useDispatch();
  const { activeProfile, profiles } = useSelector(state => state.events);

  const handleAddProfile = async (profileName) => {
    if (!profileName.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/profiles', {
        name: profileName,
        timezone: 'UTC'
      });
      dispatch(setProfiles([...profiles, res.data]));
      dispatch(setActiveProfile(res.data));
    } catch (err) {
      alert('Error creating profile: ' + err.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      const pRes = await axios.get('http://localhost:5000/api/profiles');
      const eRes = await axios.get('http://localhost:5000/api/events');
      dispatch(setProfiles(pRes.data));
      dispatch(setEvents(eRes.data));
      if (pRes.data.length > 0) dispatch(setActiveProfile(pRes.data[0]));
    };
    load();
  }, [dispatch]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <div className="header-left">
          <h1>Event Management</h1>
          <p>Create and manage events across multiple timezones</p>
        </div>
        <div className="header-right">
          <Dropdown
            placeholder="Select current profile..."
            value={activeProfile?._id || ''}
            onChange={(value) => dispatch(setActiveProfile(profiles.find(p => p._id === value)))}
            onAddClick={handleAddProfile}
            options={[
              { value: '', label: 'Select current profile...' },
              ...profiles.map(p => ({ value: p._id, label: p.name }))
            ]}
          />
        </div>
      </header>

      <div className="dashboard-container">
        <aside>
          <div className="card">
            <h2>Create Event</h2>
            <CreateEventForm />
          </div>
        </aside>
        <main>
          <div className="card" style={{ minHeight: '600px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2>Events</h2>
              <div className="events-header-controls">
                <span className="events-header-label">View in Timezone</span>
                <Dropdown
                  value={activeProfile?.timezone || 'UTC'}
                  onChange={(value) => { }}
                  options={[
                    { value: 'UTC', label: 'UTC' },
                    { value: 'ET', label: 'Eastern Time (ET)' },
                    { value: 'CT', label: 'Central Time (CT)' },
                    { value: 'MT', label: 'Mountain Time (MT)' },
                    { value: 'PT', label: 'Pacific Time (PT)' }
                  ]}
                />
              </div>
            </div>
            <EventList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;