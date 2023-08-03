#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::WindowEvent;
use tauri::AppHandle;
use tauri::generate_handler;
use tauri::Manager;
use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use winapi::um::winbase::CREATE_NO_WINDOW;
use std::fs;

#[tauri::command]
    fn run_ps(app: AppHandle, code: &str) {
        let output = Command::new("powershell")
            .args(&[
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-Command",
                code
            ])
            .stdout(Stdio::piped())
            .creation_flags(CREATE_NO_WINDOW)
            .output()
            .expect("Failed to run PowerShell command.");

        let output_string = String::from_utf8_lossy(&output.stdout);
        app.emit_all("ps_output", output_string).unwrap();
    }

#[tauri::command]
fn remove_file(file_path: &str) {
    fs::remove_file(file_path).unwrap();
}

fn main() {
    tauri::Builder::default()
        .on_window_event(|e| {
            if let WindowEvent::Resized(_) = e.event() {
                std::thread::sleep(std::time::Duration::from_nanos(1));
            }
        })
        .plugin(tauri_plugin_upload::init())
        .invoke_handler(generate_handler![run_ps, remove_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application"); 
}