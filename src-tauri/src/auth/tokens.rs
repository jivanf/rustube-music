use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Tokens {
    access_token: String,
    id_token: String,
}

