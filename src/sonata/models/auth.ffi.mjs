import md5 from "js-md5"

export function hash(text) {
    return md5(text)
}

export function generate_salt() {
    let uuid = self.crypto.randomUUID()
    return uuid.split("-")[0]
}
