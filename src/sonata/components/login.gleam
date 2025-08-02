import gleam/list
import gleam/uri
import modem
import sonata/api_helper
import sonata/msg

import formal/form
import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import sonata/api
import sonata/models/auth
import varasto

import sonata/storage

pub type Model {
  Model(
    storage: varasto.TypedStorage(storage.Storage),
    login_form: form.Form(Login),
    auth_details: auth.Auth,
  )
}

pub type Msg {
  LoginSubmitted(Result(Login, form.Form(Login)))
  SonataMsg(msg.Msg)
}

pub fn register() {
  let component = lustre.component(init, update, view, [])
  lustre.register(component, "login-page")
}

pub fn element() {
  element.element("login-page", [], [])
}

fn init(_) {
  #(
    Model(
      storage.create(),
      login_form(),
      auth.Auth("", auth.Credentials("", "")),
    ),
    effect.none(),
  )
}

fn update(m: Model, msg: Msg) {
  case msg {
    LoginSubmitted(Ok(login_data)) -> {
      let auth =
        auth.Auth(
          username: login_data.username,
          credentials: auth.hash_password(login_data.password),
        )

      #(
        Model(..m, auth_details: auth),
        api.ping(auth)
          |> effect.map(fn(a) { SonataMsg(a) }),
      )
    }
    LoginSubmitted(Error(updated_form)) -> #(
      Model(..m, login_form: updated_form),
      effect.none(),
    )
    SonataMsg(msg.SubsonicResponse(resp)) ->
      case resp {
        Ok(api_helper.Ping) -> {
          m.storage
          |> varasto.set("auth", storage.Storage(auth: m.auth_details))
          let assert Ok(home) = uri.parse("/")
          #(m, modem.load(home))
        }
        _ -> #(m, effect.none())
      }
    _ -> #(m, effect.none())
  }
}

pub type Login {
  Login(username: String, password: String)
}

fn login_form() -> form.Form(Login) {
  form.new({
    use username <- form.field(
      "username",
      form.parse_string |> form.check_not_empty,
    )
    use password <- form.field(
      "password",
      form.parse_string |> form.check_not_empty,
    )

    form.success(Login(username:, password:))
  })
}

pub fn view(m: Model) {
  let submitted = fn(fields) {
    m.login_form |> form.add_values(fields) |> form.run |> LoginSubmitted
  }

  html.div(
    [
      attribute.class(
        "bg-linear-to-t from-zinc-950 to-zinc-900 font-[Poppins] flex h-screen mx-auto p-4 overflow-none",
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
            [attribute.class("flex bg-zinc-800 rounded-lg justify-center p-4")],
            [
              html.div([attribute.class("flex flex-col gap-8")], [
                html.h1([attribute.class("font-bold text-4xl self-center")], [
                  element.text("Sonata"),
                ]),
                html.form(
                  [
                    event.on_submit(submitted),
                    attribute.class("flex flex-col gap-4"),
                  ],
                  [
                    html.div([attribute.class("flex flex-col gap-2")], [
                      html.label([attribute.class("text-sm font-medium")], [
                        element.text("Username"),
                      ]),
                      html.input([
                        attribute.type_("input"),
                        attribute.name("username"),
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
                    html.div([attribute.class("flex flex-col gap-2")], [
                      html.label([attribute.class("text-sm font-medium")], [
                        element.text("Password"),
                      ]),
                      html.input([
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
