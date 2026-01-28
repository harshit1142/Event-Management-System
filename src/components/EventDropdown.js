import React, { useState, useRef, useEffect } from 'react';
import '../styles/Dropdown.css';

const Dropdown = ({ options, placeholder, value, onChange, label, onAddClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileInput, setProfileInput] = useState('');
    const dropdownRef = useRef(null);

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;
    const handleSelect = (optionValue) => {
        onChange(optionValue);
        // Don't close if it's multi-select (no value prop passed)
        if (value) setIsOpen(false);
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="dropdown-wrapper" ref={dropdownRef}>
            <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedLabel}</span>
                <svg className={`dropdown-icon ${isOpen ? 'open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 10l5 5 5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`option ${opt.isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                            {opt.isSelected && <span className="check">✓</span>}
                        </div>
                    ))}

                    <>
                        <div className="dropdown-divider"></div>

                        <div className='dropdown-add-profile'>
                            <input type="text" placeholder="Add User" value={profileInput} onChange={(e) => setProfileInput(e.target.value)} />
                            <button type="button" className="dropdown-add-btn" onClick={() => { onAddClick(profileInput); setProfileInput(''); }}>
                                Add
                            </button>
                        </div>
                    </>

                </div>
            )}
        </div>
    );
};

export default Dropdown;
