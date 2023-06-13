import React, { useState } from 'react';
import './EditComponent.css';

const EditComponent = ({ empId, name, projectId, grade, billability, onSave, onCancel }) => {
    const [editedName, setEditedName] = useState(name);
    const [editedProjectId, setEditedProjectId] = useState(projectId);
    const [editedGrade, setEditedGrade] = useState(grade);
    const [editedBillability, setEditedBillability] = useState(billability);

    const handleSave = () => {
        const updatedData = {
            empId,
            name: editedName,
            projectId: editedProjectId,
            grade: editedGrade,
            billability: editedBillability
        };
        console.log(updatedData);

        onSave(updatedData);
    };

    const handleCancel = () => {
        onCancel();
    };

    

    return (
        <div className="edit-popup">
            <label>
                Name:
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                />
            </label>
            <label>
                Project ID:
                <input
                    type="text"
                    value={editedProjectId}
                    onChange={(e) => setEditedProjectId(e.target.value)}
                />
            </label>
            <label>
                Grade:
                <input
                    type="text"
                    value={editedGrade}
                    onChange={(e) => setEditedGrade(e.target.value)}
                />
            </label>
            <label>
                Billability:
                <input
                    type="text"
                    value={editedBillability}
                    onChange={(e) => setEditedBillability(e.target.value)}
                />
            </label>
            <div className="edit-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default EditComponent;