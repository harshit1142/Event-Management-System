import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setProfiles, setActiveProfile } from '../store/eventSlice';
import { UserPlus, ChevronDown } from 'lucide-react';

const ProfileSwitcher = () => {
    const dispatch = useDispatch();
    const { profiles, activeProfile } = useSelector((state) => state.events);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            // API call to create user with just a name
            const res = await axios.post('https://event-management-system-rsvr.onrender.com/api/profiles', {
                name: newName,
                timezone: 'UTC' // Defaulting as per requirements
            });

            // Update Redux state with the new list
            const updatedProfiles = [...profiles, res.data];
            dispatch(setProfiles(updatedProfiles));
            dispatch(setActiveProfile(res.data));

            setNewName('');
            setShowAdd(false);
        } catch (err) {
            console.error("Error creating profile:", err);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {/* Add Profile Section */}
            {showAdd ? (
                <form onSubmit={handleCreateProfile} className="flex items-center gap-2 animate-in slide-in-from-right-4">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Enter name..."
                        className="border border-indigo-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                        Save
                    </button>
                    <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 text-xs">
                        Cancel
                    </button>
                </form>
            ) : (
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                >
                    <UserPlus size={18} />
                    Add Profile
                </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <select
                    className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer appearance-none pr-6"
                    value={activeProfile?._id || ''}
                    onChange={(e) => {
                        const selected = profiles.find(p => p._id === e.target.value);
                        dispatch(setActiveProfile(selected));
                    }}
                >
                    {profiles.map((p) => (
                        <option key={p._id} value={p._id}>
                            {p.name} ({p.timezone})
                        </option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
};

export default ProfileSwitcher;