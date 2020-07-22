canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

document.addEventListener("mousemove", move);
document.addEventListener("click", function () {
    game.bullets.push(new Bullet(
       game.player.x + game.player.w - 10,
       game.player.y + game.player.h - 32,
       8,
       ctx
    ));

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
        this.w = 130
        this.h = 120;
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
    constructor(x, y, dx, dy, context) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.w = 87;
        this.h = 79;
        this.img = new Image();
        this.img.src = 'img/zombie.png';
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
        this.bullet = new Bullet(2000, 2000, 5, this.ctx);
        this.zombie = new Zombie(2000,2000,5,5,this.ctx);
        this.zombies = [];
        this.zombieTimer = 0;
        this.zombieSpawnInterval = 40;
        this.bullets = [];
        this.loop();
    }

    loop()
    {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    update()
    {
        this.player.update();
        this.bullet.update();
        this.zombie.update();

        if (this.zombieTimer % this.zombieSpawnInterval === 0)
        {
            this.zombies.push(new Zombie(
                800 - this.zombie.w - 2,
                Helper.getRandomInt(0, 700 - this.zombie.h - 2),
                4,
                4,
                this.ctx
            ));

            this.zombieTimer = 0;
        }

        this.zombieTimer++;
        this.bullets.forEach((bullet, index) => {
            if (bullet.x > 800)
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

            zombie.x -= zombie.dx;
            zombie.update();


            for (let b in this.bullets)
            {
                const zombieCenterX = zombie.x + zombie.w / 2;
                const zombieCenterY = zombie.y + zombie.h / 2;
                if (
                    zombie.x <= this.bullets[b].x + this.bullets[b].w &&
                    zombie.y <= this.bullets[b].y &&
                    zombie.y + zombie.h >= this.bullets[b].y
                )
                {
                    Helper.removeIndex(this.zombies, index);
                    this.bullets[b].x = 1500;
                }
            }

        });
    }

    draw()
    {
        this.ctx.clearRect(0,0,800,700);
        this.player.draw();
        this.bullet.draw();
        this.zombie.draw();

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
    }
}

game = new Game(ctx);
game.update();
game.draw();