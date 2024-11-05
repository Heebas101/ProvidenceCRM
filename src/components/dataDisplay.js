import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { FaPhone, FaEnvelope, FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './dataDisplay.css';
import Filter from './filter'; // Import the Filter component
import Header from './TopBar';
const DataDisplay = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState({});
    const [selectedStage, setSelectedStage] = useState({});
    const [editMode, setEditMode] = useState({});
    const [noteEdit, setNoteEdit] = useState({});
    const [expandedCard, setExpandedCard] = useState(null);
    
    // State for filters
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

    const stageColorMap = {
        'New Inquiry': 'bg-pastel-purple',
        'Initial Contact': 'bg-pastel-blue',
        'Follow Up': 'bg-pastel-teal',
        'Offers Made': 'bg-pastel-yellow',
        'Negotiating': 'bg-pastel-orange',
        'Sold': 'bg-pastel-green',
        'Closed': 'bg-pastel-light',
    };

    const getStageColor = (stage) => {
        return stageColorMap[stage] || '';
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('WebsiteInquiries')
                .select('CustomerName, Country, Source, Email, Phone, Date, Agent, Notes, id, Stage, Make, Model');

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

    const handleAgentChange = async (itemId) => {
        if (!selectedAgent[itemId]) return;

        const { error } = await supabase
            .from('WebsiteInquiries')
            .update({ Agent: selectedAgent[itemId] })
            .eq('id', itemId);

        if (error) {
            setError(error.message);
        } else {
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === itemId ? { ...item, Agent: selectedAgent[item.id] } : item
                )
            );
        }
    };

    const handleStageChange = async (itemId) => {
        if (!selectedStage[itemId]) return;

        const { error } = await supabase
            .from('WebsiteInquiries')
            .update({ Stage: selectedStage[itemId] })
            .eq('id', itemId);

        if (error) {
            setError(error.message);
        } else {
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === itemId ? { ...item, Stage: selectedStage[item.id] } : item
                )
            );
        }
    };

    const handleNoteChange = async (itemId) => {
        const { error } = await supabase
            .from('WebsiteInquiries')
            .update({ Notes: noteEdit[itemId] })
            .eq('id', itemId);

        if (error) {
            setError(error.message);
        } else {
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === itemId ? { ...item, Notes: noteEdit[item.id] } : item
                )
            );
        }
    };

    const handleSave = async (itemId) => {
        await handleAgentChange(itemId);
        await handleStageChange(itemId);
        await handleNoteChange(itemId);
        setEditMode((prev) => ({ ...prev, [itemId]: false }));
    };

    const toggleEditMode = (itemId) => {
        setEditMode((prev) => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
        setNoteEdit((prev) => ({
            ...prev,
            [itemId]: data.find(item => item.id === itemId).Notes
        }));
    };

    const toggleExpand = (itemId) => {
        setExpandedCard(expandedCard === itemId ? null : itemId);
    };

    // Filter the data based on selected agent and stage
    const filteredData = data.filter(item => {
        const matchesAgent = agentFilter ? item.Agent === agentFilter : true;
        const matchesStage = stageFilter ? item.Stage === stageFilter : true;
        return matchesAgent && matchesStage;
    });

    return (
        <div className="container mt-5">
            <Header/>
            <h1 className="text-center">Dashboard</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Include the Filter component */}
            <Filter 
                agents={agents}
                stages={stages}
                selectedAgent={agentFilter}
                selectedStage={stageFilter}
                onAgentChange={setAgentFilter}
                onStageChange={setStageFilter}
            />

            <div className="row">
                {filteredData.map((item) => (
                    <div key={item.id} className="col-md-4 col-sm-6 mb-4">
                        <div 
                            className={`card shadow-sm ${editMode[item.id] ? 'border-warning' : ''} ${getStageColor(item.Stage)} ${expandedCard === item.id ? 'expanded' : ''}`}
                            onClick={() => toggleExpand(item.id)}
                        >
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <h5 className="card-title"><FaUser /> {item.CustomerName}</h5>
                                        <p className="card-text">
                                            <strong>Country:</strong> {item.Country}<br />
                                            <FaEnvelope /> {item.Email}<br />
                                            <FaPhone /> {item.Phone}<br />
                                            <strong>Source:</strong> {item.Source}<br />
                                            <strong>Date:</strong> {formatDate(item.Date)}<br />
                                            <strong>Stage:</strong> <span className={getStageColor(item.Stage)}>{item.Stage}</span><br />
                                            <strong>Agent:</strong> {item.Agent}<br />
                                            <strong>Car Make:</strong> {item.Make}<br />
                                            <strong>Car Model:</strong> {item.Model}<br />
                                            {expandedCard === item.id && (
                                                <>
                                                    <strong>Notes:</strong> {item.Notes}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        {!editMode[item.id] ? (
                                            <button 
                                                className="btn btn-outline-primary btn-sm mt-2"
                                                onClick={() => toggleEditMode(item.id)}
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                        ) : (
                                            <>
                                                <select 
                                                    className="form-select mt-2"
                                                    onChange={(e) => setSelectedAgent({ ...selectedAgent, [item.id]: e.target.value })}
                                                    value={selectedAgent[item.id] || item.Agent}
                                                >
                                                    {agents.map((agent) => (
                                                        <option key={agent} value={agent}>{agent}</option>
                                                    ))}
                                                </select>
                                                <select 
                                                    className="form-select mt-2"
                                                    onChange={(e) => setSelectedStage({ ...selectedStage, [item.id]: e.target.value })}
                                                    value={selectedStage[item.id] || item.Stage}
                                                >
                                                    {stages.map((stage) => (
                                                        <option key={stage} value={stage}>{stage}</option>
                                                    ))}
                                                </select>
                                                <input 
                                                    type="text" 
                                                    className="form-control mt-2"
                                                    value={noteEdit[item.id]} 
                                                    onChange={(e) => setNoteEdit({ ...noteEdit, [item.id]: e.target.value })} 
                                                />
                                                <button 
                                                    className="btn btn-success btn-sm mt-2" 
                                                    onClick={() => handleSave(item.id)}
                                                >
                                                    <FaSave /> Save
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm mt-2"
                                                    onClick={() => toggleEditMode(item.id)}
                                                >
                                                    <FaTimes /> Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataDisplay;















