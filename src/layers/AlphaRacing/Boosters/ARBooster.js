var ARBooster = cc.Sprite.extend({
    _player: null,
    _isActive: false,

    ctor: function(player, spriteName) {
        this._super("#" + spriteName);
        this._player = player;
    },

    setActive: function(active) {
        if (this._isActive == active)
            return;

        this._isActive = active;
        if (this._isActive) {
            this.willStart();
            this.start();
            this.didStart();
        }
        else {
            this.willEnd();
            this.end();
            this.didEnded();
        }
    },

    isActive: function() {
        return this._isActive;
    },

    start: function() {
        this._player.setBoostFlag(this.getBoostFlag());
    },

    end: function() {

    },

    fixUpdate: function() {

    },

    update: function(dt) {
        if (cc.rectIntersectsRect(this._player.getCollisionBoundingBox(), this.getBoundingBox())) {
            this.onCollide();
        }
    },

    onCollide: function() {
        if (this._player.hasBoostFlag(this.getBoostFlag())) {
            let boosters = ARBoosterWorker.getInstance().findBooster(this.getBoostFlag(), true);
            // cc.log(boosters.length);
            boosters.forEach(b => b.setActive(false));
        }
    },

    willStart: function() {},

    didStart: function() {},

    willEnd: function() {},

    didEnded: function() {},
}); 

ARBooster.State = {
    NONE        : 0,
    INVISIBLE   : 1 << 0,
    MAGNET      : 1 << 1,
    DOUBLE      : 1 << 2
}