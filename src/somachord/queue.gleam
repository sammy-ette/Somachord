import gleam/dict
import gleam/int
import gleam/list
import gleam/option
import gleam/pair
import plinth/javascript/date
import somachord/api_models

pub type Queue {
  Queue(
    song_position: Float,
    songs: dict.Dict(Int, api_models.Child),
    // back, front
    song_order: #(List(Int), List(Int)),
    position: Int,
    changed: date.Date,
  )
}

pub fn empty() {
  Queue(
    song_position: 0.0,
    songs: dict.new(),
    song_order: #([], []),
    position: 0,
    changed: date.now(),
  )
}

pub fn new(
  position position: Int,
  songs songs: List(api_models.Child),
  song_position song_position: Float,
) {
  Queue(
    position:,
    song_position:,
    songs: songs
      |> list.fold(#(dict.new(), 0), fn(acc, song) {
        let #(d, idx) = acc
        #(d |> dict.insert(idx, song), idx + 1)
      })
      |> pair.first,
    changed: date.now(),
    song_order: list.range(0, list.length(songs) - 1)
      |> list.partition(fn(idx) { idx < position }),
  )
}

pub fn shuffle(queue: Queue) {
  Queue(..queue, song_order: #(
    queue.song_order.0 |> list.shuffle,
    queue.song_order.1 |> list.shuffle,
  ))
}

pub fn unshuffle(queue: Queue) {
  Queue(..queue, song_order: #(
    queue.song_order.0 |> list.sort(int.compare),
    queue.song_order.1 |> list.sort(int.compare),
  ))
}

pub fn next(queue: Queue) {
  case queue.song_order.1 {
    [] -> queue
    [front_first, ..front_rest] -> {
      let updated_back = [front_first, ..queue.song_order.0]
      Queue(..queue, song_order: #(updated_back, front_rest))
    }
  }
}

pub fn previous(queue: Queue) {
  case queue.song_order.0 {
    [] -> queue
    [back_first, ..back_rest] -> {
      let updated_front = [back_first, ..queue.song_order.1]
      Queue(..queue, song_order: #(back_rest, updated_front))
    }
  }
}

pub fn current_song(queue: Queue) -> option.Option(api_models.Child) {
  echo queue.song_order
  echo queue.songs
  case queue.song_order.1 |> list.first {
    Ok(idx) -> {
      echo idx
      let assert Ok(song) = queue.songs |> dict.get(idx)
      option.Some(song)
    }
    Error(_) -> option.None
  }
}
