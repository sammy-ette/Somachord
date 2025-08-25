import md5 from "js-md5"

export function hash(text) {
    return md5(text)
}

export function generate_salt() {
    // 10 == 8 + 2 (salt is 8 characters)
    return Math.random().toString(36).substring(2, 10)
}
