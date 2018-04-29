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

var API_SERVER_URL;
var SESSION_TOKEN_NAME;


var LOGGER = (function() {

	var _log = console.log.bind(window.console);
	var _debug = console.debug.bind(window.console);

	return {
		log: _log,
		debug: _debug
	}
})();


var SESSION = (function() {

	var STORAGE_ITEM_NAME	= "DENTAL_PLUS.SESSION";
	var LOGIN_API_URL		= "/api/login2/";
	var LOGOUT_API_URL		= "/api/logout/";

	
	var USER_INFO;
	var SESSION_TOKEN;

	var SESSION_DATA = {};	// key, value

	var SESSION_DATA_LISTENERS = {};

	function _addSessionDataChangeListener(sessionDataKey, func) {
		//SESSION_DATA_LISTENERS.put(sessionDataKey, func);
		var listeners = SESSION_DATA_LISTENERS[sessionDataKey];
		if ( !listeners ) {
			listeners = [];
			SESSION_DATA_LISTENERS[sessionDataKey] = listeners;
		}
		listeners.push(func);
	}

	function _clearSessionDataChangeListener(sessionDataKey) {
		var listeners = SESSION_DATA_LISTENERS[sessionDataKey];
		if ( listeners ) SESSION_DATA_LISTENERS[sessionDataKey] = undefined;
	}

	function _clearAllSessionDataChangeListener() {
		SESSION_DATA_LISTENERS = {};
	}

	function _fireSessionDataChageListeners(sessionDataKey) {
		var listeners = SESSION_DATA_LISTENERS[sessionDataKey];
		if ( !listeners ) return;

		listeners.forEach(function(listener) {
			listener();
		});
	}

	function _setSessionData(sessionDataKey, sessionDataValue) {
		SESSION_DATA[sessionDataKey] = sessionDataValue;
		_saveSessionData();
		_fireSessionDataChageListeners(sessionDataKey);
	}
	function _getSessionData(sessionDataKey) {
		return SESSION_DATA[sessionDataKey];
	}

	function _getStorage() {
		if ( USER_INFO && USER_INFO.sessionType==1 ) {	// 세션 유형 1: LOCAL STORAGE 
			return localStorage;
		} else {										// 세션 유형 0: SESSION STORAGE
			return sessionStorage;
		}
	}

	function _saveUserInfoAndToken() {
		_getStorage.setItem(STORAGE_ITEM_NAME+".USER_INFO",		JSON.stringify(USER_INFO));
		_getStorage.setItem(STORAGE_ITEM_NAME+".SESSION_TOKEN",	JSON.stringify(SESSION_TOKEN));
	}
	function _saveSessionData() {
		_getStorage.setItem(STORAGE_ITEM_NAME+".SESSION_DATA",		JSON.stringify(SESSION_DATA));
	}
	function _load() {
		// userInfo = JSON.parse(storageItem);
		USER_INFO		= _getStorage.getItem(STORAGE_ITEM_NAME+".USER_INFO");
		SESSION_TOKEN	= _getStorage.getItem(STORAGE_ITEM_NAME+".SESSION_TOKEN");
		SESSION_DATA	= _getStorage.getItem(STORAGE_ITEM_NAME+".SESSION_DATA");
	}
	function _clear() {
		USER_INFO = null;
		SESSION_DATA = {};
		SESSION_DATA_LISTENERS = {};

		_getStorage.removeItem(STORAGE_ITEM_NAME+".USER_INFO");
		_getStorage.removeItem(STORAGE_ITEM_NAME+".SESSION_TOKEN");
		_getStorage.removeItem(STORAGE_ITEM_NAME+".SESSION_DATA");
	}

	function init() {
		_load();
	}

	init();



	function _setSessionToken(sessionToken) {
		
		var partArray = sessionToken.split(".");
		LOGGER.debug("SESSION._setSessionToken : 토큰 분리 : ", partArray);

		var newUserInfo = JSON.parse(atob(partArray[0]));
		USER_INFO = newUserInfo;
		SESSION_TOKEN = sessionToken;
		
		_saveUserInfoAndToken();	// SESSION_DATA는 갱신하지 않음.
	}

	var _callLogin = function(email, password) {

		var loginParam = "email=" + email + "&" + "password=" + password;
		_callApi("POST", LOGIN_API_URL, loginParam,
			function(resData) {

				LOGGER.debug("로그인 응답 : ", resData);

				//TODO
				// 로그인의 응답 내용은 SESSION_DATA에 Setting할 내용임
				// 해당 값을 Setting한다.

				if ( resData && resData=="FORCE_CHANGE_PASSWORD" ) {
					// 비밀번호 초기화 상태임
					alert("임시 비밀번호로 로그인되었습니다. \n비밀번호를 변경해주십시오.");
					location.href = "modify_password.html";
					return;
				}

				if ( resData && resData=="CHANGE_PASSWORD" ) {
					// 비밀번호 초기화 상태임
					location.href = "modify_password.html";
					return;
				}

				//if ( successProcFunc ) successProcFunc();
			},
			function(resCode, resMsg) {
				LOGGER.debug("LOGIN_INFO 로그인 실패 : ", resCode, resMsg);
				_clear();
				//if ( errorProcFunc ) errorProcFunc(resCode, resMsg);
				//else alert(resMsg + " [" + resMsg + "]");
				alert(resMsg + " [" + resMsg + "]");
			}
		);

		//return success;
	};

	var _callLogout = function() {
		if ( !USER_INFO ) {
			alert("로그인되어 있지 않습니다.");
			return;
		}
		// 서버에 로그아웃 정보를 날려준다 (1. 혹시라도 ServerSession으로 바꿀까봐.    2. Client 세션이라고 해도 DB에 LOGOUT 기록 남기려고).
		_callApi("POST", LOGOUT_API_URL, "userId=" + USER_INFO.useId,
			function(resData) {			// 로그아웃 성공하면...
				LOGGER.debug("로그아웃 성공 : " + resData);
				_clear();
				alert("로그아웃되었습니다.");
			},
			function(resCode, resMsg) { // 로그아웃 실패하면...
				LOGGER.debug("로그아웃 에러 " + resMsg + "  " + resCode);
				_clear();
				alert(resMsg + " [" + resCode + "]");
			}
		);
	};



	function _callApi(httpMethodType, apiUrl, reqData,
		callbackSuccessProcessFunction,
		callbackErrorProcessFunction,
		reqContentType) {

		LOGGER.debug("SESSION.callApi " + httpMethodType + " [" + apiUrl + "]");

		var myHeaders = {};
		myHeaders[SESSION_TOKEN_NAME] = SESSION_TOKEN;

		$.ajax({
			type: httpMethodType,
			url: API_SERVER_URL + apiUrl,
			headers: myHeaders,
			contentType: reqContentType,            
			data: reqData,
			success: function(result, textStatus, jqXHR) {
				if (result._RESPONSE_CODE_ != null && result._RESPONSE_CODE_ == "0000") {

					LOGGER.debug("CALL API : <RECV:HEADER> : ", jqXHR.getResponseHeader(SESSION_TOKEN_NAME));
					var sessionToken = jqXHR.getResponseHeader(SESSION_TOKEN_NAME);
					if ( sessionToken ) {		// 로그인 직후, 또는 로그인연장/로그인정보변경의 경우
						_setSessionToken(sessionToken);
					}
	
					LOGGER.debug("CALL API : <RECV> 성공 [", result._RESPONSE_, "]");
					callbackSuccessProcessFunction(result._RESPONSE_);
				} else {
					LOGGER.debug("CALL API : <RECV> 논리 오류 [", result._RESPONSE_CODE, "] ==> [", result._RESPONSE_MSG_, "]");
					callbackErrorProcessFunction(result._RESPONSE_CODE_, result._RESPONSE_MSG_);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) { // 공통 통신 에러 및 HTTP 오류
				LOGGER.debug("AJAX_COMM_ERR [", jqXHR.status, ", ", jqXHR.statusText, ", ", jqXHR.statusCode(), "] : ", textStatus, " ERR [", errorThrown, "]");
				LOGGER.debug("HEADER : ", jqXHR.getResponseHeader(SESSION_TOKEN_NAME));
				alert("통신 장애입니다. 콜센터로 연락주세요.");
			}
		});

	}

	return {
		callApi : function(httpMethod, apiUrl, reqData, callbackSuccessProcessFunction, callbackErrorProcessFunction, reqContentType) {
			return _callApi(httpMethod, apiUrl, reqData, callbackSuccessProcessFunction, callbackErrorProcessFunction, reqContentType);
		},

		callLogin : function(email, password) {
			return _callLogin(email, password);
		},

		callLogout : function() {
			return _callLogout();
		},



		isLoggedIn : function() {
			if ( USER_INFO && USER_INFO.userId ) return true;
			else false;
		},

		getName: function() {
			if ( USER_INFO ) return USER_INFO.name;
			else return;
		},
		getEmail: function() {
			if ( USER_INFO ) return USER_INFO.email;
			else return;
		},
		getId: function() {
			if ( USER_INFO ) return USER_INFO.userId;
			else return;
		},

		getUserType: function() {   // 1:구직(개인)회원, 2:구인(병원)회원
			if ( USER_INFO ) return USER_INFO.userType;
			else return;
		},
		
		isHospitalMember: function() {
			if ( USER_INFO && USER_INFO.userType && USER_INFO.userType==2 ) return true;
			return false;
		},
		isPersonalMember: function() {
			if ( USER_INFO && USER_INFO.userType && USER_INFO.userType==1 ) return true;
			return false;
		},

		getHospitalId: function() {
			if ( USER_INFO && USER_INFO.userType && USER_INFO.userType==2 ) return USER_INFO.hospitalId;
			else return null;
		},

		checkAuthPersonal: function() {
			if ( !USER_INFO || !USER_INFO.userId ) {
				alert("로그인이 필요합니다.");
				location.href = "login.html";
				return false;
			}

			if ( !USER_INFO.userType || USER_INFO.userType!=1 ) {
				alert("개인회원만 이용 가능합니다.");
				window.history.back();
				return false;
			}
	
			return true;
		},

		checkAuthHospital: function(checkHospitalId) {
			if ( !USER_INFO || !USER_INFO.userId ) {
				alert("로그인이 필요합니다.");
				location.href = "login.html";
				return false;
			}

			if ( !USER_INFO.userType || USER_INFO.userType!=2 ) {
				alert("병원회원만 이용 가능합니다.");
				window.history.back();
				return false;
			}

			if ( checkHospitalId && !USER_INFO.hospitalId ) {
				alert("병원정보가 등록되지 않았습니다. 병원정보를 먼저 등록해 주십시오.");
				location.href = "register_dentist.html";
				return false;
			}
	
			return true;
		},


		addSessionDataChangeListener : function(sessionDataKey, func) {
			return _addSessionDataChangeListener(sessionDataKey, func);
		},

		setSessionData : function(sessionDataKey, sessionDataValue) {
			return _setSessionData(sessionDataKey, sessionDataValue);
		},

		getSessionData : function(sessionDataKey) {
			return _getSessionData(sessionDataKey);
		}


	};


})();


var JOB_SEEKER_COMMON = (function() {

	return {

		getScrappedJobAdId : function() {
			return SESSION.getSessionData("JOB_SEEKER_SCRAPPED_JOB_AD_ID_LIST");
		},

		callAddScrappedJobAdId : function (jobAdId) {
			if ( !jobAdId ) throw "addScrappedJobAdId : jobAdId가 없습니다.";

			if ( !SESSION.isLoggedIn() ) throw "로그인 필요";
			if ( !SESSION.isPersonalMember() ) throw "개인회원만 가능";

			var SCRAPPED_JOB_AD_ID_URL = "/api/user/" + SESSION.userId + "/scrappedJobAdId/" + jobAdId + "/";
			SESSION.callApi("POST", SCRAPPED_JOB_AD_ID_URL, null,
				function(resData) {
					SESSION.setSessionData("JOB_SEEKER_SCRAPPED_JOB_AD_ID_LIST", resData);
				},
				function(resCode, resMsg) {
					alert("스크랩 가져오기 ERROR " + resMsg);
				}
			);
		},

		callRemoveScrappedJobAdId : function (jobAdId ) {

		},

		addScrapChangeEventListener : function (func) {

		}
	};
})();
