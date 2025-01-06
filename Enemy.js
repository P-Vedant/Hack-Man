import MovingDirection from "./MovingDirection.js";

export default class Enemy{

    constructor(x, y, tileSize, velocity, tileMap){
        this.x=x;
        this.y=y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap=tileMap;

        this.#loadImages();

        this.moveDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);

        this.directionTimerDefault=this.#random(10, 25);
        this.directionTimer = this.directionTimerDefault;

        this.scaredAboutToExpireTimerDefault = 10;
        this.scaredAboutToExpireTimerDefault = this.scaredAboutToExpireTimerDefault;
    }

    draw(ctx, pause, cursor){
        if(!pause){
            this.#move();
            this.#changeDirection();
        }
        this.#setImage(ctx, cursor);
       
    }

    collideWith(cursor){
        const size = this.tileSize / 2;
    
        if(this.x < cursor.x + size && this.x + size > cursor.x && this.y < cursor.y +size && this.y + size > cursor.y){
            return true;
        }
        else{
            return false;
        }
    }

    #setImage(ctx, cursor) {
        if (cursor.powerDotActive) {
          this.#setImageWhenPowerDotIsActive(cursor);
        } else {
          this.image = this.normalVirus;
        }
        ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
      }

      #setImageWhenPowerDotIsActive(cursor){
        if(cursor.powerDotActiveExpire){
            this.scaredAboutToExpireTimer--;
            if(this.scaredAboutToExpireTimer === 0){
                this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
                if(this.image === this.scaredVirus){
                    this.image =this.scaredVirus2;
                }
                else{
                    this.image = this.scaredVirus;
                }
            }
        }
        else{
            this.image =this.scaredVirus
        }
      }

    #changeDirection() {
        this.directionTimer--;
        let newMoveDirection = null;
        if (this.directionTimer == 0) {
          this.directionTimer = this.directionTimerDefault;
          newMoveDirection = Math.floor(
            Math.random() * Object.keys(MovingDirection).length
          );
        }
    
        if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
          if (
            Number.isInteger(this.x / this.tileSize) &&
            Number.isInteger(this.y / this.tileSize)
          ) {
            if (
              !this.tileMap.didCollideWithEnvironment(
                this.x,
                this.y,
                newMoveDirection
              )
            ) {
              this.movingDirection = newMoveDirection;
            }
          }
        }
      }

      #move() {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.movingDirection
          )
        ) {
          switch (this.movingDirection) {
            case MovingDirection.up:
              this.y -= this.velocity;
              break;
            case MovingDirection.down:
              this.y += this.velocity;
              break;
            case MovingDirection.left:
              this.x -= this.velocity;
              break;
            case MovingDirection.right:
              this.x += this.velocity;
              break;
          }
        }
      }

    #random(min, max){
        return Math.floor(Math.random()*(max - min +1)) + min;
    }

    #loadImages(){
        this.normalVirus = new Image();
        this.normalVirus.src= '../images/enemy.jpg';

        this.scaredVirus = new Image();
        this.scaredVirus.src = '../images/scaredVirus.png';

        this.scaredVirus2 = new Image();
        this.scaredVirus2.src = '../images/scaredVirus2.png';
        
        this.image = this.normalVirus;
    }

}

