class Player {
	constructor() {
		this.ctx = new AudioContext()
		this.element = new Audio()
		this.element.crossOrigin = true
		this.element.addEventListener('error', (event) => {
			console.log('retrying song fetch')
			let time = this.element.currentTime
			let paused = this.element.paused

			load_song(this, this.element.currentSrc, this.current)
			this.element.currentTime = time
			if(!paused) {
				this.element.play()
			}
		})

		this.node = this.ctx.createMediaElementSource(this.element)
		this.node.connect(this.ctx.destination)
		this.current = null // current song playing
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
		updatePresence(player)
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

function coverURL(player) {
	let info = player.current
	let link = player.element.src

	let auth = JSON.parse(localStorage.getItem("auth")).auth
	return `${URL.parse(link).origin}/rest/getCoverArt.view?f=json&u=${auth.username}&s=${auth.salt}&t=${auth.token}&c=somachord&v=1.16.0&id=${info.cover_art_id}&size=500`
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

	player.current = info
	if ('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: info.title,
			artist: info.artists.toArray().map(artist => artist.name).join(', '),
			album: info.album_name,
			artwork: [{
				src: coverURL(player)
			}],
		})
	}
}

function updatePresence(player) {
	let info = player.current
	if (!info) {
		return;
	}

	if (window.electronAPI) {
		window.electronAPI.updatePresence({
			details: info.title,
			state: info.artists.toArray().map(artist => artist.name).join(', '),
			largeImageKey: coverURL(player),
			largeImageText: info.album_name,
			startTimestamp: player.element.paused ? Date.now() : new Date(Date.now() - (player.element.currentTime * 1000)),
			endTimestamp: player.element.paused ? Date.now() : new Date(Date.now() + (info.duration * 1000) - (player.element.currentTime * 1000)),
			smallImageKey: player.element.paused ? 'https://cdn-icons-png.flaticon.com/512/9195/9195053.png' : null,
			smallImageText: player.element.paused ? 'Paused' : null
		})
	}
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
	updatePresence(player)
}

/**
 * 
 * @param {Player} player 
 * @param {number} amount 
 */
export function seek(player, amount) {
	player.element.currentTime = amount
	updatePresence(player)
}

/**
 * 
 * @param {Player} player 
 */
export function beginning(player) {
	player.element.currentTime = 0
	updatePresence(player)
}

/**
 * 
 * @param {Player} player 
 * @param {boolean} state 
 */
export function loop(player, state) {
	player.element.loop = state
}
