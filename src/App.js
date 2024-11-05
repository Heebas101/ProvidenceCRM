// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/signIn';
import DataDisplay from './components/dataDisplay';
import { supabase } from './components/supabase';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch the session on app load
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null); // Set user based on the session
        };

        fetchSession();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null); // Update user state when auth state changes
        });

        // Cleanup subscription on component unmount
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const handleSignIn = (user) => {
        setUser(user); // Update user state on successful sign-in
    };

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={user ? <Navigate to="/data" /> : <SignIn onSignIn={handleSignIn} />} 
                />
                <Route 
                    path="/data" 
                    element={user ? <DataDisplay /> : <Navigate to="/" />} 
                />
            </Routes>
        </Router>
    );
};

export default App;


