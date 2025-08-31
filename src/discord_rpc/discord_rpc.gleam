pub type Client

@external(javascript, "./discord_rpc.ffi.mjs", "new_client")
pub fn new_client() -> Client

@external(javascript, "./discord_rpc.ffi.mjs", "login")
pub fn login(client: Client, client_id: String) -> Nil
