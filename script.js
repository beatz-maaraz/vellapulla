(function() {
      "use strict";

      // DOM refs
      const lockScreen = document.getElementById('lockScreen');
      const passwordInput = document.getElementById('passwordInput');
      const unlockBtn = document.getElementById('unlockBtn');
      const lockError = document.getElementById('lockError');
      const birthdayPage = document.getElementById('birthdayPage');
      const musicBtn = document.getElementById('musicBtn');

      const SECRET = '1718'; // change to your special mmdd

      // ---------- AUDIO (romantic tune) ----------
      let audioCtx = null;
      let isMusicPlaying = false;
      let oscillator = null;
      let gainNode = null;
      let musicTimeout = null;

      function initAudio() {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
      }

      function playRomanticTune() {
        if (!audioCtx) return;
        if (oscillator) {
          oscillator.stop();
          oscillator.disconnect();
          if (gainNode) gainNode.disconnect();
        }
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        
        const now = audioCtx.currentTime;
        // Simple romantic arpeggio
        const notes = [523, 659, 784, 880, 1047, 880, 784, 659, 523];
        notes.forEach((freq, i) => {
          oscillator.frequency.setValueAtTime(freq, now + i * 0.25);
        });
        // loop
        oscillator.frequency.setValueAtTime(523, now + 2.5);
        oscillator.frequency.setValueAtTime(659, now + 2.75);
        oscillator.frequency.setValueAtTime(784, now + 3.0);
        oscillator.frequency.setValueAtTime(880, now + 3.25);
        oscillator.frequency.setValueAtTime(1047, now + 3.5);
        oscillator.frequency.setValueAtTime(880, now + 3.75);
        oscillator.frequency.setValueAtTime(784, now + 4.0);
        oscillator.frequency.setValueAtTime(659, now + 4.25);
        oscillator.frequency.setValueAtTime(523, now + 4.5);
        oscillator.frequency.setValueAtTime(659, now + 4.75);
        oscillator.frequency.setValueAtTime(784, now + 5.0);
        oscillator.frequency.setValueAtTime(880, now + 5.25);
        oscillator.frequency.setValueAtTime(1047, now + 5.5);
        oscillator.frequency.setValueAtTime(880, now + 5.75);
        oscillator.frequency.setValueAtTime(784, now + 6.0);
        oscillator.frequency.setValueAtTime(659, now + 6.25);
        oscillator.frequency.setValueAtTime(523, now + 6.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start(now);
        oscillator.stop(now + 7.0);

        // loop
        musicTimeout = setTimeout(() => {
          if (isMusicPlaying) playRomanticTune();
        }, 7000);
      }

      function startMusic() {
        initAudio();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        isMusicPlaying = true;
        playRomanticTune();
        musicBtn.innerHTML = '<span>🔊</span> pause romance';
      }

      function stopMusic() {
        isMusicPlaying = false;
        if (musicTimeout) {
          clearTimeout(musicTimeout);
          musicTimeout = null;
        }
        if (oscillator) {
          oscillator.stop();
          oscillator.disconnect();
          if (gainNode) gainNode.disconnect();
          oscillator = null;
          gainNode = null;
        }
        musicBtn.innerHTML = '<span>🎵</span> play romance';
      }

      function toggleMusic() {
        if (isMusicPlaying) {
          stopMusic();
        } else {
          startMusic();
        }
      }

      musicBtn.addEventListener('click', toggleMusic);

      // ---------- SCROLL ANIMATIONS ----------
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, {
        threshold: 0.15
      });

      document.querySelectorAll('.scroll-zoom').forEach((el) => {
        observer.observe(el);
      });

      // ---------- LETTER LOGIC ----------
      const envelopeWrapper = document.getElementById('envelopeWrapper');
      const envelopeContainer = document.getElementById('envelopeContainer');
      const blurOverlay = document.getElementById('blurOverlay');
      
      envelopeWrapper.addEventListener('click', (e) => {
        // Toggle mail open on click
        const isOpen = envelopeWrapper.classList.toggle('mail-open');
        envelopeContainer.classList.toggle('mail-open');
        blurOverlay.classList.toggle('active');

        if (isOpen) {
          // Burst of hearts (limited for performance)
          for (let i = 0; i < 8; i++) {
            setTimeout(() => {
              const heart = document.createElement('div');
              heart.className = 'burst-heart';
              heart.textContent = ['💖', '💕', '💘', '✨'][Math.floor(Math.random() * 4)];
              const rect = envelopeWrapper.getBoundingClientRect();
              heart.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 150) + 'px';
              heart.style.top = (rect.top + rect.height / 2 + (Math.random() - 0.5) * 100) + 'px';
              heart.style.fontSize = (1.5 + Math.random() * 2) + 'rem';
              heart.style.animationDuration = (3 + Math.random() * 2) + 's';
              document.body.appendChild(heart);
              setTimeout(() => heart.remove(), 5000);
            }, i * 50);
          }
        }
      });

      // ---------- UNLOCK LOGIC ----------
      function unlock() {
        const val = passwordInput.value.trim();
        if (val === SECRET) {
          lockError.textContent = '💕 unlocking ...';
          lockError.style.color = '#7f4a55';
          lockScreen.classList.add('hidden');
          
          setTimeout(() => {
            lockScreen.style.display = 'none';
            birthdayPage.style.display = 'block';
            document.body.classList.add('unlocked');
            
            // force reflow
            void birthdayPage.offsetWidth;
            
            birthdayPage.classList.add('active');
            const bgText = document.getElementById('bgText');
            if(bgText) bgText.classList.add('active');
            window.scrollTo(0, 0);

            // Happy Birthday Overlay Sequence
            const hbOverlay = document.getElementById('hbOverlay');
            if (hbOverlay) {
              hbOverlay.classList.add('active');
              
              // Generate confetti
              for (let i = 0; i < 70; i++) {
                const conf = document.createElement('div');
                conf.className = 'confetti';
                conf.style.left = Math.random() * 100 + 'vw';
                const colors = ['#ff4d6d', '#ff7799', '#ffb6c1', '#b84a5e', '#ffd1d9', '#f00', '#d4a34b'];
                conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                conf.style.animationDelay = (Math.random() * 1.5) + 's';
                hbOverlay.appendChild(conf);
              }

              // After 4.5 seconds, hide overlay
              setTimeout(() => {
                // Fade out the overlay smoothly without disrupting the child animations
                hbOverlay.style.opacity = '0';
                hbOverlay.style.pointerEvents = 'none';
                
                setTimeout(() => {
                  hbOverlay.style.display = 'none';
                }, 1000); // Wait for fade out
              }, 4500);
            }
          }, 600);
          // AUTO PLAY MUSIC
          startMusic();

          // Confetti / heart burst
          function spawnHeart() {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['🖤', '🤍'][Math.floor(Math.random() * 2)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.fontSize = (1.2 + Math.random() * 2.2) + 'rem';
            heart.style.animationDuration = (6 + Math.random() * 10) + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 12000);
          }
          
          for (let i = 0; i < 10; i++) spawnHeart();
          setInterval(spawnHeart, 1500);

          // GSAP tilt effect on cards
          document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mouseenter', function(e) {
              gsap.to(this, { rotateY: 6, rotateX: -4, scale: 1.02, duration: 0.4, ease: 'power1.out' });
            });
            card.addEventListener('mouseleave', function(e) {
              gsap.to(this, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.4, ease: 'power1.out' });
            });
            // touch support
            card.addEventListener('touchstart', function(e) {
              gsap.to(this, { rotateY: 4, rotateX: -3, scale: 1.02, duration: 0.3 });
            });
            card.addEventListener('touchend', function(e) {
              gsap.to(this, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.3 });
            });
          });

        } else {
          lockError.textContent = '💔 not quite, try again';
          lockError.style.color = '#b13e4b';
          lockScreen.classList.add('shake');
          setTimeout(() => lockScreen.classList.remove('shake'), 500);
          passwordInput.value = '';
          passwordInput.focus();
        }
      }

      unlockBtn.addEventListener('click', unlock);
      passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') unlock(); });

      // ---------- SECRET LOCKER LOGIC ----------
      const lockerBtn = document.getElementById('lockerBtn');
      const lockerModal = document.getElementById('lockerModal');
      const lockerCloseBtn = document.getElementById('lockerCloseBtn');
      const lockerContent = document.getElementById('lockerContent');
      const lockerGallery = document.getElementById('lockerGallery');
      const lockerUnlockBtn = document.getElementById('lockerUnlockBtn');
      const lockerPassword = document.getElementById('lockerPassword');
      const lockerError = document.getElementById('lockerError');
      const galleryCloseBtn = document.getElementById('galleryCloseBtn');

      if (lockerBtn) {
        lockerBtn.addEventListener('click', () => {
          lockerModal.classList.add('active');
          lockerContent.style.display = 'block';
          lockerGallery.style.display = 'none';
          lockerPassword.value = '';
          lockerError.textContent = '';
        });
      }

      function closeLocker() {
        lockerModal.classList.remove('active');
      }

      if (lockerCloseBtn) lockerCloseBtn.addEventListener('click', closeLocker);
      if (galleryCloseBtn) galleryCloseBtn.addEventListener('click', closeLocker);

      function unlockLocker() {
        if (lockerPassword.value.trim() === SECRET) {
          lockerContent.style.display = 'none';
          lockerGallery.style.display = 'block';
        } else {
          lockerError.textContent = '💔 Incorrect PIN';
          lockerContent.classList.add('shake');
          setTimeout(() => lockerContent.classList.remove('shake'), 500);
        }
      }

      if (lockerUnlockBtn) lockerUnlockBtn.addEventListener('click', unlockLocker);
      if (lockerPassword) {
        lockerPassword.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') unlockLocker();
        });
      }

      // ---------- 3D BOOK LOGIC ----------
      const book = document.getElementById('journeyBook');
      if (book) {
        const pages = document.querySelectorAll('.page');
        let currentPage = 0;

        pages.forEach((page, index) => {
          page.addEventListener('click', () => {
            if (index === currentPage) { // flip forward
              page.classList.add('flipped');
              currentPage++;
              if (currentPage === 1) book.classList.add('open');
            } else if (index === currentPage - 1) { // flip backward
              page.classList.remove('flipped');
              currentPage--;
              if (currentPage === 0) book.classList.remove('open');
            }
          });
        });
      }

      // ---------- SCROLL FADE-IN & HEARTS LOGIC ----------
      const scrollElements = document.querySelectorAll('.scroll-zoom');
      const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.1 });
      scrollElements.forEach(el => scrollObserver.observe(el));

      let scrollTimeout;
      window.addEventListener('scroll', () => {
        if (!document.body.classList.contains('unlocked')) return;
        
        if (!scrollTimeout) {
          // Limit total number of hearts to prevent lag spikes
          if (document.querySelectorAll('.burst-heart').length < 8) {
            spawnMiniHeart();
          }
          scrollTimeout = setTimeout(() => { scrollTimeout = null; }, 200);
        }
      });

      function spawnMiniHeart() {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.style.position = 'fixed';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '150';
        heart.textContent = ['💖', '💕', '🌸', '✨'][Math.floor(Math.random() * 4)];
        heart.style.left = (5 + Math.random() * 90) + 'vw';
        heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
        heart.style.animation = `floatUp ${1.5 + Math.random() * 2}s linear forwards`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 3500);
      }

      // ---------- IMAGE MODAL LOGIC ----------
      const imageModal = document.getElementById('imageModal');
      const imageModalImg = document.getElementById('imageModalImg');
      const closeImageModalBtn = document.getElementById('closeImageModalBtn');

      document.querySelectorAll('.card-3d').forEach(card => {
        card.addEventListener('click', () => {
          const imgSrc = card.getAttribute('data-img');
          if(imgSrc) {
            imageModalImg.src = imgSrc;
            imageModal.style.display = 'flex';
            setTimeout(() => {
              imageModal.style.opacity = '1';
            }, 10);
          }
        });
      });

      closeImageModalBtn.addEventListener('click', () => {
        imageModal.style.opacity = '0';
        setTimeout(() => {
          imageModal.style.display = 'none';
        }, 300);
      });
      imageModal.addEventListener('click', (e) => {
        if(e.target === imageModal) {
          imageModal.style.opacity = '0';
          setTimeout(() => {
            imageModal.style.display = 'none';
          }, 300);
        }
      });

      // ---------- THREE.JS BACKGROUND (3D hearts) ----------
      (function initThreeBackground() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '0';
        container.style.pointerEvents = 'none';
        document.body.prepend(container);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // main heart group
        const heartGroup = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ 
          color: 0xff4d6d, 
          emissive: 0x661122, 
          emissiveIntensity: 0.2, 
          roughness: 0.3, 
          metalness: 0.1 
        });
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 1.5);
        heartShape.bezierCurveTo(2, 1.5, 2, 0, 0, -2.5);
        heartShape.bezierCurveTo(-2, 0, -2, 1.5, 0, 1.5);

        const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        geometry.center();

        const heartMesh = new THREE.Mesh(geometry, mat);
        heartGroup.add(heartMesh);
        heartGroup.scale.set(0.8, 0.8, 0.8);
        scene.add(heartGroup);

        const light = new THREE.PointLight(0xffa5b0, 1, 50);
        light.position.set(5, 10, 10);
        scene.add(light);
        const ambient = new THREE.AmbientLight(0x442233, 0.4);
        scene.add(ambient);

        // particle hearts
        const heartParticles = new THREE.BufferGeometry();
        const particleCount = 160;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 60;
          positions[i+1] = (Math.random() - 0.5) * 40;
          positions[i+2] = (Math.random() - 0.5) * 40 - 10;
        }
        heartParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
          color: 0xff7799,
          size: 0.25,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending
        });
        const particleSystem = new THREE.Points(heartParticles, particleMat);
        scene.add(particleSystem);

        function animate() {
          requestAnimationFrame(animate);
          heartGroup.rotation.y += 0.005;
          heartGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
          particleSystem.rotation.y += 0.0005;
          renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });
      })();

    })();
