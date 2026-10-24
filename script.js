/**
 * 🌸 OPERATION: MAKE MY FAVORITE HUMAN SMILE AGAIN! 🥹💗
 * Interactive Logic, Mini-Game, Web Audio Synthesizer, GSAP & Certificate Export
 * Author: Deb Paul
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 1. STATE & GLOBAL CONFIGURATION
  // ===================================================================
  const state = {
    friendName: 'Bestie',
    sfxEnabled: true,
    musicPlaying: false,
    angerPercent: 100,
    envelopeOpened: false,
    surpriseOpened: false,
    friendshipScore: 0,
    friendshipProgress: 15,
    pillowPunches: 0,
    easterEggsFound: 0
  };

  // Check URL query parameters for ?name=
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('name')) {
    state.friendName = urlParams.get('name').trim() || 'Bestie';
    localStorage.setItem('bestie_friend_name', state.friendName);
  } else if (localStorage.getItem('bestie_friend_name')) {
    state.friendName = localStorage.getItem('bestie_friend_name');
  }

  // ===================================================================
  // 2. WEB AUDIO API SYNTHESIZER (ZERO EXTERNAL AUDIO DEPENDENCY)
  // ===================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play Cute Pop Sound
  function playPopSound() {
    if (!state.sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  // Play Sparkle Chime Sound
  function playSparkleChime() {
    if (!state.sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch (e) {}
  }

  // Play Squeak Sound (for stress pillow)
  function playSqueakSound() {
    if (!state.sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }

  // Play Victory Fanfare
  function playVictoryFanfare() {
    if (!state.sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [
        { f: 440, d: 0.15 },
        { f: 554.37, d: 0.15 },
        { f: 659.25, d: 0.15 },
        { f: 880, d: 0.45 }
      ];
      let t = ctx.currentTime;
      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + n.d);
        t += n.d * 0.9;
      });
    } catch (e) {}
  }

  // Soothing Gentle Lo-Fi Melody Synthesizer
  let lofiInterval = null;
  const lofiChords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];
  let chordIdx = 0;

  function playLofiArpeggio() {
    if (!state.musicPlaying) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const currentChord = lofiChords[chordIdx % lofiChords.length];
      chordIdx++;

      currentChord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.35);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.35 + 0.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.35);
        osc.stop(ctx.currentTime + idx * 0.35 + 0.95);
      });
    } catch (e) {}
  }

  function startLofiMusic() {
    state.musicPlaying = true;
    const btn = document.getElementById('musicToggleBtn');
    if (btn) btn.classList.add('playing');
    playLofiArpeggio();
    if (lofiInterval) clearInterval(lofiInterval);
    lofiInterval = setInterval(playLofiArpeggio, 2200);
  }

  function stopLofiMusic() {
    state.musicPlaying = false;
    const btn = document.getElementById('musicToggleBtn');
    if (btn) btn.classList.remove('playing');
    if (lofiInterval) {
      clearInterval(lofiInterval);
      lofiInterval = null;
    }
  }

  // Music toggle listener
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      getAudioContext();
      if (state.musicPlaying) {
        stopLofiMusic();
      } else {
        startLofiMusic();
      }
    });
  }

  // SFX toggle listener
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const sfxIcon = document.getElementById('sfxIcon');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      state.sfxEnabled = !state.sfxEnabled;
      if (sfxIcon) {
        sfxIcon.textContent = state.sfxEnabled ? '🔊' : '🔇';
      }
      playPopSound();
    });
  }

  // ===================================================================
  // 3. NAME CUSTOMIZER & GLOBAL PLACEHOLDERS
  // ===================================================================
  function applyFriendName(name) {
    state.friendName = name || 'Bestie';
    localStorage.setItem('bestie_friend_name', state.friendName);

    // Update all name placeholders
    document.querySelectorAll('.friend-name-placeholder').forEach(el => {
      el.textContent = state.friendName;
    });

    const navName = document.getElementById('navFriendName');
    if (navName) navName.textContent = state.friendName;

    const certDisplay = document.getElementById('certRecipientDisplay');
    if (certDisplay) certDisplay.textContent = state.friendName;

    const certInput = document.getElementById('certFriendInput');
    if (certInput) certInput.value = state.friendName;
  }

  applyFriendName(state.friendName);

  // Name Modal Interactions
  const nameModal = document.getElementById('nameModal');
  const customizeNameBtn = document.getElementById('customizeNameBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalSaveBtn = document.getElementById('modalSaveBtn');
  const friendNameInput = document.getElementById('friendNameInput');

  if (customizeNameBtn && nameModal) {
    customizeNameBtn.addEventListener('click', () => {
      playPopSound();
      if (friendNameInput) friendNameInput.value = state.friendName;
      nameModal.classList.remove('hidden');
    });
  }

  function closeModal() {
    playPopSound();
    if (nameModal) nameModal.classList.add('hidden');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

  if (modalSaveBtn && friendNameInput) {
    modalSaveBtn.addEventListener('click', () => {
      const val = friendNameInput.value.trim();
      if (val) {
        applyFriendName(val);
        playSparkleChime();
        triggerHeartConfetti();
      }
      closeModal();
    });
  }

  // Certificate input direct update
  const certFriendInput = document.getElementById('certFriendInput');
  const btnUpdateCertName = document.getElementById('btnUpdateCertName');
  if (btnUpdateCertName && certFriendInput) {
    btnUpdateCertName.addEventListener('click', () => {
      const val = certFriendInput.value.trim();
      if (val) {
        applyFriendName(val);
        playSparkleChime();
        triggerHeartConfetti();
      }
    });
  }

  // Automatically update Certificate and Letter Date to Today's Localized Date
  const today = new Date();
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedToday = today.toLocaleDateString('en-US', dateOptions);

  const certDateDisplay = document.getElementById('certDateDisplay');
  if (certDateDisplay) certDateDisplay.textContent = formattedToday;

  const letterDate = document.getElementById('letterDate');
  if (letterDate) letterDate.textContent = formattedToday;

  const currentYear = document.getElementById('currentYear');
  if (currentYear) currentYear.textContent = today.getFullYear();

  // ===================================================================
  // 4. FLOATING BACKGROUND PARTICLES GENERATOR
  // ===================================================================
  const bgParticles = document.getElementById('bgParticles');
  const particleSymbols = ['🌸', '✨', '🧸', '😂', '💗', '🌷', '🍪', '⭐', '🎈'];

  if (bgParticles) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'floating-particle';
      p.textContent = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
      p.style.left = `${Math.random() * 98}%`;
      p.style.animationDelay = `${Math.random() * 18}s`;
      p.style.animationDuration = `${12 + Math.random() * 14}s`;
      p.style.fontSize = `${1.1 + Math.random() * 0.9}rem`;
      bgParticles.appendChild(p);
    }
  }

  // Custom Cursor Follower for Desktop
  const cursorDot = document.getElementById('cursorDot');
  const cursorTrail = document.getElementById('cursorTrail');

  if (cursorDot && cursorTrail && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursorTrail() {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
      requestAnimationFrame(animateCursorTrail);
    }
    animateCursorTrail();

    // Hover scale effects on interactive elements
    document.querySelectorAll('button, a, .choc-piece, .voucher-chip, .quiz-opt-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.4)';
        cursorTrail.style.borderColor = 'rgba(236, 72, 153, 0.7)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorTrail.style.borderColor = 'rgba(236, 72, 153, 0.4)';
      });
    });
  }

  // ===================================================================
  // 5. CUTE ANIMATED LOADING SCREEN
  // ===================================================================
  const loadingScreen = document.getElementById('loadingScreen');
  const loaderBar = document.getElementById('loaderBar');
  const loaderStatus = document.getElementById('loaderStatus');

  const loadingSteps = [
    { text: 'Gathering apology courage... 🥹', progress: 25 },
    { text: "Deb's last 2 brain cells rebooting... 🤡", progress: 60 },
    { text: 'Sprinkling extra friendship magic... 🌸', progress: 90 },
    { text: 'Ready for inspection! ✨', progress: 100 }
  ];

  let currentStepIdx = 0;
  function runLoadingSequence() {
    if (currentStepIdx < loadingSteps.length) {
      const step = loadingSteps[currentStepIdx];
      if (loaderBar) loaderBar.style.width = `${step.progress}%`;
      if (loaderStatus) loaderStatus.textContent = step.text;
      currentStepIdx++;
      setTimeout(runLoadingSequence, 450);
    } else {
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.classList.add('fade-out');
          setTimeout(() => loadingScreen.remove(), 700);
        }
      }, 350);
    }
  }
  runLoadingSequence();

  // Progress Bar in HUD
  function addFriendshipProgress(points) {
    state.friendshipProgress = Math.min(100, state.friendshipProgress + points);
    const fill = document.getElementById('hudProgressFill');
    const label = document.getElementById('hudProgressPercent');
    if (fill) fill.style.width = `${state.friendshipProgress}%`;
    if (label) label.textContent = `${state.friendshipProgress}%`;
  }

  // Confetti helper
  function triggerHeartConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#ec4899', '#c084fc', '#38bdf8', '#fbbf24']
      });
    }
  }

  function triggerGrandConfetti() {
    if (typeof confetti === 'function') {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#f472b6', '#ec4899', '#a855f7', '#38bdf8', '#f59e0b', '#10b981'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }

  // ===================================================================
  // 6. SECTION 1: THE FUNNY WARNING INTERACTIONS
  // ===================================================================
  const btnInvestigate = document.getElementById('btnInvestigate');
  const btnStillAngry = document.getElementById('btnStillAngry');
  const stillAngryResponse = document.getElementById('stillAngryResponse');
  const btnStressPillow = document.getElementById('btnStressPillow');
  const pillowCounter = document.getElementById('pillowCounter');
  const btnGentleContinue = document.getElementById('btnGentleContinue');

  if (btnInvestigate) {
    btnInvestigate.addEventListener('click', () => {
      playSparkleChime();
      addFriendshipProgress(10);
      document.getElementById('meterSection').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnStillAngry && stillAngryResponse) {
    btnStillAngry.addEventListener('click', () => {
      playPopSound();
      stillAngryResponse.classList.toggle('hidden');
      if (!stillAngryResponse.classList.contains('hidden')) {
        stillAngryResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  const punchMessages = [
    "Oof! Take that! 💥",
    "Deb's imaginary lawyer objected! 🥊",
    "Direct hit! Even my shadow apologized. 😭",
    "Brain cells reduced to 0.5! 🤡",
    "Critical punch registered! Feeling lighter yet? 🌸"
  ];

  if (btnStressPillow && pillowCounter) {
    btnStressPillow.addEventListener('click', () => {
      state.pillowPunches++;
      playSqueakSound();
      const msg = punchMessages[state.pillowPunches % punchMessages.length];
      pillowCounter.textContent = `Punches registered: ${state.pillowPunches} — "${msg}"`;
      
      // Pillow bounce animation
      btnStressPillow.style.transform = 'scale(0.92)';
      setTimeout(() => btnStressPillow.style.transform = '', 120);

      if (state.pillowPunches === 5) {
        addFriendshipProgress(5);
        triggerHeartConfetti();
      }
    });
  }

  if (btnGentleContinue) {
    btnGentleContinue.addEventListener('click', () => {
      playPopSound();
      document.getElementById('meterSection').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Easter egg: click Deb avatar
  const worriedDeb = document.getElementById('worriedDeb');
  if (worriedDeb) {
    worriedDeb.addEventListener('click', () => {
      playPopSound();
      worriedDeb.style.transform = 'rotate(360deg) scale(1.1)';
      setTimeout(() => worriedDeb.style.transform = '', 600);
      alert("🤡 Deb: 'Honk honk! Full-time idiot, lifetime loyal friend reporting for duty!'");
    });
  }

  // Easter egg: click Angry Bird
  const angryBirdBox = document.getElementById('angryBirdBox');
  if (angryBirdBox) {
    angryBirdBox.addEventListener('click', () => {
      playSparkleChime();
      triggerHeartConfetti();
      angryBirdBox.style.transform = 'scale(1.2) translateY(-10px)';
      setTimeout(() => angryBirdBox.style.transform = '', 400);
    });
  }

  // ===================================================================
  // 7. SECTION 2: INTERACTIVE ANGRY METER
  // ===================================================================
  const meterMessages = {
    100: { headline: "Anger Level: 100%", quote: "Okay, I'm officially in danger. 😭", emoji: "😭", status: "CRITICAL EMERGENCY 🔥", color: "#dc2626" },
    90: { headline: "Anger Level: 90%", quote: "Even Google can't find a solution to this situation.", emoji: "🔍", status: "SEARCHING RESCUE 🆘", color: "#ea580c" },
    80: { headline: "Anger Level: 80%", quote: "My brain has submitted its resignation letter.", emoji: "📝", status: "BRAIN RESIGNED 📉", color: "#f59e0b" },
    70: { headline: "Anger Level: 70%", quote: "I promise I'm not always this stupid. Just occasionally. 🤡", emoji: "🤡", status: "OCCASIONALLY DUMB 🥺", color: "#eab308" },
    60: { headline: "Anger Level: 60%", quote: "Can we agree that I'm at least a little funny?", emoji: "🎭", status: "SEEKING LAUGHS 😂", color: "#84cc16" },
    50: { headline: "Anger Level: 50%", quote: "Halfway there! My imaginary lawyer says I'm making progress.", emoji: "⚖️", status: "HALFWAY RECOVERED 🕊️", color: "#10b981" },
    40: { headline: "Anger Level: 40%", quote: "Look! The friendship rescue mission is working!", emoji: "🚀", status: "RESCUE SUCCEEDING ✨", color: "#06b6d4" },
    30: { headline: "Anger Level: 30%", quote: "Your smile is worth approximately 999999 cookies. 🍪", emoji: "🍪", status: "COOKIE PARADISE 🌸", color: "#38bdf8" },
    20: { headline: "Anger Level: 20%", quote: "Almost there! My last brain cell is celebrating.", emoji: "🧠", status: "BRAIN REJOICING 🥳", color: "#818cf8" },
    10: { headline: "Anger Level: 10%", quote: "Is that a tiny smile? I won't tell anyone. 🤫", emoji: "🤫", status: "TINY SMILE SPOTTED! 👀", color: "#c084fc" },
    0: { headline: "Anger Level: 0%", quote: "MISSION ACCOMPLISHED! 🎉", emoji: "🎉", status: "PEACE RESTORED 💖", color: "#ec4899" }
  };

  const thermometerFill = document.getElementById('thermometerFill');
  const gaugeNumber = document.getElementById('gaugeNumber');
  const gaugeStatusBadge = document.getElementById('gaugeStatusBadge');
  const quoteIconBubble = document.getElementById('quoteIconBubble');
  const quoteHeadline = document.getElementById('quoteHeadline');
  const quoteMessage = document.getElementById('quoteMessage');
  const btnReduceAnger = document.getElementById('btnReduceAnger');
  const btnResetMeter = document.getElementById('btnResetMeter');

  function updateMeterUI(percent) {
    const data = meterMessages[percent] || meterMessages[0];
    
    if (thermometerFill) {
      thermometerFill.style.width = `${percent}%`;
    }
    if (gaugeNumber) {
      gaugeNumber.textContent = `${percent}%`;
      gaugeNumber.style.color = data.color;
    }
    if (gaugeStatusBadge) {
      gaugeStatusBadge.textContent = data.status;
      gaugeStatusBadge.style.color = data.color;
      gaugeStatusBadge.style.background = `${data.color}15`;
      gaugeStatusBadge.style.borderColor = `${data.color}40`;
    }
    if (quoteIconBubble) quoteIconBubble.textContent = data.emoji;
    if (quoteHeadline) quoteHeadline.textContent = data.headline;
    if (quoteMessage) quoteMessage.textContent = `"${data.quote}"`;

    if (percent === 0) {
      triggerGrandConfetti();
      playVictoryFanfare();
      addFriendshipProgress(15);
      if (btnReduceAnger) {
        btnReduceAnger.disabled = true;
        btnReduceAnger.querySelector('.btn-text').textContent = "Goal Achieved! 🏆";
      }
    }
  }

  if (btnReduceAnger) {
    btnReduceAnger.addEventListener('click', () => {
      if (state.angerPercent > 0) {
        state.angerPercent -= 10;
        playPopSound();
        triggerHeartConfetti();
        updateMeterUI(state.angerPercent);
      }
    });
  }

  if (btnResetMeter) {
    btnResetMeter.addEventListener('click', () => {
      playPopSound();
      state.angerPercent = 100;
      if (btnReduceAnger) {
        btnReduceAnger.disabled = false;
        btnReduceAnger.querySelector('.btn-text').textContent = "Reduce Anger by 10% 😂";
      }
      updateMeterUI(100);
    });
  }

  // ===================================================================
  // 8. SECTION 3: THE REAL APOLOGY LETTER (INTERACTIVE ENVELOPE)
  // ===================================================================
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('waxSeal');
  const envelopeInstruction = document.getElementById('envelopeInstruction');

  function toggleEnvelope() {
    state.envelopeOpened = !state.envelopeOpened;
    playSparkleChime();

    if (envelope) {
      envelope.classList.toggle('is-open', state.envelopeOpened);
    }

    if (state.envelopeOpened) {
      triggerHeartConfetti();
      addFriendshipProgress(20);
      if (envelopeInstruction) {
        envelopeInstruction.innerHTML = '<span>🌷 Letter unfolded with sincerity & love</span>';
      }
    } else {
      if (envelopeInstruction) {
        envelopeInstruction.innerHTML = '<span class="tap-hand">👆</span> Click the wax seal to read the letter';
      }
    }
  }

  if (waxSeal) waxSeal.addEventListener('click', toggleEnvelope);

  // ===================================================================
  // 9. SECTION 4: 6 REASONS CARDS HOVER & CLICK PARTICLES
  // ===================================================================
  const reasonCards = document.querySelectorAll('.reason-card');
  reasonCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      playPopSound();
    });
    card.addEventListener('click', () => {
      playSparkleChime();
      triggerHeartConfetti();
      addFriendshipProgress(3);
    });
  });

  // ===================================================================
  // 10. SECTION 5: MINI-GAME — HELP THIS IDIOT FIX HIS MISTAKE! 🤡
  // ===================================================================
  const canvas = document.getElementById('gameCanvas');
  const gameStartOverlay = document.getElementById('gameStartOverlay');
  const gameWinOverlay = document.getElementById('gameWinOverlay');
  const btnStartGame = document.getElementById('btnStartGame');
  const btnPlayAgain = document.getElementById('btnPlayAgain');
  const gameHeartsCount = document.getElementById('gameHeartsCount');
  const gameScoreEl = document.getElementById('gameScore');
  const gameToastMessage = document.getElementById('gameToastMessage');
  const btnTouchLeft = document.getElementById('btnTouchLeft');
  const btnTouchRight = document.getElementById('btnTouchRight');
  const gameSoundBtn = document.getElementById('gameSoundBtn');
  const gameSoundIcon = document.getElementById('gameSoundIcon');

  let ctx = canvas ? canvas.getContext('2d') : null;
  let gameRunning = false;
  let gameAnimationId = null;
  let collectedHearts = 0;
  let currentScore = 0;
  let gameSoundMuted = false;

  const basket = {
    x: 350,
    y: 370,
    width: 90,
    height: 48,
    speed: 12
  };

  const fallingItems = [];
  const itemTypes = [
    { type: 'heart', symbol: '💗', isTarget: true, points: 50, speed: 2.2 },
    { type: 'pizza', symbol: '🍕', isTarget: false, points: 20, speed: 2.8 },
    { type: 'chocolate', symbol: '🍫', isTarget: false, points: 25, speed: 2.5 },
    { type: 'flower', symbol: '🌸', isTarget: false, points: 15, speed: 2.0 },
    { type: 'emoji', symbol: '😂', isTarget: false, points: 15, speed: 2.6 },
    { type: 'bear', symbol: '🧸', isTarget: false, points: 30, speed: 1.8 }
  ];

  const heartMilestoneMessages = [
    "Achievement unlocked: Professional Apology Beginner!",
    "Congratulations! You've saved one confused human.",
    "Friendship XP +100! Brain cells partially recovering.",
    "Friendship Shield Activated! 🛡️💗 Almost there!",
    "MISSION COMPLETE! 5/5 Hearts Secured!"
  ];

  if (gameSoundBtn) {
    gameSoundBtn.addEventListener('click', () => {
      gameSoundMuted = !gameSoundMuted;
      gameSoundIcon.textContent = gameSoundMuted ? '🔇' : '🔊';
    });
  }

  function spawnFallingItem() {
    if (!gameRunning) return;
    // Boost heart probability if still need hearts
    let typeChoice;
    if (Math.random() < 0.35 && collectedHearts < 5) {
      typeChoice = itemTypes[0]; // Heart
    } else {
      typeChoice = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    }

    fallingItems.push({
      x: 30 + Math.random() * (canvas.width - 60),
      y: -30,
      size: 32,
      ...typeChoice
    });
  }

  let spawnTimer = 0;

  function updateGame() {
    if (!gameRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw basket / apology trolley
    ctx.save();
    // Basket base
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.roundRect(basket.x, basket.y, basket.width, basket.height, [8, 8, 16, 16]);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Basket Rim
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(basket.x - 6, basket.y, basket.width + 12, 10);

    // Chibi Mascot icon in basket
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🤡', basket.x + basket.width / 2, basket.y + 36);
    ctx.restore();

    // Spawn items
    spawnTimer++;
    if (spawnTimer % 45 === 0) {
      spawnFallingItem();
    }

    // Update and draw falling items
    for (let i = fallingItems.length - 1; i >= 0; i--) {
      const item = fallingItems[i];
      item.y += item.speed;

      // Draw item symbol
      ctx.font = `${item.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(item.symbol, item.x, item.y);

      // Collision detection with basket
      if (
        item.y + item.size / 2 >= basket.y &&
        item.y - item.size / 2 <= basket.y + basket.height &&
        item.x >= basket.x - 10 &&
        item.x <= basket.x + basket.width + 10
      ) {
        // Caught!
        if (item.isTarget) {
          collectedHearts++;
          if (!gameSoundMuted) playSparkleChime();
          triggerHeartConfetti();

          const messageIdx = Math.min(collectedHearts - 1, heartMilestoneMessages.length - 1);
          if (gameToastMessage) {
            gameToastMessage.textContent = heartMilestoneMessages[messageIdx];
          }

          if (gameHeartsCount) gameHeartsCount.textContent = `${collectedHearts} / 5`;
          currentScore += item.points;

          if (collectedHearts >= 5) {
            winMiniGame();
            return;
          }
        } else {
          currentScore += item.points;
          if (!gameSoundMuted) playPopSound();
          if (gameToastMessage) {
            gameToastMessage.textContent = `Caught ${item.symbol}! +${item.points} Friendship Points!`;
          }
        }

        if (gameScoreEl) gameScoreEl.textContent = currentScore;
        fallingItems.splice(i, 1);
        continue;
      }

      // Remove items off screen
      if (item.y > canvas.height + 40) {
        fallingItems.splice(i, 1);
      }
    }

    gameAnimationId = requestAnimationFrame(updateGame);
  }

  function startMiniGame() {
    if (gameStartOverlay) gameStartOverlay.classList.add('hidden');
    if (gameWinOverlay) gameWinOverlay.classList.add('hidden');

    collectedHearts = 0;
    currentScore = 0;
    fallingItems.length = 0;
    if (gameHeartsCount) gameHeartsCount.textContent = '0 / 5';
    if (gameScoreEl) gameScoreEl.textContent = '0';
    if (gameToastMessage) gameToastMessage.textContent = "Catch falling friendship hearts! 🎮";

    gameRunning = true;
    playPopSound();
    cancelAnimationFrame(gameAnimationId);
    updateGame();
  }

  function winMiniGame() {
    gameRunning = false;
    cancelAnimationFrame(gameAnimationId);
    playVictoryFanfare();
    triggerGrandConfetti();
    addFriendshipProgress(20);
    if (gameWinOverlay) gameWinOverlay.classList.remove('hidden');
  }

  if (btnStartGame) btnStartGame.addEventListener('click', startMiniGame);
  if (btnPlayAgain) btnPlayAgain.addEventListener('click', startMiniGame);

  // Mouse & Touch Controls for Game
  if (canvas) {
    const handleMove = (clientX) => {
      if (!gameRunning) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const canvasX = (clientX - rect.left) * scaleX;
      basket.x = Math.max(0, Math.min(canvas.width - basket.width, canvasX - basket.width / 2));
    };

    canvas.addEventListener('mousemove', (e) => handleMove(e.clientX));
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    }, { passive: false });
  }

  // Keyboard Left & Right Arrows
  window.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      basket.x = Math.max(0, basket.x - basket.speed * 2);
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      basket.x = Math.min(canvas.width - basket.width, basket.x + basket.speed * 2);
    }
  });

  // Mobile On-screen Buttons
  let touchInterval = null;
  if (btnTouchLeft) {
    btnTouchLeft.addEventListener('touchstart', (e) => {
      e.preventDefault();
      touchInterval = setInterval(() => {
        basket.x = Math.max(0, basket.x - basket.speed * 1.5);
      }, 30);
    });
    btnTouchLeft.addEventListener('touchend', () => clearInterval(touchInterval));
  }

  if (btnTouchRight) {
    btnTouchRight.addEventListener('touchstart', (e) => {
      e.preventDefault();
      touchInterval = setInterval(() => {
        basket.x = Math.min(canvas.width - basket.width, basket.x + basket.speed * 1.5);
      }, 30);
    });
    btnTouchRight.addEventListener('touchend', () => clearInterval(touchInterval));
  }

  // ===================================================================
  // 11. SECTION 6: FUNNY FRIENDSHIP QUIZ
  // ===================================================================
  const quizQuestions = [
    {
      qNum: "Question 1 of 3",
      question: "Who is the bigger idiot in this friendship?",
      options: [
        { text: "You", isDeb: false, feedback: "Nice try, but the answer is still Deb. 😂 Even my mirror agreed." },
        { text: "Me", isDeb: false, feedback: "Nice try, but the answer is still Deb. 😂 Science has debunked this." },
        { text: "Obviously Deb 🤡", isDeb: true, feedback: "Correct! Scientists have confirmed this with peer-reviewed research. 🔬" }
      ]
    },
    {
      qNum: "Question 2 of 3",
      question: "What should Deb do when he makes a mistake?",
      options: [
        { text: "Make excuses", isCorrect: false, feedback: "Error 404: Excuses invalid! Deb takes full responsibility." },
        { text: "Blame Mercury retrograde", isCorrect: false, feedback: "Planets don't make mistakes; Deb does! Try again. 🪐" },
        { text: "Apologize and actually do better", isCorrect: true, feedback: "Correct! Character development unlocked! ✨ Deb takes genuine accountability." }
      ]
    },
    {
      qNum: "Question 3 of 3",
      question: "What makes a friendship special?",
      options: [
        { text: "Trust", isCorrect: false, feedback: "True, but there's an even more complete answer..." },
        { text: "Respect", isCorrect: false, feedback: "Crucial! But look closer at the choices..." },
        { text: "Laughing at ridiculous things", isCorrect: false, feedback: "Super true, but don't forget the rest!" },
        { text: "All of the above", isCorrect: true, feedback: "Exactly! And that's why good friendships deserve care. 💖" }
      ]
    }
  ];

  let currentQuizIdx = 0;
  const quizCardBody = document.getElementById('quizCardBody');
  const quizProgressFill = document.getElementById('quizProgressFill');

  function renderQuizQuestion(idx) {
    if (!quizCardBody) return;
    const q = quizQuestions[idx];

    if (quizProgressFill) {
      quizProgressFill.style.width = `${((idx + 1) / quizQuestions.length) * 100}%`;
    }

    let optionsHTML = '';
    const prefixes = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, oIdx) => {
      optionsHTML += `
        <button class="quiz-opt-btn" data-index="${oIdx}">
          <span class="opt-prefix">${prefixes[oIdx]}</span>
          <span class="opt-text">${opt.text}</span>
        </button>
      `;
    });

    quizCardBody.innerHTML = `
      <div class="quiz-question-number">${q.qNum}</div>
      <h3 class="quiz-question-text">${q.question}</h3>
      <div class="quiz-options-list">
        ${optionsHTML}
      </div>
      <div class="quiz-feedback-box hidden" id="quizFeedbackBox">
        <div class="feedback-headline" id="feedbackHeadline"></div>
        <div class="feedback-text" id="feedbackText"></div>
        <button class="btn btn-primary btn-sm" id="btnNextQuizQuestion">Next Question ➡️</button>
      </div>
    `;

    // Attach listeners
    const optButtons = quizCardBody.querySelectorAll('.quiz-opt-btn');
    const feedbackBox = quizCardBody.getElementById ? quizCardBody.getElementById('quizFeedbackBox') : document.getElementById('quizFeedbackBox');
    const feedbackHeadline = document.getElementById('feedbackHeadline');
    const feedbackText = document.getElementById('feedbackText');
    const btnNext = document.getElementById('btnNextQuizQuestion');

    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedOpt = q.options[btn.dataset.index];
        playPopSound();

        optButtons.forEach(b => b.disabled = true);

        if (selectedOpt.isDeb || selectedOpt.isCorrect) {
          btn.classList.add('correct');
          playSparkleChime();
          triggerHeartConfetti();
          if (feedbackHeadline) feedbackHeadline.textContent = "✨ BINGO!";
        } else {
          btn.classList.add('wrong');
          if (feedbackHeadline) feedbackHeadline.textContent = "😂 Nice Try!";
        }

        if (feedbackText) feedbackText.textContent = selectedOpt.feedback;
        if (feedbackBox) feedbackBox.classList.remove('hidden');

        if (btnNext) {
          btnNext.addEventListener('click', () => {
            playPopSound();
            if (currentQuizIdx < quizQuestions.length - 1) {
              currentQuizIdx++;
              renderQuizQuestion(currentQuizIdx);
            } else {
              renderQuizComplete();
            }
          });
        }
      });
    });
  }

  function renderQuizComplete() {
    addFriendshipProgress(15);
    playVictoryFanfare();
    triggerGrandConfetti();

    quizCardBody.innerHTML = `
      <div class="text-center" style="padding: 1.5rem 0;">
        <div style="font-size: 3.5rem; margin-bottom: 0.8rem;">🎓✨</div>
        <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--pink-500); margin-bottom: 0.8rem;">
          Quiz Passed With 100% Honors!
        </h3>
        <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          Scientific conclusion: Deb is undeniably guilty, your friendship is legendary, and things are looking up!
        </p>
        <a href="#certificateSection" class="btn btn-primary btn-glow">
          <span>Claim Your Official Certificate 🏆</span>
        </a>
      </div>
    `;
  }

  renderQuizQuestion(0);

  // ===================================================================
  // 12. SECTION 7: OFFICIAL FRIENDSHIP CERTIFICATE DOWNLOAD (html2canvas)
  // ===================================================================
  const btnDownloadCert = document.getElementById('btnDownloadCert');
  const certificateToDownload = document.getElementById('certificateToDownload');

  if (btnDownloadCert && certificateToDownload) {
    btnDownloadCert.addEventListener('click', () => {
      playSparkleChime();
      triggerGrandConfetti();
      btnDownloadCert.disabled = true;
      btnDownloadCert.querySelector('.btn-text').textContent = "Generating PNG... ⏳";

      if (typeof html2canvas === 'function') {
        html2canvas(certificateToDownload, {
          scale: 2,
          useCORS: true,
          backgroundColor: null
        }).then(canvas => {
          const imageURL = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          const safeName = (state.friendName || 'Bestie').replace(/[^a-zA-Z0-9]/g, '_');
          downloadLink.download = `Official_Friendship_Certificate_${safeName}.png`;
          downloadLink.href = imageURL;
          downloadLink.click();

          btnDownloadCert.disabled = false;
          btnDownloadCert.querySelector('.btn-text').textContent = "Downloaded! 📜✨";
          setTimeout(() => {
            btnDownloadCert.querySelector('.btn-text').textContent = "Download My Certificate";
          }, 3000);
        }).catch(err => {
          console.error("Certificate generation error:", err);
          btnDownloadCert.disabled = false;
          btnDownloadCert.querySelector('.btn-text').textContent = "Download My Certificate";
        });
      }
    });
  }

  // ===================================================================
  // 13. SECTION 8: SECRET SURPRISE BOX & VIRTUAL CHOCOLATE
  // ===================================================================
  const btnOpenSurprise = document.getElementById('btnOpenSurprise');
  const giftBox3D = document.getElementById('giftBox3D');
  const revealedSurprise = document.getElementById('revealedSurprise');

  function openGiftSurprise() {
    if (state.surpriseOpened) return;
    state.surpriseOpened = true;

    playSparkleChime();
    triggerGrandConfetti();
    addFriendshipProgress(15);

    if (giftBox3D) giftBox3D.classList.add('box-open');
    if (btnOpenSurprise) btnOpenSurprise.style.display = 'none';

    setTimeout(() => {
      if (revealedSurprise) revealedSurprise.classList.remove('hidden');
      revealedSurprise.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 450);
  }

  if (btnOpenSurprise) btnOpenSurprise.addEventListener('click', openGiftSurprise);
  if (giftBox3D) giftBox3D.addEventListener('click', openGiftSurprise);

  // Virtual Chocolate treats
  const chocPieces = document.querySelectorAll('.choc-piece');
  const chocComplimentToast = document.getElementById('chocComplimentToast');

  chocPieces.forEach(piece => {
    piece.addEventListener('click', () => {
      playPopSound();
      triggerHeartConfetti();
      const compliment = piece.dataset.compliment;
      if (chocComplimentToast) {
        chocComplimentToast.textContent = compliment;
        chocComplimentToast.style.borderColor = '#ec4899';
        chocComplimentToast.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.2)';
      }
    });
  });

  // ===================================================================
  // 14. SECTION 9: THE FINAL FRIENDSHIP SCREEN & JOKE GENERATOR
  // ===================================================================
  const btnWeAreGood = document.getElementById('btnWeAreGood');
  const btnNeedTime = document.getElementById('btnNeedTime');
  const btnTellJoke = document.getElementById('btnTellJoke');
  const finalFeedbackContainer = document.getElementById('finalFeedbackContainer');

  const friendshipJokesList = [
    "Why did Deb build a website to apologize? Because even his apologies needed debugging. 💻😂",
    "My brain has 404 errors, but my appreciation for our friendship is working perfectly.",
    "I tried to become a better friend overnight. Unfortunately, the software update is still installing. 🤡",
    "Scientists say friendship requires two whole brains. In our case, you're generously carrying 95% of that weight. 😂",
    "What's the difference between a pizza and Deb's mistakes? A pizza can easily be divided, but Deb's mistakes require whole websites. 🍕",
    "I asked Siri how to stop being an idiot. Siri opened my selfie camera. 😭"
  ];

  let currentJokeIdx = 0;

  if (btnWeAreGood) {
    btnWeAreGood.addEventListener('click', () => {
      playVictoryFanfare();
      triggerGrandConfetti();
      addFriendshipProgress(25);

      finalFeedbackContainer.classList.remove('hidden');
      finalFeedbackContainer.innerHTML = `
        <div class="feedback-celebration-title">YAYYYY! 🎉💗</div>
        <div class="feedback-celebration-lead">"Friendship server successfully restored!"</div>
        <div class="feedback-celebration-sub">"Deb's remaining brain cells are throwing a parade! Thank you for being the most forgiving, legendary friend in the universe. 🌸"</div>
      `;
      finalFeedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (btnNeedTime) {
    btnNeedTime.addEventListener('click', () => {
      playPopSound();
      finalFeedbackContainer.classList.remove('hidden');
      finalFeedbackContainer.innerHTML = `
        <div class="feedback-gentle-title">That's completely okay. 💗</div>
        <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.6rem;">"Take all the time you need."</p>
        <p style="font-size: 1.02rem; color: var(--text-muted); margin-bottom: 0.6rem;">"No pressure, no rush."</p>
        <p style="font-size: 1.02rem; color: var(--pink-500); font-weight: 600;">"Our friendship deserves patience and understanding. I'll be right here whenever you're ready! 🌷"</p>
      `;
      finalFeedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (btnTellJoke) {
    btnTellJoke.addEventListener('click', () => {
      playPopSound();
      const joke = friendshipJokesList[currentJokeIdx % friendshipJokesList.length];
      currentJokeIdx++;

      finalFeedbackContainer.classList.remove('hidden');
      finalFeedbackContainer.innerHTML = `
        <div class="feedback-joke-box">
          <div style="font-size: 2rem; margin-bottom: 0.4rem;">😂🤡</div>
          <div class="joke-bubble-text">"${joke}"</div>
          <button class="btn btn-sm btn-primary" id="btnAnotherJoke">Another One! 🤣</button>
        </div>
      `;

      const btnAnother = document.getElementById('btnAnotherJoke');
      if (btnAnother) {
        btnAnother.addEventListener('click', () => {
          btnTellJoke.click();
        });
      }
      finalFeedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Voucher chips
  const voucherChips = document.querySelectorAll('.voucher-chip');
  voucherChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playSparkleChime();
      triggerHeartConfetti();
      alert(`🎉 Voucher Claimed!\n\n"${chip.textContent.trim()}"\n\nShow this to Deb anytime! No expiration date! ✨`);
    });
  });

  // ===================================================================
  // 15. SECTION 10: GOOGLE APPS SCRIPT RESPONSE FORM SUBMISSION
  // ===================================================================
  const friendshipResponseForm = document.getElementById('friendshipResponseForm');
  const responseSuccessCard = document.getElementById('responseSuccessCard');
  const btnSubmitResponse = document.getElementById('btnSubmitResponse');
  const friendPersonalMessage = document.getElementById('friendPersonalMessage');
  const charCount = document.getElementById('charCount');
  const hiddenIframe = document.getElementById('hidden_iframe');
  const submissionFeedbackMsg = document.getElementById('submissionFeedbackMsg');

  let isSubmitting = false;
  let submitTimeout = null;

  // Character counter
  if (friendPersonalMessage && charCount) {
    friendPersonalMessage.addEventListener('input', () => {
      charCount.textContent = friendPersonalMessage.value.length;
    });
  }

  // Radio button click sounds
  const choiceRadioInputs = document.querySelectorAll('.choice-option-card input[type="radio"]');
  choiceRadioInputs.forEach(radio => {
    radio.addEventListener('change', () => {
      playPopSound();
    });
  });

  // Listen for iframe load event to confirm that Google Apps Script received the HTML form POST
  if (hiddenIframe) {
    hiddenIframe.addEventListener('load', () => {
      if (isSubmitting) {
        isSubmitting = false;
        if (submitTimeout) clearTimeout(submitTimeout);

        // Celebrations!
        playVictoryFanfare();
        triggerGrandConfetti();
        addFriendshipProgress(25);

        // Hide form and reveal verified success card
        if (friendshipResponseForm) friendshipResponseForm.classList.add('hidden');
        if (responseSuccessCard) {
          responseSuccessCard.classList.remove('hidden');
          responseSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  // Handle Form Submission
  if (friendshipResponseForm) {
    friendshipResponseForm.addEventListener('submit', (e) => {
      const selectedSmile = friendshipResponseForm.querySelector('input[name="smile"]:checked');
      const selectedMood = friendshipResponseForm.querySelector('input[name="mood"]:checked');

      if (!selectedSmile || !selectedMood) {
        e.preventDefault();
        alert("Please answer Questions 1 and 2 before sending! 🌸");
        return;
      }

      if (!navigator.onLine) {
        e.preventDefault();
        alert("You seem to be offline! Please check your internet connection before sending. 🌸");
        return;
      }

      if (submissionFeedbackMsg) submissionFeedbackMsg.classList.add('hidden');

      // Set state and disable button to prevent double-submissions
      isSubmitting = true;
      if (btnSubmitResponse) {
        btnSubmitResponse.disabled = true;
        btnSubmitResponse.querySelector('.btn-text').textContent = "Sending Answers to Deb... 💌";
      }

      // Safety timeout: if server doesn't respond in 15 seconds, inform the user
      submitTimeout = setTimeout(() => {
        if (isSubmitting) {
          isSubmitting = false;
          if (btnSubmitResponse) {
            btnSubmitResponse.disabled = false;
            btnSubmitResponse.querySelector('.btn-text').textContent = "Send My Answers to Deb 💌";
          }
          if (submissionFeedbackMsg) {
            submissionFeedbackMsg.textContent = "⚠️ Submission timed out. Please check your internet connection and try again!";
            submissionFeedbackMsg.classList.remove('hidden');
          }
        }
      }, 15000);

      // Allow browser to natively POST to hidden_iframe with exact fields: smile, mood, message
    });
  }

});

