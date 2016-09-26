var SHOPPING_OBJECT_DEFAULT_WIDTH = 60;
var SHOPPING_OBJECT_DEFAULT_HEIGHT = 60;
var ShoppingBasketLayer = TestLayer.extend({
    _data: null,
    _basket: null,

    _activateObjects: [],
    _deactivateObjects: [],
    _activateSlots: [],

    timePlayed: 0,

    _basketScale: 0.8,
    _basketBBox: null,

    _blockFlag: false,
    _didObjectAllowedToMove: false,

    _currentObjectMoving: null,
    _currentAvailableSlot: null,
    _currentObjectOriginPos: null,
    _goal: 0,

    ctor: function(data, timePlayed) {
        this._super();
        this.timePlayed = timePlayed || 0;
        this._fetchObjectData(data);

        this._addBasket();
        this._showAllObjects();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },

    onEnterTransitionDidFinish: function() {
        this._super();
        this.runAction(cc.sequence(cc.delayTime(0.1),cc.callFunc(function() {Utils.startCountDownTimePlayed();})))
    },

    _addBasket: function() {
        this._basket = new cc.Sprite(res.Basket_png);
        this._basket.scale = this._basketScale;
        this._basket.x = cc.winSize.width/2;
        this._basket.y = cc.winSize.height/2 - 50* Utils.getScaleFactorTo16And9();
        this.addChild(this._basket);

        this._basketBBox = this._basket.getBoundingBox();
        this._calcPossibleSlots();
    },

    _calcPossibleSlots: function() {
        for (var i = 0; i < this._goal; i++) {
            var x = (Math.random(0.2) + 0.9) * this._basket.x;
            var y = (Math.random(0.2) + 0.9) * this._basket.y;
            this._activateSlots.push(cc.p(x*this._basketScale, y*this._basketScale));
            cc.log("x : %f - y: %f", x, y);
        }
        this._currentAvailableSlot = this._activateSlots[0];
    },

    _showAllObjects: function() {
        var currentX = 0;
        var tempX = 0;
        var tempY = 1;
        var lastObjX = 0;
        var inSecondRow = false;
        for (var i = 0; i < this._data.length; i++) {
            var objImageName = this._data[i].value;
            var objType = this._data[i].type;
            var imgPath = objType + "s/" + objImageName + ".png";
            var obj;
            if (objType == "number") {
                // cc.log("create LabelBMFont -> " + imgPath);
                obj = new cc.LabelBMFont(objImageName, res.CustomFont_fnt);
            }
            else if (objType == "object" || objType == "animal") {
                // cc.log("create normal sprite -> " + imgPath);
                obj = new cc.Sprite(imgPath);
            }
            else
                continue;
            obj.tag = i;
            // cc.log("add objects tag: " + obj.tag);
            obj.scale = (obj.width > SHOPPING_OBJECT_DEFAULT_WIDTH) ? SHOPPING_OBJECT_DEFAULT_WIDTH/obj.width : SHOPPING_OBJECT_DEFAULT_HEIGHT/obj.height;
            obj.x = obj.width * obj.scale * 2 + (obj.width*obj.scale + 20) * tempX;
            obj.y = (inSecondRow) ? (cc.rectGetMinY(this._basketBBox) - obj.height * obj.scale) : (cc.rectGetMaxY(this._basketBBox) + obj.height * obj.scale);

            if (obj.x > (cc.winSize.width - 200)) {
                inSecondRow = true;
                tempX = 0;
            } else
                tempX = tempX+1;
            
            // cc.log("obj.x: " + obj.x);
            // cc.log("cc.winSize.width: " + cc.winSize.width);
            this.addChild(obj, 2);
            this._activateObjects.push(obj);
        };
    },

    _fetchObjectData: function(data) {
        ShoppingBasketLayer._data = data;
        if (data)
            this._data = data.map(function(id) {
                var o = GameObject.getInstance().findById(id);
                // cc.log("o" + JSON.stringify(o));
                if (o[0]) {
                    cc.log("o[0]: " + JSON.stringify(o[0]));
                    // cc.log("return o[0]");
                    return o[0];
                } else {
                    cc.log("return Id");
                    return id;
                }
            });
        else
            this._data = [];

        this._goal = this._data.length;
        this.setData(JSON.stringify(this._data));
        cc.log("data after map: " + JSON.stringify(this._data));
    },

    onTouchBegan: function (touch, event) {
        var touchLoc = touch.getLocation();
        var self = event.getCurrentTarget();

        if (self._blockFlag)
            return false;

        self._deactivateObjects.forEach(function(obj){
            var bBox = obj.getBoundingBox();
            if (cc.rectContainsPoint(bBox, touchLoc)) {
                self._didObjectAllowedToMove = false;
                return true;
            }
        });

        self._activateObjects.forEach(function(obj){
            var bBox = obj.getBoundingBox();
            if (cc.rectContainsPoint(bBox, touchLoc)) {
                // cc.log("touch _activateObjects with tag: " + obj.tag);
                self._didObjectAllowedToMove = true;
                self._currentObjectMoving = obj;
                self._currentObjectOriginPos = obj.getPosition();
                return true;
            }
        });

        return true;
    },

    onTouchMoved: function (touch, event){
        var touchLoc = touch.getLocation();
        var self = event.getCurrentTarget();

        if (!self._didObjectAllowedToMove)
            return;
        // self._playObjectOderSound();
        self._currentObjectMoving.setPosition(touchLoc);
    },

    onTouchEnded: function (touch, event) {
        var touchLoc = touch.getLocation();
        var self = event.getCurrentTarget();

        if (self._blockFlag)
            return;

        if (!self._didObjectAllowedToMove)
            return;

        if (!self._currentAvailableSlot)
            return;

        self._blockFlag = true; // block touch, processing
        // calculate distance of object and slot
        // // var currSlotPos = self._currentAvailableSlot;
        var currObjectPos = self._currentObjectMoving.getPosition();
        // // var distance = cc.pDistance(currObjectPos, currSlotPos);
        // cc.log("currentslotPos: " + JSON.stringify(currSlotPos));
        // cc.log("distance: " + distance);
        if (cc.rectContainsPoint(self._basketBBox, currObjectPos)) { // move succeed
            self._handleObjectSucceedDrop();
        } else // return object to origin pos
            self._currentObjectMoving.setPosition(self._currentObjectOriginPos);

        self._renewPlayTurn();

        self._blockFlag = false; // unlock 
        // cc.log("OBJECT ACTIVATE: " + self._activateSlots.length);
        // cc.log("_activateObjects: " + self._activateObjects);
        // cc.log("_deactivateObjects: " + self._deactivateObjects);
    },


    _checkCompletedScene: function() {
        if (this._activateSlots.length == 0) {
            this._blockFlag = true;
            if (this.timePlayed < 3)
                this.runAction(cc.sequence(
                    cc.delayTime(2),
                    cc.callFunc(function() {
                        this.timePlayed++;
                        cc.director.runScene(new ShoppingBasketScene(ShoppingBasketLayer._data, this.timePlayed)); 
                    })
                ));
            else {
                Utils.updateStepData();
                SceneFlowController.getInstance().clearData();
                cc.director.runScene(new MapScene());
            }
        }
    },

    _redefineActiveObjectTag: function() {
        for (var i = 0; i < this._activateObjects.length; i++) {
            var obj = this._activateObjects[i];
            obj.tag = i;
        }
    },

    _renewPlayTurn: function() {
        this._currentObjectMoving = null;
        this._currentObjectOriginPos = null;
        this._didObjectAllowedToMove = false;
        this._redefineActiveObjectTag();
    },

    _handleObjectSucceedDrop: function() {
        this._currentObjectMoving.setPosition(this._currentAvailableSlot);
        this._activateObjects.splice(this._currentObjectMoving.tag, 1)
        this._deactivateObjects.push(this._currentObjectMoving);

        //set for playSoundObjectOder
        // this._currentObjectOder += 1;
        
        // remove current slot
        this._currentAvailableSlot = null;
        this._activateSlots.splice(0, 1);
        //paly soundCorrect
        jsb.AudioEngine.play2d(res.Succeed_sfx);

        this._currentAvailableSlot = this._activateSlots[0];
        // if (this._currentAvailableSlot)
        //     this._runSlotAction(this._currentAvailableSlot);
        this._checkCompletedScene();
        this.updateProgressBar();
    },

    updateProgressBar: function() {
        var percent = this._deactivateObjects.length / this._goal;
        this._hudLayer.setProgressBarPercentage(percent);
        this._hudLayer.setProgressLabelStr(this._deactivateObjects.length, this._goal);

        var starEarned = 0;
        var objectCorrected = this._deactivateObjects.length;
        var starGoals = this.countingStars();
        if (objectCorrected >= starGoals.starGoal1 && objectCorrected < starGoals.starGoal2)
            starEarned = 1;
        if (objectCorrected >= starGoals.starGoal2 && objectCorrected < starGoals.starGoal3)
            starEarned = 2;
        if (objectCorrected >= starGoals.starGoal3)
            starEarned = 3;

        this._hudLayer.setStarEarned(starEarned);

        if (starEarned > 0)
            this._hudLayer.addStar("light", starEarned);
    },

    countingStars: function() {
        var starGoal1 = Math.ceil(this._goal/3);
        var starGoal2 = Math.ceil(this._goal/3 * 2);
        var starGoal3 = this._goal;
        return {starGoal1: starGoal1,
                starGoal2: starGoal2, 
                starGoal3: starGoal3};
    },
});
ShoppingBasketLayer._data = null;

var ShoppingBasketScene = cc.Scene.extend({
    ctor: function(data, timePlayed) {
        this._super();

        var l = new ShoppingBasketLayer(data, timePlayed);
        this.addChild(l);
    }
});