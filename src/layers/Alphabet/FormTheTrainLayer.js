var kTagTrainSlotAction = 1;
var kTagMaxZOrder = 999999;
var FormTheTrainLayer = TestLayer.extend({

    _slotScale: 1,
    _objectScale: 0.8,

    _activateObjects: [],
    _activateSlots: [],

    _deactivateSlots: [],
    _deactivateObjects: [],

    _objectsPosition: [],

    _currentObjectMoving: null,
    _currentObjectOriginPos: null,
    _currentObjectRotation: 0,
    _currentObjectOldZOrder: -1,
    _currentAvailableSlot: null,

    _didObjectAllowedToMove: false,
    _blockFlag: false,

    ctor: function(objArr, isTestScene) {
        this._super();
        cc.log("FormTheTrainLayer");

        this._setIsTestScene(isTestScene);
        this._addTrainSlots();
        this._addTrainObjects();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },

    _addTrainSlots: function() {
        this._activateSlots = [];
        this._deactivateSlots = [];

        var lastBoxXPos = 10;
        for (var i = 0; i < FormTheTrainLayer.NUMBER_OF_BOX; i++) {
            var name = (i==0) ? "head" : "box";
            var s = new cc.Sprite("#train_slot_" + name + ".png");
            s.setAnchorPoint(0.5, 0);
            s.scale = this._slotScale;
            s.x = lastBoxXPos + s.width/2;
            s.y = cc.winSize.height/2;
            s.tag = i;
            this.addChild(s);
            this._activateSlots.push(s);

            var textPosX = (i==0) ? s.width*0.75 : s.width/2;
            var textPosY = s.height/2;
            var lb = new cc.LabelBMFont(i+1, res.CustomFont_fnt);
            lb.setAnchorPoint(0.8, 0);
            lb.scale = 0.8;
            lb.x = textPosX;
            lb.y = textPosY;
            s.addChild(lb);

            lastBoxXPos = s.x + s.width/2 + 10;
        }
    },

    _addTrainObjects: function() {
        this._activateObjects = [];
        this._deactivateObjects = [];
        this._objectsPosition = [];
        var lastBoxXPos = 10;
        for (var i = 0; i < FormTheTrainLayer.NUMBER_OF_BOX; i++) {
            var name = (i==0) ? "head" : "box";
            var s = new cc.Sprite("#train_" + name + ".png");
            // s.setAnchorPoint(0.5, 0);
            s.scale = this._objectScale;
            s.x = lastBoxXPos + s.width/2;
            s.y = s.height;
            s.tag = i;
            this.addChild(s);
            this._activateObjects.push(s);

            var textPosX = (i==0) ? s.width*0.75 : s.width/2;
            var textPosY = s.height/2;
            var lb = new cc.LabelBMFont(i+1, res.CustomFont_fnt);
            lb.setAnchorPoint(0.8, 0);
            lb.scale = 0.8;
            lb.x = textPosX;
            lb.y = textPosY;
            s.addChild(lb);
            
            this._objectsPosition.push(s.getPosition());
            lastBoxXPos = s.x + s.width/2 + 10;
        }

        this._randomTrainObjectPos();
    },

    _randomTrainObjectPos: function() {
        var arrPos = [0, 1, 2, 3, 4, 5];
        var self = this;
        this._activateObjects.forEach(function(obj) {
            var rdmPosIndex = Math.floor(Math.random() * arrPos.length);
            var rdmRotation = Math.floor(Math.random() * 360);
            obj.setPosition(self._objectsPosition[arrPos[rdmPosIndex]]);
            obj.rotation = rdmRotation;
            arrPos.splice(rdmPosIndex, 1);
        });
    },

    onTouchBegan: function(touch, event) {
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
                if (self._isSlotRunningAction)
                    return false;
                self._didObjectAllowedToMove = true;
                self._currentObjectMoving = obj;
                self._currentObjectOriginPos = obj.getPosition();
                self._currentObjectRotation = self._currentObjectMoving.rotation;
                self._currentObjectOldZOrder = self._currentObjectMoving.getLocalZOrder();
                self._currentObjectMoving.rotation = 0;
                self._currentObjectMoving.setLocalZOrder(kTagMaxZOrder);

                self._currentAvailableSlot = self._activateSlots[obj.tag];
                self._runSlotAction(self._currentAvailableSlot);
                self._runObjectPickUpAction(self._currentObjectMoving);
                return true;
            }
        });

        return true;
    },

    onTouchMoved: function(touch, event) {
        var touchLoc = touch.getLocation();
        var self = event.getCurrentTarget();

        if (!self._didObjectAllowedToMove)
            return;

        self._currentObjectMoving.setPosition(touchLoc);
    },

    onTouchEnded: function(touch, event) {
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
        var currSlotPos = self._currentAvailableSlot.getPosition();
        var currObjectPos = self._currentObjectMoving.getPosition();
        var distance = cc.pDistance(currObjectPos, currSlotPos);
        if (distance < 150) // move succeed
            self._handleObjectSucceedDrop();
        else// return object to origin pos
            self._handleObjectFailedDrop();
        self._currentObjectMoving.setLocalZOrder(self._currentObjectOldZOrder);
        self._renewPlayTurn();

        self._blockFlag = false; // unlock 
        if (self._activateSlots.length == 0) {
            self._blockFlag = true;
            if (TSOG_DEBUG)
                cc.director.replaceScene(new cc.TransitionFade(1, new GameTestScene(), cc.color(255, 255, 255, 255)));
            else
                self._moveToNextScene();
            // self._addDebugButton();
        }
    },

    _renewPlayTurn: function() {
        this._currentObjectMoving = null;
        this._currentObjectOriginPos = null;
        this._didObjectAllowedToMove = false;
        this._currentObjectRotation = 0;
        this._currentAvailableSlot = null;
        this._isSlotRunningAction = false;
        this._currentObjectOldZOrder = -1;
        this._redefineActiveObjectTag();
    },

    _redefineActiveObjectTag: function() {
        for (var i = 0; i < this._activateObjects.length; i++) {
            var obj = this._activateObjects[i];
            obj.tag = i;
        }

        for (var i = 0; i < this._activateSlots.length; i++) {
            var slot = this._activateSlots[i];
            slot.tag = i;
        }
    },

    _handleObjectSucceedDrop: function() {

        this._currentObjectMoving.setAnchorPoint(0.5, 0);
        this._currentObjectMoving.setPosition(this._currentAvailableSlot.getPosition());
        this._runObjectDropAction(this._currentObjectMoving, this._slotScale);
        this._activateObjects.splice(this._currentObjectMoving.tag, 1);
        this._deactivateObjects.push(this._currentObjectMoving);
        
        // remove current slot from array
        this._activateSlots.splice(this._currentAvailableSlot.tag, 1);
        this._currentAvailableSlot.removeFromParent();

        this.updateProgressBar();
    },

    _handleObjectFailedDrop: function() {
        this._currentObjectMoving.setPosition(this._currentObjectOriginPos);
        this._runObjectDropAction(this._currentObjectMoving, this._objectScale);
        this._currentObjectMoving.rotation = this._currentObjectRotation;
        this._currentAvailableSlot.stopAllActions();
        this._currentAvailableSlot.color = cc.color.WHITE;
       
    },

    _runSlotAction: function(slot) {
        if (this._isSlotRunningAction)
            return;

        this._isSlotRunningAction = true;
        var action = cc.repeatForever(
                cc.sequence(
                    cc.tintTo(0.25, 255, 100, 100),
                    cc.tintTo(0.25, 255, 255, 255)
                )
            );
        action.tag = kTagTrainSlotAction;
        slot.runAction(action);
    },

    updateProgressBar: function() {
        var percent = this._deactivateObjects.length / FormTheTrainLayer.NUMBER_OF_BOX;
        this._hudLayer.setProgressBarPercentage(percent);
        this._hudLayer.setProgressLabelStr(this._deactivateObjects.length, FormTheTrainLayer.NUMBER_OF_BOX);

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
        var starGoal1 = Math.ceil(FormTheTrainLayer.NUMBER_OF_BOX/3);
        var starGoal2 = Math.ceil(FormTheTrainLayer.NUMBER_OF_BOX/3 * 2);
        var starGoal3 = FormTheTrainLayer.NUMBER_OF_BOX;
        return {starGoal1: starGoal1,
                starGoal2: starGoal2, 
                starGoal3: starGoal3};
    },

    _runObjectPickUpAction: function(obj) {
        if (this._isObjectRunningAction)
            return;
        this._isObjectRunningAction = true;
        obj.runAction(
            cc.sequence(
                cc.scaleTo(0.2, this._objectScale+0.15).easing(cc.easeElasticOut(0.8)),
                cc.scaleTo(0.2, this._objectScale)
            )
        );
    },

    _runObjectDropAction: function(obj, scale) {
        var self = this;
        obj.runAction(
            cc.sequence(
                cc.scaleTo(0.2, scale-0.05).easing(cc.easeBackIn(0.8)),
                cc.scaleTo(0.2, scale),
                cc.callFunc(function() {
                    self._isObjectRunningAction = false;
                })
            )
        );
    },

    _addDebugButton: function () {
        var b = new ccui.Button("table-name.png", "", "", ccui.Widget.PLIST_TEXTURE);
        b.x = cc.winSize.width-b.width/2 - 10;
        b.y = cc.winSize.height-b.height/2 - 10;
        b.setTitleText("RESET GAME");
        b.addClickEventListener(function() {
            cc.director.runScene(new FormTheTrainScene());
        });
        this.addChild(b);
    },
});

FormTheTrainLayer.NUMBER_OF_BOX = 6;

var FormTheTrainScene = cc.Scene.extend({
    ctor:function (isTestScene){
        this._super();

        var l = new FormTheTrainLayer(isTestScene);
        this.addChild(l);
    }
});