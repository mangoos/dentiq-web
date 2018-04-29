module.exports = {

	"parserOptions": {
		"ecmaVersion": 5,
	},
	"globals": {
		"jQuery": true,
		"$": true
	},


    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};