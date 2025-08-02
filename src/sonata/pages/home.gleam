import lustre/attribute
import lustre/element/html

pub fn page() {
  html.div(
    [
      attribute.class(
        "flex-1 flex flex-col p-4 rounded-lg border border-zinc-800",
      ),
    ],
    [],
  )
}
