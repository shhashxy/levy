/* =========================================================
   CARTA DE AMOR INTERATIVA — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1) TELA DE CARREGAMENTO
  --------------------------------------------------------- */
  const loadingScreen = document.getElementById('loadingScreen');
  const openHeartBtn  = document.getElementById('openHeartBtn');
  const mainContent   = document.getElementById('mainContent');

  setTimeout(() => {
    openHeartBtn.classList.remove('hidden');
  }, 2600);

  openHeartBtn.addEventListener('click', () => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
      initAfterOpen();
    }, 900);
  });

  /* ---------------------------------------------------------
     2) FUNDO DE PARTÍCULAS (corações + pétalas caindo sempre)
  --------------------------------------------------------- */
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const SYMBOLS = ['❤', '💗', '🌸', '🌹', '💛'];
  const particles = [];
  const MAX_PARTICLES = 40;

  function spawnParticle() {
    particles.push({
      x: Math.random() * W,
      y: -20,
      size: 12 + Math.random() * 16,
      speedY: 0.6 + Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.6,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      opacity: 0.5 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);

    if (particles.length < MAX_PARTICLES && Math.random() < 0.4) {
      spawnParticle();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.y += p.speedY;
      p.sway += 0.02;
      p.x += p.speedX + Math.sin(p.sway) * 0.4;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(p.symbol, 0, 0);
      ctx.restore();

      if (p.y > H + 30) particles.splice(i, 1);
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ---------------------------------------------------------
     3) BRILHO QUE SEGUE O MOUSE
  --------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  /* ---------------------------------------------------------
     4) FUNÇÕES QUE SÓ RODAM DEPOIS DE ABRIR O CORAÇÃO
  --------------------------------------------------------- */
  function initAfterOpen() {
    startCounter();
    typeLetter();
    setupMessages();
    setupMusic();
    setupGallerySparkle();
    generateNightSky();
    setupScrollReveal();
    setupFinalSurprise();
  }

  /* ---------------------------------------------------------
     5) CONTADOR DE TEMPO JUNTOS
     Data de início definida para resultar em 288 dias na abertura.
  --------------------------------------------------------- */
  function startCounter() {
    // Ajuste esta data para o dia real em que a história de vocês começou.
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 288);
    startDate.setHours(startDate.getHours() - 13);
    startDate.setMinutes(startDate.getMinutes() - 27);
    startDate.setSeconds(startDate.getSeconds() - 42);

    const elDays  = document.getElementById('c-days');
    const elHours = document.getElementById('c-hours');
    const elMins  = document.getElementById('c-mins');
    const elSecs  = document.getElementById('c-secs');

    function update() {
      const now = new Date();
      let diff = Math.floor((now - startDate) / 1000);

      const days = Math.floor(diff / 86400); diff -= days * 86400;
      const hours = Math.floor(diff / 3600); diff -= hours * 3600;
      const mins = Math.floor(diff / 60); diff -= mins * 60;
      const secs = diff;

      elDays.textContent  = String(days).padStart(3, '0');
      elHours.textContent = String(hours).padStart(2, '0');
      elMins.textContent  = String(mins).padStart(2, '0');
      elSecs.textContent  = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ---------------------------------------------------------
     6) CARTA COM EFEITO DE DIGITAÇÃO
  --------------------------------------------------------- */
  function typeLetter() {
    const letterEl = document.getElementById('letterText');
    const cursorEl = document.getElementById('letterCursor');

    const fullText =
`Meu amor,

Se eu pudesse escolher uma vida entre infinitas possíveis, eu escolheria sempre aquela em que nossos caminhos se cruzam.

Cada dia ao seu lado me faz acreditar ainda mais no que sinto por você. Seu jeito, seu sorriso, sua forma de olhar para o mundo, tudo em você me encanta.

Obrigado por existir, por escolher ficar e por transformar os meus dias em algo tão bonito.

Com todo o meu amor,
para sempre seu.`;

    let index = 0;
    function typeChar() {
      if (index < fullText.length) {
        letterEl.textContent += fullText.charAt(index);
        index++;
        setTimeout(typeChar, 28);
      } else {
        cursorEl.style.animation = 'blink 0.9s step-end infinite';
      }
    }
    typeChar();
  }

  /* ---------------------------------------------------------
     7) MENSAGENS ESPECIAIS (clique gera mensagem aleatória)
  --------------------------------------------------------- */
  function setupMessages() {
    const messages = [
      'Você é a melhor coisa que me aconteceu.',
      'Meu lugar favorito sempre será ao seu lado.',
      'Você sempre será meu primeiro amor.',
      'Você é minha melhor escolha e eu te escolheria sempre, em todas as vidas.',
      'Você faz meus dias muito mais felizes.',
      'Você sempre será meu porto seguro.'
    ];

    const btn = document.getElementById('messageBtn');
    const bubble = document.getElementById('messageBubble');
    const textEl = document.getElementById('messageText');
    let lastIndex = -1;

    btn.addEventListener('click', () => {
      let idx;
      do { idx = Math.floor(Math.random() * messages.length); }
      while (idx === lastIndex && messages.length > 1);
      lastIndex = idx;

      bubble.classList.remove('hidden');
      bubble.style.animation = 'none';
      void bubble.offsetWidth; // reinicia a animação
      bubble.style.animation = 'popIn 0.5s ease';
      textEl.textContent = messages[idx];
    });
  }

  /* ---------------------------------------------------------
     8) MÚSICA DE FUNDO (YouTube)
  --------------------------------------------------------- */
  let ytPlayer = null;
  let ytReady = false;
  let pendingPlay = false;

  // A API do YouTube chama esta função global automaticamente quando carrega.
  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('ytPlayer', {
      height: '1',
      width: '1',
      videoId: 'C63DnA-2D-c',
      playerVars: { autoplay: 0, controls: 0, loop: 1 },
      events: {
        onReady: () => {
          ytReady = true;
          if (pendingPlay) ytPlayer.playVideo();
        }
      }
    });
  };

  function setupMusic() {
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = document.getElementById('musicIcon');
    let playing = false;

    musicBtn.addEventListener('click', () => {
      playing = !playing;

      if (playing) {
        musicIcon.textContent = '⏸';
        musicBtn.classList.add('playing');
        if (ytReady && ytPlayer) {
          ytPlayer.playVideo();
        } else {
          pendingPlay = true;
        }
      } else {
        musicIcon.textContent = '🎵';
        musicBtn.classList.remove('playing');
        if (ytReady && ytPlayer) ytPlayer.pauseVideo();
        pendingPlay = false;
      }
    });
  }

  /* ---------------------------------------------------------
     9) GALERIA — brilho já tratado via CSS :hover
     (mantido aqui para eventuais efeitos extras via JS)
  --------------------------------------------------------- */
  function setupGallerySparkle() {
    const polaroids = document.querySelectorAll('.polaroid');
    polaroids.forEach((p) => {
      p.addEventListener('mouseenter', () => {
        p.style.transitionDuration = '0.35s';
      });
    });
  }

  /* ---------------------------------------------------------
     10) CÉU ESTRELADO — gera estrelas, vaga-lumes e corações
  --------------------------------------------------------- */
  function generateNightSky() {
    const sky = document.getElementById('nightSky');

    // Estrelas
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 90}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      sky.appendChild(star);
    }

    // Vaga-lumes
    for (let i = 0; i < 12; i++) {
      const fly = document.createElement('div');
      fly.className = 'firefly';
      fly.style.left = `${Math.random() * 100}%`;
      fly.style.top = `${40 + Math.random() * 50}%`;
      fly.style.animationDelay = `${Math.random() * 4}s`;
      fly.style.animationDuration = `${4 + Math.random() * 4}s`;
      sky.appendChild(fly);
    }

    // Corações brilhando
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement('div');
      heart.className = 'night-heart';
      heart.textContent = '❤';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.top = `${20 + Math.random() * 60}%`;
      heart.style.animationDelay = `${Math.random() * 3}s`;
      sky.appendChild(heart);
    }
  }

  /* ---------------------------------------------------------
     11) ANIMAÇÃO DE REVELAÇÃO AO ROLAR (scroll reveal)
  --------------------------------------------------------- */
  function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------
     12) SURPRESA FINAL — corações subindo, pétalas, fogos e
         coração gigante pulsando
  --------------------------------------------------------- */
  function setupFinalSurprise() {
    const finalBtn = document.getElementById('finalBtn');
    const overlay = document.getElementById('finalOverlay');
    const finalSub = document.getElementById('finalSub');
    const fireworksCanvas = document.getElementById('fireworksCanvas');

    finalBtn.addEventListener('click', () => {
      overlay.classList.remove('hidden');
      requestAnimationFrame(() => overlay.classList.add('show'));

      launchRisingHearts();
      launchFireworks(fireworksCanvas);

      setTimeout(() => {
        finalSub.classList.remove('hidden');
      }, 1800);
    });
  }

  // Corações subindo pela tela
  function launchRisingHearts() {
    const total = 60;
    for (let i = 0; i < total; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = '❤';
        heart.style.position = 'fixed';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.bottom = '-30px';
        heart.style.fontSize = `${14 + Math.random() * 22}px`;
        heart.style.color = Math.random() > 0.5 ? '#e8567c' : '#d4af37';
        heart.style.zIndex = '210';
        heart.style.opacity = '0.9';
        heart.style.pointerEvents = 'none';
        heart.style.transition = 'transform 4s linear, opacity 4s linear';
        document.body.appendChild(heart);

        requestAnimationFrame(() => {
          heart.style.transform = `translateY(-${window.innerHeight + 100}px) rotate(${(Math.random() - 0.5) * 180}deg)`;
          heart.style.opacity = '0';
        });

        setTimeout(() => heart.remove(), 4200);
      }, i * 80);
    }
  }

  // Fogos de artifício de corações (canvas)
  function launchFireworks(canvas) {
    const fctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworkParticles = [];

    function createBurst(x, y) {
      const count = 26;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 3;
        fireworkParticles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60 + Math.random() * 20,
          color: Math.random() > 0.5 ? '#e8567c' : '#d4af37'
        });
      }
    }

    // Várias explosões ao longo do tempo
    const burstTimes = [0, 500, 1000, 1600, 2200, 2900];
    burstTimes.forEach((t) => {
      setTimeout(() => {
        createBurst(
          canvas.width * (0.2 + Math.random() * 0.6),
          canvas.height * (0.2 + Math.random() * 0.4)
        );
      }, t);
    });

    function renderFireworks() {
      fctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = fireworkParticles.length - 1; i >= 0; i--) {
        const p = fireworkParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravidade leve
        p.life -= 1;

        fctx.save();
        fctx.globalAlpha = Math.max(p.life / 80, 0);
        fctx.fillStyle = p.color;
        fctx.font = '16px serif';
        fctx.fillText('❤', p.x, p.y);
        fctx.restore();

        if (p.life <= 0) fireworkParticles.splice(i, 1);
      }

      requestAnimationFrame(renderFireworks);
    }
    renderFireworks();
  }

});
