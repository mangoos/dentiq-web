/******************************************************************************/
/*
/*  common.js
/*
/*  author : leejuhyeon@gmail.com
/*  last updated : 2018.04.18
/* 
/*
/******************************************************************************/

"use strict";


var COMM = (function() {

	var API_SERVER_URL = "https://localhost:9090";
	var SESSION_TOKEN_NAME = "X-ENQUAL-DENTALPLUST-TOKEN";

	function callApi(httpMethodType, apiUrl,
		reqData,
		callbackSuccessProcessFunction,
		callbackErrorProcessFunction,
		reqContentType) {
		
		console.log("COMM.callApi " + httpMethodType + " [" + apiUrl + "]");

		
		$.ajax({
			type: httpMethodType,
			url: API_SERVER_URL + apiUrl,
			headers: myHeaders,
			contentType: reqContentType,            
			data: reqData,
			success: function(result, textStatus, jqXHR) {
				console.log("HEADER : ", jqXHR.getResponseHeader(SESSION_TOKEN_NAME));

				if (result._RESPONSE_CODE_ != null && result._RESPONSE_CODE_ == "0000") {
					console.log("callApi : 성공 [", result._RESPONSE_, "]");
					callbackSuccessProcessFunction(result._RESPONSE_);
				} else {
					console.log("callApi : 논리 오류 [", result._RESPONSE_CODE, "] ==> [", result._RESPONSE_MSG_, "]");
					callbackErrorProcessFunction(result._RESPONSE_CODE_, result._RESPONSE_MSG_);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) { // 공통 통신 에러 및 HTTP 오류
				console.log("AJAX_COMM_ERR [", jqXHR.status, ", ", jqXHR.statusText, ", ", jqXHR.statusCode(), "] : ", textStatus, " ERR [", errorThrown, "]");
				console.log("HEADER : ", jqXHR.getResponseHeader(SESSION_TOKEN_NAME));
				alert("통신 장애입니다. 콜센터로 연락주세요.");
			}
		});

		
	
			
		
	}
});

var LOGIN_INFO = (function() {



})();
