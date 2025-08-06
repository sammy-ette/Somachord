class Player {
    constructor() {
        this.ctx = new AudioContext()
        this.element = new Audio()

        this.element.crossOrigin = true
        this.node = this.ctx.createMediaElementSource(this.element)
        this.node.connect(this.ctx.destination)
        this.current = null // current song playing

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            console.log('next')
        })
    }
}

export function new_() {
    return new Player()
}

/**
 * 
 * @param {Player} player 
 * @param {function} listener 
 */
export function listen_events(player, listener) {
    player.element.addEventListener('playing', () => {
        listener(player, 'loaded')
    })

    player.element.addEventListener('timeupdate', () => {
        listener(player, 'time')
    })

    player.element.addEventListener('ended', () => {
        listener(player, 'ended')
    })

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (player.element.currentTime > 5) {
            beginning(player)
        } else {
            listener(player, 'previous')
        }
    })

    navigator.mediaSession.setActionHandler('nexttrack', () => {
        listener(player, 'next')
    })
}

/**
 * 
 * @param {Player} player 
 * @returns 
 */
export function is_paused(player) {
    return player.element.paused
}

/**
 * 
 * @param {Player} player 
 * @returns 
 */
export function current(player) {
    return player.current
}

export function time(player) {
    return player.element.currentTime
}

/**
 * 
 * @param {Player} player
 * @param {string} link 
 */
export function load_song(player, link, info) {
    player.element.src = link
    if (player.ctx.state == "suspended") {
        player.ctx.resume()
    }
    player.element.play()

    let auth = JSON.parse(localStorage.getItem("auth")).auth
    console.log(auth)
    let album_art_url = `${URL.parse(link).origin}/rest/getCoverArt.view?u=${auth.username}&s=${auth.salt}&t=${auth.token}&c=sonata&id=${info.cover_art_id}&size=500`
    console.log(album_art_url)
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: info.title,
            artist: info.artists.toArray().map(artist => artist.name).join(', '),
            album: info.album_name,
            artwork: [{
                src: album_art_url
            }],
            
        })
    }
    player.current = info
}

/**
 * 
 * @param {Player} player 
 */
export function pause_play(player) {
    if(player.element.paused) {
        player.element.play()
    } else {
        player.element.pause()
    }
}

/**
 * 
 * @param {Player} player 
 * @param {number} amount 
 */
export function seek(player, amount) {
    player.element.currentTime = amount
}

/**
 * 
 * @param {Player} player 
 */
export function beginning(player) {
    player.element.currentTime = 0
}
