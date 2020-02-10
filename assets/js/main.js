enchant(); // Faz a chamada, de configuração local do projeto

var __width = window.innerWidth;
var __height = window.innerHeight;
var game = null;
var player = null;

window.onload = function () {
    game = new Game(__width, __height);
    game.fps = 30; // FPS Global do game
    var imgs_path = 'assets/imgs/';
    game.preload(
        imgs_path + 'chara5.png',
        imgs_path + 'icon0.png',
        imgs_path + 'map1.png',
        imgs_path + 'map0.gif',
        imgs_path + 'carrot.png',
        imgs_path + 'shadow_1.png'
    );
    game.onload = function () {

        var lbl = new Label('Unidade USB');
        lbl.x = 100;
        lbl.y = 100;
        lbl.font = '30px Serif';
        game.rootScene.addChild(lbl);

        // var map = new Map(16, 16);
        // map.image = game.assets['assets/imgs/map1.png']
        // map.loadData(
        //     [
        //         [4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 4, 4,],
        //         [4, 5, 5, 5, 5, 5, 4, 2, 2, 2, 0],
        //         [4, 5, 4, 5, 4, 5, 4],
        //         [4, 5, 5, 5, 5, 5, 4],
        //         [4, 5, 4, 5, 4, 5, 4],
        //         [4, 5, 5, 5, 5, 5, 4],
        //         [4, 4, 4, 4, 4, 4, 4]
        //     ]
        // );
        // game.rootScene.addChild(map);

        var player_1 = new PlayerClass(300, 300);
        var player_2 = new PlayerClass(300, 250);
        var player_3 = new PlayerClass(350, 300);
        window.player_4 = new PlayerOne(350, 250);

        var item = new DropableItem(200, 200, player_4);
        item.setImage('assets/imgs/carrot.png');
        game.rootScene.addChild(item);

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
document.oncontextmenu = function (e) {
    e.preventDefault();
    return false;
}

var PlayerClass = Class.create(Sprite, {
    initialize: function (x, y) {
        Sprite.call(this, 32, 32);
        var game = Game.instance;

        var shadow = new Sprite(32, 32);
        shadow.image = game.assets['assets/imgs/shadow_1.png'];
        shadow.opacity = 0.4;
        shadow.x = this.x;
        shadow.y = this.y + 30;
        shadow.scaleY = 0.4;
        shadow.scaleX = 0.9;
        game.rootScene.addChild(shadow);

        this.addEventListener(Event.ENTER_FRAME, function(){
            shadow.x = this.x;
            shadow.y = this.y + 23;
        });

        this.inventory = [];

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
    }
});

var PlayerOne = Class.create(PlayerClass, {
    initialize: function (x, y) {
        PlayerClass.call(this, x, y);
        var game = Game.instance;
        var self = this;

        // game.on('leftbuttondown', function () {
        //     self.x -= self.Speed.left;
        //     self.frame = self.Animations.left;
        // });
        game.on('leftbuttonup', function () {
            self.frame = 10;
        })
        game.on('rightbuttonup', function () {
            self.frame = 19;
        });
        game.on('upbuttonup', function () {
            self.frame = 28;
        });
        game.on('downbuttonup', function () {
            self.frame = 1;
        });

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

var DropableItem = Class.create(Sprite, {
    initialize: function (x, y, collector) {
        Sprite.call(this, 32, 32);
        var game = Game.instance;
        this.scale(0.7);
        this.x = x;
        this.y = y;
        this.tl
            .scaleTo(-(this.scaleX / 2), this.scaleY, 30).and().moveBy(0, 15, 30)
            .scaleTo(-(this.scaleX), this.scaleY, 30).and().moveBy(0, -15, 30)
            .scaleTo(this.scaleX / 2, this.scaleY, 30).and().moveBy(0, 15, 30)
            .scaleTo(this.scaleX, this.scaleY, 30).and().moveBy(0, -15, 30)
            .loop();

        var shadow = new Sprite(32, 32);
        shadow.image = game.assets['assets/imgs/shadow_1.png'];
        shadow.opacity = 0.4;
        shadow.x = this.x;
        shadow.y = this.y + 30;
        shadow.scaleY = 0.2;
        shadow.scaleX = 0.5;

        shadow.tl
            .scaleTo(shadow.scaleX - 0.08, shadow.scaleY, 30)
            .scaleTo(shadow.scaleX + 0.08, shadow.scaleY, 30)
            .loop();

        game.rootScene.addChild(shadow);

        this.addEventListener(Event.ENTER_FRAME, function(){
            if(this.intersect(collector)){
                game.rootScene.removeChild(this);
                game.rootScene.removeChild(shadow);
                collector.inventory.push(this);
            }
        });
    },
    setImage: function (img_asset) {
        this.image = game.assets[img_asset];
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