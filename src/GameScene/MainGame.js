let MainGameLayer = cc.Layer.extend({
    // Array list contains rope tiles and hook (hook index at 0)
    hookRope: [],

    rollOrigin: null,
    ropeOrigin: null,
    hookOrigin: null,

    ropeCount: 0,
    ropeLength: 0,
    maximumRopeLength: 0,
    minimumRopeLength: 0,

    hookRotation: 0,
    hookRotationDirection: 0,
    previousHookRotationDirection: 0,
    hookRotationStep: 0,
    hookMaximumRotationAngle: 0,

    isDropping: false,
    currentHookDirection: 0,
    dropSpeed: 0,

    //Collectable Items - Testing...
    collectableItems: [],

    gold: null,
    diamond: null,
    rock: null,

    picked: false,

    money: 0,
    upcommingMoney: 0,

    //Miner Parts:
    minerBody: null,
    minerHead: null,
    minerArm: null,

    ctor() {
        this._super();
        this.initialization();
        this.createBackground();
        this.createRollHookRope();
        this.createCollectableItems();

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: (touch, event) => {
                if (!this.isDropping) {
                    this.toggleIsDropping();
                }
                return true;
            },
        }), this)

        this.scheduleUpdate();
    },

    update() {
        this.swing();

        if (this.isDropping) {
            this.drop();
        }
    },

    initialization() {
        this.minimumRopeLength = 50;
        this.maximumRopeLength = 600;

        this.rollOrigin = cc.p(cc.winSize.width / 2,
            cc.winSize.height / 2 + 160);

        this.ropeOrigin = cc.p(this.rollOrigin.x,
            this.rollOrigin.y + 40);

        this.hookOrigin = cc.p(this.ropeOrigin.x,
            this.ropeOrigin.y - this.minimumRopeLength);

        //Found out that rope tile height is 5 units
        this.ropeCount = this.maximumRopeLength / 5;
        this.ropeLength = this.minimumRopeLength;

        this.hookRotation = 0;
        this.hookRotationDirection = 1;
        this.hookRotationStep = 2;
        this.hookMaximumRotationAngle = 75;
        this.currentHookDirection = -1;

        this.dropSpeed = 6;

    },

    initCollectableItemsGrid() {

    },

    createBackground() {
        //Create Brown Under Layer
        let brown_tile = cc.Sprite.create(res.white_tile);
        brown_tile.runAction(cc.tintTo(0, 86, 52, 37));
        brown_tile.setAnchorPoint(0, 0);
        brown_tile.setScale(cc.winSize.width / brown_tile.width, cc.winSize.height / brown_tile.height);
        this.addChild(brown_tile, 0);

        //Create Purple Tile
        let purple_tile_01 = cc.Sprite.create(res.purple_tile);
        purple_tile_01.setAnchorPoint(0, 1);
        purple_tile_01.setScale(1, 1.5);
        purple_tile_01.setPosition(0, cc.winSize.height);
        this.addChild(purple_tile_01);

        let purple_tileCount = cc.winSize.width / purple_tile_01.getContentSize().width;
        for (let i = 1; i <= purple_tileCount; ++i) {
            let purple_tile = cc.Sprite.create(res.purple_tile);
            purple_tile.setAnchorPoint(0, 1);
            purple_tile.setScale(1, 1.5);
            purple_tile.setPosition(purple_tile_01.getContentSize().width * i, cc.winSize.height);
            this.addChild(purple_tile);
        }

        //Create Purple Tile
        let game_top_bg_01 = cc.Sprite.create(res.game_top_bg);
        game_top_bg_01.setAnchorPoint(0, 1);
        game_top_bg_01.setPosition(0, cc.winSize.height);
        this.addChild(game_top_bg_01);

        let game_top_bgCount = cc.winSize.width / game_top_bg_01.getContentSize().width;
        for (let i = 1; i <= game_top_bgCount; ++i) {
            let game_top_bg = cc.Sprite.create(res.game_top_bg);
            game_top_bg.setAnchorPoint(0, 1);
            game_top_bg.setPosition(game_top_bg_01.getContentSize().width * i, cc.winSize.height);
            this.addChild(game_top_bg);
        }

        //Create Ground Tile
        let ground_tile_01 = cc.Sprite.create(res.ground_tile);
        ground_tile_01.setAnchorPoint(0, 0.5);
        ground_tile_01.setPosition(0, game_top_bg_01.y - game_top_bg_01.getContentSize().height);
        this.addChild(ground_tile_01);

        let ground_tileCount = cc.winSize.width / ground_tile_01.getContentSize().width;
        for (let i = 1; i <= ground_tileCount; ++i) {
            let ground_tile = cc.Sprite.create(res.ground_tile);
            ground_tile.setAnchorPoint(0, 0.5);
            ground_tile.setPosition(ground_tile_01.getContentSize().width * i, game_top_bg_01.y - game_top_bg_01.getContentSize().height);
            this.addChild(ground_tile);
        }


        //Create BG_Layer_01 Tile
        let bg_tile_01_01 = cc.Sprite.create(res.bg_tile_01);
        bg_tile_01_01.setAnchorPoint(0, 0.5);
        bg_tile_01_01.setPosition(0, ground_tile_01.y / 2);
        this.addChild(bg_tile_01_01);

        let bg_tile_01Count = cc.winSize.width / bg_tile_01_01.getContentSize().width;
        for (let i = 1; i <= bg_tile_01Count; ++i) {
            let bg_tile_01 = cc.Sprite.create(res.bg_tile_01);
            bg_tile_01.setAnchorPoint(0, 0.5);
            bg_tile_01.setPosition(bg_tile_01_01.getContentSize().width * i, ground_tile_01.y / 2);
            this.addChild(bg_tile_01);
        }

        //Create BG_Layer_02 Tile
        let bg_tile_02_01 = cc.Sprite.create(res.bg_tile_02);
        bg_tile_02_01.setAnchorPoint(0, 0.5);
        bg_tile_02_01.setPosition(0, ground_tile_01.y / 4 * 3);
        this.addChild(bg_tile_02_01);

        let bg_tile_02Count = cc.winSize.width / bg_tile_02_01.getContentSize().width;
        for (let i = 1; i <= bg_tile_02Count; ++i) {
            let bg_tile_02 = cc.Sprite.create(res.bg_tile_02);
            bg_tile_02.setAnchorPoint(0, 0.5);
            bg_tile_02.setPosition(bg_tile_02_01.getContentSize().width * i, ground_tile_01.y / 4 * 3);
            this.addChild(bg_tile_02);
        }

        //Create BG_Layer_03Tile
        let bg_tile_03_01 = cc.Sprite.create(res.bg_tile_03);
        bg_tile_03_01.setAnchorPoint(0, 0.5);
        bg_tile_03_01.setPosition(0, ground_tile_01.y / 4);
        this.addChild(bg_tile_03_01);

        let bg_tile_03Count = cc.winSize.width / bg_tile_03_01.getContentSize().width;
        for (let i = 1; i <= bg_tile_03Count; ++i) {
            let bg_tile_03 = cc.Sprite.create(res.bg_tile_03);
            bg_tile_03.setAnchorPoint(0, 0.5);
            bg_tile_03.setPosition(bg_tile_03_01.getContentSize().width * i, ground_tile_01.y / 4);
            this.addChild(bg_tile_03);
        }

        //Create BG_Layer_04 Tile
        let bg_tile_04_01 = cc.Sprite.create(res.bg_tile_04);
        bg_tile_04_01.setAnchorPoint(0, 0.75);
        bg_tile_04_01.setPosition(0, 0);
        this.addChild(bg_tile_04_01);

        let bg_tile_04Count = cc.winSize.width / bg_tile_04_01.getContentSize().width;
        for (let i = 1; i <= bg_tile_04Count; ++i) {
            let bg_tile_04 = cc.Sprite.create(res.bg_tile_04);
            bg_tile_04.setAnchorPoint(0, 0.75);
            bg_tile_04.setPosition(bg_tile_04_01.getContentSize().width * i, 0);
            this.addChild(bg_tile_04);
        }
    },

    createCollectableItems() {
        // this.gold = cc.Sprite.create(res.gold_03);
        // this.diamond = cc.Sprite.create(res.diamond);
        // this.rock = cc.Sprite.create(res.rock_01);
        //
        // this.gold.setPosition(350, 350);
        // this.diamond.setPosition(500, 250);
        // this.rock.setPosition(750, 200);
        //
        // this.addChild(this.gold, 5);
        // this.addChild(this.diamond, 5);
        // this.addChild(this.rock, 5);
        //
        // this.collectableItems.push(this.gold);
        // this.collectableItems.push(this.diamond);
        // this.collectableItems.push(this.rock);
        //
        for (let i = 0; i < 40; ++i) {
            let gold = cc.Sprite.create(res.gold_03);
            let diamond = cc.Sprite.create(res.diamond);
            let rock = cc.Sprite.create(res.rock_01);

            let randomX = Math.random() * (cc.winSize.width - 600) + 300;
            let randomY = Math.random() * (cc.winSize.height - 350) + 50;

            gold.setPosition(randomX, randomY);

            randomX = Math.random() * (cc.winSize.width - 600) + 300;
            randomY = Math.random() * (cc.winSize.height - 350) + 50;

            diamond.setPosition(randomX, randomY);

            randomX = Math.random() * (cc.winSize.width - 600) + 300;
            randomY = Math.random() * (cc.winSize.height - 350) + 50;
            rock.setPosition(randomX, randomY);

            this.addChild(gold, 5, 1);
            this.addChild(diamond, 5, 2);
            this.addChild(rock, 5, 3);

            this.collectableItems.push(gold);
            this.collectableItems.push(diamond);
            this.collectableItems.push(rock);
        }

    }
    ,

    createRollHookRope() {
        //Create Roll
        let roll = cc.Sprite.create(res.roll);
        roll.setAnchorPoint(0.5, 0);
        roll.setPosition(this.rollOrigin.x - 5, this.rollOrigin.y);

        this.addChild(roll, 5);

        //Create Hook
        let hook = cc.Sprite.create(res.hook);
        hook.setAnchorPoint(0.5, 0.9);
        hook.setPosition(this.hookOrigin);

        this.hookRope[0] = hook;
        this.addChild(this.hookRope[0], 5);

        //Create Ropes
        let rope_hide = cc.Sprite.create(res.rope_hide);
        rope_hide.setAnchorPoint(0.5, 0.5);
        rope_hide.setPosition(this.ropeOrigin);
        this.addChild(rope_hide, 6);

        for (let index = 1; index < this.ropeCount; ++index) {
            let rope = cc.Sprite.create(res.rope_tile);
            rope.setAnchorPoint(0.5, 1);
            rope.setPosition(cc.p(this.ropeOrigin.x, this.ropeOrigin.y - 5 * index));

            this.hookRope[index] = rope;
            this.addChild(this.hookRope[index], 5);
        }
    },

    swing() {
        this.hookRotation -= this.hookRotationStep * this.hookRotationDirection;

        if (this.hookRotation <= -this.hookMaximumRotationAngle || this.hookRotation >= this.hookMaximumRotationAngle) {
            this.hookRotationDirection = -this.hookRotationDirection;
        }

        this.hookRope[0].setRotation(-this.hookRotation);

        let rotationAroundPointVector = cc.pRotateByAngle(cc.p(0, -1), cc.p(0, 0), cc.degreesToRadians(this.hookRotation));

        this.hookRope[0].setPosition(cc.pAdd(this.ropeOrigin, cc.pMult(rotationAroundPointVector, this.ropeLength)));

        for (let index = 1; index < this.ropeCount; ++index) {
            this.hookRope[index].setPosition(cc.pAdd(this.ropeOrigin, cc.pMult(rotationAroundPointVector, this.ropeLength - index * 5)));
            this.hookRope[index].setRotation(-this.hookRotation);

            let isWithInHookAndRoll = this.hookRope[index].y <= this.ropeOrigin.y && this.hookRope[index].y >= this.hookRope[0].y;

            this.hookRope[index].setVisible(isWithInHookAndRoll);

        }
    },

    drop() {
        this.scanning();

        if (this.ropeLength >= this.maximumRopeLength) {
            this.currentHookDirection = -this.currentHookDirection;
            this.dropSpeed = 14;

        } else if (this.ropeLength < this.minimumRopeLength) {
            this.hookRope[0].setTexture(res.hook);
            this.dropSpeed = 6;
            if (this.picked) {
                this.money += this.upcommingMoney;
                this.upcommingMoney = 0;
                console.log("Money: ", this.money);
                this.picked = false;
            }

            if (this.isDropping) {
                this.toggleIsDropping();
            }
        }

        this.ropeLength += this.dropSpeed * this.currentHookDirection;
    },

    toggleIsDropping() {
        if (this.isDropping) {
            this.isDropping = false;
            this.currentHookDirection = 0;
            this.ropeLength = this.minimumRopeLength;
            this.hookRotationDirection = this.previousHookRotationDirection;
        } else {
            this.isDropping = true;
            this.currentHookDirection = 1;

            this.previousHookRotationDirection = this.hookRotationDirection;
            this.hookRotationDirection = 0;
        }
    },

    scanning() {
        this.collectableItems.forEach(item => {
            if (item != null && !this.picked) {
                this.checkCollidedWithCollectableItems(item);
            }
        });
    },

    checkCollidedWithCollectableItems(item) {
        let distanceToHook = cc.pDistance(this.hookRope[0].getPosition(), item.getPosition());
        let itemRadius = item.getBoundingBox().width / 2;

        if (distanceToHook <= itemRadius)
        {
            this.pick(item);
        }
    },

    pick(item) {
        if (item.getTag() === 1) {
            this.upcommingMoney = 400;
            this.dropSpeed = 2;

            console.log("Gold: +" + this.upcommingMoney);
            this.hookRope[0].setTexture(res.picked_gold_03);
        } else if (item.getTag() === 2) {
            this.upcommingMoney = 700;
            this.dropSpeed = 8;

            console.log("Diamond: +" + this.upcommingMoney);


            this.hookRope[0].setTexture(res.picked_diamond);
        } else if (item.getTag() === 3) {
            this.upcommingMoney = 50;
            this.dropSpeed = 1;

            console.log("Rock: +" + this.upcommingMoney);
            this.hookRope[0].setTexture(res.picked_rock);
        }
        console.log("Drop Speed: " + this.dropSpeed);

        this.removeChild(item);
        this.collectableItems.splice(this.collectableItems.indexOf(item), 1);
        this.picked = true;
        this.currentHookDirection = -1;
    }
});

let MainGameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        let layer = new MainGameLayer();
        this.addChild(layer);
    }
});