var GameSelectorLayer = cc.Layer.extend({

    _scrollView: null,
    _scrollViewContainer: null,

    _iconGapWidth: 178,
    _iconGapHeight: 175,

    ctor: function () {
        this._super();

        var bg = new cc.Sprite(res.Bg_game_jpg);
        bg.x = cc.winSize.width/2;
        bg.y = cc.winSize.height/2;
        this.addChild(bg);

        this.createScrollViewContainer();
        this.createScrollView();
        this.createBackButton();
    },

    createScrollViewContainer: function() {
        var gameData = DataManager.getInstance().getGameData();

        var containerWidth = Math.ceil(gameData.length / 2) * this._iconGapWidth;
        var containerHeight = this._iconGapHeight * 2 + 20;

        // this._scrollViewContainer = new cc.LayerColor(cc.color(255, 0, 0, 255));
        this._scrollViewContainer = new cc.Layer();
        this._scrollViewContainer.setContentSize(containerWidth, containerHeight);

        for (var i = 0; i < gameData.length; i++) {
            var posX = Math.floor(i / 2) * this._iconGapWidth + this._iconGapWidth/2;
            var posY = (1 - (i % 2)) * this._iconGapHeight + this._iconGapHeight/2 + 25;

            var btnGame = new ccui.Button();
            btnGame.setSwallowTouches(false);
            btnGame.loadTextures("icon-game-1.png", "", "", ccui.Widget.PLIST_TEXTURE);
            btnGame.x = posX;
            btnGame.y = posY;
            btnGame.rotation = Math.random() * 10 - 5;
            btnGame.scale = 0.9;
            this._scrollViewContainer.addChild(btnGame, 1);

            var btnShadow = new cc.Sprite("#icon-game-shadow.png");
            btnShadow.x = posX;
            btnShadow.y = posY - 8;
            btnShadow.rotation = btnGame.rotation;
            btnShadow.scale = btnGame.scale;
            this._scrollViewContainer.addChild(btnShadow, 0);

            var pin = new cc.Sprite("#pin.png");
            pin.x = posX;
            pin.y = posY + btnGame.height/2 - 3;
            this._scrollViewContainer.addChild(pin, 2);

            var lbName = new cc.LabelTTF(gameData[i].game_name, "Arial", 18);
            lbName.color = cc.color('#fffa85');
            lbName.x = posX;
            lbName.y = posY - 85;
            this._scrollViewContainer.addChild(lbName);
        }
    },

    createScrollView: function(){
        var self = this;
        this._scrollView = new ccui.ScrollView();
        this._scrollView.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this._scrollView.setTouchEnabled(true);
        this._scrollView.setSwallowTouches(false);
        this._scrollView.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));

        this._scrollView.x = cc.winSize.width/2 - 355;
        this._scrollView.y = 200;
        this._scrollView.setContentSize(this._iconGapWidth * 4, this._iconGapHeight * 2);
        self.addChild(this._scrollView);

        // var innerWidth = Math.ceil(this.schoolBtn.length / 4) * cc.winSize.width;
        // var innerHeight = cc.winSize.height;

        this._scrollView.setBounceEnabled(true);
        this._scrollView.setInnerContainerSize(this._scrollViewContainer.getContentSize());
        this._scrollView.addChild(this._scrollViewContainer);
    },

    createBackButton: function() {
        var bb = new ccui.Button("back.png",
                                 "back-pressed.png",
                                 "",
                                 ccui.Widget.PLIST_TEXTURE);

        bb.x = bb.width*1.5 ;
        bb.y = cc.winSize.height - bb.height;
        bb.addClickEventListener(function() {
            cc.director.replaceScene(new AccountSelectorScene());
        });

        this.addChild(bb);
    },
});

var GameSelectorScene = cc.Scene.extend({
    ctor: function() {
        this._super();

        var gsLayer = new GameSelectorLayer();
        this.addChild(gsLayer);
    }
});