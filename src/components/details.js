import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import './dataDisplay.css'; // Use the same CSS for styling

const DetailsDisplay = () => {
    const { inquiryId } = useParams();
    const numericId = Number(inquiryId);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [agentNotes, setAgentNotes] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedStage, setSelectedStage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const agents = ['Abdallah', 'Azam', 'Ishaak', 'Dilshard', 'Shanilka', 'Thabith', 'Thanish', 'Zubair'];
    const stages = [
        'New Inquiry',
        'Initial Contact',
        'Follow Up',
        'Offers Made',
        'Negotiating',
        'Sold',
        'Closed',
    ];

    useEffect(() => {
        const fetchDetails = async () => {
            if (isNaN(numericId) || numericId <= 0) {
                setError('Invalid Inquiry ID');
                return;
            }

            const { data, error } = await supabase
                .from('WebsiteInquiries')
                .select('CustomerName, Country, Email, Phone, Date, Agent, Stage, Make, Model, AgentNotes, Notes')
                .eq('id', numericId)
                .single();

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
    }, [numericId]);

    const handleSave = async () => {
        setIsSaving(true);

        const updates = {
            Agent: selectedAgent,
            Stage: selectedStage,
            AgentNotes: agentNotes,
        };

        const { error } = await supabase
            .from('WebsiteInquiries')
            .update(updates)
            .eq('id', numericId);

        if (error) {
            setError('Failed to save changes: ' + error.message);
        } else {
            // Update local state with the new values
            setData((prevData) => ({
                ...prevData,
                ...updates,
            }));
            setIsEditing(false); // Exit edit mode
        }
        setIsSaving(false);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            setError('Logout failed: ' + error.message);
        } else {
            navigate('/'); // Redirect to the login page after logout
        }
    };

    const goToDashboard = () => {
        navigate('/data'); // Navigate to the dashboard page
    };

    if (error) {
        return (
            <div className="container mt-5">
                <h1 className="text-center text-danger">Error</h1>
                <p className="text-center">{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mt-5">
                <h1 className="text-center">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-4">
                <button className="btn btn-secondary" onClick={goToDashboard}>
                    Back to Dashboard
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>
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
                        <td>{data.Date}</td>
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
                                    {stages.map((stage) => (
                                        <option key={stage} value={stage}>
                                            {stage}
                                        </option>
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
                                    {agents.map((agent) => (
                                        <option key={agent} value={agent}>
                                            {agent}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                data.Agent
                            )}
                        </td>
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
            <div className="text-center mt-4">
                {isEditing ? (
                    <button
                        className="btn btn-success me-2"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                ) : (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                )}
                {isEditing && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default DetailsDisplay;
