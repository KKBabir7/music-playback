/**
 * ============================================================================
 * IMRAN PLAYBACK - CORE AUDIO & VIDEO ENGINE
 * Real-time Web Audio API Analyser, 3 High-Performance Visualizers (BARS, WAVE, RADIAL),
 * Centered HTML5 Video Player, Dynamic VU Meters, Equalizer Bass Boost & Local Media Loader.
 * ============================================================================
 */

(function () {
  'use strict';

  // Master Playlist Catalog
  const defaultPlaylist = [
    {
      title: "Shukno Patar Nupur Paye",
      artist: "Nazrul Sangeet EDM • Desi Fusion AI Cover",
      src: "music/shukno-patar-nupur-paye-nazrul-sangeet.mp3",
      type: "audio"
    },
    {
      title: "Shukno Patar Nupur Paye (Jol Toronger)",
      artist: "Rock Nazrul Geeti • EDM Studio-19",
      src: "music/shukno-patar-nupur-paye-jol-toronger.mp3",
      type: "audio"
    },
    {
      title: "Tawhideri Murshid Amar (Official Video)",
      artist: "Kazi Nazrul Islam • Video Presentation",
      src: "music/tawhideri-murshid-amar.mp4",
      type: "video"
    },
    {
      title: "Ore Nil Doriya",
      artist: "Instrumental Rock Guitar Cover • Musicdhara",
      src: "music/ore-nil-doriya-instrumental-rock-version-guitar-cover-with-lyrics.mp3",
      type: "audio"
    },
    {
      title: "Bhengeche Pinjor",
      artist: "Arabic Afro House • Andrew Kishore Reimagined",
      src: "music/bhengeche-pinjor-AI-Cover-Arabic-Afro-House.mp3",
      type: "audio"
    },
    {
      title: "Beyt",
      artist: "Ehsan Daryadel",
      src: "music/ehsan-daryadel-beyt.mp3",
      type: "audio"
    },
    {
      title: "Aman Aman",
      artist: "Kamro • Arabic Music",
      src: "music/kamro-aman-aman-arabic-music.mp3",
      type: "audio"
    },
    {
      title: "Unke Andaze Karam",
      artist: "Rapkid Arfat Cover • Prod. Atif Gulzar",
      src: "music/unke-andaze-karam-rapkid-arfat-cover-song-prod.mp3",
      type: "audio"
    },
    {
      title: "I Don't Wanna Go",
      artist: "Alan Walker",
      src: "music/i-dont-wanna-go.mp3",
      type: "audio"
    },
    {
      title: "Lonely",
      artist: "Alan Walker",
      src: "music/lonely-128.mp3",
      type: "audio"
    },
    {
      title: "Lost Control",
      artist: "Alan Walker ft. Sorana",
      src: "music/lost-control.mp3",
      type: "audio"
    },
    {
      title: "Do It All For You",
      artist: "Alan Walker ft. Trevor Guthrie",
      src: "music/do-it-all-for-you.mp3",
      type: "audio"
    },
    {
      title: "Fitash Er Kanna",
      artist: "Aurthohin",
      src: "music/fitash-er-kanna.mp3",
      type: "audio"
    },
    {
      title: "Chera Shopno",
      artist: "Aurthohin",
      src: "music/chera-shopno.mp3",
      type: "audio"
    },
    {
      title: "Ami Gan Gaite Pari Nah",
      artist: "Lalon Band",
      src: "music/ami-gan-gaite-pari-nah.mp3",
      type: "audio"
    },
    {
      title: "Tawhideri Murshid Amar (তাওহিদের-ই মুর্শিদ আমার)",
      artist: "Kazi Nazrul Islam • Emon Chowdhury",
      src: "music/tawhideri-murshid-amar.mp3",
      type: "audio"
    },
    {
      title: "Nishchup Adhar",
      artist: "Shironamhin",
      src: "music/nishchup-adhar.mp3",
      type: "audio"
    },
    {
      title: "Kanar Hatt Bazar",
      artist: "DJ Rahat ft. Baul Shafi Mondol",
      src: "music/kanar-hatt-bazar.mp3",
      type: "audio"
    },
    {
      title: "Shono Mohajon",
      artist: "SHUNNO",
      src: "music/shono-mohajon.mp3",
      type: "audio"
    },
    {
      title: "Citycell Theme",
      artist: "Instrumental Cover • Beautiful Bangladesh Cinematic",
      src: "music/citycell-theme-instrumental-cover-featuring-beautiful-bangladesh-cinematic.mp3",
      type: "audio"
    },
    {
      title: "Cairokee Band",
      artist: "El-Gouna",
      src: "music/cairokee-band.mp3",
      type: "audio"
    }
  ];

  // Player State
  let playlist = [...defaultPlaylist];
  let currentIndex = 0;
  let isPlaying = false;
  let isMuted = false;
  let isShuffle = false;
  let isRepeat = false;
  let isBassBoost = false;
  let currentVolume = 0.85;
  let visualizerMode = 'bars'; // 'bars' | 'wave' | 'radial'

  // DOM Elements
  const audioElement = document.getElementById('audio-element');
  const videoPlayer = document.getElementById('video-player');
  const canvas = document.getElementById('canvas');
  const canvasHint = document.getElementById('canvas-hint');
  const ctx = canvas.getContext('2d');

  // HUD Elements
  const hudTitle = document.getElementById('hud-title');
  const hudArtist = document.getElementById('hud-artist');
  const hudStatus = document.getElementById('hud-status');
  const hudSampleRate = document.getElementById('hud-sample-rate');
  const hudBitrate = document.getElementById('hud-bitrate');

  // Controls Elements
  const btnPlayPrimary = document.getElementById('btn-play-primary');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnRewind = document.getElementById('btn-rewind');
  const btnForward = document.getElementById('btn-forward');
  const btnShuffle = document.getElementById('btn-shuffle');
  const btnRepeat = document.getElementById('btn-repeat');
  const btnMute = document.getElementById('btn-mute');
  const volumeSlider = document.getElementById('volume-slider');
  const volumePct = document.getElementById('volume-pct');

  // Left Rack & Header Buttons
  const rackBtnToggle = document.getElementById('rack-btn-toggle');
  const rackToggleText = document.getElementById('rack-toggle-text');
  const rackBtnStop = document.getElementById('rack-btn-stop');
  const rackBtnOpenFile = document.getElementById('rack-btn-openfile');
  const rackBtnOpenFolder = document.getElementById('rack-btn-openfolder');
  const rackBtnFav = document.getElementById('rack-btn-fav');
  const rackFavText = document.getElementById('rack-fav-text');
  const btnFav = document.getElementById('btn-fav');
  const btnFullscreenToggle = document.getElementById('btn-fullscreen-toggle');
  const vuFillL = document.getElementById('vu-fill-l');
  const vuFillR = document.getElementById('vu-fill-r');

  // Studio Vinyl Deck & Sleep Timer
  const vinylDisc = document.getElementById('vinyl-disc');
  const vinylStatusText = document.getElementById('vinyl-status-text');
  const timerCountdown = document.getElementById('timer-countdown');
  const timerButtons = document.querySelectorAll('.timer-btn');
  let sleepTimerInterval = null;
  let sleepTimerRemainingSec = 0;

  // Favorites State (Stored in LocalStorage)
  let favoriteTracks = [];
  try {
    favoriteTracks = JSON.parse(localStorage.getItem('imran_favs') || '[]');
  } catch (e) {
    favoriteTracks = [];
  }

  // Seeker Elements
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  const seekerBar = document.getElementById('seeker-bar');
  const seekerBuffer = document.getElementById('seeker-buffer');
  const seekerProgress = document.getElementById('seeker-progress');

  // Playlist Elements
  const playlistItemsContainer = document.getElementById('playlist-items');
  const playlistCounter = document.getElementById('playlist-counter');
  const playlistSearch = document.getElementById('playlist-search');
  const btnUploadFile = document.getElementById('btn-upload-file');
  const btnUploadFolder = document.getElementById('btn-upload-folder');
  const fileInput = document.getElementById('file-input');
  const folderInput = document.getElementById('folder-input');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const countAllEl = document.getElementById('count-all');
  const countAudioEl = document.getElementById('count-audio');
  const countVideoEl = document.getElementById('count-video');
  const countFavEl = document.getElementById('count-fav');
  let currentMediaFilter = 'all'; // 'all' | 'audio' | 'video' | 'fav'

  // Visualizer Mode Buttons (Bars, Wave, Radial)
  const visButtons = document.querySelectorAll('.vis-btn');

  // Mobile App Bottom Navigation Dock
  const mobileDockButtons = document.querySelectorAll('.mob-dock-btn');
  const studioDeck = document.querySelector('.studio-deck');

  // Web Audio API Context & Nodes
  let audioCtx = null;
  let audioSource = null;
  let analyser = null;
  let bassFilter = null;
  let midFilter = null;
  let trebleFilter = null;
  let dataArray = null;
  let timeDomainArray = null;
  let bufferLength = 0;
  let animationFrameId = null;

  // Visualizer Color Themes
  let visualizerTheme = 'emerald'; // 'emerald' | 'crimson' | 'cyan' | 'violet'
  const themePalettes = {
    crimson: {
      gradStart: '#00e5ff',
      gradMid: '#ffb703',
      gradEnd: '#ff2a51',
      gradPeak: '#ff758f',
      glow: 'rgba(255, 42, 81, 0.45)',
      waveStroke1: '#00e5ff',
      waveGlow1: 'rgba(0, 229, 255, 0.8)',
      waveStroke2: '#ff2a51',
      waveGlow2: 'rgba(255, 42, 81, 0.6)',
      radialHueBase: 340
    },
    emerald: {
      gradStart: '#003d1f',
      gradMid: '#00b359',
      gradEnd: '#00e676',
      gradPeak: '#69f0ae',
      glow: 'rgba(0, 230, 118, 0.55)',
      waveStroke1: '#00f5a0',
      waveGlow1: 'rgba(0, 245, 160, 0.9)',
      waveStroke2: '#00c853',
      waveGlow2: 'rgba(0, 200, 83, 0.65)',
      radialHueBase: 145
    },
    green: {
      gradStart: '#003d1f',
      gradMid: '#00b359',
      gradEnd: '#00e676',
      gradPeak: '#69f0ae',
      glow: 'rgba(0, 230, 118, 0.55)',
      waveStroke1: '#00f5a0',
      waveGlow1: 'rgba(0, 245, 160, 0.9)',
      waveStroke2: '#00c853',
      waveGlow2: 'rgba(0, 200, 83, 0.65)',
      radialHueBase: 145
    },
    cyan: {
      gradStart: '#0055ff',
      gradMid: '#00c3ff',
      gradEnd: '#00e5ff',
      gradPeak: '#a6f0ff',
      glow: 'rgba(0, 229, 255, 0.45)',
      waveStroke1: '#00e5ff',
      waveGlow1: 'rgba(0, 229, 255, 0.9)',
      waveStroke2: '#0055ff',
      waveGlow2: 'rgba(0, 85, 255, 0.6)',
      radialHueBase: 190
    },
    violet: {
      gradStart: '#5e17eb',
      gradMid: '#9d4edd',
      gradEnd: '#c77dff',
      gradPeak: '#ff9ebb',
      glow: 'rgba(199, 125, 255, 0.45)',
      waveStroke1: '#c77dff',
      waveGlow1: 'rgba(199, 125, 255, 0.9)',
      waveStroke2: '#ff477e',
      waveGlow2: 'rgba(255, 71, 126, 0.6)',
      radialHueBase: 280
    }
  };

  // 3-Band Equalizer Presets
  const eqPresets = {
    flat: { bass: 0, mid: 0, treble: 0 },
    bass: { bass: 9, mid: -1, treble: 1 },
    vocal: { bass: -2, mid: 5, treble: 2 },
    edm: { bass: 8, mid: -2, treble: 6 }
  };
  let currentEq = 'flat';

  // Peak drops for bars
  let peakCaps = [];

  /**
   * Format seconds to mm:ss
   */
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  /**
   * Initialize Web Audio API once on user interaction
   */
  function initAudioContext() {
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      timeDomainArray = new Uint8Array(bufferLength);

      // Low-shelf bass filter (120 Hz)
      bassFilter = audioCtx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 120;
      bassFilter.gain.value = isBassBoost ? 12 : eqPresets[currentEq].bass;

      // Peaking mid filter (1 kHz)
      midFilter = audioCtx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 1000;
      midFilter.Q.value = 1.0;
      midFilter.gain.value = eqPresets[currentEq].mid;

      // High-shelf treble filter (3.2 kHz)
      trebleFilter = audioCtx.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 3200;
      trebleFilter.gain.value = eqPresets[currentEq].treble;

      // Connect Audio Chain: Source -> Bass -> Mid -> Treble -> Analyser -> Output
      audioSource = audioCtx.createMediaElementSource(audioElement);
      audioSource.connect(bassFilter);
      bassFilter.connect(midFilter);
      midFilter.connect(trebleFilter);
      trebleFilter.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (err) {
      console.warn("Web Audio API not supported or blocked:", err);
    }
  }

  /**
   * Resize Canvas to fit screen chassis perfectly
   */
  function resizeCanvas() {
    if (!canvas || !canvas.parentElement) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  /**
   * Render Playlist UI with Audio / Video / Favorite Filter
   */
  function renderPlaylist(filterQuery = "") {
    if (!playlistItemsContainer) return;
    playlistItemsContainer.innerHTML = "";

    const query = filterQuery.toLowerCase().trim();
    let displayCount = 0;

    // Real-time track counts for badges
    const totalAll = playlist.length;
    const totalAudio = playlist.filter(t => t.type !== 'video').length;
    const totalVideo = playlist.filter(t => t.type === 'video').length;
    const totalFav = playlist.filter(t => favoriteTracks.includes(t.title)).length;

    if (countAllEl) countAllEl.textContent = totalAll;
    if (countAudioEl) countAudioEl.textContent = totalAudio;
    if (countVideoEl) countVideoEl.textContent = totalVideo;
    if (countFavEl) countFavEl.textContent = totalFav;

    playlist.forEach((track, idx) => {
      // Media Type Filter: All vs Audio vs Video vs Favorite
      if (currentMediaFilter === 'audio' && track.type === 'video') return;
      if (currentMediaFilter === 'video' && track.type !== 'video') return;
      if (currentMediaFilter === 'fav' && !favoriteTracks.includes(track.title)) return;

      // Search Query Filter
      if (query && !track.title.toLowerCase().includes(query) && !track.artist.toLowerCase().includes(query)) {
        return;
      }

      displayCount++;
      const isFav = favoriteTracks.includes(track.title);
      const li = document.createElement('li');
      li.className = `track-item ${idx === currentIndex ? 'active' : ''}`;
      li.dataset.index = idx;

      li.innerHTML = `
        <span class="track-num">${idx + 1 < 10 ? '0' : ''}${idx + 1}</span>
        <div class="track-eq-anim">
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
          <div class="eq-bar"></div>
        </div>
        <div class="track-meta">
          <div class="track-title">${track.title}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        <button class="track-item-fav-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Remove Favorite' : 'Add to Favorites'}">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <span class="track-badge ${track.type === 'video' ? 'video' : ''}">
          ${track.type === 'video' ? 'VIDEO' : 'MP3'}
        </span>
      `;

      // Favorite button on playlist item
      const favBtn = li.querySelector('.track-item-fav-btn');
      if (favBtn) {
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFavorite(track.title);
        });
      }

      li.addEventListener('click', () => {
        loadTrack(idx, true);
        if (window.innerWidth <= 900) {
          setMobileView('player');
        }
      });

      playlistItemsContainer.appendChild(li);
    });

    if (playlistCounter) {
      const typeLabel = currentMediaFilter === 'all' ? 'TRACKS' : currentMediaFilter.toUpperCase();
      playlistCounter.textContent = `${displayCount} ${typeLabel}`;
    }
  }

  /**
   * Return currently active media (audio or video element)
   */
  function getActiveMedia() {
    return playlist[currentIndex].type === 'video' ? videoPlayer : audioElement;
  }

  /**
   * Load Track by Index
   */
  function loadTrack(index, autoPlay = false) {
    if (index < 0 || index >= playlist.length) return;
    currentIndex = index;
    const track = playlist[currentIndex];

    // Reset both elements
    audioElement.pause();
    videoPlayer.pause();

    // Update Track HUD
    hudTitle.textContent = track.title;
    hudArtist.textContent = track.artist;

    if (track.type === 'video') {
      // CENTER VIDEO PLAYER ACTIVATION
      videoPlayer.classList.add('active');
      canvas.style.display = 'none';
      if (canvasHint) canvasHint.style.display = 'none';

      if (hudBitrate) hudBitrate.textContent = '1080p • MP4';
      videoPlayer.src = track.src;
      videoPlayer.load();

      if (autoPlay) {
        initAudioContext();
        videoPlayer.play().then(() => {
          isPlaying = true;
          updatePlaybackUI();
        }).catch(err => {
          console.warn("Autoplay deferred:", err);
          isPlaying = false;
          updatePlaybackUI();
        });
      }
    } else {
      // AUDIO SPECTRUM VISUALIZER ACTIVATION
      videoPlayer.classList.remove('active');
      canvas.style.display = 'block';
      if (canvasHint) canvasHint.style.display = 'block';

      if (hudBitrate) hudBitrate.textContent = '320 kbps';
      audioElement.src = track.src;
      audioElement.load();

      if (autoPlay) {
        initAudioContext();
        audioElement.play().then(() => {
          isPlaying = true;
          updatePlaybackUI();
        }).catch(err => {
          console.warn("Autoplay deferred:", err);
          isPlaying = false;
          updatePlaybackUI();
        });
      }
    }

    updatePlaybackUI();
    renderPlaylist(playlistSearch ? playlistSearch.value : "");
    scrollActiveTrackIntoView();
  }

  /**
   * Scroll active track into playlist view smoothly
   */
  function scrollActiveTrackIntoView() {
    const activeItem = playlistItemsContainer.querySelector('.track-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Play / Pause Toggle
   */
  function togglePlay() {
    initAudioContext();
    const activeMedia = getActiveMedia();

    if (activeMedia.paused) {
      activeMedia.play().then(() => {
        isPlaying = true;
        updatePlaybackUI();
      }).catch(e => console.warn("Playback error:", e));
    } else {
      activeMedia.pause();
      isPlaying = false;
      updatePlaybackUI();
    }
  }

  /**
   * Stop Playback
   */
  function stopPlayback() {
    const activeMedia = getActiveMedia();
    activeMedia.pause();
    activeMedia.currentTime = 0;
    isPlaying = false;
    updatePlaybackUI();
  }

  /**
   * Next Track
   */
  function nextTrack() {
    if (isShuffle) {
      currentIndex = Math.floor(Math.random() * playlist.length);
    } else {
      currentIndex = (currentIndex + 1) % playlist.length;
    }
    loadTrack(currentIndex, true);
  }

  /**
   * Previous Track
   */
  function prevTrack() {
    const activeMedia = getActiveMedia();
    if (activeMedia.currentTime > 3) {
      activeMedia.currentTime = 0;
      return;
    }
    if (isShuffle) {
      currentIndex = Math.floor(Math.random() * playlist.length);
    } else {
      currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    loadTrack(currentIndex, true);
  }

  /**
   * Update UI button states, HUD, vinyl deck, and rack favorite state
   */
  function updatePlaybackUI() {
    const currentTrack = playlist[currentIndex];
    const isVid = currentTrack.type === 'video';

    if (isPlaying) {
      btnPlayPrimary.innerHTML = '<i class="fa fa-pause"></i>';
      if (rackBtnToggle && rackToggleText) {
        rackBtnToggle.classList.add('active');
        rackToggleText.innerHTML = '<i class="fa fa-pause" style="font-size:0.75rem; margin-right:6px;"></i> PAUSE';
      }
      hudStatus.innerHTML = `<span class="hud-pulse"></span> ${isVid ? 'VIDEO PLAYING' : 'AUDIO PLAYING'}`;
      hudStatus.style.borderColor = 'rgba(255, 42, 81, 0.4)';

      if (vinylDisc) vinylDisc.classList.add('spinning');
      if (vinylStatusText) vinylStatusText.textContent = currentTrack.title;
    } else {
      btnPlayPrimary.innerHTML = '<i class="fa fa-play" style="margin-left: 3px;"></i>';
      if (rackBtnToggle && rackToggleText) {
        rackBtnToggle.classList.remove('active');
        rackToggleText.innerHTML = '<i class="fa fa-play" style="font-size:0.75rem; margin-right:6px;"></i> PLAY';
      }
      hudStatus.innerHTML = '<span class="hud-pulse" style="background:#8c96a8;"></span> STANDBY';
      hudStatus.style.borderColor = 'rgba(255, 255, 255, 0.15)';

      if (vinylDisc) vinylDisc.classList.remove('spinning');
      if (vinylStatusText) vinylStatusText.textContent = 'STANDBY';
    }

    // Favorite status (Transport bar icon & rack button)
    const isFav = favoriteTracks.includes(currentTrack.title);
    if (btnFav) {
      btnFav.classList.toggle('active', isFav);
      btnFav.innerHTML = `<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
      btnFav.title = isFav ? 'Remove from Favorites' : 'Add to Favorites';
    }
    if (rackBtnFav && rackFavText) {
      rackBtnFav.classList.toggle('active', isFav);
      rackFavText.innerHTML = `<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart" style="margin-right:6px; color:${isFav ? '#ff2a51' : 'inherit'};"></i> ${isFav ? 'FAVORITED' : 'FAVORITE'}`;
    }
  }

  /**
   * Update Seeker Progress and Time
   */
  function updateProgress() {
    const media = getActiveMedia();
    if (!media.duration || isNaN(media.duration)) return;

    const progressPct = (media.currentTime / media.duration) * 100;
    seekerProgress.style.width = `${progressPct}%`;
    seekerBar.value = progressPct;

    currentTimeEl.textContent = formatTime(media.currentTime);
    durationTimeEl.textContent = formatTime(media.duration);

    if (media.buffered.length > 0) {
      const bufferedEnd = media.buffered.end(media.buffered.length - 1);
      const bufferPct = (bufferedEnd / media.duration) * 100;
      seekerBuffer.style.width = `${bufferPct}%`;
    }
  }

  /**
   * Audio/Video Seeker Scrubber Handler
   */
  seekerBar.addEventListener('input', function () {
    const media = getActiveMedia();
    if (!media.duration) return;
    const seekTo = (seekerBar.value / 100) * media.duration;
    media.currentTime = seekTo;
    seekerProgress.style.width = `${seekerBar.value}%`;
  });

  /**
   * Volume control
   */
  function setVolume(val) {
    currentVolume = Math.max(0, Math.min(1, val));
    audioElement.volume = currentVolume;
    videoPlayer.volume = currentVolume;
    volumeSlider.value = Math.round(currentVolume * 100);
    volumePct.textContent = `${Math.round(currentVolume * 100)}%`;

    if (currentVolume === 0) {
      btnMute.innerHTML = '<i class="fa fa-volume-off"></i>';
      btnMute.classList.add('active');
    } else if (currentVolume < 0.5) {
      btnMute.innerHTML = '<i class="fa fa-volume-down"></i>';
      btnMute.classList.remove('active');
    } else {
      btnMute.innerHTML = '<i class="fa fa-volume-high"></i>';
      btnMute.classList.remove('active');
    }
  }

  volumeSlider.addEventListener('input', (e) => {
    setVolume(e.target.value / 100);
  });

  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
      audioElement.muted = true;
      videoPlayer.muted = true;
      btnMute.innerHTML = '<i class="fa fa-volume-off"></i>';
      btnMute.classList.add('active');
    } else {
      audioElement.muted = false;
      videoPlayer.muted = false;
      setVolume(currentVolume);
    }
  });

  /**
   * Toggle Track Favorite Status
   */
  function toggleFavorite(trackTitle) {
    const title = trackTitle || playlist[currentIndex].title;
    const idx = favoriteTracks.indexOf(title);
    if (idx > -1) {
      favoriteTracks.splice(idx, 1);
    } else {
      favoriteTracks.push(title);
    }
    try {
      localStorage.setItem('imran_favs', JSON.stringify(favoriteTracks));
    } catch (e) {
      console.warn("Storage error:", e);
    }

    updatePlaybackUI();
    renderPlaylist(playlistSearch ? playlistSearch.value : "");
  }

  // Transport Control Favorite Button (Heart Icon next to Repeat)
  if (btnFav) {
    btnFav.addEventListener('click', () => {
      toggleFavorite();
    });
  }

  // Backward compatibility if rackBtnFav exists
  if (rackBtnFav) {
    rackBtnFav.addEventListener('click', () => {
      toggleFavorite();
    });
  }

  // Studio Vinyl Disc Interaction
  if (vinylDisc) {
    vinylDisc.addEventListener('click', togglePlay);
  }

  /**
   * Sleep / Focus Timer Implementation
   */
  function setSleepTimer(minutes) {
    if (sleepTimerInterval) {
      clearInterval(sleepTimerInterval);
      sleepTimerInterval = null;
    }

    timerButtons.forEach(btn => {
      const btnMin = parseInt(btn.dataset.timer || btn.dataset.time, 10);
      btn.classList.toggle('active', btnMin === minutes);
    });

    if (minutes === 0) {
      sleepTimerRemainingSec = 0;
      if (timerCountdown) timerCountdown.textContent = 'OFF';
      return;
    }

    sleepTimerRemainingSec = minutes * 60;
    if (timerCountdown) timerCountdown.textContent = formatTime(sleepTimerRemainingSec);

    sleepTimerInterval = setInterval(() => {
      sleepTimerRemainingSec--;
      if (sleepTimerRemainingSec <= 0) {
        clearInterval(sleepTimerInterval);
        sleepTimerInterval = null;
        stopPlayback();
        if (timerCountdown) timerCountdown.textContent = '00:00';
        timerButtons.forEach(b => {
          const val = parseInt(b.dataset.timer || b.dataset.time, 10);
          b.classList.toggle('active', val === 0);
        });
        setTimeout(() => {
          if (timerCountdown) timerCountdown.textContent = 'OFF';
        }, 3000);
      } else {
        if (timerCountdown) timerCountdown.textContent = formatTime(sleepTimerRemainingSec);
      }
    }, 1000);
  }

  timerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const minutes = parseInt(btn.dataset.timer || btn.dataset.time, 10) || 0;
      setSleepTimer(minutes);
    });
  });

  /**
   * Click directly on center video screen to toggle play/pause
   */
  videoPlayer.addEventListener('click', togglePlay);

  /**
   * Visualizer Rendering Loops
   */
  function renderVisualizer() {
    animationFrameId = requestAnimationFrame(renderVisualizer);

    // If video is active, update mock VU meters based on video playback
    if (playlist[currentIndex].type === 'video') {
      if (vuFillL && vuFillR) {
        const mockLevel = isPlaying ? (Math.random() * 45 + 35) : 5;
        vuFillL.style.width = `${mockLevel}%`;
        vuFillR.style.width = `${Math.max(5, mockLevel + (Math.random() * 10 - 5))}%`;
      }
      const vuDbEl = document.getElementById('vu-db-readout');
      if (vuDbEl) {
        vuDbEl.textContent = isPlaying ? '-6 dB' : '-∞ dB';
      }
      return;
    }

    if (!analyser || !dataArray || !canvas) return;

    analyser.getByteFrequencyData(dataArray);
    analyser.getByteTimeDomainData(timeDomainArray);

    // Update real-time hardware VU Meters (Left & Right channel simulation)
    let sumLow = 0;
    let sumHigh = 0;
    const half = Math.floor(bufferLength / 2);
    for (let i = 0; i < half; i++) sumLow += dataArray[i];
    for (let i = half; i < bufferLength; i++) sumHigh += dataArray[i];

    const rmsL = Math.min(100, Math.round((sumLow / (half * 255)) * 130));
    const rmsR = Math.min(100, Math.round((sumHigh / (half * 255)) * 130));

    if (vuFillL && vuFillR) {
      vuFillL.style.width = `${isPlaying ? Math.max(8, rmsL) : 5}%`;
      vuFillR.style.width = `${isPlaying ? Math.max(8, rmsR) : 5}%`;
    }

    // Dynamic numeric dB Readout
    const vuDbEl = document.getElementById('vu-db-readout');
    if (vuDbEl) {
      if (isPlaying) {
        const maxLevel = Math.max(rmsL, rmsR);
        const dbVal = Math.round(-30 + (maxLevel / 100) * 33);
        vuDbEl.textContent = `${dbVal > 0 ? '+' : ''}${dbVal} dB`;
      } else {
        vuDbEl.textContent = '-∞ dB';
      }
    }

    const W = canvas.width;
    const H = canvas.height;

    // Background trail for smooth persistence
    ctx.fillStyle = 'rgba(6, 7, 9, 0.28)';
    ctx.fillRect(0, 0, W, H);

    // Render based on visualizerMode
    switch (visualizerMode) {
      case 'bars':
        renderBarSpectrum(W, H);
        break;
      case 'wave':
        renderNeonWave(W, H);
        break;
      case 'radial':
        renderRadialPulse(W, H);
        break;
    }
  }

  /**
   * Mode 1: Anodized Cyber Frequency Bar Spectrum (Theme-Aware)
   */
  function renderBarSpectrum(W, H) {
    const bars = Math.min(64, bufferLength);
    const barWidth = (W / bars) * 0.72;
    const gap = (W / bars) * 0.28;
    const pal = themePalettes[visualizerTheme] || themePalettes.crimson;

    for (let i = 0; i < bars; i++) {
      const val = dataArray[i];
      const barHeight = (val / 255) * (H * 0.82);

      if (!peakCaps[i] || barHeight > peakCaps[i]) {
        peakCaps[i] = barHeight;
      } else {
        peakCaps[i] = Math.max(0, peakCaps[i] - 1.8);
      }

      const x = i * (barWidth + gap) + gap / 2;
      const y = H - barHeight;

      // Dynamic Palette Gradient
      const grad = ctx.createLinearGradient(0, H, 0, 0);
      grad.addColorStop(0, pal.gradStart);
      grad.addColorStop(0.4, pal.gradMid);
      grad.addColorStop(0.85, pal.gradEnd);
      grad.addColorStop(1, pal.gradPeak);

      ctx.fillStyle = grad;
      ctx.shadowColor = pal.glow;
      ctx.shadowBlur = 8;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Peak Cap
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = pal.gradStart;
      ctx.shadowBlur = 6;
      ctx.fillRect(x, H - peakCaps[i] - 3, barWidth, 3);
    }
    ctx.shadowBlur = 0;
  }

  /**
   * Mode 2: Neon Oscilloscope Waveform (Theme-Aware)
   */
  function renderNeonWave(W, H) {
    const pal = themePalettes[visualizerTheme] || themePalettes.crimson;

    ctx.lineWidth = 3;
    ctx.strokeStyle = pal.waveStroke1;
    ctx.shadowColor = pal.waveGlow1;
    ctx.shadowBlur = 15;
    ctx.beginPath();

    const sliceWidth = W / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = timeDomainArray[i] / 128.0;
      const y = (v * H) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // Secondary Reflection Wave
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = pal.waveStroke2;
    ctx.shadowColor = pal.waveGlow2;
    ctx.beginPath();
    x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = timeDomainArray[i] / 128.0;
      const y = H - (v * H) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  /**
   * Mode 3: Radial Cyber Core Pulse (Theme-Aware)
   */
  function renderRadialPulse(W, H) {
    const pal = themePalettes[visualizerTheme] || themePalettes.crimson;
    const centerX = W / 2;
    const centerY = H / 2;
    const baseRadius = Math.min(W, H) * 0.18;

    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = pal.glow;
    ctx.lineWidth = 2;
    ctx.stroke();

    const bars = 72;
    const step = (Math.PI * 2) / bars;

    for (let i = 0; i < bars; i++) {
      const val = dataArray[i % bufferLength];
      const radLen = (val / 255) * (Math.min(W, H) * 0.28);
      const angle = i * step;

      const x1 = centerX + Math.cos(angle) * baseRadius;
      const y1 = centerY + Math.sin(angle) * baseRadius;
      const x2 = centerX + Math.cos(angle) * (baseRadius + radLen);
      const y2 = centerY + Math.sin(angle) * (baseRadius + radLen);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `hsl(${(i / bars) * 60 + pal.radialHueBase}, 100%, 60%)`;
      ctx.shadowColor = pal.glow;
      ctx.shadowBlur = 10;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  /**
   * Visualizer Mode Switcher Buttons (Bars, Wave, Radial)
   */
  visButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      visButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      visualizerMode = btn.dataset.mode;
    });
  });

  // Clicking canvas cycles between the 3 modes
  canvas.addEventListener('click', () => {
    const modes = ['bars', 'wave', 'radial'];
    const nextIdx = (modes.indexOf(visualizerMode) + 1) % modes.length;
    visualizerMode = modes[nextIdx];
    visButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.mode === visualizerMode);
    });
  });

  /**
   * Fullscreen Mode
   */
  function toggleFullscreen() {
    const chassis = document.querySelector('.studio-chassis');
    if (!document.fullscreenElement) {
      chassis.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  document.addEventListener('fullscreenchange', () => {
    if (btnFullscreenToggle) {
      if (document.fullscreenElement) {
        btnFullscreenToggle.innerHTML = '<i class="fa fa-compress"></i>';
        btnFullscreenToggle.title = 'Exit Full Screen (F)';
      } else {
        btnFullscreenToggle.innerHTML = '<i class="fa fa-expand"></i>';
        btnFullscreenToggle.title = 'Toggle Full Screen (F)';
      }
    }
  });

  /**
   * Media File Type Detection & Validation
   */
  function isAudioFile(file) {
    if (!file || !file.name) return false;
    if (file.type && file.type.startsWith('audio/')) return true;
    return /\.(mp3|wav|ogg|m4a|aac|flac|opus|weba|wma)$/i.test(file.name);
  }

  function isVideoFile(file) {
    if (!file || !file.name) return false;
    if (file.type && file.type.startsWith('video/')) return true;
    return /\.(mp4|webm|mkv|mov|avi|m4v|ogv)$/i.test(file.name);
  }

  function isMediaFile(file) {
    return isAudioFile(file) || isVideoFile(file);
  }

  /**
   * Recursively read files from DataTransferItemList (Folder Drag & Drop)
   */
  async function getAllFilesFromDataTransfer(dataTransfer) {
    if (!dataTransfer) return [];
    const items = dataTransfer.items;
    if (items && items.length > 0 && items[0].webkitGetAsEntry) {
      const queue = [];
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();
        if (entry) {
          queue.push(readFileSystemEntry(entry));
        }
      }
      const results = await Promise.all(queue);
      return results.flat();
    } else if (dataTransfer.files && dataTransfer.files.length > 0) {
      return Array.from(dataTransfer.files);
    }
    return [];
  }

  function readFileSystemEntry(entry) {
    return new Promise((resolve) => {
      if (!entry) return resolve([]);
      if (entry.isFile) {
        entry.file(
          (file) => {
            file.entryFullPath = entry.fullPath;
            resolve([file]);
          },
          () => resolve([])
        );
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const collectedFiles = [];

        const readBatch = () => {
          dirReader.readEntries(
            async (entries) => {
              if (!entries || entries.length === 0) {
                resolve(collectedFiles.flat());
              } else {
                const subTasks = entries.map((child) => readFileSystemEntry(child));
                const subResults = await Promise.all(subTasks);
                collectedFiles.push(...subResults.flat());
                readBatch(); // Directory readers return entries in batches of ~100
              }
            },
            () => resolve(collectedFiles.flat())
          );
        };

        readBatch();
      } else {
        resolve([]);
      }
    });
  }

  /**
   * Local File/Folder Upload Handler (Detects Video or Audio, opens Video in center immediately)
   */
  function handleFiles(files) {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    // Filter only valid audio and video files (skip images, text files, metadata, etc.)
    const mediaFiles = fileList.filter(isMediaFile);

    if (mediaFiles.length === 0) {
      if (typeof showToast === 'function') {
        showToast('No audio or video files found in selection.');
      }
      return;
    }

    let hasVideo = false;
    // Iterate in reverse so the first file ends up at index 0 when unshifting
    for (let i = mediaFiles.length - 1; i >= 0; i--) {
      const file = mediaFiles[i];
      const isVid = isVideoFile(file);
      if (isVid) hasVideo = true;
      const blobUrl = URL.createObjectURL(file);

      // Determine artist name from directory path if available
      let artistName = isVid ? "User Local Video" : "User Local Audio";
      const fullPath = file.webkitRelativePath || file.entryFullPath || '';
      if (fullPath) {
        const parts = fullPath.split('/').filter(Boolean);
        if (parts.length > 2) {
          // Folder/Subfolder/Song.mp3 -> Subfolder as artist/album
          artistName = parts[parts.length - 2];
        } else if (parts.length === 2) {
          // Folder/Song.mp3 -> Folder as artist
          artistName = parts[0];
        }
      }

      playlist.unshift({
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: artistName,
        src: blobUrl,
        type: isVid ? "video" : "audio"
      });
    }

    // Auto-adjust filter tab so uploaded item is immediately visible
    if (hasVideo && currentMediaFilter === 'audio') {
      currentMediaFilter = 'video';
      filterTabs.forEach(t => t.classList.toggle('active', t.dataset.filter === 'video'));
    } else if (!hasVideo && currentMediaFilter === 'video') {
      currentMediaFilter = 'audio';
      filterTabs.forEach(t => t.classList.toggle('active', t.dataset.filter === 'audio'));
    }

    renderPlaylist(playlistSearch ? playlistSearch.value : "");
    // Immediately load and play the newly uploaded video or audio track
    loadTrack(0, true);
    if (window.innerWidth <= 900) {
      setMobileView('player');
    }

    if (typeof showToast === 'function') {
      showToast(`Added ${mediaFiles.length} media track${mediaFiles.length > 1 ? 's' : ''} to playlist`);
    }

    // Reset input values so same file/folder can be selected again
    if (fileInput) fileInput.value = '';
    if (folderInput) folderInput.value = '';
  }

  // File & Folder input change listeners
  if (fileInput) {
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
  }
  if (folderInput) {
    folderInput.addEventListener('change', (e) => handleFiles(e.target.files));
  }

  // File & Folder button click listeners
  if (btnUploadFile) {
    btnUploadFile.addEventListener('click', () => fileInput && fileInput.click());
  }
  if (btnUploadFolder) {
    btnUploadFolder.addEventListener('click', () => folderInput && folderInput.click());
  }
  if (rackBtnOpenFile) {
    rackBtnOpenFile.addEventListener('click', () => fileInput && fileInput.click());
  }
  if (rackBtnOpenFolder) {
    rackBtnOpenFolder.addEventListener('click', () => folderInput && folderInput.click());
  }

  // Drag and drop files & folders directly onto Studio Chassis
  const chassis = document.querySelector('.studio-chassis');
  if (chassis) {
    chassis.addEventListener('dragover', (e) => {
      e.preventDefault();
      chassis.style.borderColor = 'var(--accent-red)';
    });
    chassis.addEventListener('dragleave', () => {
      chassis.style.borderColor = 'var(--border-dark)';
    });
    chassis.addEventListener('drop', async (e) => {
      e.preventDefault();
      chassis.style.borderColor = 'var(--border-dark)';
      try {
        const allFiles = await getAllFilesFromDataTransfer(e.dataTransfer);
        handleFiles(allFiles);
      } catch (err) {
        console.error('Error reading dropped files/folders:', err);
        handleFiles(e.dataTransfer.files);
      }
    });
  }

  /**
   * Media Event Listeners
   */
  [audioElement, videoPlayer].forEach(media => {
    media.addEventListener('timeupdate', updateProgress);
    media.addEventListener('ended', () => {
      if (isRepeat) {
        media.currentTime = 0;
        media.play();
      } else {
        nextTrack();
      }
    });
    media.addEventListener('play', () => {
      isPlaying = true;
      updatePlaybackUI();
    });
    media.addEventListener('pause', () => {
      isPlaying = false;
      updatePlaybackUI();
    });
  });

  /**
   * Bind Button Controls
   */
  btnPlayPrimary.addEventListener('click', togglePlay);
  if (rackBtnToggle) {
    rackBtnToggle.addEventListener('click', togglePlay);
  }
  rackBtnStop.addEventListener('click', stopPlayback);
  if (btnFullscreenToggle) {
    btnFullscreenToggle.addEventListener('click', toggleFullscreen);
  }

  btnNext.addEventListener('click', nextTrack);
  btnPrev.addEventListener('click', prevTrack);
  btnRewind.addEventListener('click', () => {
    getActiveMedia().currentTime = Math.max(0, getActiveMedia().currentTime - 10);
  });
  btnForward.addEventListener('click', () => {
    getActiveMedia().currentTime = Math.min(getActiveMedia().duration || 0, getActiveMedia().currentTime + 10);
  });

  btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
  });

  btnRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    btnRepeat.classList.toggle('active', isRepeat);
  });

  // Media Filter Tabs (All / Audio / Video)
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentMediaFilter = tab.dataset.filter;
      renderPlaylist(playlistSearch ? playlistSearch.value : "");
    });
  });

  // Search filter
  if (playlistSearch) {
    playlistSearch.addEventListener('input', (e) => {
      renderPlaylist(e.target.value);
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (document.activeElement === playlistSearch) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        getActiveMedia().currentTime = Math.max(0, getActiveMedia().currentTime - 5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        getActiveMedia().currentTime = Math.min(getActiveMedia().duration || 0, getActiveMedia().currentTime + 5);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume(currentVolume + 0.05);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume(currentVolume - 0.05);
        break;
      case 'KeyM':
        btnMute.click();
        break;
      case 'KeyF':
        toggleFullscreen();
        break;
      case 'KeyL':
        btnRepeat.click();
        break;
      case 'KeyS':
        btnShuffle.click();
        break;
    }
  });


  /**
   * Mobile App Navigation Dock (Rack / Player / Playlist Viewport Switcher)
   */
  function setMobileView(viewName) {
    if (!studioDeck) return;
    studioDeck.classList.remove('view-rack', 'view-player', 'view-playlist');
    studioDeck.classList.add(`view-${viewName}`);

    mobileDockButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mobView === viewName);
    });

    if (viewName === 'player') {
      setTimeout(resizeCanvas, 60);
    }
  }

  mobileDockButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.mobView;
      setMobileView(targetView);
    });
  });

  // =========================================================================
  // STUDIO SETTINGS & LIBRARY MANAGER (AUDIO & VIDEO DELETE SYSTEM)
  // =========================================================================
  const modalSettings = document.getElementById('modal-settings');
  const btnOpenSettings = document.getElementById('btn-open-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const settingsTabButtons = document.querySelectorAll('.settings-tab-btn');
  const settingsTabPanes = document.querySelectorAll('.settings-tab-pane');
  const studioToast = document.getElementById('studio-toast');
  let toastTimer = null;

  // Track Manager DOM & Multiple Selection State
  const managerSearchInput = document.getElementById('manager-search-input');
  const managerFilterPills = document.querySelectorAll('.manager-pill');
  const managerTrackList = document.getElementById('manager-track-list');
  const mgrCountAll = document.getElementById('mgr-count-all');
  const mgrCountAudio = document.getElementById('mgr-count-audio');
  const mgrCountVideo = document.getElementById('mgr-count-video');
  const managerStatsText = document.getElementById('manager-stats-text');
  const mgrSelectAll = document.getElementById('mgr-select-all');
  const btnDeleteSelected = document.getElementById('btn-delete-selected');
  const selectedCountEl = document.getElementById('selected-count');
  const btnClearFavorites = document.getElementById('btn-clear-favorites');
  const favStorageCount = document.getElementById('fav-storage-count');

  let managerFilter = 'all'; // 'all' | 'audio' | 'video'
  let selectedTrackIndices = new Set();

  /**
   * Show Sleek Studio Toast Notification
   */
  function showToast(message) {
    if (!studioToast) return;
    studioToast.textContent = message;
    studioToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      studioToast.classList.remove('show');
    }, 2400);
  }

  /**
   * Update Batch Delete UI and Count
   */
  function updateSelectedDeleteUI() {
    if (selectedCountEl) selectedCountEl.textContent = selectedTrackIndices.size;
    if (btnDeleteSelected) {
      btnDeleteSelected.style.display = selectedTrackIndices.size > 0 ? 'inline-flex' : 'none';
    }
  }

  /**
   * Delete Single Track from Active Session Library
   */
  function deleteTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    const deletedTrack = playlist[index];

    if (playlist.length <= 1) {
      showToast("Cannot delete the only remaining track in library.");
      return;
    }

    playlist.splice(index, 1);
    selectedTrackIndices.delete(index);

    // Re-index remaining selected items if needed
    const updatedSelected = new Set();
    selectedTrackIndices.forEach(si => {
      if (si > index) updatedSelected.add(si - 1);
      else if (si < index) updatedSelected.add(si);
    });
    selectedTrackIndices = updatedSelected;

    if (index === currentIndex) {
      if (currentIndex >= playlist.length) {
        currentIndex = 0;
      }
      loadTrack(currentIndex, isPlaying);
    } else if (index < currentIndex) {
      currentIndex--;
    }

    renderPlaylist(playlistSearch ? playlistSearch.value : "");
    renderSettingsTrackManager();
    showToast(`Deleted: "${deletedTrack.title}"`);
  }

  /**
   * Render Track Manager Rows with Multiple Checkboxes
   */
  function renderSettingsTrackManager() {
    if (!managerTrackList) return;
    managerTrackList.innerHTML = "";

    const query = managerSearchInput ? managerSearchInput.value.toLowerCase().trim() : "";
    const totalAll = playlist.length;
    const totalAudio = playlist.filter(t => t.type !== 'video').length;
    const totalVideo = playlist.filter(t => t.type === 'video').length;

    if (mgrCountAll) mgrCountAll.textContent = totalAll;
    if (mgrCountAudio) mgrCountAudio.textContent = totalAudio;
    if (mgrCountVideo) mgrCountVideo.textContent = totalVideo;
    if (managerStatsText) {
      managerStatsText.textContent = `${totalAll} Total Tracks (${totalAudio} Audio, ${totalVideo} Video)`;
    }
    if (favStorageCount) {
      favStorageCount.textContent = favoriteTracks.length;
    }

    let renderedCount = 0;
    playlist.forEach((track, idx) => {
      if (managerFilter === 'audio' && track.type === 'video') return;
      if (managerFilter === 'video' && track.type !== 'video') return;

      if (query && !track.title.toLowerCase().includes(query) && !track.artist.toLowerCase().includes(query)) {
        return;
      }

      renderedCount++;
      const isCurrent = idx === currentIndex;
      const isSelected = selectedTrackIndices.has(idx);
      const row = document.createElement('div');
      row.className = `mgr-track-row ${isCurrent ? 'active' : ''}`;

      row.innerHTML = `
        <input type="checkbox" class="mgr-track-checkbox studio-checkbox" data-index="${idx}" ${isSelected ? 'checked' : ''}>
        <span class="mgr-idx">${idx + 1}</span>
        <span class="mgr-type-badge ${track.type === 'video' ? 'video' : ''}">
          ${track.type === 'video' ? 'VIDEO' : 'MP3'}
        </span>
        <div class="mgr-info">
          <div class="mgr-title">
            ${track.title}
            ${isCurrent ? '<span class="mgr-playing-tag">ACTIVE</span>' : ''}
          </div>
          <div class="mgr-artist">${track.artist}</div>
        </div>
        <div class="mgr-actions">
          <button class="btn-mgr-play" title="${isCurrent && isPlaying ? 'Pause' : 'Play Track'}">
            <i class="fa ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
          </button>
          <button class="btn-mgr-delete" title="Delete Track" data-index="${idx}">
            <i class="fa fa-trash-can"></i>
          </button>
        </div>
      `;

      // Checkbox click
      const chk = row.querySelector('.mgr-track-checkbox');
      if (chk) {
        chk.addEventListener('change', (e) => {
          e.stopPropagation();
          if (chk.checked) {
            selectedTrackIndices.add(idx);
          } else {
            selectedTrackIndices.delete(idx);
          }
          updateSelectedDeleteUI();
          if (mgrSelectAll) {
            const allBoxes = Array.from(managerTrackList.querySelectorAll('.mgr-track-checkbox'));
            mgrSelectAll.checked = allBoxes.length > 0 && allBoxes.every(c => c.checked);
          }
        });
      }

      // Play button
      const btnPlay = row.querySelector('.btn-mgr-play');
      if (btnPlay) {
        btnPlay.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isCurrent) {
            togglePlay();
          } else {
            loadTrack(idx, true);
          }
          renderSettingsTrackManager();
        });
      }

      // Single delete button (Icon only)
      const btnDel = row.querySelector('.btn-mgr-delete');
      if (btnDel) {
        btnDel.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteTrack(idx);
        });
      }

      managerTrackList.appendChild(row);
    });

    if (renderedCount === 0) {
      managerTrackList.innerHTML = `
        <div style="text-align:center; padding: 25px; color: var(--text-muted); font-size: 0.85rem;">
          <i class="fa fa-circle-exclamation" style="margin-bottom:8px; font-size:1.2rem; color:var(--accent-red);"></i><br>
          No matching tracks found in library.
        </div>
      `;
    }

    if (mgrSelectAll) {
      const allBoxes = Array.from(managerTrackList.querySelectorAll('.mgr-track-checkbox'));
      mgrSelectAll.checked = allBoxes.length > 0 && allBoxes.every(c => c.checked);
    }
    updateSelectedDeleteUI();
  }

  // Select All Checkbox Handler
  if (mgrSelectAll) {
    mgrSelectAll.addEventListener('change', () => {
      const checkboxes = managerTrackList.querySelectorAll('.mgr-track-checkbox');
      checkboxes.forEach(chk => {
        const idx = parseInt(chk.dataset.index, 10);
        chk.checked = mgrSelectAll.checked;
        if (mgrSelectAll.checked) {
          selectedTrackIndices.add(idx);
        } else {
          selectedTrackIndices.delete(idx);
        }
      });
      updateSelectedDeleteUI();
    });
  }

  // Delete Selected Multiple Tracks Handler
  if (btnDeleteSelected) {
    btnDeleteSelected.addEventListener('click', () => {
      const indicesToDelete = Array.from(selectedTrackIndices).sort((a, b) => b - a);
      if (indicesToDelete.length === 0) return;

      if (playlist.length <= indicesToDelete.length) {
        showToast("Cannot delete all tracks in library.");
        return;
      }

      const count = indicesToDelete.length;
      indicesToDelete.forEach(idx => {
        playlist.splice(idx, 1);
      });

      if (currentIndex >= playlist.length) {
        currentIndex = 0;
      }
      loadTrack(currentIndex, isPlaying);

      selectedTrackIndices.clear();
      if (mgrSelectAll) mgrSelectAll.checked = false;

      renderPlaylist(playlistSearch ? playlistSearch.value : "");
      renderSettingsTrackManager();
      showToast(`Deleted ${count} selected tracks`);
    });
  }

  // Manager Search & Filter events
  if (managerSearchInput) {
    managerSearchInput.addEventListener('input', renderSettingsTrackManager);
  }

  managerFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      managerFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      managerFilter = pill.dataset.mfilter;
      renderSettingsTrackManager();
    });
  });

  // Clear Favorites
  if (btnClearFavorites) {
    btnClearFavorites.addEventListener('click', () => {
      favoriteTracks = [];
      try {
        localStorage.removeItem('imran_favs');
      } catch (e) {}
      updatePlaybackUI();
      renderPlaylist(playlistSearch ? playlistSearch.value : "");
      renderSettingsTrackManager();
      showToast("Cleared all favorites");
    });
  }

  // Settings Tab Navigation
  settingsTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      settingsTabButtons.forEach(b => b.classList.remove('active'));
      settingsTabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(`tab-content-${targetTab}`);
      if (pane) pane.classList.add('active');

      if (targetTab === 'library') {
        renderSettingsTrackManager();
      }
    });
  });

  // EQ Cards in Settings DSP tab
  const eqCards = document.querySelectorAll('.eq-card');
  eqCards.forEach(card => {
    card.addEventListener('click', () => {
      initAudioContext();
      const presetKey = card.dataset.eq;
      currentEq = presetKey;
      const p = eqPresets[presetKey] || eqPresets.flat;
      if (audioCtx && bassFilter && midFilter && trebleFilter) {
        const now = audioCtx.currentTime;
        bassFilter.gain.setTargetAtTime(p.bass, now, 0.05);
        midFilter.gain.setTargetAtTime(p.mid, now, 0.05);
        trebleFilter.gain.setTargetAtTime(p.treble, now, 0.05);
      }
      eqCards.forEach(c => c.classList.toggle('active', c.dataset.eq === presetKey));
      showToast(`DSP Equalizer: ${presetKey.toUpperCase()}`);
    });
  });

  // ==========================================================================
  // MASTER STUDIO THEME MANAGEMENT (PROFESSIONAL GRADIENT GREEN & CRIMSON RED)
  // ==========================================================================
  let currentStudioTheme = localStorage.getItem('imran_studio_theme') || 'green';

  function setStudioTheme(themeName, showNotification = true) {
    if (themeName !== 'red' && themeName !== 'green') themeName = 'green';
    currentStudioTheme = themeName;

    // Apply data-theme attribute on root and body
    document.documentElement.setAttribute('data-theme', themeName);
    document.body.setAttribute('data-theme', themeName);

    // Update Header Theme Pill Buttons
    const themePillBtns = document.querySelectorAll('.theme-pill-btn');
    themePillBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeTarget === themeName);
    });

    // Update Settings Modal Master Theme Cards
    const appThemeCards = document.querySelectorAll('.theme-card[data-app-theme]');
    appThemeCards.forEach(card => {
      card.classList.toggle('active', card.dataset.appTheme === themeName);
    });

    // Synchronize default visualizer palette
    if (themeName === 'green') {
      visualizerTheme = 'emerald';
    } else if (themeName === 'red') {
      visualizerTheme = 'crimson';
    }
    const visThemeCards = document.querySelectorAll('.theme-card[data-theme]');
    visThemeCards.forEach(c => c.classList.toggle('active', c.dataset.theme === visualizerTheme));

    // Persist choice in local storage
    localStorage.setItem('imran_studio_theme', themeName);

    if (showNotification) {
      const label = themeName === 'green' ? 'Professional Gradient Green' : 'Crimson Cyber Red';
      showToast(`Studio Theme: ${label}`);
    }
  }

  // Header Theme Pill Buttons event listeners
  const themePillBtns = document.querySelectorAll('.theme-pill-btn');
  themePillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setStudioTheme(btn.dataset.themeTarget, true);
    });
  });

  // Settings Modal Master Theme Cards event listeners
  const appThemeCards = document.querySelectorAll('.theme-card[data-app-theme]');
  appThemeCards.forEach(card => {
    card.addEventListener('click', () => {
      setStudioTheme(card.dataset.appTheme, true);
    });
  });

  // Settings Modal Spectrum Visualizer Theme Cards event listeners
  const visThemeCards = document.querySelectorAll('.theme-card[data-theme]');
  visThemeCards.forEach(card => {
    card.addEventListener('click', () => {
      visualizerTheme = card.dataset.theme;
      visThemeCards.forEach(c => c.classList.toggle('active', c.dataset.theme === visualizerTheme));
      showToast(`Visualizer Palette: ${visualizerTheme.toUpperCase()}`);
    });
  });

  // Settings Modal Open / Close
  if (btnOpenSettings && modalSettings && btnCloseSettings) {
    btnOpenSettings.addEventListener('click', () => {
      renderSettingsTrackManager();
      modalSettings.classList.add('open');
    });
    btnCloseSettings.addEventListener('click', () => {
      modalSettings.classList.remove('open');
    });
    modalSettings.addEventListener('click', (e) => {
      if (e.target === modalSettings) modalSettings.classList.remove('open');
    });
  }

  // Initialize
  setStudioTheme(currentStudioTheme, false);
  resizeCanvas();
  renderPlaylist();
  setVolume(currentVolume);
  loadTrack(0, false);
  renderVisualizer();

})();