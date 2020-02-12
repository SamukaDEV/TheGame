enchant(); // Faz a chamada, de configuração local do projeto

var __width = window.innerWidth;
var __height = window.innerHeight;
var game = null;
var player = null;
var socket = null;

window.onload = function () {
    game = new Core(__width, __height);
    game.fps = 30; // FPS Global do game
    var imgs_path = 'assets/imgs/';
    game.preload(
        imgs_path + 'chara5.png',
        imgs_path + 'icon0.png',
        imgs_path + 'map1.png',
        imgs_path + 'map0.gif',
        imgs_path + 'carrot.png',
        imgs_path + 'shadow_1.png',
        imgs_path + 'balls.png',
    );
    game.onload = function () {

        socket = io('http://localhost');
        socket.on('connect', (e) => {
            console.log('Socket Connected');
            net_state.frame = 6;
            net_label.text = 'Connected';
        });
        socket.on('reconnect', (e) => {
            console.log('Reconnected');
        });
        socket.on('disconnect', (e) => {
            console.log('Disconnected');
            net_state.frame = 7;
            net_label.text = 'Reconnecting';
        });
        socket.on('error', (e) => {
            console.log(e);
        });
        socket.on('pong', (ms) => {
            if(ms >= 100){
                net_state.frame = 7;
            }else if(ms < 100){
                net_state.frame = 6;
            }
            net_label.text = ms + ' ms';
        });

        // game.addEventListener(Event.ENTER_FRAME, function(){
        //     socket.emit();
        // });

        var roomName = new enchant.ui.MutableText();
        roomName.x = 150;
        roomName.y = 500;
        game.rootScene.addChild(roomName);

        var joinButton = new enchant.ui.Button("Join Room");
        joinButton.x = 100;
        joinButton.y = 500;
        joinButton.addEventListener('touchend', function (e) {
            socket.emit('join-room', 'DemoRoom');
        });
        game.rootScene.addChild(joinButton);

        var net_state = new Sprite(16, 16);
        net_state.image = game.assets[imgs_path + 'balls.png'];
        net_state.x = 10;
        net_state.y = 10;
        net_state.frame = 3; // 3 - red; 6 - green; 5 - gray;
        game.rootScene.addChild(net_state);

        var net_label = new Label('NET');
        net_label.x = 30;
        net_label.y = 13;
        game.rootScene.addChild(net_label);

        var lbl = new Label('The Game Lobby');
        lbl.x = __width / 2 - (lbl.width / 2);
        lbl.y = 10;
        lbl.font = '30px Serif';
        game.rootScene.addChild(lbl);

        // Reassign keys.
        game.keybind(87, 'up');     // 87 is the ASCII code for 'W'.
        game.keybind(65, 'left');   // 65 is the ASCII code for 'A'.
        game.keybind(83, 'down');   // 83 is the ASCII code for 'S'.
        game.keybind(68, 'right');  // 68 is the ASCII code for 'D'.

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

        player = new PlayerOne(350, 250);

        var item = new DropableItem(200, 200, player);
        item.setImage('assets/imgs/carrot.png');
        game.rootScene.addChild(item);

        // var pad = new Pad();
        // pad.x = 100;
        // pad.y = 300;
        // game.rootScene.addChild(pad);

        // game.rootScene.on('touchstart', function (e) {
        //     player_4.tl.queue = [];
        //     player_4.tl.moveTo(e.x - (32 / 2), e.y - (32 / 2), 30);
        // });

        game.rootScene.addChild(player);

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

window.onresize = function () {
    game.width = window.innerWidth;
    game.height = window.innerHeight;
}

var PlayerClass = Class.create(Sprite, {
    initialize: function (x, y) {
        Sprite.call(this, 32, 32);
        var game = Game.instance;

        this.shadow = new Sprite(32, 32);
        this.shadow.image = game.assets['assets/imgs/shadow_1.png'];
        this.shadow.opacity = 0.4;
        this.shadow.x = this.x;
        this.shadow.y = this.y + 30;
        this.shadow.scaleY = 0.4;
        this.shadow.scaleX = 0.9;
        // shadow.alignTopIn(this, 20);
        game.rootScene.addChild(this.shadow);

        this.addEventListener(Event.ENTER_FRAME, function () {
            this.shadow.x = this.x;
            this.shadow.y = this.y + 23;
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

        this.shadow = new Sprite(32, 32);
        this.shadow.image = game.assets['assets/imgs/shadow_1.png'];
        this.shadow.opacity = 0.4;
        this.shadow.x = this.x;
        this.shadow.y = this.y + 30;
        this.shadow.scaleY = 0.2;
        this.shadow.scaleX = 0.5;

        this.shadow.tl
            .scaleTo(this.shadow.scaleX - 0.08, this.shadow.scaleY, 30)
            .scaleTo(this.shadow.scaleX + 0.08, this.shadow.scaleY, 30)
            .loop();

        game.rootScene.addChild(this.shadow);

        this.addEventListener(Event.ENTER_FRAME, function () {
            if (this.intersect(collector)) {
                this.remove();
                collector.inventory.push(this);
            }
        });
    },
    remove() {
        game.rootScene.removeChild(this);
        game.rootScene.removeChild(this.shadow);
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