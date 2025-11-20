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
    // played, unplayed
    // top of unplayed is the current song
    song_order: SongOrder,
    position: Int,
    changed: date.Date,
  )
}

pub type SongOrder {
  SongOrder(played: List(Int), unplayed: List(Int))
}

pub fn empty() {
  Queue(
    song_position: 0.0,
    songs: dict.new(),
    song_order: SongOrder(played: [], unplayed: []),
    position: 0,
    changed: date.now(),
  )
}

pub fn new(
  position position: Int,
  songs songs: List(api_models.Child),
  song_position song_position: Float,
) {
  let song_order =
    list.range(0, list.length(songs) - 1)
    |> list.split(position)
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
    song_order: SongOrder(played: song_order.0, unplayed: song_order.1),
  )
}

pub fn shuffle(queue: Queue) {
  let song_order =
    list.range(0, list.length(queue.songs |> dict.values) - 1)
    |> list.shuffle
    |> list.split(queue.position)
  Queue(
    ..queue,
    song_order: SongOrder(played: song_order.0, unplayed: song_order.1),
  )
}

pub fn unshuffle(queue: Queue) {
  let song_order =
    list.range(0, list.length(queue.songs |> dict.values) - 1)
    |> list.split(queue.position)
  Queue(
    ..queue,
    song_order: SongOrder(played: song_order.0, unplayed: song_order.1),
  )
}

pub fn jump(queue: Queue, position: Int) {
  case int.compare(position, queue.position) {
    order.Gt -> {
      next_itr(queue, position - queue.position)
    }
    order.Lt -> {
      previous_itr(queue, queue.position - position)
    }

    order.Eq -> queue
  }
}

fn next_itr(queue: Queue, times: Int) {
  case times {
    0 -> queue
    _ -> next_itr(next(queue), times - 1)
  }
}

fn previous_itr(queue: Queue, times: Int) {
  case times {
    0 -> queue
    _ -> previous_itr(previous(queue), times - 1)
  }
}

pub fn next(queue: Queue) {
  case queue.song_order.unplayed {
    [] -> queue
    [front_first, ..unplayed_rest] -> {
      let updated_played = [front_first, ..queue.song_order.played]
      Queue(
        ..queue,
        song_order: SongOrder(updated_played, unplayed_rest),
        position: queue.position + 1,
      )
    }
  }
}

pub fn previous(queue: Queue) {
  case queue.song_order.played {
    [] -> queue
    [played_first, ..played_rest] -> {
      let updated_unplayed = [played_first, ..queue.song_order.unplayed]
      Queue(
        ..queue,
        song_order: SongOrder(played_rest, updated_unplayed),
        position: queue.position - 1,
      )
    }
  }
}

pub fn current_song(queue: Queue) -> option.Option(api_models.Child) {
  case queue.song_order.unplayed |> list.first {
    Ok(idx) -> {
      let assert Ok(song) = queue.songs |> dict.get(idx)
      option.Some(song)
    }
    Error(_) -> option.None
  }
}

pub fn list(queue: Queue) -> List(#(Int, api_models.Child)) {
  list.map(
    [list.reverse(queue.song_order.played), queue.song_order.unplayed]
      |> list.flatten,
    fn(idx) {
      let assert Ok(song) = queue.songs |> dict.get(idx)
      #(idx, song)
    },
  )
}
