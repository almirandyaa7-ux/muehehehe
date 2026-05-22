let currentLvl1Question = 0;
let bucketClicks = 0;
const targetClicks = 5;

const quizData = [
  { q: "Aira's favorite color (combination) is...?", options: ["blue + purple💙💜", "blue + yellow💙💛", "blue + red💙❤️"], correct: 1 },
  { q: "What does she think about Aan?", options: ["he is kawaii anime girl", "he likes to emote", "both is correct"], correct: 2 },
  { q: "What thing she can't tolerate?", options: ["cats slander", "bad design", "freaks"], correct: 0 },
  { q: "What part of classical mechanics is her fav?", options: ["projectile motion", "oscillation", "rigid body dynamics"], correct: 2 },
  { q: "Last question : Who is wearing the crown today? :> ", options: ["the b'day boy", "of course its Aira", "All is correct✨"], correct: 1 }
];

function nextScreen(fromId, toId) {
  document.getElementById(fromId).classList.remove('active');
  document.getElementById(toId).classList.add('active');
}

function startLevel(lvl) {
  nextScreen('screen-taman', `screen-lvl${lvl}`);
  if (lvl === 1) {
    currentLvl1Question = 0;
    loadQuizQuestion();
  } else if (lvl === 2) {
    bucketClicks = 0;
    document.getElementById('click-target').innerText = targetClicks;
    moveBucket();
  }
}

function loadQuizQuestion() {
  const data = quizData[currentLvl1Question];
  document.getElementById('quiz-question').innerText = data.q;
  const buttons = document.querySelectorAll('.quiz-options .option-btn');
  buttons.forEach((btn, index) => {
    btn.innerText = data.options[index];
  });
}

function checkAnswer(selectedIndex) {
  if (selectedIndex === quizData[currentLvl1Question].correct) {
    currentLvl1Question++;
    if (currentLvl1Question < quizData.length) {
      alert("huh? you are quite good at this. fine, here is your light ☀️");
      loadQuizQuestion();
    } else {
      alert("wohoo! the flower can sense it! ☀️");
      unlockLevel(2, "🌿", "status: its begin to grow thanks to sunlight!");
    }
  } else {
    alert("you get it wrong? i can't believe this >:(");
  }
}

function moveBucket() {
  const bucket = document.getElementById('moving-bucket');
  const gameArea = document.querySelector('.game-area');
  
  const maxX = gameArea.clientWidth - bucket.clientWidth;
  const maxY = gameArea.clientHeight - bucket.clientHeight;
  
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  
  bucket.style.left = `${randomX}px`;
  bucket.style.top = `${randomY}px`;
}

function catchBucket() {
  bucketClicks++;
  document.getElementById('click-target').innerText = targetClicks - bucketClicks;
  
  if (bucketClicks < targetClicks) {
    moveBucket();
  } else {
    alert("muehehe noice, it's H2O for you 💧");
    unlockLevel(3, "💮", "status: the flower buds are starting to appear!");
  }
}

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewBox = document.getElementById('preview-box');
      previewBox.style.backgroundImage = `url('${e.target.result}')`;
      previewBox.innerText = "";
      document.getElementById('btn-submit-photo').disabled = false;
    }
    reader.readAsDataURL(file);
  }
}

// Paste URL Aplikasi Web (Web App URL) dari Apps Script kamu di bawah ini!
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbycWH0oCnk4LUncn8zj4Fr762h0NXvzwudWZkbwMKu2BouhljXfbqXoaFLLoW5y4eHy/exec";

function submitPhoto() {
  const fileInput = document.getElementById('photo-input');
  const file = fileInput.files[0];
  const inputNama = document.getElementById('input-nama').value.trim() || "Aan";

  if (!file) {
    alert("Nuh uh you can't skip>:(");
    return;
  }

  alert("sending to Aira...");

  const reader = new FileReader();
  reader.onload = function(e) {
    const payload = {
      fileName: `Memori_${inputNama}_${Date.now()}.png`,
      mimeType: file.type,
      fileData: e.target.result,
      uploaderName: inputNama
    };

    fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      if(data.status === "success") {
        alert("muehehehe thank you :3");
        
        nextScreen('screen-lvl3', 'screen-taman');
        
        const pot = document.getElementById('plant-pot');
        pot.innerText = "💫";
        pot.classList.add('grow-animation');
        document.getElementById('plant-status').innerText = "status : the flower has bloomed!";
        
        document.querySelector('.level-grid').style.display = 'none';
        document.getElementById('btn-siram').style.display = 'block';
      } else {
        alert("Uh oh, something is wrong. Try again!");
        console.error(data.message);
      }
    })
    .catch(error => {
      alert("Try again!");
      console.error(error);
    });
  };
  
  reader.readAsDataURL(file);
}

function unlockLevel(nextLvlNum, plantEmoji, statusText) {
  nextScreen(`screen-lvl${nextLvlNum - 1}`, 'screen-taman');
  
  const targetBtn = document.getElementById(`btn-lvl${nextLvlNum}`);
  targetBtn.disabled = false;
  if(nextLvlNum === 2) targetBtn.innerHTML = `<span class="icon">💧</span> go for the H2O`;
  if(nextLvlNum === 3) targetBtn.innerHTML = `<span class="icon">💩</span> a 'fertilizer' to make it live`;

  const pot = document.getElementById('plant-pot');
  pot.innerText = plantEmoji;
  pot.classList.add('grow-animation');
  setTimeout(() => pot.classList.remove('grow-animation'), 600);

  document.getElementById('plant-status').innerText = statusText;
}

function siramTanaman() {
  const pot = document.getElementById('plant-pot');
  pot.innerText = "✨🌼✨"; 
  pot.classList.add('grow-animation');
  document.getElementById('plant-status').innerText = "status: the flower has bloomed beautifully 💛";
  
  setTimeout(() => {
    nextScreen('screen-taman', 'screen-reward');
    document.getElementById('main-video').play();
  }, 2000); 
}

function kembaliKeTaman() {
  document.getElementById('main-video').pause();
  nextScreen('screen-reward', 'screen-taman');
}

// ==================== CODES YANG SUDAH DIPERBAIKI SANGAT BERSIH ====================

function validasiNama() {
  const inputNamaElement = document.getElementById('input-nama'); 
  const inputNama = inputNamaElement ? inputNamaElement.value.trim().toLowerCase() : "";
  const textElement = document.getElementById('welcome-text');
  const buttonElement = document.querySelector('#screen-welcome .btn');
  const characterImg = document.getElementById('character-img');

  if (inputNama === "") {
    alert("who are you hey >:(");
    return;
  }

  // 1. Ganti teks sambutan ucapan
  if (inputNama === "aan") {
    textElement.innerHTML = "<strong>Elow Aan :D</strong><br>I have a seed. Will you help me to grow it? Wait, i mean, you should do that D:<";
  } else {
    textElement.innerHTML = "<strong>No, no, i know you're Aan >:D</strong><br>Heh, you can't trick me. As a penalty, you have to help me grow my flower>:D";
  }

  // 2. Ganti gambar karakter jadi 'yah.png' secara halus
  if (characterImg) {
    characterImg.style.opacity = 0;
    setTimeout(() => {
      characterImg.src = "yah.png"; 
      characterImg.style.opacity = 1;
    }, 300);
  }

  // 3. Pancing musik otomatis menyala pas klik tombol ini (Biar nembus aturan browser!)
  const music = document.getElementById('bg-music');
  if (music && !isMusicPlaying) {
    toggleMusic();
  }

  // 4. Setel tombol ke halaman taman halaman belakang
  if (buttonElement) {
    buttonElement.innerText = "Enter the Backyard ✨";
    buttonElement.setAttribute("onclick", "nextScreen('screen-welcome', 'screen-taman')");
  }
}

let isMusicPlaying = false;

function toggleMusic() {
  const music = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');

  if (!music) return;

  if (!isMusicPlaying) {
    music.play().then(() => {
      isMusicPlaying = true;
      icon.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; 
      btn.classList.add('rotate-music');
    }).catch(err => {
      console.log("Autoplay diblokir browser, diputar manual via klik:", err);
    });
  } else {
    music.pause();
    isMusicPlaying = false;
    icon.innerHTML = '<i class="fa-solid fa-music"></i>'; 
    btn.classList.remove('rotate-music');
  }
}