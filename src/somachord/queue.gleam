import gleam/dict
import gleam/int
import gleam/list
import gleam/option
import gleam/order
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
      |> list.split(position),
  )
}

pub fn shuffle(queue: Queue) {
  Queue(
    ..queue,
    song_order: list.range(0, list.length(queue.songs |> dict.values) - 1)
      |> list.shuffle
      |> echo
      |> list.split(queue.position)
      |> echo,
  )
}

pub fn unshuffle(queue: Queue) {
  Queue(
    ..queue,
    song_order: list.range(0, list.length(queue.songs |> dict.values) - 1)
      |> list.split(queue.position),
  )
}

pub fn jump(queue: Queue, position: Int) {
  Queue(
    ..queue,
    song_order: list.append(queue.song_order.0, queue.song_order.1)
      |> list.split(position),
    position:,
  )
}

pub fn next(queue: Queue) {
  case queue.song_order.1 {
    [] -> queue
    [front_first, ..front_rest] -> {
      let updated_back = [front_first, ..queue.song_order.0]
      Queue(
        ..queue,
        song_order: #(updated_back, front_rest),
        position: queue.position + 1,
      )
    }
  }
}

pub fn previous(queue: Queue) {
  case queue.song_order.0 {
    [] -> queue
    [back_first, ..back_rest] -> {
      let updated_front = [back_first, ..queue.song_order.1]
      Queue(
        ..queue,
        song_order: #(back_rest, updated_front),
        position: queue.position - 1,
      )
    }
  }
}

pub fn current_song(queue: Queue) -> option.Option(api_models.Child) {
  case queue.song_order.1 |> list.first {
    Ok(idx) -> {
      let assert Ok(song) = queue.songs |> dict.get(idx)
      option.Some(song)
    }
    Error(_) -> option.None
  }
}

pub fn list(queue: Queue) -> List(#(Int, api_models.Child)) {
  list.map(
    list.append(list.reverse(queue.song_order.0), queue.song_order.1),
    fn(idx) {
      let assert Ok(song) = queue.songs |> dict.get(idx)
      #(idx, song)
    },
  )
}
