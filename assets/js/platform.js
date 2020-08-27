enchant();

var game, physicsWorld, btnAddBlock;
var assets_path = 'assets/images/'

var grid = []

function cubeBlock(x, y) {
    let cube = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.3, true);
    cube.image = game.assets[assets_path + 'map2.gif']
    cube.frame = 2;
    cube.position = { x: x, y: y }
    cube.on(Event.TOUCH_START, function (e) {
        let self = this 
        let item = grid.filter(item=>{
            item.selected = false
            return item === self
        })
        // console.log(item)
        item[0].selected = true
    })
    cube.on(Event.TOUCH_MOVE, function (e) {
        this.x = e.x - this.width / 2
        this.y = e.y - this.height / 2
    })
    cube.on(Event.ENTER_FRAME, function(e){
        if(this.selected){
            
        }
    })
    return cube
}

function Player(x, y) {
    let player = new Sprite(32, 32)
    player.x = x
    player.y = y
    player.animations = {
        idle: [1],
        walking: {
            up: [27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 29, 29, 29, 29],
            down: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
            left: [9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11],
            right: [18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 20, 20, 20, 20]
        }
    }
    player.image = game.assets[assets_path + 'chara5.png']
    player.frame = player.animations.idle
    player.speed = 2.5
    player.boost_speed = 0
    player.is_walking = false
    player.anim_direction = 'down'
    player.last_frame = player.animations.idle[0]
    player.on(Event.TOUCH_START, function (e) {
        // console.log(e)
    })
    player.on(Event.TOUCH_END, function (e) {
        // console.log(e)
    })
    player.on(Event.TOUCH_MOVE, function (e) {
        this.x = e.x - this.width / 2
        this.y = e.y - this.height / 2
    })
    player.addEventListener('enterframe', function (e) {
        // console.log(game.input)
        this.is_walking = false
        if (game.input.Shift) {
            this.boost_speed = 3
        } else {
            this.boost_speed = 0
        }
        if (game.input.W) {
            this.y -= this.speed + this.boost_speed
            this.is_walking = true
            this.anim_direction = 'up'
            this.last_frame = this.animations.walking.up[6]
        }
        if (game.input.S) {
            this.y += this.speed + this.boost_speed
            this.is_walking = true
            this.anim_direction = 'down'
            this.last_frame = this.animations.walking.down[6]
        }
        if (game.input.A) {
            this.x -= this.speed + this.boost_speed
            this.is_walking = true
            this.anim_direction = 'left'
            this.last_frame = this.animations.walking.left[6]
        }
        if (game.input.D) {
            this.x += this.speed + this.boost_speed
            this.is_walking = true
            this.anim_direction = 'right'
            this.last_frame = this.animations.walking.right[6]
        }
        if (this.is_walking) {
            switch (this.anim_direction) {
                case 'down':
                    this.frame = this.animations.walking.down
                    break;
                case 'up':
                    this.frame = this.animations.walking.up
                    break;
                case 'left':
                    this.frame = this.animations.walking.left
                    break;
                case 'right':
                    this.frame = this.animations.walking.right
                    break;
            }
        } else {
            this.frame = this.last_frame
        }
    })
    return player
}

window.onload = function () {
    game = new Game(720, 480); // 320x320 -> 720x480
    // game = new Game(320, 320); // 320x320 -> 720x480
    game.fps = 30; // default 30
    game.preload(assets_path + "chara1.gif", assets_path + "icon1.png", assets_path + "map2.gif", assets_path + "chara5.png");
    game.onload = function () {
        physicsWorld = new PhysicsWorld(0, 9.8);

        game.keybind(87, 'W')
        game.keybind(83, 'S')
        game.keybind(65, 'A')
        game.keybind(68, 'D')
        game.keybind(16, 'Shift')

        btnAddBlock = new Sprite(16, 16)
        btnAddBlock.image = game.assets[assets_path + "map2.gif"]
        btnAddBlock.frame = 2
        btnAddBlock.scale(2, 2)
        btnAddBlock.x = 690
        btnAddBlock.y = 12
        btnAddBlock.canMove = false
        btnAddBlock.on(Event.TOUCH_MOVE, function (e) {
            if (!this.canMove)
                return
            this.x = e.x - this.width / 2
            this.y = e.y - this.height / 2
        })
        btnAddBlock.on(Event.TOUCH_START, function (e) {
            let nblock = cubeBlock(game.width / 2, game.height / 2)
            grid.push(nblock)
            game.rootScene.addChild(nblock)
        })
        // console.log(btnAddBlock)
        game.rootScene.addChild(btnAddBlock)

        // for (var i = 0; i < 20; i++) {
        //     //床を生成
        //     var floor = new PhyBoxSprite(16, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.3, true);
        //     floor.image = game.assets[assets_path + "map2.gif"];
        //     floor.frame = 2;
        //     floor.position = { x: (i * 16) + 16, y: 300 };
        //     game.rootScene.addChild(floor);
        // }

        // var floor_right = cubeBlock(19 * 16 + 16, 300 - 16)
        // var floor_right2 = cubeBlock(19 * 16 + 16, 300 - 32)
        // var floor_left = cubeBlock(16, 300 - 16)
        // var floor_left2 = cubeBlock(16, 300 - 32)

        var player = Player(100, 100)

        // game.rootScene.addChild(floor_right)
        // game.rootScene.addChild(floor_right2)
        // game.rootScene.addChild(floor_left)
        // game.rootScene.addChild(floor_left2)

        game.rootScene.addChild(player)

        game.rootScene.addEventListener("enterframe", function () {
            physicsWorld.step(game.fps);
            if (game.frame % game.fps == 0) {
                //ボールを生成
                // var ball = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.2, true);
                // ball.image = game.assets[assets_path + "icon1.png"];
                // ball.frame = 4;
                // ball.position = { x: 0, y: 120 };
                // ball.applyImpulse(new b2Vec2(Math.random(), 0));
                // game.rootScene.addChild(ball);
                // ball.addEventListener("enterframe", function () {
                //     if (ball > 320) ball.destroy();
                // })
            }
        });
        game.rootScene.addEventListener("touchstart", function (evt) {

            // console.log(evt.x, evt.y)


            //ボールを生成
            // var ball = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.2, true);
            // ball.image = game.assets[assets_path + "icon1.png"];
            // ball.frame = 3;
            // ball.position = { x: evt.x, y: evt.y };
            // ball.applyImpulse(new b2Vec2(Math.random() * 0.1, 0));
            // game.rootScene.addChild(ball);
            // ball.addEventListener("enterframe", function () {
            //     if (ball > 320) ball.destroy();
            //     if(ball.y > game.height) ball.destroy()
            // })
        });


    };
    game.start();
};
