import React, { useState, useEffect } from 'react';
import { Control } from './types';

interface ConfigPanelProps {
  control: Control;
  onClose: () => void;
  onUpdate: (updatedControl: Control) => void;
}

function ConfigPanel({ control, onClose, onUpdate }: ConfigPanelProps) {
  const [editedControl, setEditedControl] = useState<Control>(control);

  useEffect(() => {
    setEditedControl(control);
  }, [control]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === 'action') {
      setEditedControl({
        ...editedControl,
        action: { ...editedControl.action, command: value },
      });
    } else {
      setEditedControl({ ...editedControl, [id]: value });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedControl);
    onClose(); // Close panel after saving
  };

  return (
    <div className="config-panel">
      <div className="config-panel-header">
        <h2>Edit Button</h2>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="label">Label</label>
          <input
            type="text"
            id="label"
            value={editedControl.label}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="action">Action</label>
          <select
            id="action"
            value={editedControl.action.command}
            onChange={handleChange}
          >
            <option value="">-- Select Action --</option>
            <option value="volume_up">Volume Up</option>
            <option value="volume_down">Volume Down</option>
          </select>
        </div>
        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
}

export default ConfigPanel;
