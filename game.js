const SPEEDYZOMBIE_H = 74;
const SPEEDYZOMBIE_W = 65;

const ZOMBIE_H = 72;
const ZOMBIE_W = 69;

const BOSS_W = 232;
const BOSS_H = 300;

const SCREEN_H = 600;
const SCREEN_W = 800;

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

document.addEventListener("mousemove", move);
document.addEventListener("click", function () {
    if (game.gameOver === false)
    {
        Helper.playSound(game.shotSound);
        game.bullets.push(new Bullet(
            game.player.x + game.player.w - 10,
            game.player.y + game.player.h - 27,
            12,
            ctx
        ));
    }
})

function move(event) {
    game.player.x = event.offsetX - game.player.w / 2
    game.player.y = event.offsetY - game.player.h / 2;
}

class Helper
{
    static getRandomInt(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static removeIndex(array, index)
    {
        if (index >= array.length || array.length <= 0)
        {
            return;
        }
        array[index] = array[array.length - 1];
        array[array.length - 1] = undefined;
        array.length = array.length - 1;
    }

    static _timestamp()
    {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    static playSound(sound)
    {
        sound.pause();
        sound.currentTime = 0;
        sound.play().then(() => {}).catch(() => {})
    }
}


class Player
{
    constructor(x, y, dx, dy, context) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.w = 110
        this.h = 100;
        this.ctx = context;
        this.img = new Image();
        this.img.src = 'img/player.png';
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Zombie
{
    constructor(x, y, dx, dy, zombieimg, context) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.w = ZOMBIE_W;
        this.h = ZOMBIE_H;
        this.ctx = context;
        this.zombieimg = zombieimg;
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.zombieimg,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Boss
{
    constructor(x, y, dx, bossImg, context) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.w = BOSS_W;
        this.h = BOSS_H;
        this.ctx = context;
        this.bossImg = bossImg;
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.bossImg,
            this.x, this.y,
            this.w, this.h
        );
    }
}

class SpeedyZombie
{
    constructor(x, y, dx, speedyZombieImg, context) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.w = SPEEDYZOMBIE_W;
        this.h = SPEEDYZOMBIE_H;
        this.img = speedyZombieImg;
        this.ctx = context;
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Bullet
{
    constructor(x, y, dx, context) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.w = 15;
        this.h = 4;
        this.ctx = context;
    }

    update()
    {
    }

    draw()
    {
        this.ctx.fillStyle = "rgb(240, 208, 0)";
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Game
{
    constructor(context) {
        this.ctx = context;
        this.player = new Player(Helper.getRandomInt(0, 350), Helper.getRandomInt(0, 570), 5,5,this.ctx);
        this.zombies = [];
        this.zombieTimer = 0;
        this.fps = 60;
        this.step = 1 / this.fps;
        this.now = 0;
        this.lastTime = Helper._timestamp();
        this.deltaTime = 0;
        this.speedyZombieTimer = 0;
        this.shotSound = new Audio()
        this.shotSound.src = 'sound/shot.mp3';
        this.zombieSound = new Audio();
        this.zombieSound.src = 'sound/playerdead.wav';
        this.zombieSpawnInterval = 50;
        this.zombieimg = new Image();
        this.zombieimg.src = 'img/zombie.png';
        this.speedyzombieimg = new Image();
        this.speedyzombieimg.src = 'img/zombie2.png';
        this.bosszombieimg = new Image();
        this.bosszombieimg.src = 'img/boss.png';
        this.speedyZombieSpawnInterval = 80;
        this.gameOver = false;
        this.bullets = [];
        this.bosses = [];
        this.bossTimer = 1;
        this.bossSpawnInterval = 1900;
        this.life = 3;
        this.bossLife = 20;
        this.score = 0;
        this.loop();
    }

    loop()
    {
        this.now = Helper._timestamp();
        this.deltaTime = this.deltaTime + Math.min(1, (this.now - this.lastTime) / 1000);

        while (this.deltaTime > this.step)
        {
            this.deltaTime = this.deltaTime - this.step;
            this.update();
        }

        this.draw(this.deltaTime);
        this.lastTime = this.now;

        requestAnimationFrame(() => this.loop());
    }

    update()
    {
        this.player.update();

        if (this.zombieTimer % this.zombieSpawnInterval === 0)
        {
            this.zombies.push(new Zombie(
                SCREEN_W,
                Helper.getRandomInt(0, SCREEN_H - ZOMBIE_H - 2),
                Helper.getRandomInt(3,5),
                4,
                this.zombieimg,
                this.ctx
            ));

            this.zombieTimer = 0;
        }

        this.zombieTimer++;

        if (this.speedyZombieTimer % this.speedyZombieSpawnInterval === 0)
        {
            this.zombies.push(new SpeedyZombie(
                SCREEN_W,
                Helper.getRandomInt(0, SCREEN_H - SPEEDYZOMBIE_H - 2),
                Helper.getRandomInt(6,8),
                this.speedyzombieimg,
                this.ctx
            ));

            this.speedyZombieTimer = 0;
        }

        this.speedyZombieTimer++;

        if (this.bossTimer % this.bossSpawnInterval === 0) {
            this.bossLife = 20;
            this.bosses.push(new Boss(
                SCREEN_W,
                Helper.getRandomInt(0, SCREEN_H - BOSS_H - 2),
                1,
                this.bosszombieimg,
                this.ctx
            ));

            this.bossTimer = 0;
        }

        this.bossTimer++;

        this.bullets.forEach((bullet, index) => {
            if (bullet.x > SCREEN_W)
            {
                Helper.removeIndex(this.bullets, index);
            }
            bullet.x += bullet.dx;
            bullet.update();
        });
        this.zombies.forEach((zombie, index) => {
            if (zombie.x < 0 - zombie.w)
            {
                Helper.removeIndex(this.zombies, index);
            }

            const zombieCenterX = zombie.x + zombie.w / 2;
            const zombieCenterY = zombie.y + zombie.h / 2;
            if (
                zombieCenterX >= this.player.x &&
                zombieCenterX <= this.player.x + this.player.w + 15 &&
                zombieCenterY >= this.player.y &&
                zombieCenterY <= this.player.y + this.player.h
            )
            {
                this._lifeUpdate();
                Helper.removeIndex(this.zombies, index);
                Helper.playSound(this.zombieSound);
            }

            zombie.x -= zombie.dx;
            zombie.update();


            for (let b in this.bullets)
            {
                if (
                    zombie.x >= this.bullets[b].x &&
                    zombie.x <= this.bullets[b].x + this.bullets[b].w &&
                    zombie.y <= this.bullets[b].y &&
                    zombie.y + zombie.h >= this.bullets[b].y
                ) {
                    Helper.removeIndex(this.zombies, index);
                    this._scoreUpdate(1);
                    this.bullets[b].x = 1500;
                }
            }
        });



        if (this.life === 0) {
            this.gameOver = true;
            Helper.playSound(this.zombieSound);
            this.ctx.font = "70px Lucida Sans Typewriter";
            this.ctx.fillStyle = "red";
            this.ctx.fillText("Game Over!", 200, 325);
            throw new Error("GAME OVER!");
        }

        this.bosses.forEach((boss, index) => {
            for (let b in this.bullets)
            {
                const bossCenterX = boss.x + boss.w / 2;
                const bossCenterY = boss.y + boss.h / 2;
                if (
                    bossCenterX >= this.bullets[b].x &&
                    bossCenterX <= this.bullets[b].x + this.bullets[b].w &&
                    boss.y <= this.bullets[b].y &&
                    boss.y + boss.h >= this.bullets[b].y
                )
                {
                    this.bullets[b].x = 1500;
                    this.bossLife--;
                }

                if (this.bossLife === 0)
                {
                    Helper.removeIndex(this.bosses, index);
                    this._scoreUpdate(5);
                }

            }

            boss.x -= boss.dx;

            const bossCenterX = boss.x + boss.w / 2;
            const bossCenterY = boss.y + boss.h / 2;
            if (
                boss.x + boss.w >= this.player.x &&
                boss.x + 100 <= this.player.x + this.player.w &&
                boss.y - 15 <= this.player.y &&
                boss.y + boss.h - 70 >= this.player.y
            )
            {
                this.life = 0;
            }

            boss.update();
        });

    }

    draw()
    {
        this.ctx.clearRect(0,0,SCREEN_W,SCREEN_H);
        this.player.draw();

        for (let b in this.bullets)
        {
            if (this.bullets.hasOwnProperty(b))
            {
                this.bullets[b].draw();
            }
        }


        for (let z in this.zombies)
        {
            if (this.zombies.hasOwnProperty(z))
            {
                this.zombies[z].draw();
            }
        }

        for (let i in this.bosses)
        {
            if (this.bosses.hasOwnProperty(i))
            {
                this.bosses[i].draw();
            }
        }
    }

    _scoreUpdate(score)
    {
        this.score += score;
        document.getElementById("game-score").innerText = '' + this.score;
    }


    _lifeUpdate()
    {
        document.getElementById("game-life").innerText = '' + --this.life;
    }

}

game = new Game(ctx);
game.update();
game.draw();
