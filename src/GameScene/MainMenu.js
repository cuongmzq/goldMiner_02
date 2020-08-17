let MainMenuLayer = cc.Layer.extend({
    ctor: function () {
      this._super();
      this.createEnvironment();
    },

    createEnvironment: function () {
        /// Create Background
        let sprite = cc.Sprite.create(menuRes.menu_background);
        let countX = Math.ceil(cc.winSize.width / sprite.getContentSize().width);
        let countY = Math.ceil(cc.winSize.height / sprite.getContentSize().height);

        for (let i = 0; i < countX; ++i)
        {
            for (let j = 0; j < countY; ++j)
            {
                let _sprite = cc.Sprite.create(menuRes.menu_background);
                _sprite.setAnchorPoint(0,0);
                _sprite.setPosition(cc.p(i * sprite.getContentSize().width, j * sprite.getContentSize().height));
                this.addChild(_sprite,0);
            }
        }

        let tunnel = cc.Sprite.create(menuRes.menu_door);
        tunnel.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.addChild(tunnel, 0);

        for (let i = 0; i < 2; ++i)
        {
            let rock = cc.Sprite.create(menuRes.menu_rock);
            rock.setAnchorPoint(0, 0);
            rock.setPosition(rock.getContentSize().width * i, tunnel.getPosition().y - tunnel.getContentSize().height / 2);
            this.addChild(rock, 1);
        }

        for (let i = 0; i < 2; ++i)
        {
            var ground = cc.Sprite.create(menuRes.menu_floor);
            ground.setAnchorPoint(0, 0);
            ground.setPosition(ground.getContentSize().width * i, 0);
            this.addChild(ground,1);
        }

        let leftSide = cc.Sprite.create(menuRes.side_left);
        let rightSide = cc.Sprite.create(menuRes.side_right);

        leftSide.setAnchorPoint(0, 1);
        rightSide.setAnchorPoint(1, 1);

        leftSide.setPosition(0, cc.winSize.height);
        rightSide.setPosition(cc.winSize.width, cc.winSize.height);

        this.addChild(leftSide, 1);
        this.addChild(rightSide, 1);

        let rock_00 = cc.Sprite.create(menuRes.rock_00);
        let rock_01 = cc.Sprite.create(menuRes.rock_01);
        let rock_02 = cc.Sprite.create(menuRes.rock_02);
        let rock_03 = cc.Sprite.create(menuRes.rock_00);


        rock_00.setPosition(cc.winSize.width / 2 + 250, ground.getContentSize().height / 1.5);
        rock_01.setPosition(cc.winSize.width / 2 - 190, ground.getContentSize().height / 1.5);
        rock_02.setPosition(cc.winSize.width / 2 + 190, ground.getContentSize().height / 1.6);
        rock_03.setPosition(cc.winSize.width / 2 + 490, ground.getContentSize().height / 1.2);

        rock_00.setAnchorPoint(0.5, 0);
        rock_01.setAnchorPoint(0.5, 0);
        rock_02.setAnchorPoint(0.5, 0);
        rock_03.setAnchorPoint(0.5, 0);


        this.addChild(rock_00, 1);
        this.addChild(rock_01, 1);
        this.addChild(rock_02, 1);
        this.addChild(rock_03, 1);

        let gold_miner_text = cc.Sprite.create(menuRes.gold_miner_text);
        gold_miner_text.setAnchorPoint(0.5, 1);
        gold_miner_text.setPosition(cc.winSize.width / 2, cc.winSize.height - gold_miner_text.getContentSize().height / 2);
        this.addChild(gold_miner_text);

        let tom_text = cc.Sprite.create(menuRes.tom_text);
        tom_text.setPosition(cc.p(gold_miner_text.x + gold_miner_text.getContentSize().width / 2 - 20, gold_miner_text.y - gold_miner_text.getContentSize().height / 2 - 20));
        tom_text.setAnchorPoint(0.5, 1);
        tom_text.setRotation(-20);
        this.addChild(tom_text);


        let shine = cc.Sprite.extend({
           ctor: function() {
               this._super();
               this.setTexture(menuRes.shine);

               let _rotation = cc.rotateBy(0.3, 20);
               let _scale = cc.scaleBy(0.5, 1.2);

               this.runAction(cc.repeatForever(_rotation));
               this.runAction(cc.repeatForever(cc.sequence(_scale, _scale.reverse())));

           }
        });

        for (let i = 0; i < 4; ++i) {
            let shining = new shine();
            shining.setScale(0.3 + 0.2 * (i % 2));
            shining.setPosition(20 + 200 * i, (gold_miner_text.getContentSize().height - 20) * ((i + 1) % 2) + 10);
            gold_miner_text.addChild(shining, 10);
        }

        let shakeShining = cc.sequence(cc.scaleTo(0.5, 1.1, 1.1), cc.scaleTo(0.5, 1, 1));
        tom_text.runAction(cc.repeatForever(shakeShining));
        
        //Miner

        let miner_body = cc.Sprite.create(menuRes.miner_body_gold);
        miner_body.setAnchorPoint(0.5, 0);
        miner_body.setPosition(cc.winSize.width / 2, ground.getContentSize().height / 1.5);
        this.addChild(miner_body,1);
    }
});

let MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        let layer = new MainMenuLayer();
        this.addChild(layer);
    }
});