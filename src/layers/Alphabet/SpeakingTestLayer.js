var SpeakingTestLayer = cc.LayerColor.extend({
    _talkingAdi: null,
    _objectsArray: [],
    _currentObjectShowUp: null,
    _itemArray: [],
    _soundName: null,
    _remainingTime: 2,

    currentObjectShowUpId: 0,
    currentObjectName: null,
    resultText: null,
    _userId:null,
    checkCorrectAction:0,
    _objectName: "",
    _nextSceneName: null,
    _oldSceneName: null,

    ctor: function(objectsArray, oldSceneName) {
        this._super(cc.color(255, 255, 255, 255));
        this.font = "hud-font.fnt";
        this._oldSceneName = oldSceneName;
        // this._currentScene = currentScene;
        // cc.log("currentScene: %s", currentScene); 

        cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(touch, event) {return true;}
        }, this);

        
        this._objectsArray = objectsArray || [];
        cc.log("this._objectsArray" + JSON.stringify(this._objectsArray));
        SpeechRecognitionListener.getInstance().setSpeakingLayer(this);

        // NativeHelper.callNative("changeSpeechLanguageArray", [JSON.stringify(this._itemArray)]);
    },

    onEnter: function() {
        this._super();
        
        this._addAdiDog();
        
        this._userId = KVDatabase.getInstance().getString(STRING_USER_ID);
        KVDatabase.getInstance().set("startSceneTime", Date.now()/1000);
        this.playBeginSound();
    },

    playBeginSound: function(){
        self = this;
        var nation = Utils.getLanguage();
        
        this._talkingAdi.adiTalk();
        var mask = new cc.LayerColor(cc.color(0, 0, 0, 0));
        this.addChild(mask, 1000);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) { return true; }
        }, mask);

        var audioId = jsb.AudioEngine.play2d("res/sounds/speak-after_" + nation + ".mp3", false);
        jsb.AudioEngine.setFinishCallback(audioId, function(audioId, audioPath) {
            mask.removeFromParent();

            // self._addLabel();
            self._showNextObject();
        });
    },

    addResultText: function() {
        this._resultTextLb = new cc.LabelBMFont(this.resultText, this.font);
        this._resultTextLb.x = this._talkingAdi.x - this._resultTextLb.width/2 - 100;
        this._resultTextLb.y = this._talkingAdi.y + 400;
        this.addChild(this._resultTextLb);
    },  

    incorrectAction: function() {
        var self = this;
        jsb.AudioEngine.play2d(res.Failed_sfx);

        // if (this._checkTimeUp()) {    
            this._timeUp();
            this.runAction(
                cc.sequence(
                    cc.delayTime(4),
                    cc.callFunc(function() {
                        self._showNextObject();
                        this.checkCorrectAction = 0;
                    })        
                )
            );   
        // }
        var now = Date.now()/1000;
        var deltaTime = now - KVDatabase.getInstance().getInt("startSceneTime", 0);
        SegmentHelper.track(SEGMENT.SPEAK_TEST, { 
            player_id: this._userId, 
            Correct: "incorrectAction",
            objectName: this._objectName,
            timestamp: deltaTime,
            actual_spoken_word:this.resultText
        });
        return false;
    },

    correctAction: function() {
        var self = this;
        jsb.AudioEngine.play2d(res.Succeed_sfx);
        this.runAction(cc.sequence(
            cc.callFunc(function() {
                self._talkingAdi.adiJump();
            }),
            cc.delayTime(1),
            cc.callFunc(function() {
                self._talkingAdi.adiHifi();
            }),
            cc.delayTime(2),
            cc.callFunc(function() {
                this.checkCorrectAction = 1;
                self._showNextObject();
            })
        ));
        var now = Date.now()/1000;
        var deltaTime = now - KVDatabase.getInstance().getInt("startSceneTime", 0);
        SegmentHelper.track(SEGMENT.SPEAK_TEST, { 
            player_id: this._userId, 
            Correct: "correctAction",
            objectName: this._objectName,
            timestamp: deltaTime,
            actual_spoken_word:this.resultText

        });
        return false;
    },

    _showNextObject: function() {
        if (!this._checkCompleted()) {
            if (this._resultTextLb)
                this._resultTextLb.setString("");
            this._showObject();
            // this._remainingTime = 2;
            // this._label.setString(this._remainingTime);
            // this._label.visible = true;
            // this.schedule(this._setLabelString, 1, 1);
            // this._startSpeechRecognizing();    
        }
    },

    _addAdiDog: function() {
        this._talkingAdi = new AdiDogNode();
        this._talkingAdi.scale = 1.5;
        this._talkingAdi.setPosition(cc.p(cc.winSize.width / 3, cc.winSize.height / 6));
        this.addChild(this._talkingAdi);
    },

    _playObjectSound: function(callback) {
        var audioId = jsb.AudioEngine.play2d(this._soundName);
        jsb.AudioEngine.setFinishCallback(audioId, function(audioId, audioPath) {
            callback && callback(audioId);
        });
        this._talkingAdi.adiTalk();
    },

    _checkCompleted: function() {
        if (this.currentObjectShowUpId >= this._objectsArray.length){
            NativeHelper.callNative("stopSpeechRecognition");
            
            var nextSceneName = SceneFlowController.getInstance().getNextSceneName();
            var scene;
            if (nextSceneName != "RoomScene" && nextSceneName != "ForestScene" && nextSceneName != "TalkingAdiScene")
                scene = new window[nextSceneName](this._objectsArray, this._oldSceneName);
            else
                scene = new window[nextSceneName]();
            cc.director.runScene(new cc.TransitionFade(1, scene, cc.color(255, 255, 255, 255)));

            return true;
        }
        return false;
    },

    _checkTimeUp: function() {
        var startTime = KVDatabase.getInstance().getInt("timeUp", 0);
        var now = Date.now()/1000;
        return (now - startTime) >= 2;
    },

    _timeUp: function() {
        var self = this;
        this._talkingAdi.onStoppedListening();
        this._talkingAdi.adiShakeHead();
        this.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(function() {    
                self._playObjectSound();
            })
        )) 
    },

    // _startSpeechRecognizing: function() {
    //     var self = this;
    //     this.runAction(
    //         cc.sequence(
    //             cc.delayTime(3),
    //             cc.callFunc(function() {
    //                 NativeHelper.callNative("startSpeechRecognition", [5000]);
    //                 KVDatabase.getInstance().set("timeUp", Date.now()/1000);
    //                 self._talkingAdi.onStartedListening();
    //             })
    //         )
    //     )
    // },

    _addLabel: function(text) {
        text = text || "";
        this._label = "";
        this._label = new cc.LabelBMFont(text, this.font);
        
        this._label.x = cc.winSize.width / 2;
        this._label.y = cc.winSize.height - 100;
        this.addChild(this._label, 10000);    

        var self = this;
        this._label.runAction(cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function() {
                self._label.removeFromParent();
            })
        ))
    },

    _showObject: function() {
        if (this._currentObjectShowUp) {
            this._currentObjectShowUp.removeFromParent();
            this._currentObjectShowUp = null;
        }
        var objectName = "";
        this._soundName = "";
        if (this._oldSceneName == "RoomScene") {
            objectName = "things/" + this._objectsArray[this.currentObjectShowUpId].name;
            this._soundName = "res/sounds/" + objectName + "-2.mp3";
            this._objectName = objectName;
        }
        else if (this._oldSceneName == "ForestScene") {
            objectName = "animals/" + this._objectsArray[this.currentObjectShowUpId].name;
            this._soundName = "res/sounds/" + objectName + ".mp3";
            this._objectName = objectName;

        }
        
        this.currentObjectName = this._objectsArray[this.currentObjectShowUpId].name;
        var self = this;
        this._playObjectSound(function(audioId) {
            self._addLabel("GO");
            NativeHelper.callNative("startSpeechRecognition", [5000]);
            KVDatabase.getInstance().set("timeUp", Date.now()/1000);
            self._talkingAdi.onStartedListening();
        });

        this._currentObjectShowUp = new cc.Sprite(objectName + ".png");
        this._currentObjectShowUp.x = cc.winSize.width/3*2 + 100;
        this._currentObjectShowUp.y = cc.winSize.height/2;
        this._currentObjectShowUp.scale = 250 / this._currentObjectShowUp.width;
        this.addChild(this._currentObjectShowUp);

        AnimatedEffect.create(this._currentObjectShowUp, "smoke", SMOKE_EFFECT_DELAY, SMOKE_EFFECT_FRAMES, false);
        this.currentObjectShowUpId +=1;
    },

    // _setLabelString: function() {
    //     if (!this._label)
    //         return;
    //     this._remainingTime -= 1;
    //     var self = this;    
    //     if (this._remainingTime == 0) {
    //         this._label.setString("GO!");
    //         this._label.runAction(
    //             cc.sequence(
    //                 cc.delayTime(1),
    //                 cc.callFunc(function() {
    //                     self._label.visible = false;
    //                     return;
    //                 })
    //             )
    //         )
    //     }

    //     if (this._remainingTime > 0) {
    //         this._label.setString(this._remainingTime);
    //     }

    // }
});

var SpeakingTestScene = cc.Scene.extend({
    ctor: function(objectsArray, nextSceneName, oldSceneName){
        this._super();

        var layer = new SpeakingTestLayer(objectsArray, nextSceneName, oldSceneName);
        this.addChild(layer);
    }
});