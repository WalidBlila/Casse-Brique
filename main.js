//Audio
// var myAudio = document.createElement("audio");
// myAudio.src = "mysprite.mp3";
// myAudio.play();
// myAudio.pause();

// let mainSong = new Audio('audio/mainsound_hipjazz.mp3')

var audio = new Audio('audio/audio1.mp3audio1.mp3');
audio.play();


// Création canvas
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 400;

// // Insérer image
// let spaceImg = document.createElement('img');
// spaceImg.src = "https://i.pinimg.com/originals/40/d9/35/40d93575782911578362a40784b39e2d.jpg'";

// spaceImg.onload = function () {
//   ctx.drawImage(spaceImg, 0,0, 100,100/1,77)//1922 * 1082

// }

// Intégration plateforme
let plateforme = {
  width: 130,
  height: 10,
  x: 0,
  y: 0
};
plateforme.x = (canvas.width - plateforme.width) / 2;
plateforme.y = canvas.height - plateforme.height * 2;

// Intégration balle
let ball = {
  radius: 30,
  x: canvas.width / 2,
  y: canvas.height - 50,
  speed: 1,
  dx: 3,
  dy: -4
};

// Intégrer vies et score
let lives = 3;
let score = 0;
let numBricks = 0;


// Intégration briques
let rowCount = 5;
let colCount = 12;
let offsetTop = 30;
let offsetLeft = 15;
let colors = ["red", "orange", "lime", "blue","violet"]
let bricks = []
for (let c = 0; c < colCount; c++) {
  bricks[c] = []
  for (let r = 0; r < rowCount; r++) {
    let brick = {
      width:  100,
      height: 20,
      padding: 5,
      x: 0,
      y: 0,
      color: colors[r],
      status: 1
    };
    bricks[c][r] = brick;
    numBricks += 1;
  }
}


// Intégrations key listeners
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Rafraichissement toute les 5 ms
setInterval(updateGame, 5);

// Dessiner plateforme
function drawPlateforme() {
  ctx.beginPath();
  ctx.rect(plateforme.x, plateforme.y, plateforme.width, plateforme.height);
  ctx.fillStyle = "#3335FF";
  ctx.fill();
  ctx.closePath;
}

// Dessiner balle
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#33FFC9";
  ctx.fill();
  ctx.closePath();
}

// Dessiner briques
function drawBricks() {
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let brick = bricks[c][r];
      if (brick.status == 1) {
        brick.x = (c * (brick.width + brick.padding)) + offsetLeft;
        brick.y = (r * (brick.height + brick.padding)) + offsetTop;

        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = brick.color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Détection des collissions
function collision() {
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let brick = bricks[c][r];
      if (brick.status == 1) {
        if (ball.x + ball.radius > brick.x && ball.x - ball.radius < brick.x + brick.width && ball.y + ball.radius > brick.y && ball.y - ball.radius < brick.y + brick.height) {
          ball.dy *= -1;
          brick.status = 0;
          score += 1;
          numBricks -= 1;
          console.log(numBricks);
          if (numBricks == 0) {
            alert("You Won!");
            ball.dx = 0;
            ball.dy = 0;
          }
        }
      }
    }
  }
}

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

// MAJ Game
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPlateforme();

  // Rebond sur les bords et plateforme
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx *= -1;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy *= -1;
  } else if (ball.y + ball.dy > plateforme.y - ball.radius) {
    if (ball.x + ball.radius > plateforme.x && ball.x - ball.radius < plateforme.x + plateforme.width) {
      // Calcul angle de la balle depuis ou elle touche la plateforme
      let angle = (Math.PI / 2) * (plateforme.x + (plateforme.width / 2) - ball.x) / (plateforme.width / 2);
      ball.dx = -1 * (Math.sin(angle) * ball.speed);
      ball.dy = -1 * (Math.cos(angle) + ball.speed);
    } else {
      lives -= 1;
      reset();
      if (lives < 1) {
        alert("Game Over!")
        ball.dx = 0;
        ball.dy = 0
      }
    }
  }

  // MAJ plateforme
  if (rightPressed && plateforme.x < canvas.width - plateforme.width) {
    plateforme.x += 7;
  } else if (leftPressed && plateforme.x > 0) {
    plateforme.x -= 7;
  }

  // MAJ position balle
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Reset
function reset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 50;
  ball.dx = 3;
  ball.dy = -4;

  paddle.x = (canvas.width - paddle.width) / 2;
  paddle.y = canvas.height - paddle.height * 2;
}
  
  
  collision();
}
