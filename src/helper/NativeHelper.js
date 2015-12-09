var NativeHelper = NativeHelper || {};

var NativeHelperConfig = {
    callOpenScheme: {
        iOS: [
            "H102Wrapper",
            "openScheme:withData:"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "openScheme",
            "(Ljava/lang/String;Ljava/lang/String;)Z"
        ]
    },
    getUDID: {
        iOS:[
            "H102Wrapper",
            "getUniqueDeviceId"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "getId",
            "()Ljava/lang/String;"
        ]
    },
    segmentIdentity: {
        iOS: [
            "H102Wrapper",
            "segmentIdentity:traits:"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "segmentIdentity",
            "(Ljava/lang/String;Ljava/lang/String;)V"
        ]
    },
    segmentTrack: {
        iOS: [
            "H102Wrapper",
            "segmentTrack:properties:"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "segmentTrack",
            "(Ljava/lang/String;Ljava/lang/String;)V"
        ]
    },
    checkMic: {
        iOS: [
            "H102Wrapper",
            "checkMic"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "checkMic",
            "()Z"
        ]
    },
    isRecording: {
        iOS: [
            "H102Wrapper",
            "isRecording"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "isRecording",
            "()Z"
        ]
    },
    initRecord: {
        iOS: [
            "H102Wrapper",
            "initRecord:"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "initRecord",
            "()V"
        ]
    },
    startRecord: {
        iOS: [
            "H102Wrapper",
            "startRecord"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "startRecord",
            "()V"
        ]
    },
    stopRecord: {
        iOS: [
            "H102Wrapper",
            "stopRecord"
        ],
        Android: [
            "com/h102/H102Wrapper",
            "stopRecord",
            "()V"
        ]
    },
    startBackgroundSoundDetecting: {
        Android: [
            "com/h102/H102Wrapper",
            "startBackgroundSoundDetecting",
            "()V"
        ]
    }
}

// Args must be an array
NativeHelper.callNative = function(method, args) {
    if (!NativeHelperConfig[method] || !NativeHelperConfig[method][cc.sys.os]) {
        cc.log("WARNING: No config for os: " + cc.sys.os + " with method: " + method)
        return;
    }

    args = args || [];
    args = NativeHelperConfig[method][cc.sys.os].concat(args);
    return jsb.reflection.callStaticMethod.apply(this, args);
}