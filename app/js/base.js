/******************************************************************************/
/*
/*  base.js
/*
/*  author : jhlee@gmail.com
/*  last updated : 2018.01.24
/* 
/*
/*
/*
/******************************************************************************/

var LOGGER = (function() {

	var LOG_ENABLED = true;

	if ( LOG_ENABLED )
		var _log = console.log.bind(window.console);
	else
		var _log = function() {};
	

	return {
		log: function() {
			return _log();
		},
		debug: function() {
			_log();
		}

	};


})();


