import MovingDirection from "./MovingDirection.js";

export default class Cursor {
    constructor(x, y, tileSize, velocity, tileMap){
        this.x= x;
        this.y=y;
        this.tileSize=tileSize;
        this.velocity=velocity;
        this.tileMap = tileMap;

        this.currentMovingDirection=null;
        this.requestedMovingDirection=null;

        this.cursorRotation = this.Rotation.right;
        this.wakaSound = new Audio("../sounds/cursorWakaWaka.mp3");

        this.powerDotSound = new Audio("../sounds/cursorEatingCherry.mp3");
        this.powerDotActive = false; 
        this.powerDotAboutToExpire = false;
        this.timers = [];
    
        this.madeFirstMove = false;

        document.addEventListener("keydown", this.#keydown)
       
        this.#loadCursorImages();
    }
    
   Rotation = { 
    right:1,
    down:2,
    left:3,
    up:4
   };

draw(ctx, pause, enemies){
    if(!pause){
    this.#move();
    }
    this.#eatDot();
    this.#eatPowerDot();
    this.#eatVirus(enemies);

    const size= this.tileSize/2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.cursorRotation * 90 * Math.PI)/180);
    ctx.drawImage(this.cursorImages[this.cursorImageIndex], -size, -size, this.tileSize, this.tileSize);
    ctx.restore();
    //ctx.drawImage(this.cursorImages[this.cursorImageIndex], this.x, this.y, this.tileSize, this.tileSize);
}

#loadCursorImages(){
    const cursorImage1= new Image();
    cursorImage1.src = "../images/cursor png.jpg";
    
    const cursorImage4 = new Image();
    cursorImage4.src = "../images/cursor png.jpg"

    this.cursorImages = [cursorImage1, cursorImage4];

    this.cursorImageIndex = 0;
}

#keydown=(event)=>{
    //up
    if(event.keyCode==38){
        if(this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
        this.requestedMovingDirection = MovingDirection.up;
        this.madeFirstMove = true;
    }
    //down
    if(event.keyCode==40){
        if(this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
        this.requestedMovingDirection = MovingDirection.down;
        this.madeFirstMove = true;
    }
    //left
    if(event.keyCode==37){
        if(this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
        this.requestedMovingDirection = MovingDirection.left;
        this.madeFirstMove = true;
    }
    //right
    if(event.keyCode==39){
        if(this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
        this.requestedMovingDirection = MovingDirection.right;
        this.madeFirstMove = true;
    }
}

#move(){
    if(this.currentMovingDirection !== this.requestedMovingDirection){
        if(Number.isInteger(this.x/this.tileSize) &&
         Number.isInteger(this.y/this.tileSize)){
            if(!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.requestedMovingDirection)){

            }
            this.currentMovingDirection=this.requestedMovingDirection;
         }
    }

    if(this.tileMap.didCollideWithEnvironment(this.x, this.y, this.currentMovingDirection))
{
    this.cursorImageIndex = 1;
    return;
}else if (
    this.currentMovingDirection != null) {
    this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
  }  //

switch(this.currentMovingDirection){
        case MovingDirection.up:
        this.y -= this.velocity;
        this.cursorRotation = this.Rotation.up;
        break;
        case MovingDirection.down:
        this.y += this.velocity;
        this.cursorRotation = this.Rotation.down;
        break;
        case MovingDirection.left:
        this.x -= this.velocity;
        this.cursorRotation=this.Rotation.left;
        break;
        case MovingDirection.right:
        this.x += this.velocity;
        this.cursorRotation=this.Rotation.right;
        break;
        
    }
}

#eatDot(){
    if(this.tileMap.eatDot(this.x, this.y)&& this.madeFirstMove){
    this.wakaSound.play();
    } 
}
#eatPowerDot(){
    if(this.tileMap.eatPowerDot(this.x, this.y)){
        this.powerDotSound.play();
        this.powerDotActive = true;
        this.powerDotAboutToExpire = false;
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers=[];

        let powerDotTimer = setTimeout(()=>{
            this.powerDotActive = false;
            this.powerDotAboutToExpire=false;
        }, 1000*6)

        this.timers.push(powerDotTimer);

        let powerDotAboutToExpireTimer = setTimeout(()=> {
            this.powerDotAboutToExpire = true;
        }, 1000*3);

        this.timers.push(powerDotAboutToExpireTimer);
        }
}
#eatVirus(enemies) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
      });
    }
  }
}