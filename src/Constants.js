var BACKEND_ADDRESS = "https://tsog.herokuapp.com/";

var TAG_LOADING_INDICATOR_LAYER = 717;

SCHOOL_INFO = [
    {
        school_id: "55e10c0b2eee625df1993a61",
        school_name: "Vietnam National University"
    },
    {
        school_id: "55e10c0b2eee625df1993a62",
        school_name: "Vietnam University of Commerce"
    },
    {
        school_id: "55e10c0b2eee625df1993a63",
        school_name: "Vietnam University of Fine Arts"
    },
    {
        school_id: "55e10c0b2eee625df1993a64",
        school_name: "Hanoi Open University"
    }
];

GAME_INFO = [
    {
        game_id: "55e10c0b2eee625df1993a5f",
        game_name: "Alphabet",
        android_bundle: "com.hub102.abc",
        ios_bundle: "com.hub102.abc"
    },
    {
        game_id: "55e10c0b2eee625df1993a60",
        game_name: "XYZ",
        android_bundle: "com.hub102.xyz",
        ios_bundle: "com.hub102.xyz"
    },
    {
        game_id: "55e10c0b2eee625df1993a60",
        game_name: "XYZ2",
        android_bundle: "com.hub102.xyz",
        ios_bundle: "com.hub102.xyz"
    },
    {
        game_id: "55e10c0b2eee625df1993a60",
        game_name: "XYZ3",
        android_bundle: "com.hub102.xyz",
        ios_bundle: "com.hub102.xyz"
    },
    {
        game_id: "55e10c0b2eee625df1993a60",
        game_name: "XYZ4",
        android_bundle: "com.hub102.xyz",
        ios_bundle: "com.hub102.xyz"
    },
    {
        game_id: "55e10c0b2eee625df1993a60",
        game_name: "XYZ5",
        android_bundle: "com.hub102.xyz",
        ios_bundle: "com.hub102.xyz"
    },
    {
        game_id: "55e10c0b2eee625df1993a60",
        game_name: "XYZ6",
        android_bundle: "com.hub102.xyz",
        ios_bundle: "com.hub102.xyz"
    },
    {
        game_id: "55e10c0b2eee625df1993a60",
        game_name: "XYZ7",
        android_bundle: "com.hub102.xyz",
        ios_bundle: "com.hub102.xyz"
    },
    {
        game_id: "55e10c0b2eee625df1993a60",
        game_name: "XYZ8",
        android_bundle: "com.hub102.xyz",
        ios_bundle: "com.hub102.xyz"
    }
]

SCHOOL_NAME_COLOR = [
    res.RedFont_fnt,
    res.YellowFont_fnt,
    res.PurpleFont_fnt,
    res.GreenFont_fnt
];

var TREE_POSITIONS = [
    {x : 0, hintImageId : 1, hintOffsetX : 400, hintOffsetY : 350, passwordOffsetX: 30, flowerOffsetX: 30, flowerOffsetY: -40 },
    {x : 0, hintImageId : 4, hintOffsetX : 500, hintOffsetY : 350, passwordOffsetX: 35, flowerOffsetX: 10, flowerOffsetY: -40 },
    {x : 30, hintImageId : 1, hintOffsetX : 650, hintOffsetY : 350, passwordOffsetX: 30, flowerOffsetX: -30, flowerOffsetY: -48 },
    {x : 20, hintImageId : 3, hintOffsetX : 350,  hintOffsetY : 350,passwordOffsetX: -35, flowerOffsetX: -23, flowerOffsetY: -45 },
    {x : -20, hintImageId : 2, hintOffsetX : 500,  hintOffsetY : 350,passwordOffsetX: -30, flowerOffsetX: 10, flowerOffsetY: -57 },
    {x : -40, hintImageId : 3, hintOffsetX : 600,  hintOffsetY : 350,passwordOffsetX: -35, flowerOffsetX: 10, flowerOffsetY: -62 }
];


var NUMBER_OF_TREES = 20;
// String

var STRING_SCHOOL_DATA  = "school_data";
var STRING_ACCOUNT_DATA  = "account_data";
var STRING_GAME_DATA  = "game_data";
