class Player {
	constructor() {
		this.ctx = new AudioContext();
		this.node = null
		this.current = null // Current song info
		this.buffer = new AudioBufferSourceNode(this.ctx)

		this.playbackState = 'stopped'; // 'playing', 'paused', 'stopped'
		this.startOffset = 0
		this.startTime = 0
	}

	_dispatchCustomEvent(type, detail) {
		const event = new CustomEvent(type, { detail: { player: this, ...detail } });
		this.dispatchEvent(event);
	}

	_updateLoop = () => {
		if (this.playbackState === 'playing' && this.current && this.node) {
			this._dispatchCustomEvent('timeupdate', {});
			requestAnimationFrame(this._updateLoop);
		}
	}

	/**
	 * Internal method to create and start a new AudioBufferSourceNode.
	 * @param {number} startOffset - Time in seconds to start playback from.
	 */
	_startNode(startOffset) {
		this.node = this.ctx.createBufferSource();
		this.node.buffer = this.buffer;
		this.node.connect(this.ctx.destination);
		
		// This is where we handle the 'ended' event.
		this.node.onended = () => {
			if (this.playbackState === 'playing') {
				if (this.nextBuffer) {
					this.buffer = this.nextBuffer
					this.startOffset = 0
					this.startTime = this.ctx.currentTime

					this._startNode()
					this.nextBuffer = null
				} else {
					this.playbackState = 'stopped';
					this.startOffset = 0;
					this._dispatchCustomEvent('ended', {});
				}
			}
		};

		this.node.start(0, startOffset)
		this.startTime = this.ctx.currentTime
		this.playbackState = 'playing'

		requestAnimationFrame(this._updateLoop)
		this._dispatchCustomEvent('playing', { state: 'playing' })
	}
	
    /**
     * Loads a song and prepares it for playback.
     * @param {string} link - The URL to the song.
     * @param {object} info - Song metadata.
     */
    async load_song(link, info, nextLink, nextInfo) {
        if (this.node) {
            this.node.stop();
            this.startOffset = 0;
            this.playbackState = 'stopped';
            this._dispatchCustomEvent('timeupdate', {
                time: 0,
                duration: this.buffer.duration
            });
        }

        let buffer = await fetch(link).then(res => res.arrayBuffer()).then(data => {
            return this.ctx.decodeAudioData(data)
        })

        if (nextLink && nextLink != '') {
            this.nextBuffer = await fetch(nextLink).then(res => res.arrayBuffer()).then(data => {
                return this.ctx.decodeAudioData(data)
            })
            this.nextInfo = nextInfo
        }

        this.buffer = buffer
        this.current = info;

		if ('mediaSession' in navigator) {
			let auth = JSON.parse(localStorage.getItem("auth")).auth;
			let album_art_url = `${URL.parse(link).origin}/rest/getCoverArt.view?u=${auth.username}&s=${auth.salt}&t=${auth.token}&c=somachord&id=${info.cover_art_id}&size=500`;
			navigator.mediaSession.metadata = new MediaMetadata({
				title: info.title,
				artist: info.artists.toArray().map(artist => artist.name).join(', '),
				album: info.album_name,
				artwork: [{
					src: album_art_url
				}],
        	})
		}
                
        this.startOffset = 0; // Reset offset for a new song
        this.playbackState = 'stopped';
        this._dispatchCustomEvent('loaded', {});
        this.play()
    }

	/**
	 * Toggles between play and pause.
	 */
	pause_play() {
		if (this.playbackState === 'playing') {
			this.pause();
		} else {
			this.play();
		}
	}

	play() {
		if (this.current) {
			// Resume the context if it's suspended
			if (this.ctx.state === 'suspended') {
				this.ctx.resume();
			}
			// This plays the music :)
			this._startNode(this.startOffset);
		}
	}

	pause() {
		if (this.node && this.playbackState === 'playing') {
			this.node.stop();
			this.startOffset += (this.ctx.currentTime - this.startTime);
			this.playbackState = 'paused';
			this._dispatchCustomEvent('paused', { state: 'paused' });
		}
	}

	/**
	 * 
	 * @param {number} amount Time to seek in seconds
	 */
	seek(amount) {
		if (this.node) {
			this.node.stop()
			this.startOffset = amount
			if (this.playbackState === 'playing') {
				this._startNode(this.startOffset)
			}
			this._dispatchCustomEvent('seeked', { time: this.startOffset })
		}
	}

	beginning() {
		this.seek(0);
	}

	/**
	 * @returns {number} The current time in seconds.
	 */
	time() {
		if (this.playbackState === 'playing') {
			return this.startOffset + (this.ctx.currentTime - this.startTime);
		}
		return this.startOffset;
	}
	
	/**
	 * * @param {Player} player 
	 */
	is_paused(player) {
		return player.playbackState !== 'playing';
	}

	/**
	 * Returns the current song information. (model.Child gleam side)
	 * @returns {object} The current song object.
	 */
	current(player) {
		return player.current;
	}

	/**
	 * @param {Player} player
	 */
	loop(player) {
		if (player.node) {
			player.node.loop = true;
		}
	}

	// A simple method to make the Player object an EventTarget,
	// so we can use `addEventListener`.
	addEventListener(type, listener) {
		this._eventTarget = this._eventTarget || new EventTarget();
		this._eventTarget.addEventListener(type, listener);
	}
	
	dispatchEvent(event) {
		if (this._eventTarget) {
			this._eventTarget.dispatchEvent(event);
		}
	}
}
export function new_() {
	return new Player();
}

/**
 * @param {Player} player 
 * @param {function} listener 
 */
export function listen_events(player, listener) {
	player.addEventListener('loaded', () => {
		listener(player, 'loaded');
	});

	player.addEventListener('timeupdate', () => {
		listener(player, 'time');
	});

	player.addEventListener('ended', () => {
		listener(player, 'ended');
	});

	navigator.mediaSession.setActionHandler('previoustrack', () => {
		if (player.time() > 5) {
			player.beginning();
		} else {
			listener(player, 'previous');
		}
	});

	navigator.mediaSession.setActionHandler('nexttrack', () => {
		listener(player, 'next');
	});
}

export function is_paused(player) { return player.is_paused(player); }
export function current(player) { return player.current }
export function time(player) { return player.time(); }
export function load_song(player, link, info, nextLink, nextInfo) { player.load_song(link, info, nextLink, nextInfo); }
export function pause_play(player) { player.pause_play(); }
export function seek(player, amount) { player.seek(amount); }
export function beginning(player) { player.beginning(); }
export function loop(player) { player.loop(player); }
