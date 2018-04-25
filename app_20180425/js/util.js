/******************************************************************************/
/*
/*  common.js
/*
/*  author : jhlee@gmail.com
/*  last updated : 2018.01.24
/* 
/*
/*
/******************************************************************************/

"use strict";



/* API 서버 URL */
// var API_SERVER_URL = "http://dentalplus.enqual.co.kr:8080";
// var API_SERVER_URL = "https://api.enqual.co.kr:8080";


var LiveValidator = function() {
    return {

        number : function(event) {
            var keyValue = event.keyCode;
            if ( (keyValue >= 48) && (keyValue <= 57) ) return true;
            else return false;
        }
    }

}();