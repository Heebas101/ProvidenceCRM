import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './dataDisplay.css';
import Filter from './filter';
import Header from './TopBar';

const DataDisplay = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState({});
    const [selectedStage, setSelectedStage] = useState({});
    const [editMode, setEditMode] = useState({});
    
    const [agentFilter, setAgentFilter] = useState('');
    const [stageFilter, setStageFilter] = useState('');

    const agents = ['Abdallah', 'Azam', 'Ishaak', 'Dilshard', 'Shanilka', 'Thabith', 'Thanish', 'Zubair'];
    const stages = [
        'New Inquiry',
        'Initial Contact',
        'Follow Up',
        'Offers Made',
        'Negotiating',
        'Sold',
        'Closed'
    ];

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('WebsiteInquiries')
                .select('CustomerName, Country, Email, Phone, Date, Agent, id, Stage, Make, Model');

            if (error) {
                setError(error.message);
            } else {
                setData(data);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleSave = async (itemId) => {
        const updates = {};
        if (selectedAgent[itemId]) updates.Agent = selectedAgent[itemId];
        if (selectedStage[itemId]) updates.Stage = selectedStage[itemId];
        
        const { error } = await supabase
            .from('WebsiteInquiries')
            .update(updates)
            .eq('id', itemId);

        if (error) {
            setError(error.message);
        } else {
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                )
            );
            setEditMode((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    const toggleEditMode = (itemId) => {
        setEditMode((prev) => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const filteredData = data.filter(item => {
        const matchesAgent = agentFilter ? item.Agent === agentFilter : true;
        const matchesStage = stageFilter ? item.Stage === stageFilter : true;
        return matchesAgent && matchesStage;
    });

    const getRowClass = (stage) => {
        switch (stage) {
            case 'New Inquiry': return 'row-new-inquiry';
            case 'Initial Contact': return 'row-initial-contact';
            case 'Follow Up': return 'row-follow-up';
            case 'Offers Made': return 'row-offers-made';
            case 'Negotiating': return 'row-negotiating';
            case 'Sold': return 'row-sold';
            case 'Closed': return 'row-closed';
            default: return '';
        }
    };

    return (
        <div className="container mt-5">
            <Header/>
            <h1 className="text-center">Dashboard</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <Filter 
                agents={agents}
                stages={stages}
                selectedAgent={agentFilter}
                selectedStage={stageFilter}
                onAgentChange={setAgentFilter}
                onStageChange={setStageFilter}
            />

            <table className="table table-bordered mt-4">
                <thead className="table-primary">
                    <tr className="table-heading">
                        <th>Customer Name</th>
                        <th>Country</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Stage</th>
                        <th>Agent</th>
                        <th>Car Make</th>
                        <th>Car Model</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} className={getRowClass(item.Stage)}>
                            <td>{item.CustomerName}</td>
                            <td>{item.Country}</td>
                            <td>{item.Email}</td>
                            <td>{item.Phone}</td>
                            <td>{formatDate(item.Date)}</td>
                            <td>{item.Stage}</td>
                            <td>{item.Agent}</td>
                            <td>{item.Make}</td>
                            <td>{item.Model}</td>
                            <td>
                                <Link to={`/details/${item.id}`} className="btn btn-info btn-sm">
                                    Expand
                                </Link>
                                <button
                                    className="btn btn-outline-primary btn-sm ms-2"
                                    onClick={() => toggleEditMode(item.id)}
                                >
                                    <FaEdit /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataDisplay;





















