import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
    name: 'events',
    initialState: {
        profiles: [],
        activeProfile: null,
        events: [],
    },
    reducers: {
        setProfiles: (state, action) => { state.profiles = action.payload; },
        setActiveProfile: (state, action) => { state.activeProfile = action.payload; },
        setEvents: (state, action) => { state.events = action.payload; },
    }
});

export const { setProfiles, setActiveProfile, setEvents } = eventSlice.actions;
export default eventSlice.reducer;