// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;

fn main() {
    // Load .env
    dotenv().expect(".env file must exist and be readable");

    // Run
    rustube_music_lib::run()
}
