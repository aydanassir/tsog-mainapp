var GameObject = cc.Class.extend({
    id: null,
    type: null,
    value: null,

    _data: null,

    init: function() {
        // load json file
        var self = this;
        cc.loader.loadJson(res.Game_Object_JSON, function(err, data) {
            if (!err) {
                self._data = data;
            } else {
                cc.fileUtils.removeFile(Utils.getAssetsManagerPath() + res.Game_Object_JSON);
                cc.loader.loadJson(res.Game_Object_JSON, function(err, data) {
                    self._data = data;
                });
            };
        });
    },

    findById: function(id) {
        return this._data.filter(function(object) {
            if (object.id == id)
                return object;
        });
    },

    getRandomAnObjectDiffWithId: function(id) {
        cc.log("id: " + id);
        var obj = this.findById(id);
        for (var i = 0; i < this._data.length; i++) {
            var object = this._data[i];
            if (obj && obj[0].type == object.type && object.id != id) {
                return object.value;
            }
        }
    },
});

GameObject._instance = null;
GameObject.getInstance = function() {
    return GameObject._instance;
};

GameObject.setupInstance = function() {
    GameObject._instance = new GameObject();
    GameObject._instance.init();
}
