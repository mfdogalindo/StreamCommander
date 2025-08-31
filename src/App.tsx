import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Profile, Control } from './types';
import ConfigPanel from './ConfigPanel';

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    invoke<Profile>('get_profile')
      .then(setProfile)
      .catch(console.error);
  }, []);

  const handleControlClick = (control: Control) => {
    if (isEditMode) {
      setSelectedControl(control);
    } else {
      invoke(control.action.command).catch(console.error);
    }
  };

  const handleClosePanel = () => {
    setSelectedControl(null);
  };

  const handleControlUpdate = (updatedControl: Control) => {
    if (!profile) return;

    const newControls = profile.controls.map((control) =>
      control.id === updatedControl.id ? updatedControl : control
    );
    setProfile({ ...profile, controls: newControls });
  };

  const handleSaveProfile = () => {
    if (!profile) return;
    invoke('save_profile', { profile })
      .then(() => {
        setSaveStatus('Profile saved!');
        setTimeout(() => setSaveStatus(''), 2000);
      })
      .catch((err) => {
        setSaveStatus(`Error: ${err}`);
        setTimeout(() => setSaveStatus(''), 5000);
      });
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${profile.grid_size.cols}, 1fr)`,
    gridTemplateRows: `repeat(${profile.grid_size.rows}, 1fr)`,
    gap: '10px',
    marginTop: '1rem',
  };

  return (
    <div className={`container ${isEditMode ? 'edit-mode' : ''}`}>
      <div className="app-header">
        <h1>{isEditMode ? `Editing: ${profile.name}` : profile.name}</h1>
        <div className="header-buttons">
          {saveStatus && <span className="save-status">{saveStatus}</span>}
          {isEditMode && (
            <button onClick={handleSaveProfile} className="save-profile-btn">
              Save Profile
            </button>
          )}
          <button onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>
      <div className="main-content">
        <div style={gridStyle}>
          {profile.controls.map((control) => (
            <button
              key={control.id}
              className="control-button"
              style={{
                gridColumn: control.position.col + 1,
                gridRow: control.position.row + 1,
              }}
              onClick={() => handleControlClick(control)}
            >
              {control.label}
            </button>
          ))}
        </div>
        {selectedControl && (
          <ConfigPanel
            control={selectedControl}
            onClose={handleClosePanel}
            onUpdate={handleControlUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default App;
