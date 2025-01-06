import TileMap from "./TileMap.js";

const tileSize=32;
const velocity  = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap=new TileMap(tileSize);
const cursor = tileMap.getCursor(velocity);
const enemies = tileMap.getEnemies(velocity);

function gameLoop(){
tileMap.draw(ctx);
cursor.draw(ctx);
enemies.forEach((enemy) => enemy.draw(ctx, pause(), cursor));
        
const ateDot = tileMap.eatDot(cursor.x, cursor.y);
    if (ateDot) {
        // Redraw the tile map to show the eaten dot
        tileMap.draw(ctx);
    }

}

function pause(){
   return !cursor.madeFirstMove;
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000/75);