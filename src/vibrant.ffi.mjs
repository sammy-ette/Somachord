import { Vibrant } from "node-vibrant/browser";

export function palette(imageURL) {
    return Vibrant.from(imageURL)
    .getPalette()
}

export function vibrant(palette) {
    return palette.Vibrant
}

export function dark_vibrant(palette) {
    return palette.DarkVibrant
}

export function light_vibrant(palette) {
    return palette.LightVibrant
}

export function muted(palette) {
    return palette.Muted
}


export function dark_muted(palette) {
    return palette.DarkMuted
}

export function light_muted(palette) {
    return palette.LightMuted
}

export function swatch_hex(swatch) {
    return swatch.hex
}
