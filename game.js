canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

document.addEventListener("mousemove", move);

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
        ctx.clearRect(0,0,800,700);
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Game
{
    constructor(context) {
        this.ctx = context;
        this.player = new Player(Helper.getRandomInt(0, 350), Helper.getRandomInt(0, 570), 5,5,this.ctx);
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
    }

    draw()
    {
        this.player.draw();
    }
}

game = new Game(ctx);
game.update();
game.draw();