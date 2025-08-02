//import gleam/crypto
import gleam/dynamic/decode
import gleam/json

import md5
import random_str

pub type Auth {
  Auth(username: String, credentials: Credentials)
}

pub fn decoder() {
  use username <- decode.field("username", decode.string)
  use salt <- decode.field("salt", decode.string)
  use token <- decode.field("token", decode.string)

  decode.success(Auth(username:, credentials: Credentials(salt:, token:)))
}

pub fn encoder(auth: Auth) -> json.Json {
  json.object([
    #("username", json.string(auth.username)),
    #("salt", json.string(auth.credentials.salt)),
    #("token", json.string(auth.credentials.token)),
  ])
}

// the recommended authentication scheme
// is to send an authentication token, calculated as a one-way salted hash of the password.
// This involves two steps:
// For each REST call, generate a random string called the salt.
// Send this as parameter s. Use a salt length of at least six characters.
// Calculate the authentication token as follows:
// token = md5(password + salt).
// The md5() function takes a string and returns the 32-byte ASCII
// hexadecimal representation of the MD5 hash, using lower case characters
// for the hex values. The ‘+’ operator represents concatenation of the two strings.
// Treat the strings as UTF-8 encoded when calculating the hash. Send the result as parameter t.
// For example: if the password is sesame and the random salt is c19b2d,
// then token = md5(“sesamec19b2d”) = 26719a1196d2a940705a59634eb18eab.
// The corresponding request URL then becomes:
pub type Credentials {
  Credentials(salt: String, token: String)
}

pub fn hash_password(password: String) -> Credentials {
  let salt = random_str.new()
  let token = md5.new(password <> salt)

  Credentials(salt:, token:)
}
