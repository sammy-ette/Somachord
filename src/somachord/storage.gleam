import gleam/dynamic/decode
import gleam/json
import plinth/javascript/storage
import somachord/models/auth
import varasto

pub type Storage {
  Storage(auth: auth.Auth)
}

fn storage_reader() {
  use auth <- decode.field("auth", auth.decoder())
  decode.success(Storage(auth:))
}

fn storage_writer(storage: Storage) -> json.Json {
  json.object([#("auth", auth.encoder(storage.auth))])
}

pub fn create() {
  let assert Ok(localstorage) = storage.local()
  varasto.new(localstorage, storage_reader(), storage_writer)
}
