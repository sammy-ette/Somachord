import electron
import gleam/bool
import gleam/list
import gleam/uri
import modem
import plinth/browser/window
import rsvp

import formal/form
import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import somachord/api/api
import somachord/models/auth
import varasto

import somachord/storage

pub type Model {
  Model(
    storage: varasto.TypedStorage(storage.Storage),
    login_form: form.Form(Login),
    auth_details: auth.Auth,
  )
}

pub type Msg {
  LoginSubmitted(Result(Login, form.Form(Login)))
  PingResponse(Result(Result(Nil, api.SubsonicError), rsvp.Error))
}

pub fn register() {
  let component = lustre.component(init, update, view, [])
  lustre.register(component, "login-page")
}

pub fn element() {
  element.element("login-page", [attribute.class("flex-1")], [])
}

fn init(_) {
  #(
    Model(
      storage.create(),
      login_form(),
      auth.Auth("", auth.Credentials("", ""), ""),
    ),
    effect.none(),
  )
}

fn update(m: Model, message: Msg) {
  case message {
    LoginSubmitted(Ok(login_data)) -> {
      let auth =
        auth.Auth(
          server_url: login_data.server_url,
          username: login_data.username,
          credentials: auth.hash_password(login_data.password),
        )

      #(
        Model(..m, auth_details: auth),
        api.ping(auth_details: auth, msg: PingResponse),
      )
    }
    LoginSubmitted(Error(updated_form)) -> #(
      Model(..m, login_form: updated_form),
      effect.none(),
    )
    PingResponse(Ok(Ok(Nil))) -> {
      let _ =
        m.storage
        |> varasto.set("auth", storage.Storage(auth: m.auth_details))

      #(m, {
        let assert Ok(home) =
          uri.parse(case electron.am_i_electron() {
            True -> window.location()
            False -> "/"
          })
        modem.load(home)
      })
    }
    PingResponse(Ok(Error(e))) -> {
      let message = case e {
        api.WrongCredentials(msg) -> msg
        api.SubsonicError(_, msg) -> msg
        api.NotFound -> panic as "should be unreachable"
      }

      #(
        Model(
          ..m,
          login_form: form.add_error(
            m.login_form,
            "ping_error",
            form.CustomError(message),
          ),
        ),
        effect.none(),
      )
    }
    PingResponse(Error(e)) -> {
      echo e
      panic
    }
  }
}

pub type Login {
  Login(server_url: String, username: String, password: String)
}

fn login_form() -> form.Form(Login) {
  form.new({
    use server_url <- form.field("serverURL", form.parse_url)
    use username <- form.field(
      "username",
      form.parse_string |> form.check_not_empty,
    )
    use password <- form.field(
      "password",
      form.parse_string |> form.check_not_empty,
    )

    form.success(Login(
      server_url: server_url |> uri.to_string,
      username:,
      password:,
    ))
  })
}

pub fn view(m: Model) {
  let submitted = fn(fields) {
    m.login_form |> form.add_values(fields) |> form.run |> LoginSubmitted
  }

  html.div(
    [
      attribute.class(
        "bg-linear-to-t from-zinc-950 to-zinc-900 font-[Poppins,sans-serif] flex h-screen mx-auto p-4 overflow-hidden",
      ),
    ],
    [
      html.div(
        [
          attribute.class(
            "rounded-xl flex-1 h-full flex border border-zinc-600 justify-center items-center",
          ),
        ],
        [
          html.div(
            [
              attribute.class(
                "md:w-[30%] flex bg-zinc-800 rounded-lg justify-center p-4",
              ),
            ],
            [
              html.div([attribute.class("flex flex-col w-full")], [
                html.h1([attribute.class("font-bold text-4xl self-center")], [
                  element.text("Somachord"),
                ]),
                {
                  use <- bool.guard(
                    form.field_error_messages(m.login_form, "ping_error")
                      |> list.is_empty,
                    element.none(),
                  )
                  let assert Ok(msg) =
                    form.field_error_messages(m.login_form, "ping_error")
                    |> list.first
                  html.small([attribute.class("self-center text-red-400")], [
                    element.text(msg),
                  ])
                },
                html.form(
                  [
                    event.on_submit(submitted),
                    attribute.class("flex flex-col gap-4"),
                  ],
                  [
                    html.div([attribute.class("flex flex-col gap-2")], [
                      html.label([attribute.class("text-sm font-medium")], [
                        element.text("Server URL"),
                      ]),
                      html.input([
                        attribute.type_("input"),
                        attribute.name("serverURL"),
                        attribute.class(
                          "bg-zinc-700 rounded-md p-2 text-zinc-200 focus:outline focus:outline-violet-400",
                        ),
                      ]),
                      ..list.map(
                        form.field_error_messages(m.login_form, "serverURL"),
                        fn(msg) {
                          html.small([attribute.class("text-red-400")], [
                            element.text(msg),
                          ])
                        },
                      )
                    ]),
                    html.div([attribute.class("flex flex-col gap-2")], [
                      html.label([attribute.class("text-sm font-medium")], [
                        element.text("Username"),
                      ]),
                      html.input([
                        attribute.autocomplete("text"),
                        attribute.type_("input"),
                        attribute.name("username"),
                        attribute.class(
                          "bg-zinc-700 rounded-md p-2 text-zinc-200 focus:outline focus:outline-violet-400",
                        ),
                      ]),
                      ..list.map(
                        form.field_error_messages(m.login_form, "username"),
                        fn(msg) {
                          html.small([attribute.class("text-red-400")], [
                            element.text(msg),
                          ])
                        },
                      )
                    ]),
                    html.div([attribute.class("flex flex-col gap-2")], [
                      html.label([attribute.class("text-sm font-medium")], [
                        element.text("Password"),
                      ]),
                      html.input([
                        attribute.autocomplete("current-password"),
                        attribute.type_("password"),
                        attribute.name("password"),
                        attribute.class(
                          "bg-zinc-700 rounded-md p-2 text-zinc-200 focus:outline focus:outline-violet-400",
                        ),
                      ]),
                      ..list.map(
                        form.field_error_messages(m.login_form, "password"),
                        fn(msg) {
                          html.small([attribute.class("text-red-400")], [
                            element.text(msg),
                          ])
                        },
                      )
                    ]),
                    html.button(
                      [
                        attribute.class(
                          "bg-violet-600 hover:bg-violet-600/80 active:scale-[95%] translate-scale duration-250 ease-in-out rounded-full p-2 w-1/3 self-center h-12 items-center",
                        ),
                      ],
                      [
                        html.span([attribute.class("font-semibold")], [
                          element.text("Login"),
                        ]),
                      ],
                    ),
                  ],
                ),
              ]),
            ],
          ),
        ],
      ),
    ],
  )
}
