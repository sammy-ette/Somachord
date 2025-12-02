import gleam/dict
import gleam/int
import gleam/list
import gleam/option
import gleam/order
import plinth/javascript/date
import somachord/api/models as api_models

pub type Deque(a) {
  Deque(front: List(a), back: List(a))
}

fn new_deque() -> Deque(a) {
  Deque(front: [], back: [])
}

fn push_front(deque: Deque(a), item: a) -> Deque(a) {
  Deque(front: [item, ..deque.front], back: deque.back)
}

fn push_back(deque: Deque(a), item: a) -> Deque(a) {
  Deque(front: deque.front, back: [item, ..deque.back])
}

fn pop_front(deque: Deque(a)) -> #(option.Option(a), Deque(a)) {
  case deque.front {
    [head, ..tail] -> #(option.Some(head), Deque(front: tail, back: deque.back))
    [] ->
      case list.reverse(deque.back) {
        [] -> #(option.None, deque)
        [head, ..tail] -> #(option.Some(head), Deque(front: tail, back: []))
      }
  }
}

fn to_list(deque: Deque(a)) -> List(a) {
  list.append(deque.front, list.reverse(deque.back))
}

pub type Queue {
  Queue(
    song_position: Float,
    songs: dict.Dict(Int, api_models.Child),
    // played, unplayed
    // top of unplayed is the current song
    song_order: SongOrder,
    position: Int,
    changed: date.Date,
    length: Int,
  )
}

pub type SongOrder {
  SongOrder(played: Deque(Int), unplayed: Deque(Int))
}

pub fn new() -> Queue {
  Queue(
    song_position: 0.0,
    songs: dict.new(),
    song_order: SongOrder(played: new_deque(), unplayed: new_deque()),
    position: 0,
    changed: date.now(),
    length: 0,
  )
}

pub fn add(queue: Queue, song: api_models.Child) {
  let updated_songs = queue.songs |> dict.insert(queue.length, song)
  let updated_unplayed = push_back(queue.song_order.unplayed, queue.length)
  Queue(
    ..queue,
    songs: updated_songs,
    song_order: SongOrder(queue.song_order.played, updated_unplayed),
    length: queue.length + 1,
    changed: date.now(),
  )
}

pub fn add_list(queue: Queue, songs: List(api_models.Child)) -> Queue {
  list.fold(songs, queue, fn(acc_queue, song) { acc_queue |> add(song) })
}

pub fn next(queue: Queue) {
  let #(song_idx_opt, updated_unplayed) = pop_front(queue.song_order.unplayed)
  case song_idx_opt {
    option.Some(song_idx) -> {
      let updated_played = push_front(queue.song_order.played, song_idx)
      Queue(
        ..queue,
        song_order: SongOrder(updated_played, updated_unplayed),
        position: queue.position + 1,
        changed: date.now(),
      )
    }
    option.None -> queue
  }
}

pub fn previous(queue: Queue) {
  let #(song_idx_opt, updated_played) = pop_front(queue.song_order.played)
  case song_idx_opt {
    option.Some(song_idx) -> {
      let updated_unplayed = push_front(queue.song_order.unplayed, song_idx)
      Queue(
        ..queue,
        song_order: SongOrder(updated_played, updated_unplayed),
        position: queue.position - 1,
        changed: date.now(),
      )
    }
    option.None -> queue
  }
}

pub fn shuffle(queue: Queue) {
  let all_indices =
    list.append(
      to_list(queue.song_order.played) |> list.reverse,
      to_list(queue.song_order.unplayed),
    )

  case to_list(queue.song_order.unplayed) {
    [current, ..] -> {
      let shuffled = list.shuffle(all_indices)
      let assert Ok(pos) = list.find(shuffled, fn(x) { x == current })
      let prefix = list.take(shuffled, pos)
      let suffix = list.drop(shuffled, pos)
      let new_played =
        list.fold(prefix, new_deque(), fn(deq, idx) { push_front(deq, idx) })
      let new_unplayed =
        list.fold(suffix, new_deque(), fn(deq, idx) { push_back(deq, idx) })
      Queue(
        ..queue,
        song_order: SongOrder(played: new_played, unplayed: new_unplayed),
        position: list.length(prefix),
        changed: date.now(),
      )
    }
    [] -> {
      // no current: just shuffle everything into unplayed
      let shuffled = list.shuffle(all_indices)
      let new_unplayed =
        list.fold(shuffled, new_deque(), fn(deq, idx) { push_back(deq, idx) })
      Queue(
        ..queue,
        song_order: SongOrder(played: new_deque(), unplayed: new_unplayed),
        position: 0,
        changed: date.now(),
      )
    }
  }
}

pub fn unshuffle(queue: Queue) {
  let all_indices =
    list.append(
      to_list(queue.song_order.played) |> list.reverse,
      to_list(queue.song_order.unplayed),
    )

  case to_list(queue.song_order.unplayed) {
    [current, ..] -> {
      let sorted = list.sort(all_indices, int.compare)
      let assert Ok(pos) = list.find(sorted, fn(x) { x == current })
      let prefix = list.take(sorted, pos)
      let suffix = list.drop(sorted, pos)
      let new_played =
        list.fold(prefix, new_deque(), fn(deq, idx) { push_front(deq, idx) })
      let new_unplayed =
        list.fold(suffix, new_deque(), fn(deq, idx) { push_back(deq, idx) })
      Queue(
        ..queue,
        song_order: SongOrder(played: new_played, unplayed: new_unplayed),
        position: list.length(prefix),
        changed: date.now(),
      )
    }
    [] -> {
      let sorted = list.sort(all_indices, int.compare)
      let new_unplayed =
        list.fold(sorted, new_deque(), fn(deq, idx) { push_back(deq, idx) })
      Queue(
        ..queue,
        song_order: SongOrder(played: new_deque(), unplayed: new_unplayed),
        position: 0,
        changed: date.now(),
      )
    }
  }
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

pub fn current_song(queue: Queue) -> option.Option(api_models.Child) {
  let #(song_idx_opt, _) = pop_front(queue.song_order.unplayed)
  option.then(song_idx_opt, fn(idx) {
    dict.get(queue.songs, idx) |> option.from_result
  })
}

pub fn list(queue: Queue) -> List(#(Int, api_models.Child)) {
  let all_indices =
    list.append(
      to_list(queue.song_order.played) |> list.reverse,
      to_list(queue.song_order.unplayed),
    )
  list.filter_map(all_indices, fn(idx) {
    case dict.get(queue.songs, idx) {
      Ok(song) -> Ok(#(idx, song))
      Error(_) -> Error(Nil)
    }
  })
}
