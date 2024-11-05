import React, { useState } from 'react';
import { supabase } from './supabase.js'; // Adjust the import path based on your file structure
import './signIn.css';
import logo from '../assets/logo.png'; // Adjust the path to your logo image

const SignIn = ({ onSignIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            setError('');
            onSignIn(data.user);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="form-signin align-items-center w-100 m-auto">
                
                <img 
                    src={logo} 
                    alt="Logo" 
                    className="mb-4" 
                    style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }} 
                /> {/* Adjust width as needed */}
                
                <form onSubmit={handleSignIn}>
                    <h1 className="h3 mb-3 fw-normal"></h1>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="form-floating">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>

                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <button className="btn btn-primary w-100 py-2" type="submit">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;


