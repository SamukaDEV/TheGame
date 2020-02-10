enchant(); // Faz a chamada, de configuração local do projeto

var __width = window.innerWidth;
var __height = window.innerHeight;
var game = null;
var player = null;

window.onload = function () {
    game = new Game(__width, __height);
    game.fps = 30; // FPS Global do game
    game.preload(
        'assets/imgs/chara5.png',
        'assets/imgs/icon0.png'
    );
    game.onload = function () {

        var lbl = new Label('Unidade USB');
        lbl.x = 100;
        lbl.y = 100;
        lbl.font = '30px Serif';
        game.rootScene.addChild(lbl);        

        var player_1 = new PlayerClass(300, 300);
        var player_2 = new PlayerClass(300, 250);
        var player_3 = new PlayerClass(350, 300);
        var player_4 = new PlayerClass(350, 250);

        var pad = new Pad();
        pad.x = 100;
        pad.y = 300;
        game.rootScene.addChild(pad);

        game.rootScene.addChild(player_1);
        game.rootScene.addChild(player_2);
        game.rootScene.addChild(player_3);
        game.rootScene.addChild(player_4);
    }
    game.start();
}

document.addEventListener('keydown', function (e) {
    // console.log(e.keyCode);
    if (e.keyCode == 116)
        document.location.reload();
});

var PlayerClass = Class.create(Sprite, {
    initialize: function (x, y) {
        Sprite.call(this, 32, 32);
        var game = Game.instance;

        this.image = game.assets['assets/imgs/chara5.png'];
        this.scale(2);
        this.x = x;
        this.y = y;
        this.frame = 1;

        this.Animations = {
            down: [0, 0, 0, 1, 1, 1, 2, 2, 2],
            up: [27, 27, 27, 28, 28, 28, 29, 29, 29],
            left: [9, 9, 9, 10, 10, 10, 11, 11, 11],
            right: [18, 18, 18, 19, 19, 19, 20, 20, 20]
        }
        this.Speed = {
            left: 3,
            right: 3,
            up: 3,
            down: 3
        }
        this.addEventListener(Event.ENTER_FRAME, function () {
            if (game.input.left) {
                this.x -= this.Speed.left;
                this.frame = this.Animations.left;
            }
            if (game.input.right) {
                this.x += this.Speed.right;
                this.frame = this.Animations.right;
            }
            if (game.input.up) {
                this.y -= this.Speed.up;
                this.frame = this.Animations.up;
            }
            if (game.input.down) {
                this.y += this.Speed.down;
                this.frame = this.Animations.down;
            }
        });
    }
});

// player = new Sprite(32, 32);
// player.image = game.assets['assets/imgs/chara5.png'];
// player.scale(2);
// player.x = (__width / 2) - (player.width / 2);
// player.y = (__height / 2) - (player.height / 2);
// player.frame = [0, 0, 0, 1, 1, 1, 2, 2, 2];
// player.moving = false;

// var Animations = {
//     down: [0, 0, 0, 1, 1, 1, 2, 2, 2],
//     up: [27, 27, 27, 28, 28, 28, 29, 29, 29],
//     left: [9, 9, 9, 10, 10, 10, 11, 11, 11],
//     right: [18, 18, 18, 19, 19, 19, 20, 20, 20]
// }

// var Speed = {
//     left: 3,
//     right: 3,
//     up: 3,
//     down: 3
// }

// player.addEventListener(Event.ENTER_FRAME, function () {
//     if (game.input.left) {
//         player.x -= Speed.left;
//         player.frame = Animations.left;
//     }
//     if (game.input.right) {
//         player.x += Speed.right;
//         player.frame = Animations.right;
//     }
//     if (game.input.up) {
//         player.y -= Speed.up;
//         player.frame = Animations.up;
//     }
//     if (game.input.down) {
//         player.y += Speed.down;
//         player.frame = Animations.down;
//     }
// });