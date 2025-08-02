import gleam/dynamic
import gleam/dynamic/decode
import sonata/storage
import varasto

import sonata/router

pub type Model {
  Model(
    route: router.Route,
    layout: Layout,
    storage: varasto.TypedStorage(storage.Storage),
  )
}

pub type Layout {
  Desktop
  Mobile
}

pub type Song {
  Song(id: String, title: String, album: String, artist: String, duration: Int)
}

pub type Album {
  Album(id: String, name: String, version: String, artist: String, year: Int)
}

pub type SongLyric {
  SongLyric(time: Int, line: String)
}
