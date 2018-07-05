module.exports = {

	"parserOptions": {
		"ecmaVersion": 5
	},
	"globals": {
		"jQuery": true,
		"$": true
	},
    "env": {
        "browser": true
    },
    "extends": "naver/es5",
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
        ],
        "no-console": "off",
        "no-inner-declarations": "off",
        "vars-on-top" : "off"
    }
}