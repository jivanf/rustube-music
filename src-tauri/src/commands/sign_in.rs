use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;
use tiny_http::Server;
use url::Url;

#[derive(Serialize)]
#[derive(Deserialize)]
pub struct Tokens {
    access_token: String,
    id_token: String,
}

#[tauri::command]
pub async fn sign_in(app_handle: AppHandle) -> Tokens {
    let server = start_redirect_server();

    let redirect_uri = format!("http://localhost:{}", server.server_addr().to_ip().unwrap().port());
    println!("{}", redirect_uri);

    app_handle
        .shell()
        .open(sign_in_url(&redirect_uri), None)
        .expect("TODO: Send error to frontend");

    let code = receive_authorization_code(server);

    get_tokens(&code, &redirect_uri).await
}

fn sign_in_url<'a>(redirect_uri: &str) -> String {
    Url::parse_with_params(
        "https://accounts.google.com/o/oauth2/v2/auth",
        &[
            (
                "client_id",
                std::env::var("FIREBASE_CLIENT_ID").unwrap(),
            ),
            (
                "redirect_uri",
                redirect_uri.to_owned(),
            ),
            (
                "scope",
                "openid https://www.googleapis.com/auth/userinfo.email profile".to_owned(),
            ),
            ("response_type", "code".to_owned()),
            ("prompt", "select_account".to_owned()),
        ],
    )
    .unwrap()
    .into()
}

fn start_redirect_server() -> Server {
    Server::http("localhost:0").expect("TODO: Send error to frontend")
}

fn receive_authorization_code(server: Server) -> String {
    let mut code = String::new();

    for request in server.incoming_requests() {
        let url = Url::parse(format!("http://localhost{}", request.url()).as_str()).unwrap();
        let query_params = url.query_pairs();

        let mut code_iter = query_params
            .filter(|pair| pair.0 == "code")
            .map(|pair| pair.1.to_string())
            .take(1);

        let code_result = code_iter.next();

        if code_result != None {
            code = code_result.unwrap();
            break;
        }
    }

    code
}

async fn get_tokens(code: &str, redirect_uri: &str) -> Tokens {
    let mut data: HashMap<&str, String> = HashMap::new();
    data.insert("code", code.to_owned());
    data.insert("client_id", std::env::var("FIREBASE_CLIENT_ID").unwrap());
    data.insert("client_secret", std::env::var("FIREBASE_CLIENT_SECRET").unwrap());
    data.insert("redirect_uri", redirect_uri.to_owned());
    data.insert("grant_type", "authorization_code".to_owned());

    let client = reqwest::Client::new();
    let response = client.post("https://accounts.google.com/o/oauth2/token").json(&data).send().await.unwrap();

    response.json::<Tokens>().await.unwrap()
}
