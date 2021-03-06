const C_ITEMS = {
    Gold_00: 1,
    Gold_01: 2,
    Gold_02: 3,
    Gold_03: 4,
    Diamond: 5,
    Rock_00: 6,
    Rock_01: 7,
    Bag: 8,
    Bone: 9,
    Skull: 10,
    TNT: 11,
    Mole: 12,
    Mole_diamond: 13
};

const LEVEL = {
    LEVEL_01: {
        ITEMS: [C_ITEMS.Gold_00, C_ITEMS.Gold_02, C_ITEMS.Gold_03, C_ITEMS.Rock_01],
        ITEM_COUNT: 15,
        TARGET: 650
    },
    LEVEL_02: {
        ITEMS: [C_ITEMS.Gold_00, C_ITEMS.Gold_03, C_ITEMS.Diamond, C_ITEMS.Skull, C_ITEMS.Diamond, C_ITEMS.Bag],
        ITEM_COUNT: 18,
        TARGET: 950
    },
    LEVEL_03: {
        ITEMS: [C_ITEMS.Gold_03, C_ITEMS.Diamond, C_ITEMS.TNT, C_ITEMS.Bone, C_ITEMS.Mole],
        ITEM_COUNT: 24,
        TARGET: 1900
    },

    LEVEL_04: {
        ITEMS: [C_ITEMS.Diamond, C_ITEMS.TNT, C_ITEMS.Bone, C_ITEMS.Mole_diamond],
        ITEM_COUNT: 13,
        TARGET: 3900
    },
    LEVEL_05: {
        ITEMS: [C_ITEMS.Diamond, C_ITEMS.Diamond, C_ITEMS.Bag, C_ITEMS.Gold_00, C_ITEMS.TNT, C_ITEMS.Bone, C_ITEMS.Mole_diamond],
        ITEM_COUNT: 40,
        TARGET: 6900
    },
    LEVEL_06: {
        ITEMS: [C_ITEMS.Diamond],
        ITEM_COUNT: 99,
        TARGET: 19650
    },
};

let LEVELS = [LEVEL.LEVEL_01, LEVEL.LEVEL_02, LEVEL.LEVEL_03, LEVEL.LEVEL_04, LEVEL.LEVEL_05];

let collectableItems = [];
let mainLayerTHIS = null;

let C_ITEM = cc.Sprite.extend({
    sourceSprite: "null",
    pickedHookSprite: "null",
    value: 0,
    weight: 0,

    ctor: function (itemEnum) {
        this._super();

        switch (itemEnum)
        {
            case C_ITEMS.Gold_00:
                this.sourceSprite = resources.gold_00;
                this.pickedHookSprite = resources.picked_gold_00;
                this.value = 60;
                this.weight = 13;
                this.setName("Gold_00");
                break;
            case C_ITEMS.Gold_01:
                this.sourceSprite = resources.gold_01;
                this.pickedHookSprite = resources.picked_gold_01;
                this.value = 150;
                this.weight = 15;
                this.setName("Gold_01");
                break;
            case C_ITEMS.Gold_02:
                this.sourceSprite = resources.gold_02;
                this.pickedHookSprite = resources.picked_gold_02;
                this.value = 350;
                this.weight = 17;
                this.setName("Gold_02");
                break;
            case C_ITEMS.Gold_03:
                this.sourceSprite = resources.gold_03;
                this.pickedHookSprite = resources.picked_gold_03;
                this.value = 500;
                this.weight = 19;
                this.setName("Gold_03");
                break;
            case C_ITEMS.Rock_00:
                this.sourceSprite = resources.rock_00;
                this.pickedHookSprite = resources.picked_rock_00;
                this.value = 20;
                this.weight = 17;
                this.setName("Rock_00");
                break;
            case C_ITEMS.Rock_01:
                this.sourceSprite = resources.rock_01;
                this.pickedHookSprite = resources.picked_rock_01;
                this.value = 50;
                this.weight = 19;
                this.setName("Rock_01");
                break;
            case C_ITEMS.Diamond:
                this.sourceSprite = resources.diamond;
                this.pickedHookSprite = resources.picked_diamond;
                this.value = 850;
                this.weight = 14;
                this.setName("Diamond");
                break;
            case C_ITEMS.Bag:
                this.sourceSprite = resources.bag;
                this.pickedHookSprite = resources.picked_bag;
                this.value = Math.floor(Math.random() * 900) ;
                this.weight = 14;
                this.setName("Bag");
                break;
            case C_ITEMS.Bone:
                this.sourceSprite = resources.bone;
                this.pickedHookSprite = resources.picked_bone;
                this.value = 1;
                this.weight = 12;
                this.setName("Bone");
                break;
            case C_ITEMS.Skull:
                this.sourceSprite = resources.skull;
                this.pickedHookSprite = resources.picked_skull;
                this.value = 15;
                this.weight = 10;
                this.setName("Skull");
                break;
            case C_ITEMS.TNT:
                this.sourceSprite = resources.tnt;
                this.pickedHookSprite = resources.picked_fracture;
                this.value = 2;
                this.weight = 15;
                this.setName("TNT");
                break;
            case C_ITEMS.Mole:
                this.sourceSprite = resources.mole_00;
                this.pickedHookSprite = resources.picked_mole;
                this.value = 5;
                this.weight = 12;
                this.setName("Mole");
                break;
            case C_ITEMS.Mole_diamond:
                this.sourceSprite = resources.mole_diamond_00;
                this.pickedHookSprite = resources.picked_mole_diamond;
                this.value = 855;
                this.weight = 14;
                this.setName("Mole_diamond");
                break;
        }

        this.setTexture(this.sourceSprite);
        this.zIndex = 5;
    },

    getValue: function()
    {
        return this.value;
    },

    getWeight: function()
    {
        return this.weight;
    },

    getPickedHookSprite: function()
    {
        return this.pickedHookSprite;
    }
});

let HOOK_ROLL = cc.Node.extend({
    roll: null,
    ropeHook: [],

    hookCircleDebug: null,
    layerZOrder: 5,

    ropePartsCount: 0,
    ropeLength: 0,
    ropeLengthMin: 50,
    ropeLengthMax: 500,
    ropeLengthMaximum: 0,

    //rotation conflict with built-in variable
    _rotation: 0,
    _rotationStep: 2,
    _rotationDirection: 1,
    _rotationLimit: 85,

    _previousRotationDirection: 1,

    _dropDirection: 0,

    _dropSpeed: 5,

    pickedItem: null,

    ctor: function () {
        this._super();
        this.initRollHookRope();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            allowSwallow: true,
            onTouchBegan: () => {
                if (this.ropeLength <= this.ropeLengthMin)
                {
                    this.drop();
                }
                return true;
            },

            onTouchMoved: () => {

            },

            onTouchEnded: () => {

            }

        }, this);

        this.scheduleUpdate();
    },

    update: function (dt) {
        this.swinging(dt);
    },

    initMiner: function () {

    },

    initRollHookRope: function () {
        this.ropeLength = this.ropeLengthMin;

        //First
        this.roll = cc.Sprite.create(resources.roll);
        this.roll.setPosition(0, 0);
        this.addChild(this.roll, this.layerZOrder);

        // this.ropeLengthMaximum = Math.sqrt(Math.pow(cc.winSize.width / 2, 2) + Math.pow(this.convertToWorldSpace(this.roll.getPosition()).y, 2));
        // console.log(mainLayerTHIS.convertToNodeSpace(this.roll.getPosition()));
        this.ropeLengthMaximum = Math.sqrt(Math.pow(cc.winSize.width / 2, 2) + Math.pow(mainLayerTHIS.groundOrigin.y, 2));
        this.ropeLengthMax = this.ropeLengthMaximum;

        //Second: Hook is the first element
        let hook = cc.Sprite.create(resources.hook);
        hook.setPosition(cc.p(this.roll.x, this.roll.y - 5 * this.ropeLengthMin));
        hook.setAnchorPoint(0.5, 0.9);
        this.ropeHook[0] = hook;
        this.addChild(this.ropeHook[0], this.layerZOrder + 1);

        //Third: 5 is the height of ropeTile Res
        this.ropePartsCount = this.ropeLengthMax / 5;

        for (let i = 1; i <= this.ropePartsCount; ++i) {
            let ropePart = cc.Sprite.create(resources.rope_tile);
            let position = cc.p(this.roll.x, this.roll.y - 5 * i);

            ropePart.setAnchorPoint(0.5, 1);
            ropePart.setPosition(position);

            if (position.y <= this.ropeHook[0].y)
            {
                ropePart.setVisible(false);
            }

            this.ropeHook.push(ropePart);

            this.addChild(this.ropeHook[i], this.layerZOrder);
        }

        let ropeHide = cc.Sprite.create(resources.rope_hide);
        ropeHide.setPosition(cc.p(this.roll.x - 2, this.roll.y + 2));
        this.addChild(ropeHide, this.layerZOrder);
    },

    swinging(dt) {
        this._rotation -= this._rotationStep * this._rotationDirection * dt * 60;

        if (this._rotation < -this._rotationLimit)
        {
            this._rotation = -this._rotationLimit;
            this._rotationDirection = -this._rotationDirection;
        }
        else if (this._rotation > this._rotationLimit)
        {
            this._rotation = this._rotationLimit;
            this._rotationDirection = -this._rotationDirection;
        }

        this.ropeHook[0].setRotation(-this._rotation);

        let _rotationVector = cc.pRotateByAngle(cc.p(0, -1), cc.p(0, 0), cc.degreesToRadians(this._rotation));

        this.ropeHook[0].setPosition(cc.pAdd(this.roll.getPosition(), cc.pMult(_rotationVector, this.ropeLength)));

        for (let index = 1; index < this.ropePartsCount; ++index) {
            this.ropeHook[index].setPosition(cc.pAdd(this.roll.getPosition(), cc.pMult(_rotationVector, this.ropeLength - index * 5)));
            this.ropeHook[index].setRotation(-this._rotation);

            let isWithInHookAndRoll = this.ropeHook[index].y <= this.roll.y && this.ropeHook[index].y >= this.ropeHook[0].y;

            this.ropeHook[index].setVisible(isWithInHookAndRoll);
        }
    },

    drop: function () {
        this._previousRotationDirection = this._rotationDirection;
        this._rotationDirection = 0;
        this._dropDirection = 1;

        this.schedule(function (dt) {
            this.dropping(dt);
        }, 0.01, 999, 0, 'dropping');

        this.schedule(function (dt) {
            this.scanning(collectableItems);
        }, 0.1, 999, 0, 'scanning');
    },

    dropping: function (dt) {
        this.ropeLength += this._dropSpeed * this._dropDirection * dt * 60;
        if (this.ropeLength >= this.ropeLengthMax)
        {
            this.toggleReturnDirection();
        }
        else if (this.ropeLength < this.ropeLengthMin)
        {
            this.ropeLength = this.ropeLengthMin;

            this._dropDirection = 0;
            this._dropSpeed = 5;

            this._rotationDirection = this._previousRotationDirection;
            this.unschedule("dropping");

            if (this.pickedItem != null)
            {
                this.returnedWithPickedItem();
            }
        }
    },

    returnedWithPickedItem() {
        mainLayerTHIS.playerMoney += this.pickedItem.value;
        mainLayerTHIS.plusMoney.setString("+" + this.pickedItem.value);
        mainLayerTHIS.animatePlusMoney();

        console.log("+ " + this.pickedItem.value + " " + "Money: " + mainLayerTHIS.playerMoney);
        this.ropeHook[0].setTexture(resources.hook);
        this.pickedItem = null;
        this._dropSpeed = 5;

        mainLayerTHIS.currentMoneyUIText.setString("Money: " + mainLayerTHIS.playerMoney);
        if (mainLayerTHIS.playerMoney >= mainLayerTHIS.currentLevel.TARGET)
        {
            mainLayerTHIS.passedLevel = true;
            console.log("PASSED LEVEL");
        }
    },

    toggleReturnDirection() {
        this._dropDirection = -1;
        if (this.pickedItem == null)
        {
            this._dropSpeed = 20;
        }
        else
        {
            this._dropSpeed = 20 - this.pickedItem.weight;
            console.log("Speed: " + this._dropSpeed);
        }
    },

    scanning: function (collectableItemList) {
        collectableItemList.forEach((item, index) => {
            if (cc.pDistance(mainLayerTHIS.convertToWorldSpace(item.getPosition()), this.convertToWorldSpace(this.ropeHook[0].getPosition())) <= item.getContentSize().width / 2)
            {
                this.pick(item, index);
                this.toggleReturnDirection();
            }
        });
    },

    pick: function(item, itemIndex) {
        collectableItems.splice(itemIndex, 1);

        this.ropeHook[0].setTexture(item.pickedHookSprite);
        this.pickedItem = item;

        console.log("Picked " + item.getName() + " Value: " + item.value + " Weight: " + item.weight);
        mainLayerTHIS.removeChild(item);
        this.unschedule("scanning");
    },
});


let MainGameLayer = cc.Layer.extend({
    roll: null,

    groundOrigin: 0,

    gridWidth: 0,
    gridHeight: 0,

    countX: 0,
    countY: 0,

    collectableItemsSlots: [],

    playerMoney: 0,
    playerMoneyIncoming: 0,

    currentLevel: null,
    passedLevel: false,
    timer: 1,
    timeLevel: 30,

    timerUIText: null,
    currentMoneyUIText: null,
    targetMoneyUIText: null,

    plusMoneyUIText: null,

    ctor: function () {
        this._super();
        mainLayerTHIS = this;
        this.createUI();
        this.createBackground();
        this.createRoll();
        this.resetLevel();
        this.loadNextLevel();

        this.scheduleUpdate();
    },

    update: function (dt) {
        this.countDown(dt);
    },

    countDown: function (dt) {
        if (this.timer > 0)
        {
            this.timer -= dt;
        }
        else
        {
            // this.loadLevelTransition();
            this.resetLevel();
            this.loadNextLevel();
        }

        this.timerUIText.setString(parseInt(this.timer));
    },

    animatePlusMoney: function () {
        this.plusMoney.setVisible(true);

        let moveBy = cc.moveBy(0.4, cc.p(-300, 100), 0);

        let fade = new cc.fadeOut(0.2);
        let fadeIn = new cc.fadeIn(0.1);
        let changePos = new cc.moveTo(0, cc.p(this.roll.getPosition().x, this.roll.getPosition().y + 10), 0);
        let delay = new cc.delayTime(0.8);

        let sequence = new cc.sequence(changePos, fadeIn, moveBy, delay, fade);
        this.plusMoney.runAction(sequence);
    },

    // loadLevelTransition: function () {
    //     let fadeIn = new cc.fadeIn(0.2);
    //     let fadeOut = new cc.fadeOut(0.2);
    //     let sequence = new cc.sequence(fadeOut, fadeIn);
    //
    //     this.runAction(sequence);
    // },

    createUI: function () {
       this.timerUIText = new cc.LabelTTF("Timer: ", "Arial", 32 , cc.size(180, 60), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
       this.timerUIText.setAnchorPoint(1, 1);
       this.timerUIText.setPosition(cc.winSize.width, cc.winSize.height);
       this.addChild(this.timerUIText, 10);

        this.currentMoneyUIText = new cc.LabelTTF("Money: " + 0, "Arial", 32 , cc.size(400, 60), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.currentMoneyUIText.setAnchorPoint(0, 1);
        this.currentMoneyUIText.setPosition(10, cc.winSize.height);
        this.addChild(this.currentMoneyUIText, 10);

        this.targetMoneyUIText = new cc.LabelTTF("Target: ", "Arial", 32 , cc.size(400, 60), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.targetMoneyUIText.setAnchorPoint(0, 1);
        this.targetMoneyUIText.setPosition(10, cc.winSize.height - 100);
        this.addChild(this.targetMoneyUIText, 10);

        this.plusMoney = new cc.LabelTTF("+", "Arial", 20, cc.size(50,50), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addChild(this.plusMoney, 10);
        this.plusMoney.setVisible(false);
    },

    // Init creation
    createBackground: function () {
        //Create Brown Under Layer
        let brown_tile = cc.Sprite.create(resources.white_tile);
        brown_tile.runAction(cc.tintTo(0, 86, 52, 37));
        brown_tile.setAnchorPoint(0, 0);
        brown_tile.setScale(cc.winSize.width / brown_tile.width, cc.winSize.height / brown_tile.height);
        this.addChild(brown_tile, 0);

        //Create Purple Tile
        let purple_tile_01 = cc.Sprite.create(resources.purple_tile);
        purple_tile_01.setAnchorPoint(0, 1);
        purple_tile_01.setScale(1, 1.5);
        purple_tile_01.setPosition(0, cc.winSize.height);
        this.addChild(purple_tile_01);

        let purple_tileCount = cc.winSize.width / purple_tile_01.getContentSize().width;
        for (let i = 1; i <= purple_tileCount; ++i) {
            let purple_tile = cc.Sprite.create(resources.purple_tile);
            purple_tile.setAnchorPoint(0, 1);
            purple_tile.setScale(1, 1.5);
            purple_tile.setPosition(purple_tile_01.getContentSize().width * i, cc.winSize.height);
            this.addChild(purple_tile);
        }

        //Create Purple Tile
        let game_top_bg_01 = cc.Sprite.create(resources.game_top_bg);
        game_top_bg_01.setAnchorPoint(0, 1);
        game_top_bg_01.setPosition(0, cc.winSize.height);
        this.addChild(game_top_bg_01);

        let game_top_bgCount = cc.winSize.width / game_top_bg_01.getContentSize().width;
        for (let i = 1; i <= game_top_bgCount; ++i) {
            let game_top_bg = cc.Sprite.create(resources.game_top_bg);
            game_top_bg.setAnchorPoint(0, 1);
            game_top_bg.setPosition(game_top_bg_01.getContentSize().width * i, cc.winSize.height);
            this.addChild(game_top_bg);
        }

        //Create Ground Tile
        let ground_tile_01 = cc.Sprite.create(resources.ground_tile);
        ground_tile_01.setAnchorPoint(0, 0.5);
        ground_tile_01.setPosition(0, game_top_bg_01.y - game_top_bg_01.getContentSize().height);
        this.groundOrigin = cc.p(cc.winSize.width / 2, ground_tile_01.getPosition().y);
        this.addChild(ground_tile_01);

        let ground_tileCount = cc.winSize.width / ground_tile_01.getContentSize().width;
        for (let i = 1; i <= ground_tileCount; ++i) {
            let ground_tile = cc.Sprite.create(resources.ground_tile);
            ground_tile.setAnchorPoint(0, 0.5);
            ground_tile.setPosition(ground_tile_01.getContentSize().width * i, game_top_bg_01.y - game_top_bg_01.getContentSize().height);
            this.addChild(ground_tile);
        }

        //Create BG_Layer_01 Tile
        let bg_tile_01_01 = cc.Sprite.create(resources.bg_tile_01);
        bg_tile_01_01.setAnchorPoint(0, 0.5);
        bg_tile_01_01.setPosition(0, ground_tile_01.y / 2);
        this.addChild(bg_tile_01_01);

        let bg_tile_01Count = cc.winSize.width / bg_tile_01_01.getContentSize().width;
        for (let i = 1; i <= bg_tile_01Count; ++i) {
            let bg_tile_01 = cc.Sprite.create(resources.bg_tile_01);
            bg_tile_01.setAnchorPoint(0, 0.5);
            bg_tile_01.setPosition(bg_tile_01_01.getContentSize().width * i, ground_tile_01.y / 2);
            this.addChild(bg_tile_01);
        }

        //Create BG_Layer_02 Tile
        let bg_tile_02_01 = cc.Sprite.create(resources.bg_tile_02);
        bg_tile_02_01.setAnchorPoint(0, 0.5);
        bg_tile_02_01.setPosition(0, ground_tile_01.y / 4 * 3);
        this.addChild(bg_tile_02_01);

        let bg_tile_02Count = cc.winSize.width / bg_tile_02_01.getContentSize().width;
        for (let i = 1; i <= bg_tile_02Count; ++i) {
            let bg_tile_02 = cc.Sprite.create(resources.bg_tile_02);
            bg_tile_02.setAnchorPoint(0, 0.5);
            bg_tile_02.setPosition(bg_tile_02_01.getContentSize().width * i, ground_tile_01.y / 4 * 3);
            this.addChild(bg_tile_02);
        }

        //Create BG_Layer_03Tile
        let bg_tile_03_01 = cc.Sprite.create(resources.bg_tile_03);
        bg_tile_03_01.setAnchorPoint(0, 0.5);
        bg_tile_03_01.setPosition(0, ground_tile_01.y / 4);
        this.addChild(bg_tile_03_01);

        let bg_tile_03Count = cc.winSize.width / bg_tile_03_01.getContentSize().width;
        for (let i = 1; i <= bg_tile_03Count; ++i) {
            let bg_tile_03 = cc.Sprite.create(resources.bg_tile_03);
            bg_tile_03.setAnchorPoint(0, 0.5);
            bg_tile_03.setPosition(bg_tile_03_01.getContentSize().width * i, ground_tile_01.y / 4);
            this.addChild(bg_tile_03);
        }

        //Create BG_Layer_04 Tile
        let bg_tile_04_01 = cc.Sprite.create(resources.bg_tile_04);
        bg_tile_04_01.setAnchorPoint(0, 0.75);
        bg_tile_04_01.setPosition(0, 0);
        this.addChild(bg_tile_04_01);

        let bg_tile_04Count = cc.winSize.width / bg_tile_04_01.getContentSize().width;
        for (let i = 1; i <= bg_tile_04Count; ++i) {
            let bg_tile_04 = cc.Sprite.create(resources.bg_tile_04);
            bg_tile_04.setAnchorPoint(0, 0.75);
            bg_tile_04.setPosition(bg_tile_04_01.getContentSize().width * i, 0);
            this.addChild(bg_tile_04);
        }
    },

    createGrid: function () {
        this.countX = 16;
        this.countY = 9;

        this.gridWidth = 1000;
        this.gridHeight = this.roll.y - 100;

        let paddingX = (cc.winSize.width - this.gridWidth) / 2;
        let paddingYBottom = 50;

        let tileWidth = this.gridWidth / this.countX;
        let tileHeight = (this.gridHeight - paddingYBottom) / this.countY;


        let firstPoint = cc.p(paddingX + tileWidth / 2, tileHeight / 2 + paddingYBottom);

        for (let row = 0; row < this.countY; ++row)
        {
            for (let column = 0; column < this.countX; ++column)
            {
                let position = cc.p(firstPoint.x + tileWidth * column, firstPoint.y + tileHeight * row);

                //For Testing Overlay
                // let tile = cc.Sprite.create(resources.white_tile);
                // tile.setPosition(position);
                // this.addChild(tile, 10);

                this.collectableItemsSlots.push(position);
            }
        }
    },

    createRoll: function () {
        this.roll = new HOOK_ROLL();
        this.roll.setPosition(cc.winSize.width / 2, this.groundOrigin.y + this.roll.roll.getContentSize().height / 2);
        this.addChild(this.roll, 6);
    },

    createCollectableItems: function () {
        console.log("TARGET: " + this.currentLevel.TARGET);
        this.targetMoneyUIText.setString("Target: " + this.currentLevel.TARGET);
        let levelKeys = this.currentLevel.ITEMS;

        for (let i = 0; i < this.currentLevel.ITEM_COUNT; ++i) {

            let randomPosID = Math.floor(Math.random() * this.collectableItemsSlots.length);
            let randomID = Math.floor(Math.random() * (levelKeys.length));

            let item = levelKeys[randomID];

            let collectableItem = new C_ITEM(item);
            collectableItem.setPosition(this.collectableItemsSlots[randomPosID]);

            // // let drawer = cc.DrawNode.create();
            // // drawer.clear();
            // // drawer.drawCircle(collectableItem.getPosition(), collectableItem.getContentSize().width / 2, cc.degreesToRadians(360), 30, false, 2, cc.color(255, 0, 9));
            // // // drawer.setPosition(collectableItem.getPosition());
            // this.addChild(drawer);

            this.collectableItemsSlots.splice(randomPosID, 1);

            this.addChild(collectableItem);

            collectableItems.push(collectableItem);
        }
    },

    resetLevel: function () {
        this.roll.ropeLength = this.roll.ropeLengthMin;
        this.roll.unschedule("dropping");
        this.roll.unschedule("scanning");
        this.roll._rotationDirection = this.roll._previousRotationDirection;
        this.roll.ropeHook[0].setTexture(resources.hook);
        this.roll._dropSpeed = 5;
        this.roll.pickedItem = null;
        this.passedLevel = false;
        this.timer = this.timeLevel;

        collectableItems.forEach((item, index) => {
            this.removeChild(item);
        });
        collectableItems = [];
        this.collectableItemsSlots = [];
    },

    loadNextLevel: function () {
        if (LEVELS.length > 0)
        {
            this.currentLevel = LEVELS.shift();

            this.createGrid();
            this.createCollectableItems();
        }
    }
});

let MainGameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        let layer = new MainGameLayer();
        this.addChild(layer);
    }
});