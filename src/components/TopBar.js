import React from 'react';
import LogoutButton from './logOut'; // Adjust the import path as necessary
import './topBar.css'
const Header = () => {
    return (
        <div className="header">
            <LogoutButton />
        </div>
    );
};

export default Header;
