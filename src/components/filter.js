// Filter.jsx
import React from 'react';

const Filter = ({ agents, stages, selectedAgent, selectedStage, onAgentChange, onStageChange }) => {
    return (
        <div className="filter-container mb-4">
            <h5>Filter Options</h5>
            <div className="d-flex justify-content-between">
                <div className="w-50 pr-2">
                    <label htmlFor="agentSelect" className="form-label">Select Agent:</label>
                    <select
                        id="agentSelect"
                        className="form-select"
                        value={selectedAgent}
                        onChange={(e) => onAgentChange(e.target.value)}
                    >
                        <option value="">All Agents</option>
                        {agents.map((agent, index) => (
                            <option key={index} value={agent}>
                                {agent}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-50 pl-2">
                    <label htmlFor="stageSelect" className="form-label">Select Stage:</label>
                    <select
                        id="stageSelect"
                        className="form-select"
                        value={selectedStage}
                        onChange={(e) => onStageChange(e.target.value)}
                    >
                        <option value="">All Stages</option>
                        {stages.map((stage, index) => (
                            <option key={index} value={stage}>
                                {stage}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Filter;
