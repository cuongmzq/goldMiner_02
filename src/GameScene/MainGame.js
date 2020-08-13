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
                this.sourceSprite = res.gold_00;
                this.pickedHookSprite = res.picked_gold_00;
                this.value = 60;
                this.weight = 5;
                this.setName("Gold_00")
                break;
            case C_ITEMS.Gold_01:
                this.sourceSprite = res.gold_01;
                this.pickedHookSprite = res.picked_gold_01;
                this.value = 150;
                this.weight = 10
                this.setName("Gold_01");
                break;
            case C_ITEMS.Gold_02:
                this.sourceSprite = res.gold_02;
                this.pickedHookSprite = res.picked_gold_02;
                this.value = 350;
                this.weight = 20
                this.setName("Gold_02");
                break;
            case C_ITEMS.Gold_03:
                this.sourceSprite = res.gold_03;
                this.pickedHookSprite = res.picked_gold_03;
                this.value = 500;
                this.weight = 30
                this.setName("Gold_03");
                break;
            case C_ITEMS.Rock_00:
                this.sourceSprite = res.rock_00;
                this.pickedHookSprite = res.picked_rock_00;
                this.value = 20;
                this.weight = 20
                this.setName("Rock_00");
                break;
            case C_ITEMS.Rock_01:
                this.sourceSprite = res.rock_01;
                this.pickedHookSprite = res.rock_01;
                this.value = 50;
                this.weight = 30
                this.setName("Rock_01");
                break;
            case C_ITEMS.Diamond:
                this.sourceSprite = res.diamond;
                this.pickedHookSprite = res.diamond;
                this.value = 850;
                this.weight = 1;
                this.setName("Diamond")
                break;
            case C_ITEMS.Bag:
                this.sourceSprite = res.bag;
                this.pickedHookSprite = res.picked_bag;
                this.value = 850;
                this.weight = 1;
                this.setName("Bag")
                break;
            case C_ITEMS.Bone:
                this.sourceSprite = res.bone;
                this.pickedHookSprite = res.picked_bone;
                this.value = 850;
                this.weight = 1;
                this.setName("Bone")
                break;
            case C_ITEMS.Skull:
                this.sourceSprite = res.skull;
                this.pickedHookSprite = res.picked_skull;
                this.value = 850;
                this.weight = 1;
                this.setName("Skull")
                break;
            case C_ITEMS.TNT:
                this.sourceSprite = res.tnt;
                this.pickedHookSprite = res.picked_fracture;
                this.value = 850;
                this.weight = 1;
                this.setName("TNT")
                break;
            case C_ITEMS.Mole:
                this.sourceSprite = res.mole_00;
                this.pickedHookSprite = res.picked_mole;
                this.value = 850;
                this.weight = 1;
                this.setName("Mole")
                break;
            case C_ITEMS.Mole_diamond:
                this.sourceSprite = res.mole_diamond_00;
                this.pickedHookSprite = res.picked_mole_diamond;
                this.value = 850;
                this.weight = 1;
                this.setName("Mole_diamond")
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
    layerZOrder: 5,
    roll: null,
    ropeHook: [],

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

    _previousRotationDirection: 0,

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
        this.swinging();
    },

    initRollHookRope: function () {
        this.ropeLength = this.ropeLengthMin;

        //First
        this.roll = cc.Sprite.create(res.roll);
        this.roll.setPosition(0, 0);
        this.addChild(this.roll, this.layerZOrder);

        this.ropeLengthMaximum = Math.sqrt(Math.pow(cc.winSize.width / 2, 2) + Math.pow(this.convertToWorldSpace(this.roll.getPosition()).y, 2));
        this.ropeLengthMax = this.ropeLengthMaximum;

        //Second: Hook is the first element
        let hook = cc.Sprite.create(res.hook);
        hook.setPosition(cc.p(this.roll.x, this.roll.y - 5 * this.ropeLengthMin));
        hook.setAnchorPoint(0.5, 0.9);
        this.ropeHook[0] = hook;
        this.addChild(this.ropeHook[0], this.layerZOrder);
        console.log(hook.y, this.ropeHook[0].y);

        //Third: 5 is the height of ropeTile Res
        this.ropePartsCount = this.ropeLengthMax / 5;

        for (let i = 1; i <= this.ropePartsCount; ++i) {
            let ropePart = cc.Sprite.create(res.rope_tile);
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

        let ropeHide = cc.Sprite.create(res.rope_hide);
        ropeHide.setPosition(cc.p(this.roll.x - 2, this.roll.y + 2));
        this.addChild(ropeHide, this.layerZOrder);
    },

    swinging() {
        this._rotation -= this._rotationStep * this._rotationDirection;

        if (this._rotation <= -this._rotationLimit || this._rotation >= this._rotationLimit) {
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

        // this.ropeLengthMax = ((cc.winSize.width / 2) / Math.abs(Math.cos(cc.degreesToRadians(Math.abs(90 - this._rotation)))));
        console.log(this.ropeLengthMax);

        this.schedule(function (dt) {
            this.dropping();
        }, 0.01, 999, 0, 'dropping');

        this.schedule(function (dt) {
            this.scanning(collectableItems);
        }, 0.1, 999, 0, 'scanning');
    },

    dropping: function () {
        this.ropeLength += this._dropSpeed * this._dropDirection;
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
        console.log("+ " + this.pickedItem.value + "Money: " + mainLayerTHIS.playerMoney);
        this.ropeHook[0].setTexture(res.hook);
        this.pickedItem = null;
        this._dropSpeed = 5;
    },

    toggleReturnDirection() {
        this._dropDirection = -1;
        if (this.pickedItem == null)
        {
            this._dropSpeed = 20;
        }
        else
        {
            this._dropSpeed = this.pickedItem.weight;
        }
    },

    scanning: function (collectableItemList) {
        collectableItemList.forEach((item, index) => {
            if (cc.pDistance(mainLayerTHIS.convertToWorldSpace(item.getPosition()), this.convertToWorldSpace(this.ropeHook[0].getPosition())) <= item.getBoundingBox().width / 2)
            {
                this.toggleReturnDirection();
                this.pick(item, index);
                this.unschedule("scanning");
            }
        });
    },

    pick: function(item, itemIndex) {
        collectableItems.splice(itemIndex, 1);
        this.ropeHook[0].setTexture(item.pickedHookSprite);

        this.pickedItem = item;

        console.log("Picked " + item.getName() + " " + item.value + " " + item.weight);

        mainLayerTHIS.removeChild(item);
    },


});


let MainGameLayer = cc.Layer.extend({
    roll: null,

    gridWidth: 0,
    gridHeight: 0,

    countX: 0,
    countY: 0,

    collectableItemsSlots: [],

    playerMoney: 0,
    playerMoneyIncoming: 0,

    //Collectable Items - Testing...


    ctor: function () {
        this._super();
        mainLayerTHIS = this;
        this.initialization();
        this.createRoll();
        this.createBackground();
        this.createGrid();
        this.createCollectableItems();
        this.scheduleUpdate();
    },

    update: function (dt) {
        // A in B
        // C in D
        // let aWorldPos = B.convertToWorldSpace(A.getPosition());
        // let cWorldPos = D.convertToWorldSpace(C.getPosition());
    },

    // Init
    initialization: function () {

    },

    // Init creation
    createBackground: function () {
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

    createGrid: function () {
        this.countX = 10;
        this.countY = 6;

        this.gridWidth = 900;
        this.gridHeight = this.roll.y - 100;

        let paddingX = (cc.winSize.width - this.gridWidth) / 2;
        let paddingYBottom = 100;

        let tileWidth = this.gridWidth / this.countX;
        let tileHeight = (this.gridHeight - paddingYBottom) / this.countY;


        let firstPoint = cc.p(paddingX + tileWidth / 2, tileHeight / 2 + paddingYBottom);

        for (let row = 0; row < this.countY; ++row)
        {
            for (let column = 0; column < this.countX; ++column)
            {
                let position = cc.p(firstPoint.x + tileWidth * column, firstPoint.y + tileHeight * row);

                //For Testing Overlay
                let tile = cc.Sprite.create(res.white_tile);
                tile.setPosition(position);
                this.addChild(tile, 10);

                this.collectableItemsSlots.push(position);
            }
        }
    },

    createCollectableItems: function () {


        let keys = Object.keys(C_ITEMS);
        console.log(keys);
        let levelKeys = [C_ITEMS.Rock_01, C_ITEMS.Diamond, C_ITEMS.Gold_00];
        console.log(levelKeys);

        for (let i = 0; i < 40; ++i) {

            let randomPosID = Math.floor(Math.random() * this.collectableItemsSlots.length);
            let randomID = Math.floor(Math.random() * (levelKeys.length));

            let item = levelKeys[randomID];

            let collectableItem = new C_ITEM(item);
            collectableItem.setPosition(this.collectableItemsSlots[randomPosID]);

            this.collectableItemsSlots.splice(randomPosID, 1);

            this.addChild(collectableItem);

            collectableItems.push(collectableItem);
        }

        console.log(collectableItems);
    },

    createRoll: function () {
        this.roll = new HOOK_ROLL();
        this.roll.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 160);
        this.addChild(this.roll, 5);
    },

    // drop() {
    //     this.scanning();
    //
    //     if (this.ropeLength >= this.maximumRopeLength) {
    //         this.currentHookDirection = -this.currentHookDirection;
    //         this.dropSpeed = 14;
    //
    //     } else if (this.ropeLength < this.minimumRopeLength) {
    //         this.hookRope[0].setTexture(res.hook);
    //         this.dropSpeed = 6;
    //         if (this.picked) {
    //             this.money += this.upcommingMoney;
    //             this.upcommingMoney = 0;
    //             console.log("Money: ", this.money);
    //             this.picked = false;
    //         }
    //
    //         if (this.isDropping) {
    //             this.toggleIsDropping();
    //         }
    //     }
    //
    //     this.ropeLength += this.dropSpeed * this.currentHookDirection;
    // },
    //
    // toggleIsDropping() {
    //     if (this.isDropping) {
    //         this.isDropping = false;
    //         this.currentHookDirection = 0;
    //         this.ropeLength = this.minimumRopeLength;
    //         this.hookRotationDirection = this.previousHookRotationDirection;
    //     } else {
    //         this.isDropping = true;
    //         this.currentHookDirection = 1;
    //
    //         this.previousHookRotationDirection = this.hookRotationDirection;
    //         this.hookRotationDirection = 0;
    //     }
    // },
    //
    // scanning() {
    //     this.collectableItems.forEach(item => {
    //         if (item != null && !this.picked) {
    //             this.checkCollidedWithCollectableItems(item);
    //         }
    //     });
    // },
    //
    // checkCollidedWithCollectableItems(item) {
    //     let distanceToHook = cc.pDistance(this.hookRope[0].getPosition(), item.getPosition());
    //     let itemRadius = item.getBoundingBox().width / 2;
    //
    //     if (distanceToHook <= itemRadius)
    //     {
    //         this.pick(item);
    //     }
    // },
    //
    // pick(item) {
    //     /*
    //     *if (item.getTag == C_ITEMS)
    //     * this.upcomingmoney;
    //     * this.dropSpeed
    //     * this.hookrope.settexture;
    //      */
    //
    //     // this.upcommingMoney = item.prototype.value;
    //     // this.dropSpeed = item.prototype.dropSpeed;
    //     // this.hookRope.setTexture();
    //
    //     this.removeChild(item);
    //     this.collectableItems.splice(this.collectableItems.indexOf(item), 1);
    //     this.picked = true;
    //     this.currentHookDirection = -1;
    // }
});

let MainGameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        let layer = new MainGameLayer();
        this.addChild(layer);
    }
});