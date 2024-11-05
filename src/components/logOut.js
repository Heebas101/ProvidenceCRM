import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase'; // Ensure you have the correct path to your supabase file

const LogOutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
            // Optionally handle logout error (e.g., show a notification)
        } else {
            // Redirect to login page after successful logout
            navigate('/'); // Adjust the path based on your routing setup
        }
    };

    return (
        <button 
            className="btn btn-danger" 
            onClick={handleLogout}
        >
            Log Out
        </button>
    );
};

export default LogOutButton;

