export function new_() {
    let uuid = self.crypto.randomUUID()
    return uuid.split("-")[0]
}
