let MainMenuLayer = cc.Layer.extend({
    ctor: function () {
      this._super();
      this.createEnvironment();
    },

    createEnvironment: function () {
        /// Create Background
        let sprite = cc.Sprite.create(menuRes.menu_background);
        let countX = Math.ceil(cc.winSize.width / sprite.getBoundingBox().width);
        let countY = Math.ceil(cc.winSize.height / sprite.getBoundingBox().height);

        for (let i = 0; i < countX; ++i)
        {
            for (let j = 0; j < countY; ++j)
            {
                let _sprite = cc.Sprite.create(menuRes.menu_background);
                _sprite.setPosition(cc.p(i * sprite.getBoundingBox().width, j * sprite.getBoundingBox().height));
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
            rock.setPosition(rock.getBoundingBox().width * i, tunnel.getPosition().y - tunnel.getBoundingBox().height / 2);
            this.addChild(rock, 1);
        }

        for (let i = 0; i < 2; ++i)
        {
            let ground = cc.Sprite.create(menuRes.menu_floor);
            ground.setAnchorPoint(0, 0);
            ground.setPosition(ground.getBoundingBox().width * i, 0);
            this.addChild(ground,1);
        }
    }
});

let MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        let layer = new MainMenuLayer();
        this.addChild(layer);
    }
});