import gleam/int
import gleam/list
import gleam/option
import plinth/javascript/date
import somachord/api/models as api_models

pub type Queue {
  Queue(
    song_position: Float,
    played: List(#(Int, api_models.Child)),
    current: option.Option(#(Int, api_models.Child)),
    unplayed: List(#(Int, api_models.Child)),
    next_id: Int,
    changed: date.Date,
  )
}

pub fn empty() {
  Queue(
    song_position: 0.0,
    played: [],
    current: option.None,
    unplayed: [],
    next_id: 0,
    changed: date.now(),
  )
}

pub fn new(
  songs songs: List(api_models.Child),
  song_position song_position: Float,
) {
  case songs |> list.index_map(fn(song, idx) { #(idx, song) }) {
    [] -> empty()
    [first, ..rest] ->
      Queue(
        song_position:,
        played: [],
        current: option.Some(first),
        unplayed: rest,
        next_id: list.length(songs),
        changed: date.now(),
      )
  }
}

pub fn shuffle(queue: Queue) {
  Queue(
    ..queue,
    played: list.shuffle(queue.played),
    unplayed: list.shuffle(queue.unplayed),
  )
}

pub fn unshuffle(queue: Queue) {
  Queue(
    ..queue,
    played: queue.played |> list.sort(fn(a, b) { int.compare(b.0, a.0) }),
    unplayed: queue.unplayed |> list.sort(fn(a, b) { int.compare(a.0, b.0) }),
  )
}

pub fn next(queue: Queue) {
  case queue.unplayed {
    [] -> queue
    [head, ..rest] ->
      Queue(
        ..queue,
        played: case queue.current {
          option.Some(c) -> [c, ..queue.played]
          option.None -> queue.played
        },
        current: option.Some(head),
        unplayed: rest,
      )
  }
}

pub fn previous(queue: Queue) {
  case queue.played {
    [] -> queue
    [head, ..rest] ->
      Queue(
        ..queue,
        played: rest,
        current: option.Some(head),
        unplayed: case queue.current {
          option.Some(c) -> [c, ..queue.unplayed]
          option.None -> queue.unplayed
        },
      )
  }
}

pub fn current_song(queue: Queue) -> option.Option(api_models.Child) {
  queue.current |> option.map(fn(c) { c.1 })
}

pub fn list(queue: Queue) -> List(#(Int, api_models.Child)) {
  case queue.current {
    option.Some(current) ->
      list.flatten([list.reverse(queue.played), [current], queue.unplayed])
    option.None -> list.append(list.reverse(queue.played), queue.unplayed)
  }
}

pub fn jump(queue: Queue, song_idx: Int) -> Queue {
  let matches_idx = fn(entry: #(Int, api_models.Child)) { entry.0 != song_idx }
  case queue.current {
    option.Some(#(idx, _)) if idx == song_idx -> queue
    _ ->
      case list.split_while(queue.unplayed, matches_idx) {
        #(before, [found, ..after]) ->
          Queue(
            ..queue,
            played: case queue.current {
              option.Some(c) ->
                list.append(list.reverse(before), [c, ..queue.played])
              option.None -> list.reverse(before)
            },
            current: option.Some(found),
            unplayed: after,
          )
        #(_, []) ->
          case list.split_while(queue.played, matches_idx) {
            #(before, [found, ..after]) ->
              Queue(
                ..queue,
                played: after,
                current: option.Some(found),
                unplayed: case queue.current {
                  option.Some(c) ->
                    list.append(list.reverse(before), [c, ..queue.unplayed])
                  option.None ->
                    list.append(list.reverse(before), queue.unplayed)
                },
              )
            #(_, []) -> queue
          }
      }
  }
}

pub fn append_songs(queue: Queue, songs: List(api_models.Child)) -> Queue {
  let #(new_entries, next_id) =
    songs
    |> list.fold(#([], queue.next_id), fn(acc, song) {
      #([#(acc.1, song), ..acc.0], acc.1 + 1)
    })
  Queue(
    ..queue,
    unplayed: list.append(queue.unplayed, list.reverse(new_entries)),
    next_id:,
  )
}
