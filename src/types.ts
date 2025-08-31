export interface GridSize {
  rows: number;
  cols: number;
}

export interface Action {
  action_type: string;
  command: string;
}

export interface Control {
  id: string;
  control_type: string;
  position: { row: number; col: number };
  label: string;
  action: Action;
}

export interface Profile {
  name: string;
  grid_size: GridSize;
  controls: Control[];
}
