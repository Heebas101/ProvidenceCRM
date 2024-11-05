import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import './dataDisplay.css'; // Use the same CSS for styling

const DetailsDisplay = () => {
    const { id } = useParams(); // Get the id from the URL
    const navigate = useNavigate(); // Use useNavigate for navigation
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [agentNotes, setAgentNotes] = useState('');
    const [selectedAgent, setSelectedAgent] = useState(''); // eslint-disable-next-line
    const [selectedStage, setSelectedStage] = useState(''); // eslint-disable-next-line

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
        const fetchDetails = async () => {
            const { data, error } = await supabase
                .from('WebsiteInquiries')
                .select('CustomerName, Country, Email, Phone, Date, Agent, Stage, Make, Model, AgentNotes, Notes')
                .eq('id', id)
                .single(); // Fetch a single record by ID

            if (error) {
                setError(error.message);
            } else {
                setData(data);
                setAgentNotes(data.AgentNotes);
                setSelectedAgent(data.Agent);
                setSelectedStage(data.Stage);
            }
        };

        fetchDetails();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleSave = async () => {
        const updates = {
            Agent: selectedAgent,
            Stage: selectedStage,
            AgentNotes: agentNotes
        };

        const { error } = await supabase
            .from('WebsiteInquiries')
            .update(updates)
            .eq('id', id);

        if (error) {
            setError(error.message);
        } else {
            setData((prevData) => ({
                ...prevData,
                ...updates
            }));
            setIsEditing(false); // Exit editing mode
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>; // Loading state
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Inquiry Details</h1>
            <table className="table table-bordered mt-4">
                <tbody>
                    <tr>
                        <th>Customer Name</th>
                        <td>{data.CustomerName}</td>
                    </tr>
                    <tr>
                        <th>Country</th>
                        <td>{data.Country}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{data.Email}</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>{data.Phone}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>{formatDate(data.Date)}</td>
                    </tr>
                    <tr>
                        <th>Stage</th>
                        <td>
                            {isEditing ? (
                                <select
                                    value={selectedStage}
                                    onChange={(e) => setSelectedStage(e.target.value)}
                                    className="form-select"
                                >
                                    {stages.map(stage => (
                                        <option key={stage} value={stage}>{stage}</option>
                                    ))}
                                </select>
                            ) : (
                                data.Stage
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>Agent</th>
                        <td>
                            {isEditing ? (
                                <select
                                    value={selectedAgent}
                                    onChange={(e) => setSelectedAgent(e.target.value)}
                                    className="form-select"
                                >
                                    {agents.map(agent => (
                                        <option key={agent} value={agent}>{agent}</option>
                                    ))}
                                </select>
                            ) : (
                                data.Agent
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>Car Make</th>
                        <td>{data.Make}</td>
                    </tr>
                    <tr>
                        <th>Car Model</th>
                        <td>{data.Model}</td>
                    </tr>
                    <tr>
                        <th>Agent Notes</th>
                        <td>
                            {isEditing ? (
                                <textarea
                                    value={agentNotes}
                                    onChange={(e) => setAgentNotes(e.target.value)}
                                    className="form-control"
                                />
                            ) : (
                                data.AgentNotes
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>Notes</th>
                        <td>{data.Notes}</td>
                    </tr>
                </tbody>
            </table>
            <div className="d-flex justify-content-center mt-4">
    {isEditing ? (
        <button className="btn btn-success me-2" onClick={handleSave}>Save Changes</button>
    ) : (
        <button className="btn btn-primary me-2 btn-lg" onClick={() => setIsEditing(true)}>Edit</button>
    )}
    <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Dashboard</button>
</div>
        </div>
    );
};

export default DetailsDisplay;






