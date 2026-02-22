// Global p5 overrides
window.setup = setupGame;
window.setupGame = setupGame;
window.draw = drawGame;
window.mousePressed = mousePressed;
window.keyPressed = keyPressed;
window.windowResized = windowResized;

let activeGame = null;
let menuParticles = [];

function setupGame() {
  let container = document.getElementById('game-canvas-container');
  if (!container) {
    let canvas = createCanvas(1, 1);
    canvas.style('display', 'none');
    noLoop();
    return;
  }
  
  // Ensure we have valid dimensions, fallback to window size
  let w = container.clientWidth || window.innerWidth;
  let h = container.clientHeight || window.innerHeight;
  
  // Double check dimensions are not zero
  if (w === 0) w = window.innerWidth;
  if (h === 0) h = window.innerHeight;

  let canvas = createCanvas(w, h);
  canvas.parent('game-canvas-container');
  canvas.style('display', 'block');
  
  activeGame = null;
  menuParticles = [];
  background(20); // Draw background immediately
  drawMainMenu(); // Force menu draw
  loop();
}

function drawGame() {
  if (!document.getElementById('game-canvas-container')) return;
  background(20);
  if (activeGame) {
    activeGame.update();
    activeGame.draw();
  } else {
    drawMainMenu();
  }
}

function getHighScore(key) {
    try {
        return localStorage.getItem(key) || 0;
    } catch (e) {
        return 0;
    }
}

function drawMainMenu() {
  if (mouseX !== 0 || mouseY !== 0) {
    menuParticles.push(new MenuParticle(mouseX, mouseY));
    menuParticles.push(new MenuParticle(mouseX, mouseY));
  }
  for (let i = menuParticles.length - 1; i >= 0; i--) {
    menuParticles[i].update();
    menuParticles[i].show();
    if (menuParticles[i].finished()) menuParticles.splice(i, 1);
  }

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  noStroke();
  textSize(40);
  text("Select a Game", width / 2, height / 4);

  drawButton("Bug Catcher", width/2, height/2 - 60, () => startGame('BUG'));
  drawButton("Snake", width/2, height/2 + 20, () => startGame('SNAKE'));
  drawButton("Tetris", width/2, height/2 + 100, () => startGame('TETRIS'));
  
  textSize(14); fill(150);
  text(`High Score: ${getHighScore('hs_bug')}`, width/2, height/2 - 25);
  text(`High Score: ${getHighScore('hs_snake')}`, width/2, height/2 + 55);
  text(`High Score: ${getHighScore('hs_tetris')}`, width/2, height/2 + 135);
  pop();
}

function drawButton(label, x, y, action) {
  let w = 200;
  let h = 50;
  let isHover = mouseX > x - w/2 && mouseX < x + w/2 && mouseY > y - h/2 && mouseY < y + h/2;
  
  fill(isHover ? color(0, 255, 100) : 50);
  stroke(255);
  rect(x - w/2, y - h/2, w, h, 10);
  
  fill(255);
  noStroke();
  textSize(20);
  text(label, x, y);
}

function mousePressed() {
    if (!document.getElementById('game-canvas-container')) return;

    if (!activeGame) {
        let w = 200; let h = 50;
        let x = width/2;
        
        if (checkClick(x, height/2 - 60, w, h)) startGame('BUG');
        else if (checkClick(x, height/2 + 20, w, h)) startGame('SNAKE');
        else if (checkClick(x, height/2 + 100, w, h)) startGame('TETRIS');
    } else {
        activeGame.mousePressed();
    }
}

function checkClick(x, y, w, h) {
    return mouseX > x - w/2 && mouseX < x + w/2 && mouseY > y - h/2 && mouseY < y + h/2;
}

function keyPressed() {
    if (activeGame) {
        activeGame.keyPressed(keyCode);
    } else {
        if (keyCode === 27 && window.closeEasterEgg) window.closeEasterEgg();
    }
}

function windowResized() {
  let container = document.getElementById('game-canvas-container');
  if (container) {
    resizeCanvas(container.offsetWidth, container.offsetHeight);
    if (activeGame && activeGame.onResize) activeGame.onResize();
  }
}

function startGame(type) {
    if (type === 'BUG') activeGame = new BugCatcherGame();
    if (type === 'SNAKE') activeGame = new SnakeGame();
    if (type === 'TETRIS') activeGame = new TetrisGame();
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    
    if (type === 'collect') {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
    }
}

// --- Game Classes ---

class BugCatcherGame {
    constructor() {
        this.player = new Player();
        this.items = [];
        this.score = 0;
        this.state = 'START'; // START, PLAYING, GAMEOVER
        this.difficulty = 'MEDIUM';
        this.difficulties = {
            EASY: { spawnRate: 20, minSpeed: 6, maxSpeed: 12 },
            MEDIUM: { spawnRate: 15, minSpeed: 8, maxSpeed: 16 },
            HARD: { spawnRate: 5, minSpeed: 10, maxSpeed: 20 }
        };
    }

    update() {
        if (this.state === 'PLAYING') {
            this.player.update();
            let settings = this.difficulties[this.difficulty];
            if (frameCount % settings.spawnRate == 0) {
                this.items.push(new Item(settings.minSpeed, settings.maxSpeed));
            }
            for (let i = this.items.length - 1; i >= 0; i--) {
                this.items[i].update();
                if (this.player.hits(this.items[i])) {
                    this.score += this.items[i].points;
                    if (this.items[i].points > 0) playSound('collect');
                    else playSound('gameover'); 
                    
                    if (this.score < 0) {
                        this.gameOver();
                    }
                    this.items.splice(i, 1);
                } else if (this.items[i].offscreen()) {
                    this.items.splice(i, 1);
                }
            }
        }
    }

    draw() {
        if (this.state === 'START') {
            this.drawStart();
        } else if (this.state === 'PLAYING') {
            this.player.show();
            this.items.forEach(i => i.show());
            fill(255); textSize(24); textAlign(LEFT, TOP);
            text(`Score: ${this.score}`, 10, 10);
            textAlign(RIGHT, TOP);
            text("Back to Menu (ESC)", width - 10, 10);
        } else {
            this.drawGameOver();
        }
    }

    drawStart() {
        fill(255); textAlign(CENTER, CENTER); textSize(30);
        text("Select Difficulty", width/2, height/4);
        let y = height/2 - 50;
        this.drawBtn("Easy", width/2, y, color(0,255,100));
        this.drawBtn("Medium", width/2, y+70, color(255,200,0));
        this.drawBtn("Hard", width/2, y+140, color(255,50,50));
    }

    gameOver() {
        this.state = 'GAMEOVER';
        playSound('gameover');
        let hs = parseInt(localStorage.getItem('hs_bug')) || 0;
        if (this.score > hs) localStorage.setItem('hs_bug', Math.max(0, this.score));
    }

    drawGameOver() {
        fill(255); textAlign(CENTER, CENTER); textSize(32);
        text('Game Over', width/2, height/2 - 20);
        textSize(16); text(`Final Score: ${this.score}`, width/2, height/2 + 20);
        text('Click to Restart', width/2, height/2 + 50);
        text('Press ESC for Menu', width/2, height/2 + 80);
    }

    drawBtn(label, x, y, col) {
        let w = 200; let h = 50;
        fill(col); rect(x-w/2, y-h/2, w, h, 10);
        fill(0); textSize(24); text(label, x, y);
    }

    mousePressed() {
        if (this.state === 'START') {
            let x = width/2; let y = height/2 - 50;
            if (checkClick(x, y, 200, 50)) this.start('EASY');
            if (checkClick(x, y+70, 200, 50)) this.start('MEDIUM');
            if (checkClick(x, y+140, 200, 50)) this.start('HARD');
        } else if (this.state === 'GAMEOVER') {
            this.state = 'START';
            this.score = 0;
            this.items = [];
        }
    }

    keyPressed(k) {
        if (k === 27) activeGame = null; // ESC
    }

    start(diff) {
        this.difficulty = diff;
        this.score = 0;
        this.items = [];
        this.state = 'PLAYING';
    }
    
    onResize() {
        this.player.y = height - 40;
    }
}

class SnakeGame {
    constructor() {
        this.scl = 20;
        this.snake = [{x: 0, y: 0}];
        this.xspeed = 1;
        this.yspeed = 0;
        this.food = this.pickLocation();
        this.score = 0;
        this.gameOver = false;
        this.speed = 10;
    }

    pickLocation() {
        let cols = floor(width / this.scl);
        let rows = floor(height / this.scl);
        return createVector(floor(random(cols)), floor(random(rows))).mult(this.scl);
    }

    update() {
        if (this.gameOver) return;
        if (frameCount % this.speed === 0) {
            let head = this.snake[this.snake.length - 1];
            let nextX = head.x + this.xspeed * this.scl;
            let nextY = head.y + this.yspeed * this.scl;
            
            // Constrain to screen
            nextX = constrain(nextX, 0, width - this.scl);
            nextY = constrain(nextY, 0, height - this.scl);

            // Self collision
            for (let s of this.snake) {
                if (s.x === nextX && s.y === nextY) {
                    this.endGame();
                    return;
                }
            }

            this.snake.push({x: nextX, y: nextY});
            
            if (dist(nextX, nextY, this.food.x, this.food.y) < 1) {
                this.score++;
                playSound('collect');
                this.food = this.pickLocation();
                this.speed = max(2, 10 - floor(this.score/5));
            } else {
                this.snake.shift();
            }
        }
    }

    endGame() {
        this.gameOver = true;
        playSound('gameover');
        let hs = parseInt(localStorage.getItem('hs_snake')) || 0;
        if (this.score > hs) localStorage.setItem('hs_snake', this.score);
    }

    draw() {
        fill(255);
        for (let s of this.snake) {
            rect(s.x, s.y, this.scl, this.scl);
        }
        fill(255, 0, 100);
        rect(this.food.x, this.food.y, this.scl, this.scl);
        
        fill(255); textSize(20); textAlign(LEFT, TOP);
        text(`Score: ${this.score}`, 10, 10);
        
        if (this.gameOver) {
            fill(255); textAlign(CENTER, CENTER); textSize(32);
            text("Game Over", width/2, height/2);
            textSize(16); text("Click to Restart", width/2, height/2 + 40);
            text("Press ESC for Menu", width/2, height/2 + 70);
        }
    }

    keyPressed(k) {
        if (k === UP_ARROW && this.yspeed !== 1) { this.xspeed = 0; this.yspeed = -1; }
        else if (k === DOWN_ARROW && this.yspeed !== -1) { this.xspeed = 0; this.yspeed = 1; }
        else if (k === LEFT_ARROW && this.xspeed !== 1) { this.xspeed = -1; this.yspeed = 0; }
        else if (k === RIGHT_ARROW && this.xspeed !== -1) { this.xspeed = 1; this.yspeed = 0; }
        else if (k === 27) activeGame = null;
    }

    mousePressed() {
        if (this.gameOver) {
            this.snake = [{x: 0, y: 0}];
            this.score = 0;
            this.gameOver = false;
            this.xspeed = 1; this.yspeed = 0;
        }
    }
}

class TetrisGame {
    constructor() {
        this.cols = 10;
        this.rows = 20;
        this.scl = 30;
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.nextPiece = this.newPiece();
        this.currentPiece = this.newPiece();
        this.dropInterval = 30;
        this.timer = 0;
        
        // Center the board
        this.offsetX = (width - this.cols * this.scl) / 2;
        this.offsetY = (height - this.rows * this.scl) / 2;
    }

    newPiece() {
        const shapes = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[0,1,0],[1,1,1]], // T
            [[1,0,0],[1,1,1]], // L
            [[0,0,1],[1,1,1]], // J
            [[0,1,1],[1,1,0]], // S
            [[1,1,0],[0,1,1]]  // Z
        ];
        const colors = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];
        let r = floor(random(shapes.length));
        return {
            shape: shapes[r],
            color: colors[r],
            x: 3,
            y: 0
        };
    }

    update() {
        if (this.gameOver) return;
        this.timer++;
        if (this.timer > this.dropInterval) {
            this.move(0, 1);
            this.timer = 0;
        }
    }

    draw() {
        push();
        translate(this.offsetX, this.offsetY);
        
        // Draw Board
        stroke(50);
        noFill();
        rect(0, 0, this.cols * this.scl, this.rows * this.scl);
        
        // Draw Grid
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c]) {
                    fill(this.grid[r][c]);
                    rect(c * this.scl, r * this.scl, this.scl, this.scl);
                }
            }
        }
        
        // Draw Piece
        if (this.currentPiece) {
            fill(this.currentPiece.color);
            for (let r = 0; r < this.currentPiece.shape.length; r++) {
                for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                    if (this.currentPiece.shape[r][c]) {
                        rect((this.currentPiece.x + c) * this.scl, (this.currentPiece.y + r) * this.scl, this.scl, this.scl);
                    }
                }
            }
        }
        pop();
        
        fill(255); textSize(20); textAlign(LEFT, TOP);
        text(`Score: ${this.score}`, 10, 10);

        // Next Piece Preview
        text("Next:", this.offsetX + this.cols * this.scl + 20, this.offsetY);
        if (this.nextPiece) {
            let px = this.offsetX + this.cols * this.scl + 20;
            let py = this.offsetY + 40;
            fill(this.nextPiece.color);
            for (let r = 0; r < this.nextPiece.shape.length; r++) {
                for (let c = 0; c < this.nextPiece.shape[r].length; c++) {
                    if (this.nextPiece.shape[r][c]) {
                        rect(px + c * this.scl, py + r * this.scl, this.scl, this.scl);
                    }
                }
            }
        }
        
        if (this.gameOver) {
            fill(255); textAlign(CENTER, CENTER); textSize(32);
            text("Game Over", width/2, height/2);
            textSize(16); text("Click to Restart", width/2, height/2 + 40);
            text("Press ESC for Menu", width/2, height/2 + 70);
        }
    }
    
    move(dx, dy) {
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        if (this.collide()) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            if (dy > 0) this.lock();
            return false;
        }
        return true;
    }
    
    rotate() {
        let original = this.currentPiece.shape;
        let rotated = original[0].map((val, index) => original.map(row => row[index]).reverse());
        this.currentPiece.shape = rotated;
        if (this.collide()) {
            this.currentPiece.shape = original;
        }
    }
    
    collide() {
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c]) {
                    let newX = this.currentPiece.x + c;
                    let newY = this.currentPiece.y + r;
                    if (newX < 0 || newX >= this.cols || newY >= this.rows || (newY >= 0 && this.grid[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    lock() {
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c]) {
                    let newY = this.currentPiece.y + r;
                    if (newY < 0) {
                        this.gameOver = true;
                        return;
                    }
                    this.grid[newY][this.currentPiece.x + c] = this.currentPiece.color;
                }
            }
        }
        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.newPiece();
        if (this.collide()) {
            this.endGame();
        }
    }
    
    clearLines() {
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.grid[r].every(cell => cell !== 0)) {
                this.grid.splice(r, 1);
                this.grid.unshift(Array(this.cols).fill(0));
                this.score += 100;
                playSound('collect');
                r++;
            }
        }
    }

    endGame() {
        this.gameOver = true;
        playSound('gameover');
        let hs = parseInt(localStorage.getItem('hs_tetris')) || 0;
        if (this.score > hs) localStorage.setItem('hs_tetris', this.score);
    }

    keyPressed(k) {
        if (this.gameOver) return;
        if (k === LEFT_ARROW) this.move(-1, 0);
        else if (k === RIGHT_ARROW) this.move(1, 0);
        else if (k === DOWN_ARROW) this.move(0, 1);
        else if (k === UP_ARROW) this.rotate();
        else if (k === 27) activeGame = null;
    }
    
    mousePressed() {
        if (this.gameOver) {
            this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
            this.score = 0;
            this.gameOver = false;
            this.nextPiece = this.newPiece();
            this.currentPiece = this.newPiece();
        }
    }
    
    onResize() {
        this.offsetX = (width - this.cols * this.scl) / 2;
        this.offsetY = (height - this.rows * this.scl) / 2;
    }
}

class Player {
  constructor() {
    this.w = 100; this.h = 20;
    this.x = width / 2 - this.w / 2;
    this.y = height - 40;
  }
  update() {
    this.x = mouseX - this.w / 2;
    this.x = constrain(this.x, 0, width - this.w);
  }
  show() {
    fill(0, 242, 255);
    rect(this.x, this.y, this.w, this.h, 5);
  }
  hits(item) {
    return (item.x < this.x + this.w && item.x + item.w > this.x && item.y < this.y + this.h && item.y + item.h > this.y);
  }
}

class Item {
  constructor(minSpeed, maxSpeed) {
    this.w = 40; this.h = 40;
    this.x = random(width - this.w);
    this.y = -this.h;
    this.speed = random(minSpeed || 2, maxSpeed || 5);
    if (random() > 0.3) {
      this.text = ['{}', '=>', '[]', '()'][floor(random(4))];
      this.points = 10; this.color = color(10, 255, 132);
    } else {
      this.text = ['null', 'NaN', 'bug'][floor(random(3))];
      this.points = -20; this.color = color(255, 0, 100);
    }
  }
  update() { this.y += this.speed; }
  show() {
    fill(this.color);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.text, this.x + this.w / 2, this.y + this.h / 2);
  }
  offscreen() { return this.y > height; }
}

class MenuParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.alpha = 255;
    this.size = random(2, 6);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }
  show() { noStroke(); fill(0, 242, 255, this.alpha); ellipse(this.x, this.y, this.size); }
  finished() { return this.alpha < 0; }
}
