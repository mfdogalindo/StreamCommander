// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use cpvc::{get_system_volume, set_system_volume};
use serde::{Deserialize, Serialize};

// --- Profile Structures ---
#[derive(Serialize, Deserialize, Clone)]
struct GridSize {
    rows: u32,
    cols: u32,
}

#[derive(Serialize, Deserialize, Clone)]
struct Position {
    row: u32,
    col: u32,
}

#[derive(Serialize, Deserialize, Clone)]
struct Action {
    #[serde(rename = "type")]
    action_type: String,
    command: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct Control {
    id: String,
    #[serde(rename = "type")]
    control_type: String,
    position: Position,
    label: String,
    action: Action,
}

#[derive(Serialize, Deserialize, Clone)]
struct Profile {
    name: String,
    grid_size: GridSize,
    controls: Vec<Control>,
}

// --- Tauri Commands ---

const VOLUME_STEP: f32 = 0.05;

#[tauri::command]
fn volume_up() -> Result<(), String> {
    let current_volume = get_system_volume().map_err(|e| e.to_string())?;
    let new_volume = (current_volume + VOLUME_STEP).min(1.0);
    set_system_volume(new_volume).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn volume_down() -> Result<(), String> {
    let current_volume = get_system_volume().map_err(|e| e.to_string())?;
    let new_volume = (current_volume - VOLUME_STEP).max(0.0);
    set_system_volume(new_volume).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_profile() -> Result<Profile, String> {
    let profile_str = include_str!("default-profile.json");
    serde_json::from_str(profile_str).map_err(|e| e.to_string())
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        volume_up,
        volume_down,
        get_profile
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
