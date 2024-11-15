import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBp8leWWIEEn-7hFzIvlVux5QtQotjb3dc",
    authDomain: "login-to-cryptcrunch.firebaseapp.com",
    databaseURL: "https://login-to-cryptcrunch-default-rtdb.firebaseio.com",
    projectId: "login-to-cryptcrunch",
    storageBucket: "login-to-cryptcrunch.firebasestorage.app",
    messagingSenderId: "589867971531",
    appId: "1:589867971531:web:eac9f5d3394c4e16a47c4e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    const correctAnswers = [15, 122, 121];

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;
            sessionStorage.setItem('userId', userId);

            function saveProgress(userId, currentLevel) {
                set(ref(db, 'progress/' + userId), {
                    level: currentLevel
                }).then(() => {
                    console.log("Progress saved successfully.");
                }).catch(error => {
                    console.error("Error saving progress:", error);
                });
            }

            if (!sessionStorage.getItem('currentLevel')) {
                sessionStorage.setItem('currentLevel', 1);
            }

            const submitBtn = document.getElementById('submitBtn');
            const returnButton = document.querySelector('.return-button');

            if (submitBtn) {
                submitBtn.addEventListener('click', function() {
                    const input = parseInt(document.getElementById('userInput').value);
                    let currentLevel = parseInt(sessionStorage.getItem('currentLevel'));

                    if (input === correctAnswers[currentLevel - 1]) {
                        currentLevel++;
                        sessionStorage.setItem('currentLevel', currentLevel);

                        // Save progress to Firebase
                        saveProgress(userId, currentLevel);

                        if (currentLevel > correctAnswers.length) {
                            showCompletionPopup();
                        } else {
                            showSuccessPopup(currentLevel);
                        }
                    } else {
                        showErrorPopup();
                    }
                });
            }

            if (returnButton) {
                returnButton.addEventListener('click', function() {
                    window.location.href = 'home.html';
                });
            }

            function showErrorPopup() {
                const modal = document.getElementById("errorModal");
                const tryAgainBtn = document.getElementById("tryAgainBtn");

                if (modal && tryAgainBtn) {
                    modal.style.display = "flex";

                    tryAgainBtn.onclick = function() {
                        modal.style.display = "none";
                    };
                }
            }

            let W = window.innerWidth;
            let H = window.innerHeight;
            const canvas = document.getElementById("canvas");
            const context = canvas.getContext("2d");
            const maxConfettis = 150;
            const particles = [];

            const possibleColors = [
                "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue",
                "LightBlue", "Gold", "Violet", "PaleGreen", "SteelBlue",
                "SandyBrown", "Chocolate", "Crimson"
            ];

            function randomFromTo(from, to) {
                return Math.floor(Math.random() * (to - from + 1) + from);
            }

            function confettiParticle() {
                this.x = Math.random() * W;
                this.y = Math.random() * H - H;
                this.r = randomFromTo(11, 33);
                this.d = Math.random() * maxConfettis + 11;
                this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
                this.tilt = Math.floor(Math.random() * 33) - 11;
                this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
                this.tiltAngle = 0;

                this.draw = function() {
                    context.beginPath();
                    context.lineWidth = this.r / 2;
                    context.strokeStyle = this.color;
                    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
                    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
                    return context.stroke();
                };
            }

            function Draw() {
                const results = [];
                requestAnimationFrame(Draw);
                context.clearRect(0, 0, W, H);

                for (let i = 0; i < maxConfettis; i++) {
                    results.push(particles[i].draw());
                }

                for (let i = 0; i < maxConfettis; i++) {
                    let particle = particles[i];
                    particle.tiltAngle += particle.tiltAngleIncremental;
                    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
                    particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

                    if (particle.y > H || particle.x > W + 30 || particle.x < -30) {
                        particle.x = Math.random() * W;
                        particle.y = -30;
                        particle.tilt = Math.floor(Math.random() * 10) - 20;
                    }
                }
                return results;
            }

            window.addEventListener("resize", function() {
                W = window.innerWidth;
                H = window.innerHeight;
                canvas.width = W;
                canvas.height = H;
            });

            for (let i = 0; i < maxConfettis; i++) {
                particles.push(new confettiParticle());
            }

            canvas.width = W;
            canvas.height = H;

            function showSuccessPopup(nextLevel) {
                const modal = document.getElementById("successModal");
                const successMessage = document.getElementById("successMessage");
                const nextBtn = document.getElementById("nextBtn");

                if (modal && successMessage && nextBtn) {
                    successMessage.textContent = `You've passed Level ${nextLevel - 1}`;
                    modal.style.display = "flex";
                    Draw();

                    nextBtn.onclick = function() {
                        modal.style.display = "none";
                        window.location.href = `Level${nextLevel}.html`;
                    };
                }
            }

            function showCompletionPopup() {
                const modal = document.getElementById("completionModal");
                const homeBtn = document.getElementById("homeBtn");

                if (modal && homeBtn) {
                    modal.style.display = "flex";
                    Draw();

                    homeBtn.onclick = function() {
                        modal.style.display = "none";
                        sessionStorage.setItem('currentLevel', 1);
                        window.location.href = "home.html";
                    };
                }
            }
        } else {
            console.error("User is not authenticated.");
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const levelButton = document.getElementById("level-button");
    const closeLevelButton = document.getElementById("close-level-button");
    const popupBar = document.getElementById("popup");

    if (levelButton && closeLevelButton && popupBar) {
        levelButton.addEventListener("click", function() {
            popupBar.classList.toggle("level-bg-hidden");
            popupBar.classList.toggle("level-bg");
        });

        closeLevelButton.addEventListener("click", function() {
            popupBar.classList.toggle("level-bg");
            popupBar.classList.toggle("level-bg-hidden");
        });
    }

    let currentLevel = parseInt(sessionStorage.getItem('currentLevel')) || 1;

    for (let i = 1; i <= currentLevel; i++) {
        const levelButton = document.getElementById(`level${i}`);
        if (levelButton) {
            levelButton.disabled = false;
        }
    }

    const level1Button = document.getElementById('level1');
    const level2Button = document.getElementById('level2');
    const level3Button = document.getElementById('level3');

    if (level1Button) {
        level1Button.addEventListener('click', function() {
            window.location.href = 'Level1.html';
        });
    }

    if (level2Button) {
        level2Button.addEventListener('click', function() {
            if (currentLevel >= 3) {
                window.location.href = 'Level2.html';
            }
        });
    }

    if (level3Button) {
        level3Button.addEventListener('click', function() {
            if (currentLevel >= 4) {
                window.location.href = 'Level3.html';
            }
        });
    }

    const modal = document.getElementById('levelModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementsByClassName('close')[0];

    if (modal && openModalBtn && closeBtn) {
        openModalBtn.onclick = function() {
            modal.style.display = 'flex';
        }

        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    }
});