var audio = new Audio("Theme.wav");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
class Rect{
	x = 0;
	y = 0;
	width = 64;
	height = 64;
}
function checkCollision(rect1, rect2)
{
	return (
	rect1.x<rect2.x+rect2.width&&
	rect1.x+rect1.width>rect2.x&&
	rect1.y<rect2.y+rect2.height&&
	rect1.y+rect1.height>rect2.y);
}
function spawnBlock()
{
	block.gapY = Math.random() * (canvas.height-block.gapHeight);
	block.top.y = block.gapY - block.top.height;
	if(score>=blockSpawningStart)block.middle.y = block.gapY;
	block.bottom.y = block.gapY + block.gapHeight;
	block.top.x = canvas.width;
	block.middle.x = canvas.width;
	block.bottom.x = canvas.width;
	
	pointAdded = false;
}

var jumpPressed = false;
var shootPressed = false;


document.addEventListener("keydown", function(event){
	if(event.key=="Enter"&&(gameOver||!gameStarted))
	{
		gameOver = false;
		score = 0;
		block.moveSpd = 10;
		block.middle.y=999999;
		gameStarted = true;
		spawnBlock();
		audio.play();
		audio.loop = true;
		audio.currentTime = 0;
	}
	if(event.key==" ")jumpPressed = true;
	if(event.key=="Shift"&&score >= blockSpawningStart)shootPressed = true;
});
document.addEventListener("keyup", function(){
	if(event.key==" ")jumpPressed = false;
	if(event.key=="Shift")shootPressed = false;
});

var player = {hitbox:new Rect()}
var bullet = 
{
	hitbox:new Rect(),
	speed:20
}
player.hitbox.x = canvas.width/4;
player.hitbox.y = canvas.height/2;
bullet.hitbox.width = 10;
bullet.hitbox.height = 10;
bullet.hitbox.y = 999999;

var score = 0;
var blockSpawningStart = 10;
var speedUpInterval = 10;
var amountSpedUp = 1;

var pointAdded = false;
var gameStarted=false;
var gameOver = false;

var block = 
{
	moveSpd:10,
	gapY:0,
	gapHeight:256,
	top: new Rect(),
	middle: new Rect(),
	bottom: new Rect()
}
block.gapY = Math.random() * canvas.height-block.gapHeight;
block.top.y = block.gapY - canvas.height;
block.top.x = canvas.width;
block.top.height = canvas.height;
block.top.width = 128;
block.bottom.y = block.gapY + block.gapHeight;
block.bottom.x = canvas.width;
block.bottom.height = canvas.height;
block.bottom.width = 128;
block.middle.x = canvas.width;
block.middle.y = 999999;
block.middle.height = block.gapHeight;
block.middle.width = block.top.width;

function update()
{
	if(jumpPressed&&player.hitbox.y>0) player.hitbox.y-=5;
	if(!jumpPressed&&player.hitbox.y+player.hitbox.height<canvas.height) player.hitbox.y+=5;

	if(shootPressed&&bullet.hitbox.y>=999999)
	{
		bullet.hitbox.x = player.hitbox.x+player.hitbox.height/2;
		bullet.hitbox.y = player.hitbox.y;
	}
	
	//Move Block
	for(var i = 0; i<block.moveSpd;i++)
	{
		block.top.x--;
		block.bottom.x--;
		block.middle.x--;
		if(checkCollision(player.hitbox,block.top)||checkCollision(player.hitbox,block.bottom)||checkCollision(player.hitbox,block.middle))
		{
			block.top.x++;
			block.bottom.x++;
			block.middle.x++;
 			gameOver = true;
			audio.pause();
		}
	}
	//Move bullet
	for(var b = 0; b<bullet.speed;b++)
	{
		bullet.hitbox.x++;
		if(checkCollision(bullet.hitbox,block.top)||checkCollision(bullet.hitbox,block.bottom)||checkCollision(bullet.hitbox,block.middle)||bullet.hitbox.x>canvas.width)
		{
			if(checkCollision(bullet.hitbox,block.middle)) block.middle.y = 999999;
			bullet.hitbox.y = 999999;
		}
	}

	if(block.top.x+block.top.width<=player.hitbox.x&&!pointAdded)
	{
		score++;
		if(score>blockSpawningStart &&score%speedUpInterval==0)
		{
			block.moveSpd+=amountSpedUp;
		}
		pointAdded = true;
	}
	//spawn block
	if(block.top.x+block.top.width<=0)spawnBlock();
}

function draw()
{	
	//background
	ctx.fillStyle = "#FF7f27"
	ctx.fillRect(0,0,canvas.width,canvas.height/2-32)
	for(var i = 0;i<canvas.width+64;i+=64)ctx.drawImage(document.getElementById("sky"),i,canvas.height/2-32,64,64)
	ctx.fillStyle = "#FFAEC9"
	ctx.fillRect(0,canvas.height/2+32,canvas.width,canvas.height/2-32)

	//player
	ctx.drawImage(document.getElementById("player"),player.hitbox.x,player.hitbox.y,player.hitbox.width,player.hitbox.height);

	//bullet
	ctx.fillStyle = "#FFFF00";
	ctx.fillRect(bullet.hitbox.x,bullet.hitbox.y,bullet.hitbox.width,bullet.hitbox.height);
	
	//block
	ctx.drawImage(document.getElementById("pipes"),block.top.x,block.top.y,block.top.width,block.top.height);
	ctx.drawImage(document.getElementById("pipes"),block.bottom.x,block.bottom.y,block.bottom.width,block.bottom.height);
	ctx.drawImage(document.getElementById("glass"),block.middle.x,block.middle.y,block.middle.width,block.middle.height);

	//score
	ctx.fillStyle = "#000000";
	ctx.font = "64px serif";
	ctx.fillText(score,canvas.width/2-64,100,128)
	
	//begin
	if(!gameStarted)
	{
		ctx.fillStyle = "#000000";
		ctx.font = "64px serif";
		ctx.fillText("Press ENTER to begin!",canvas.width/2-300,canvas.height/2)
	}
	if(score==0&&gameStarted&&!gameOver)
	{
		ctx.fillStyle = "#000000";
		ctx.font = "64px serif";
		ctx.fillText("Press SPACE to jump!",canvas.width/2-300,canvas.height/2)
	}
	if(score>blockSpawningStart &&score%speedUpInterval==0&&gameStarted&&!gameOver)
	{
		ctx.fillStyle = "#000000";
		ctx.font = "64px serif";
		ctx.fillText("SPEED UP!",canvas.width/2-200,canvas.height/2)
	}

	//SHOOT
	
	if(score == blockSpawningStart&&!gameOver)
	{
		ctx.fillStyle = "#000000";
		ctx.font = "64px serif";
		ctx.fillText("Press SHIFT to shoot!",canvas.width/2-300,canvas.height/2)
	}
	
	//end
	if(gameOver)
	{
		ctx.fillStyle = "#000000";
		ctx.font = "64px serif";
		ctx.fillText("Game Over! Press ENTER to restart!",canvas.width/2-450,canvas.height/2)
	}
}

draw();
setInterval(function(){
	if(!gameOver&&gameStarted) 
	{
		update();
		draw();
	}
}, 16);