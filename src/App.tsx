import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

// --- TypeScript Interfaces ---
interface GridSize {
  rows: number;
  cols: number;
}

interface Action {
  action_type: string;
  command: string;
}

interface Control {
  id: string;
  control_type: string;
  position: { row: number; col: number };
  label: string;
  action: Action;
}

interface Profile {
  name: string;
  grid_size: GridSize;
  controls: Control[];
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    invoke<Profile>('get_profile')
      .then(setProfile)
      .catch(console.error);
  }, []);

  const handleControlClick = (command: string) => {
    invoke(command).catch(console.error);
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${profile.grid_size.cols}, 1fr)`,
    gridTemplateRows: `repeat(${profile.grid_size.rows}, 1fr)`,
    gap: '10px',
    marginTop: '2rem',
  };

  return (
    <div className="container">
      <h1>{profile.name}</h1>
      <div style={gridStyle}>
        {profile.controls.map((control) => (
          <button
            key={control.id}
            className="control-button"
            style={{
              gridColumn: control.position.col + 1,
              gridRow: control.position.row + 1,
            }}
            onClick={() => handleControlClick(control.action.command)}
          >
            {control.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
