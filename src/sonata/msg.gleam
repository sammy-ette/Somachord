import rsvp
import sonata/api_helper
import sonata/router

pub type Msg {
  Router(router.Msg)
  SubsonicResponse(Result(api_helper.Response, rsvp.Error))
}
