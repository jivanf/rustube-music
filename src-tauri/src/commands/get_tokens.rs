use serde_json::from_value;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;
use crate::auth::Tokens;

#[tauri::command]
pub fn get_tokens(app_handle: AppHandle) -> Option<Tokens> {
    let store = app_handle.store("store").expect("Store must be available");

    let tokens = store.get("auth.tokens");

    match tokens {
        Some(tokens) => Some(from_value::<Tokens>(tokens).expect("Tokens must be stored with the correct structure")),
        None => None,
    }
}