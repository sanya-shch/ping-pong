const cnv = document.getElementById("playing-field");
const ctx = cnv.getContext('2d');

let soundHit = new Audio();
let soundWall = new Audio();
let soundScore = new Audio();

soundHit.src = "sounds/hit.mp3";
soundWall.src = "sounds/wall.mp3";
soundScore.src = "sounds/score.mp3";

const ball = {
    x : cnv.width/2,
    y : cnv.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
};

const user = {
    x : 0,
    y : (cnv.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
};

const com = {
    x : cnv.width - 10,
    y : (cnv.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
};

const net = {
    x : (cnv.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
};

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

cnv.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = cnv.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

function resetBall(){
    ball.x = cnv.width/2;
    ball.y = cnv.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function drawNet(){
    for(let i = 0; i <= cnv.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(){
    if( ball.x - ball.radius < 0 ){
        com.score++;
        soundScore.play();
        resetBall();
    }else if( ball.x + ball.radius > cnv.width){
        user.score++;
        soundScore.play();
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    com.y += ((ball.y - (com.y + com.height/2)))*0.1;

    if(ball.y - ball.radius < 0 || ball.y + ball.radius > cnv.height){
        ball.velocityY = -ball.velocityY;
        soundWall.play();
    }

    let player = (ball.x + ball.radius < cnv.width/2) ? user : com;

    if(collision(ball,player)){
        soundHit.play();
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);

        let angleRad = (Math.PI/4) * collidePoint;

        let direction = (ball.x + ball.radius < cnv.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
    }
}

function render(){
    drawRect(0, 0, cnv.width, cnv.height, "#000");

    drawText(user.score,cnv.width/4,cnv.height/5);

    drawText(com.score,3*cnv.width/4,cnv.height/5);

    drawNet();

    drawRect(user.x, user.y, user.width, user.height, user.color);

    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
    update();
    render();
}

const fps = 50;
setInterval(game,1000/fps);