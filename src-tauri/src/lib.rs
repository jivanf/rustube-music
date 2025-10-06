// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod auth;
mod commands;

use commands::{sign_in, get_tokens};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![sign_in, get_tokens]);

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(tauri_plugin_devtools::init());
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
