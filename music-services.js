/* Official provider SDK adapters. Customer passwords never pass through DCMD. */
(() => {
  const store = {
    get(key) { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } },
    set(key, value) { sessionStorage.setItem(key, JSON.stringify(value)); },
    remove(key) { sessionStorage.removeItem(key); }
  };
  async function request(url, options = {}) {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
    if (!response.ok) {
      const messages = {401:'Oturumun sona erdi. Hesabını yeniden bağla.', 403:'Bu hesap veya uygulama için oynatma izni yok. Aboneliğini ve uygulama erişimini kontrol et.', 429:'Çok fazla istek gönderildi. Biraz bekleyip tekrar dene.'};
      throw new Error(messages[response.status] || `Müzik servisi yanıt vermedi (${response.status}). Tekrar dene.`);
    }
    return response.status === 204 ? null : response.json();
  }
  const scripts = new Map();
  function loadSDK(src, check, callbackName) {
    if (check()) return Promise.resolve();
    if (scripts.has(src)) return scripts.get(src);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const finish = () => { if (check()) { clearTimeout(timer); resolve(); } };
      const timer = setTimeout(() => reject(new Error('Müzik servisi yüklenemedi. Bağlantını kontrol edip tekrar dene.')), 20000);
      if (callbackName) window[callbackName] = finish;
      script.src = src;
      script.onload = finish;
      script.onerror = () => {clearTimeout(timer); reject(new Error('Müzik servisine bağlanılamadı.'));};
      document.head.append(script);
    }).catch(error => { scripts.delete(src); throw error; });
    scripts.set(src, promise);
    return promise;
  }
  const safeURL = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch {return '';} };
  const base64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const random = () => base64url(crypto.getRandomValues(new Uint8Array(48)));

  class SpotifyService {
    constructor(config, onState, onError) {
      this.config = config; this.onState = onState; this.onError = onError;
      this.tokens = store.get('dcmd-spotify-tokens'); this.connected = false;
      this.device = null; this.player = null; this.timer = null; this.refreshing = null;
    }
    async token() {
      if (!this.tokens) throw new Error('Önce Spotify hesabını bağla.');
      if (Date.now() < this.tokens.expiresAt - 60000) return this.tokens.access_token;
      if (!this.refreshing) {
        this.refreshing = request('https://accounts.spotify.com/api/token', {
          method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:new URLSearchParams({grant_type:'refresh_token', refresh_token:this.tokens.refresh_token, client_id:this.config.spotifyClientId})
        }).then(data => {this.saveTokens(data); return data.access_token;}).catch(error => {
          this.tokens = null; store.remove('dcmd-spotify-tokens'); this.connected = false; throw error;
        }).finally(() => {this.refreshing = null;});
      }
      return this.refreshing;
    }
    saveTokens(data) {
      this.tokens = {...data, refresh_token:data.refresh_token || this.tokens?.refresh_token, expiresAt:Date.now() + data.expires_in * 1000};
      store.set('dcmd-spotify-tokens', this.tokens);
    }
    async api(path, options = {}) {
      const token = await this.token();
      return request(`https://api.spotify.com/v1${path}`, {...options, headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'}});
    }
    async authorize() {
      const redirect = new URL(this.config.spotifyRedirectUri || location.origin + '/');
      const loopback = ['127.0.0.1','[::1]'].includes(redirect.hostname);
      if ((redirect.protocol !== 'https:' && !loopback) || redirect.origin !== location.origin || !window.isSecureContext) {
        throw new Error('Hesap bağlantısı için sitenin HTTPS adresini kullan. Yerel Wi-Fi bağlantısı Spotify girişini desteklemiyor.');
      }
      const verifier = random(), state = random();
      const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
      store.set('dcmd-spotify-pkce', {verifier,state,redirect:redirect.href,created:Date.now()});
      const params = new URLSearchParams({client_id:this.config.spotifyClientId, response_type:'code', redirect_uri:redirect.href,
        scope:'streaming user-read-email user-read-private user-modify-playback-state', code_challenge_method:'S256', code_challenge:challenge, state});
      location.assign(`https://accounts.spotify.com/authorize?${params}`);
    }
    async callback() {
      const url = new URL(location.href);
      if (!url.searchParams.has('code') && !url.searchParams.has('error')) return false;
      const pending = store.get('dcmd-spotify-pkce');
      const code = url.searchParams.get('code'), error = url.searchParams.get('error'), state = url.searchParams.get('state');
      ['code','error','state'].forEach(key => url.searchParams.delete(key));
      history.replaceState(null, '', url.pathname + url.search + url.hash);
      store.remove('dcmd-spotify-pkce');
      if (!pending || pending.state !== state || Date.now() - pending.created > 600000) throw new Error('Giriş doğrulanamadı. Spotify bağlantısını yeniden başlat.');
      if (error || !code) throw new Error('Spotify bağlantısı iptal edildi. İstersen tekrar bağlanabilirsin.');
      const data = await request('https://accounts.spotify.com/api/token', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams({client_id:this.config.spotifyClientId, grant_type:'authorization_code', code, redirect_uri:pending.redirect, code_verifier:pending.verifier})});
      this.saveTokens(data);
      return true;
    }
    async connect() {
      if (!this.tokens) {await this.authorize(); return;}
      if (this.connected) return;
      await this.token();
      await loadSDK('https://sdk.scdn.co/spotify-player.js', () => Boolean(window.Spotify), 'onSpotifyWebPlaybackSDKReady');
      this.player?.disconnect();
      this.player = new Spotify.Player({name:'DCMD Sound', volume:0.5, getOAuthToken: callback => {this.token().then(callback).catch(this.onError);}});
      const ready = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Spotify oynatıcıya bağlanamadı. Yeniden dene.')), 20000);
        this.player.addListener('ready', ({device_id}) => {clearTimeout(timer); this.device = device_id; this.connected = true; resolve();});
        const fail = message => {clearTimeout(timer); this.connected = false; this.device = null; const error = new Error(message); reject(error); this.onError(error);};
        this.player.addListener('initialization_error', () => fail('Bu tarayıcı korumalı müzik oynatmayı desteklemiyor. Güncel Chrome, Edge veya Safari ile dene.'));
        this.player.addListener('authentication_error', () => {this.tokens = null; store.remove('dcmd-spotify-tokens'); fail('Spotify oturumu doğrulanamadı. Yeniden bağlan.');});
        this.player.addListener('account_error', () => fail('Site içinde çalmak için Spotify Premium gerekiyor.'));
      });
      this.player.addListener('not_ready', () => {this.device = null; this.connected = false; this.onState({playing:false}); this.onError(new Error('Spotify bağlantısı kesildi. Yeniden bağlan.'));});
      this.player.addListener('player_state_changed', state => this.emit(state));
      this.player.addListener('playback_error', () => this.onError(new Error('Bu parça çalınamadı. Başka bir parça dene.')));
      this.player.addListener('autoplay_failed', () => this.onError(new Error('Müziği başlatmak için oynat düğmesine dokun.')));
      this.player.connect().catch(this.onError);
      try { await ready; } catch (error) {this.player.disconnect(); throw error;}
      clearInterval(this.timer);
      this.timer = setInterval(() => {if (this.connected) this.player.getCurrentState().then(state => this.emit(state)).catch(this.onError);}, 1000);
    }
    emit(state) {
      if (!state) {this.onState({playing:false}); return;}
      const t = state.track_window.current_track;
      this.onState({playing:!state.paused, position:state.position / 1000, duration:state.duration / 1000, canSeek:!state.disallows?.seeking,
        track:{id:t.id, name:t.name, artist:t.artists.map(a => a.name).join(', '), art:safeURL(t.album.images[0]?.url), url:`https://open.spotify.com/track/${t.id}`}});
    }
    async search(query) {
      const data = await this.api(`/search?${new URLSearchParams({q:query,type:'track',limit:10})}`);
      return (data.tracks?.items || []).filter(t => t && t.is_playable !== false).map(t => ({id:t.id, uri:t.uri, name:t.name, artist:t.artists.map(a => a.name).join(', '), art:safeURL(t.album.images[0]?.url), url:safeURL(t.external_urls.spotify)}));
    }
    async play(track) {
      if (!this.device) throw new Error('Spotify oynatıcı hazır değil. Hesabını yeniden bağla.');
      await this.player.activateElement();
      await this.api(`/me/player/play?device_id=${encodeURIComponent(this.device)}`, {method:'PUT', body:JSON.stringify({uris:[track.uri]})});
    }
    async toggle() {await this.player.activateElement(); await this.player.togglePlay();}
    async pause() {if (this.connected) await this.player.pause();}
    async seek(seconds) {await this.player.seek(Math.round(seconds * 1000));}
    async disconnect() {
      try {await this.pause();} finally {
        this.player?.disconnect(); clearInterval(this.timer); this.connected = false; this.device = null;
        this.tokens = null; store.remove('dcmd-spotify-tokens'); store.remove('dcmd-spotify-pkce');
      }
    }
  }

  class AppleService {
    constructor(config, onState, onError) {this.config = config; this.onState = onState; this.onError = onError; this.connected = false; this.music = null;}
    async prepare() {
      if (this.music) return;
      if (!window.isSecureContext) throw new Error('Apple Music bağlantısı için siteyi HTTPS üzerinden aç.');
      await loadSDK('https://js-cdn.music.apple.com/musickit/v3/musickit.js', () => Boolean(window.MusicKit));
      await MusicKit.configure({developerToken:this.config.appleDeveloperToken, app:{name:'DCMD Sound',build:'1.0.0'}, suppressErrorDialog:true});
      this.music = MusicKit.getInstance();
      ['playbackStateDidChange','playbackTimeDidChange','nowPlayingItemDidChange','playbackDurationDidChange'].forEach(event => {
        this.music.addEventListener(event, () => this.emit());
      });
      this.music.addEventListener('mediaPlaybackError', () => this.onError(new Error('Apple Music parçayı çalamadı. Aboneliğini kontrol et veya başka bir parça seç.')));
      this.music.addEventListener('authorizationStatusDidChange', () => {
        if (!this.music.isAuthorized) {this.connected = false; this.onState({playing:false});}
      });
    }
    async connect() {
      // prepare() runs before the connect button is enabled, keeping authorize in the click gesture.
      if (!this.music) throw new Error('Apple Music hazırlanıyor. Biraz sonra tekrar dene.');
      await this.music.authorize();
      this.connected = Boolean(this.music.isAuthorized);
      if (!this.connected) throw new Error('Apple Music bağlantısı tamamlanmadı. Tekrar dene.');
    }
    emit() {
      const t = this.music.nowPlayingItem;
      if (!t) {this.onState({playing:false}); return;}
      const a = t.attributes || t;
      this.onState({playing:this.music.isPlaying, position:this.music.currentPlaybackTime || 0, duration:this.music.currentPlaybackDuration || 0, canSeek:true,
        track:{id:t.id, name:a.name || t.title, artist:a.artistName, art:safeURL(a.artwork?.url?.replace('{w}','160').replace('{h}','160')), url:safeURL(a.url)}});
    }
    async search(query) {
      const storefront = this.music.storefrontId || 'tr';
      const response = await this.music.api.music(`/v1/catalog/${encodeURIComponent(storefront)}/search`, {term:query,types:'songs',limit:10});
      return (response.data.results?.songs?.data || []).map(t => ({id:t.id,name:t.attributes.name,artist:t.attributes.artistName,art:safeURL(t.attributes.artwork?.url.replace('{w}','160').replace('{h}','160')),url:safeURL(t.attributes.url)}));
    }
    async play(track) {await this.music.setQueue({song:track.id}); await this.music.play();}
    async toggle() {if (this.music.isPlaying) await this.music.pause(); else await this.music.play();}
    async pause() {if (this.music) await this.music.pause();}
    async seek(seconds) {await this.music.seekToTime(seconds);}
    async disconnect() {await this.pause(); if (this.music) await this.music.unauthorize(); this.connected = false;}
  }
  window.DCMDMusic = {SpotifyService, AppleService};
})();
