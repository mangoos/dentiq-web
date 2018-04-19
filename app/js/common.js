/******************************************************************************/
/*
/*  common.js
/*
/*  author : jhlee@gmail.com
/*  last updated : 2018.01.24
/* 
/*
/*
/*
/******************************************************************************/

"use strict";



/* API 서버 URL */
// var API_SERVER_URL = "http://dentalplus.enqual.co.kr:8080";
//var API_SERVER_URL = "https://api.enqual.co.kr:9090";
var API_SERVER_URL = "https://localhost:9090";





var CONSTANTS = (function() {

	// LOCAL STORAGE에 있는지 본다. 없다면 받아 온 후, LOCAL STORAGE에 넣는다.

	//var HOSPITAL_RESOURCE_URL	= "https://dentalplus.enqual.co.kr/resources/hospital";
	var HOSPITAL_RESOURCE_URL	= "http://localhost:8887/resources/hospital";
	var HOSPITAL_REROURCE_LOGO_SMALL_FILE_NAME = "logo_small.jpg";

	//var JOB_SEEKER_RESOURCE_URL	= "https://dentalplus.enqual.co.kr/resources/jobSeeker";
	var JOB_SEEKER_RESOURCE_URL	= "http://localhost:8887/resources/jobSeeker";
	var JOB_SEEKER_REROURCE_PROFILE_SMALL_FILE_NAME = "profile_small.jpg";

	return {
		refresh: function() {
			alert("TBD : 로드될 것임");
		},

		// 구직자 프로필 이미지 URL을 리턴한다.
		getProfileImageUrl: function(jobSeekerUserId) {
			return JOB_SEEKER_RESOURCE_URL + "/" + jobSeekerUserId + "/" + JOB_SEEKER_REROURCE_PROFILE_SMALL_FILE_NAME;
		},

		// 병원 로고 이미지의 URL을 리턴한다.
		getHospitalLogoImageUrl: function(hospitalId) {
			return HOSPITAL_RESOURCE_URL + "/" + hospitalId + "/" + HOSPITAL_REROURCE_LOGO_SMALL_FILE_NAME;
		}


	};
})();

var SESSION_TOKEN_NAME = "X-ENQUAL-DENTALPLUST-TOKEN";


function uploadFile(apiUrl, formDataFileEncoded, callbackSuccessProcessFunction, callbackErrorProcessFunction) {

	var myHeaders = {};
	myHeaders[SESSION_TOKEN_NAME] = LOGIN_INFO.getToken();

	$.ajax({
		type: 'POST',
		url : API_SERVER_URL + apiUrl,
		headers: myHeaders,
		processData: false,        
		data: formDataFileEncoded,
		contentType: false,
		success: function(result, textStatus, jqXHR) {
			console.log("HEADER : ", jqXHR.getResponseHeader(SESSION_TOKEN_NAME));

			if (result._RESPONSE_CODE_ != null && result._RESPONSE_CODE_ == "0000") {
				console.log("uploadFile : 성공 [", result._RESPONSE_, "]");
				callbackSuccessProcessFunction(result._RESPONSE_);
			} else {
				console.log("uploadFile : 논리 오류 [", result._RESPONSE_CODE, "] ==> [", result._RESPONSE_MSG_, "]");
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





/******************************************************************************/
/*  API 서버에 통신을 한다.
/*
/*  네트워크 장애 상태이거나, API 서버에서의 HTTP 응답이 OK가 아닐 경우에는 공통 에러 처리를 수행한다.
/*
/*  @param {*} httpMethodType HTTP 메소드 유형. GET, POST, DELETE 등
/*  @param {*} apiUrl API의 URL. API 서버 내에서의 경로만 기술할 것
/*  @param {*} reqData 요청 데이터. 예) "email=email@a.com&password=1111"
/*  @param {*} callbackSuccessProcessFunction 응답이 정상적으로 수신(HTTP_status=OK)되고, API 서버의 응답코드가 정상(0000)일 때 처리할 콜백 함수
/*  @param {*} callbackErrorProcessFunction   응답이 정상적으로 수신(HTTP_status=OK)되었지만, API 서버의 응답코드가 정상(0000)이 아닐 때 이 오류를 처리할 콜백 함수
/******************************************************************************/
function callApiOLD(httpMethodType, apiUrl, reqData,
	callbackSuccessProcessFunction,
	callbackErrorProcessFunction,
	reqContentType) {
	//                reqContentType) {
	// if ( reqContentType==null )         reqContentType = "application/json";
	// if ( reqContentType=="JSON" )       reqContentType = "application/json";
	// else if ( reqContentType=="FORM" )  reqContentType = "application/x-www-form-urlencoded";
	// else if ( reqContentType=="FILE")   reqContentType = "multipart/form-data";
	// else                                reqContentType = "application/json";

	console.log("CALL API [", apiUrl, "] ==> " + reqData);

	var myHeaders = {};
	myHeaders[SESSION_TOKEN_NAME] = LOGIN_INFO.getToken();
	//console.log("LOGIN_TOKEN : " + myHeaders);
	

	if (reqContentType != null) {
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

	} else {

		$.ajax({
			type: httpMethodType,
			url: API_SERVER_URL + apiUrl,
			headers: myHeaders,
			//contentType: "application/json",
			// contentType: reqContentType,
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
}

function callApiSync(httpMethodType, apiUrl, reqData,
	callbackSuccessProcessFunction,
	callbackErrorProcessFunction) {
	$.ajax({
		type: httpMethodType,
		url: API_SERVER_URL + apiUrl,
		data: reqData,
		async: false,
		success: function(result) {
			if (result._RESPONSE_CODE_ != null && result._RESPONSE_CODE_ == "0000") {
				console.log("callApi : 성공 [" + result._RESPONSE_ + "] raw [" + result + "]");
				callbackSuccessProcessFunction(result._RESPONSE_);
			} else {
				console.log("callApi : 에러 [" + result._RESPONSE_CODE + "] ==> [" + result._RESPONSE_MSG_ + "]");
				callbackErrorProcessFunction(result._RESPONSE_CODE_, result._RESPONSE_MSG_);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) { // 공통 통신 에러 및 HTTP 오류
			console.log("AJAX_COMM_ERR [", jqXHR.status, ", ", jqXHR.statusText, ", ", jqXHR.statusCode(), "] : ", textStatus, " ERR [", errorThrown, "]");
			alert("통신 장애입니다. 콜센터로 연락주세요.");
		}
	});
}
/* 사용법
var apiUrl = "/api/login/";
var reqData = "email=email@a.com&password=1111";
callApi("POST", apiUrl, reqData,
	function(resData) {
		alert("로직 성공: " + resData + "  ==> [" + resData._RESPONSE_CODE_ + "]");
	},
	function(resCode, resMsg) {
		alert("로직 오류 : " + resData + "  ==> [" + resData._RESPONSE_CODE_ + "]");
	}
);
*/






/******************************************************************************/
/*  스토리지 객체
/*
/*
/******************************************************************************/
// var SESSION_STORAGE   = 0;
// var LOCAL_STORAGE     = 1;
// var DEFAULT_STORAGE   = SESSION_STORAGE;


// function getStorage(storageType) {
//     if ( storageType!=null ) {
//         if ( storageType==SESSION_STORAGE ) return sessionStorage;
//         else if ( storageType==LOCAL_STORAGE ) return localStorage;
//     }
//     if ( DEFAULT_STORAGE==SESSION_STORAGE ) return sessionStorage;
//     else if ( DEFAULT_STORAGE==LOCAL_STORAGE ) return localStorage;
//     else {
//         console.log("STORAGE TYPE이 정의되지 않았음 ", storageType, DEFAULT_STORAGE);
//     }
// }

/******************************************************************************/
/*  지역코드 객체
/*
/*
/******************************************************************************/
var LOCATION_CODE = (function() {

	var STORAGE_ITEM_NAME_LIST = "LOCATION_CODE_LIST";
	var API_URL_LIST = "/api/code/location/";
	var STORAGE_ITEM_NAME_TREE = "LOCATION_CODE_TREE";
	var API_URL_TREE = "/api/code/location/tree/";

	// var locationCodeList;
	var locationCodeTree;

	// 스토리지 또는 서버로부터 로드한다.
	var load = function(refresh) {
		console.log("LOCATION_CODE.load(", refresh, ") 호출됨");


		// var storageItemList = localStorage.getItem(STORAGE_ITEM_NAME_LIST);
		// if (refresh == true || storageItemList == null) {
		// 	callApiSync("GET", API_URL_LIST, null,
		// 		function(resData) {
		// 			console.log(resData);
		// 			localStorage.setItem(STORAGE_ITEM_NAME_LIST, JSON.stringify(resData));
		// 			//localStorage.setItem(STORAGE_ITEM_NAME, resData);
		// 			//locationCodeObj = JSON.parse(resData);
		// 			locationCodeList = resData;
		// 			console.log("load LOCATION_CODE from SERVER. ==> " + resData.length);
		// 		},
		// 		function(resCode, resMsg) {
		// 			alert("ERROR");
		// 		}
		// 	);
		// } else {
		// 	//console.log("지역코드 로드할 것임 ", storageItem);
		// 	locationCodeList = JSON.parse(storageItemList);
		// 	//locationCodeObj = storageItem;
		// 	console.log("load LOCATION_CODE from localStorage. ==> " + storageItemList.length);
		// }


		var storageItemTree = localStorage.getItem(STORAGE_ITEM_NAME_TREE);
		if (refresh == true || storageItemTree == null) {
			callApiSync("GET", API_URL_TREE, null,
				function(resData) {
					console.log(resData);
					localStorage.setItem(STORAGE_ITEM_NAME_TREE, JSON.stringify(resData));
					locationCodeTree = resData;
					console.log("load LOCATION_CODE from SERVER. ==> " + resData.length);
				},
				function(resCode, resMsg) {
					alert("ERROR");
				}
			);
		} else {
			//console.log("지역코드 로드할 것임 ", storageItem);
			locationCodeTree = JSON.parse(storageItemTree);
			//locationCodeObj = storageItem;
			console.log("load LOCATION_CODE from localStorage. ==> " + storageItemTree.length);
		}
	};

	
	var _listSidoCode = function() {
		return locationCodeTree;
	};

	var _listSiguCode = function(sidoLocationCode) {
		//if ( sidoLocationCode=null || sidoLocationCode.indexOf(".")==-1 ) return null;   // '.'이 있으면, 시도코드가 아님
		return locationCodeTree[sidoLocationCode];
	};

	var CODE_FORMAT_LOCATION = 0;
	var CODE_FORMAT_SIDO = 1;
	var CODE_FORMAT_SIGU = 2;


	function checkCodeFormat(someCode) {
		if ( someCode && someCode.indexOf(".")==2 && someCode.length==8 ) return CODE_FORMAT_LOCATION;
		else if ( someCode && someCode.length==2 ) return CODE_FORMAT_SIDO;
		else if ( someCode && someCode.length==5 ) return CODE_FORMAT_SIGU;
		throw "지역/시도/시구 코드 포맷 오류 (" + someCode + ")";
	}
	// function getSidoCodeFromLocationCode(locCode) {
	// 	if ( checkCodeFormat(locCode)==CODE_FORMAT_LOCATION ) {
	// 		return locCode.substring(0, 2);

	// 	} else if ( checkCodeFormat(locCode)==CODE_FORMAT_SIDO ) {
	// 		return locCode;

	// 	} else if ( checkCodeFormat(locCode)==CODE_FORMAT_SIGU ) {
	// 		return locCode.substring(0, 2);
	// 	}
	// }
	function getLocation(someCode) {
		var codeFormat = checkCodeFormat(someCode);
		if ( codeFormat==CODE_FORMAT_LOCATION ) {
			var sidoCode = someCode.substring(0, 2);
			return locationCodeTree[sidoCode].children[someCode];
		
		}

		if ( codeFormat==CODE_FORMAT_SIDO ) {
			return locationCodeTree[someCode];
		}

		if ( codeFormat==CODE_FORMAT_SIGU ) {
			var sidoCode = someCode.substring(0, 2);
			var locCode  = sidoCode + "." + someCode;
			return locationCodeTree[sidoCode].children[locCode];
		}

		throw "getLocation(" + someCode + ") 오류 : 찾을 수 없음";
	}

	var _getByName = function(locationCode) {
		//return locationCodeList[locationCode];
		return getLocation(locationCode);
	};

	var _isSiguCode = function(locationCode) {
		// if ( locationCodeList[locationCode].type=='SIGU' ) return true;
		// else return null;

		var result = checkCodeFormat(locationCode);
		if ( result==CODE_FORMAT_SIGU ) return true;
		return false;
	};




	// Initialize
	load(false);

	// public methods
	return {
		refresh: function() {
			load(true);
		},


		listSiguCode: function(sidoLocationCode) {
			return _listSiguCode(sidoLocationCode);
		},
		listSidoCode: function() {
			console.log("listSidoCode() 호출됨");
			return _listSidoCode();
		},
		// getName: function(locationCode) {
		//     return _getName(locationCode);
		// },
		getByName: function(locationCode) {
			return _getByName(locationCode);
		},
		isSiguCode: function(locationCode) {
			return _isSiguCode(locationCode);
		},

		getSido: function(sidoCode) {
			return _listSidoCode()[sidoCode];
		},
		getSigu: function(sidoCode, siguCode) {
			return _listSidoCode()[sidoCode].children[sidoCode+"."+siguCode];
		},
		getLocation: function(locationCode) {
			if ( !locationCode ) return null;
			if ( locationCode.indexOf(".") > -1 ) { // full code인 경우
				var tokens = locationCode.split(".");
				return _listSidoCode()[tokens[0]].children[locationCode];
			} else {    // 시도인 경우
				return _listSidoCode()[locationCode];
			}

		}

	};

})();



// var PAGE_LOGIN_NECESSITY = false; // 로그인 필요성. true: 반드시 로그인해야 함. false: 로그인하지 않아도 됨
// var PAGE_SERVER_LOGIN_CHECK_NECESSTIY = false; // 로컬 로그인 상태를 무시하고 반드시 서버에 로그인하여야 하는지 여부. true:반드시 서버에 재로그인 필요. 예: 회원정보변경 등




function callApi(httpMethodType, apiUrl, reqData,
	callbackSuccessProcessFunction,
	callbackErrorProcessFunction,
	reqContentType) {

	var myHeaders = {};
	myHeaders[SESSION_TOKEN_NAME] = LOGIN_INFO.getToken();
	//console.log("LOGIN_TOKEN : " + myHeaders);

	$.ajax({
		type: httpMethodType,
		url: API_SERVER_URL + apiUrl,
		headers: myHeaders,
		contentType: reqContentType,
		data: reqData,
		success: function(result, textStatus, jqXHR) {

			if (result._RESPONSE_CODE_ != null && result._RESPONSE_CODE_ == "0000") {

				console.log("HEADER : ", jqXHR.getResponseHeader(SESSION_TOKEN_NAME));
				var sessionToken = jqXHR.getResponseHeader(SESSION_TOKEN_NAME);
				if ( sessionToken ) {		// 로그인 직후, 또는 로그인연장/로그인정보변경의 경우
					LOGIN_INFO.setSessionToken(sessionToken);
				}

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

var LOGIN_INFO = (function() {

	var STORAGE_ITEM_NAME	= "USER_INFO";
	var LOGIN_API_URL		= "/api/login2/";
	var LOGOUT_API_URL		= "/api/logout/";

	var userInfo;

	// 서버 로그인 처리
	var callLogin = function(email, password, successProcFunc, errorProcFunc) {

		var loginParam = "email=" + email + "&" + "password=" + password;
		callApi("POST", LOGIN_API_URL, loginParam,
			function(resData) {

				//_loadScrappedJobAdIds();

				if ( successProcFunc ) successProcFunc();
			},
			function(resCode, resMsg) {
				clear();
				if ( errorProcFunc ) errorProcFunc(resCode, resMsg);
				else alert("로그인 ERROR " + resMsg);

				//return false;
			}
		);

		//return success;
	};


	var callLogout = function() {
		if ( !userInfo ) {
			alert("로그인되어 있지 않습니다.");
			return;
		}
		// 서버에 로그아웃 정보를 날려준다 (1. 혹시라도 ServerSession으로 바꿀까봐.    2. Client 세션이라고 해도 DB에 LOGOUT 기록 남기려고).
		callApi("POST", LOGOUT_API_URL, "userId=" + userInfo.useId,
			function(resData) { // 로그아웃 성공하면...
				clear();
				alert("로그아웃 성공");

				fireScrapChageEventListeners();

				//TODO JWT를 무효화한다!!! ==> 필요없다!
			},
			function(resCode, resMsg) { // 로그아웃 실패하면...
				alert("로그아웃 실패");
				//return false;
			}
		);

		// 로컬 로그아웃
		clear();
	};


	// SCRAP이 변경된 경우, 이에 대한 EventListener들
	var funcScrapChangeEventListeners = [];

	// SCRAP이 변경된 경우, 이에 대한 EventListener들을 처리한다.
	function fireScrapChageEventListeners() {
		if ( funcScrapChangeEventListeners && funcScrapChangeEventListeners.length>0 ) {	// 콜백이 등록되어 있으면, 실행한다.
			funcScrapChangeEventListeners.forEach(function(scrapChangeEventListener) {
				scrapChangeEventListener();
			});
			//funcScrapChangeEventListeners();
		}
	}

	// 서버로부터 스크랩된 공고의 ID들을 가져온다.
	var _loadScrappedJobAdIds = function() {
		if ( !userInfo || !userInfo.userId ) {
			alert("로그인되어 있지 않습니다. - 스크랩 못함");
			return;
		}

		var SCRAPPED_JOB_AD_ID_URL = "/api/user/" + userInfo.userId + "/scrappedJobAdId/";
		callApi("GET", SCRAPPED_JOB_AD_ID_URL, null,
			function(resData) {
				userInfo.scrappedJobAdIds = resData;
				save();

				fireScrapChageEventListeners();
			},
			function(resCode, resMsg) {
				// clear();
				alert("스크랩 가져오기 ERROR " + resMsg);
			}
		);
	};
	


	var _addScrappedJobAdId = function(jobAdId) {
		if ( !userInfo || !userInfo.userType || userInfo.userType!=1 ) return;

		var SCRAPPED_JOB_AD_ID_URL = "/api/user/" + userInfo.userId + "/scrappedJobAdId/" + jobAdId + "/";
		callApi("POST", SCRAPPED_JOB_AD_ID_URL, null,
			function(resData) {
				userInfo.scrappedJobAdIds = resData;
				save();
				fireScrapChageEventListeners();
			},
			function(resCode, resMsg) {
				// clear();
				fireScrapChageEventListeners();
				alert("스크랩 가져오기 ERROR " + resMsg);
			}
		);
	};
	var _removeScrappedJobAdId = function(jobAdId) {
		if ( !userInfo || !userInfo.userType || userInfo.userType!=1 ) return;

		var SCRAPPED_JOB_AD_ID_URL = "/api/user/" + userInfo.userId + "/scrappedJobAdId/" + jobAdId + "/";
		callApi("DELETE", SCRAPPED_JOB_AD_ID_URL, null,
			function(resData) {
				userInfo.scrappedJobAdIds = resData;
				save();
				fireScrapChageEventListeners();
			},
			function(resCode, resMsg) {
				// clear();
				fireScrapChageEventListeners();
				alert("스크랩 가져오기 ERROR " + resMsg);
			}
		);
	};
	var _updateLocalScrappedJobAdId = function(jobAdIdArr) {
		if ( !userInfo || !userInfo.userType || userInfo.userType!=1 ) return;
		
		userInfo.scrappedJobAdIds = jobAdIdArr;
		save();
		fireScrapChageEventListeners();
		console.log("스크랩 ID가 Local에서 업데이트되었음");


	};
	
	

	var _setSessionToken = function(newSessionToken) {

		if ( userInfo && userInfo.scrappedJobAdIds ) {
			var scrappedJobAdIds = userInfo.scrappedJobAdIds;
			userInfo = JSON.parse(atob(newSessionToken));
			userInfo.scrappedJobAdIds = scrappedJobAdIds;
		} else {
			userInfo = JSON.parse(atob(newSessionToken));
		}
		userInfo.token = newSessionToken;

		save();	// 일단 save. 병원회원인 경우도 있으니...

		if ( userInfo.userType && userInfo.userType==1 ) {		// 개인회원인 경우는 다시 SAVE하자. save() 한번만으로 할 수도 있지만, _loadScrappedJobAdIds()가 실패하면 세션정보 자체를 저장못하므로, 그렇게는 안 한다.
			console.log("===> ", userInfo);
			
			_loadScrappedJobAdIds();		// 여기서 세션 세이브될 것임
		}
		
	};

	// 로컬 스토리지에 저장한다.
	var save = function() { // return boolean
		if (userInfo != null) {
			localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(userInfo));

			return true;
		} else {
			return false;
		}
	};

	// 로컬 스토리지에서 불러온다.
	var load = function() { // return boolean
		var storageItem = localStorage.getItem(STORAGE_ITEM_NAME);
		if (storageItem != null) {
			userInfo = JSON.parse(storageItem);

			return true;
		} else {
			return false;
		}
	};

	// 로컬  스토리지와 현재 메로리 상의 사용자 정보를 삭제한다.
	var clear = function() { // return void
		localStorage.removeItem(STORAGE_ITEM_NAME);
		userInfo = null;
	};

	// 로그인 상태 확인
	var init = function() { // return void

		// 로드한다.
		if (!load()) {
			console.log("LOGIN_INFO : 로그인되지 않은 상태임");
			// load가 실패하면 로그아웃 상태이므로, 현재 페이지가 로그인이 필요한 페이지인지 확인한다.

			// 만일 로그인이 필요하지 않은 상태이면 바로 리턴한다.

			// 로그인이 필요한 페이지이면, 현재 page를 history push하고 로그인 페이지로 이동한다.
			// LOGIN_PAGE_URL
		}

	};

	// Initialize
	init();



	return {
		

		setSessionToken: function(newSessionToken) {
			_setSessionToken(newSessionToken);
		},

		login: function(email, password, successProcFunc, errorProcFunc) {
			callLogin(email, password, successProcFunc, errorProcFunc);
		},
		logout: function() {
			// 로그아웃 후에 이동할 초기 페이지를 지정해야 함.
			return callLogout();
		},
		getName: function() {
			if (userInfo != null) return userInfo.name;
			else return;
		},
		getEmail: function() {
			if (userInfo != null) return userInfo.email;
			else return;
		},
		getId: function() {
			if (userInfo != null) return userInfo.userId;
			else return;
		},

		getUserType: function() {   // 1:구직(개인)회원, 2:구인(병원)회원
			if ( userInfo != null ) return userInfo.userType;
			else return;
		},
		
		isHospitalMember: function() {
			if ( userInfo != null && userInfo.userType != null && userInfo.userType==2 ) return true;
			return false;
		},
		isPersonalMember: function() {
			if ( userInfo != null && userInfo.userType != null && userInfo.userType==1 ) return true;
			return false;
		},

		getHospitalId: function() {
			if ( userInfo != null && userInfo.userType != null && userInfo.userType==2 ) return userInfo.hospitalId;
			else return null;
		},

		isLoggedIn: function() {
			if ( userInfo &&userInfo.userId ) return true;
			return false;
		},


		addScrapChangeEventListener: function(callbackFunc) {
			funcScrapChangeEventListeners.push(callbackFunc);
		},
		clearScrapChangeEventListener: function() {
			funcScrapChangeEventListeners = [];
		},
		
		getScrappedJobAdIds: function() {
			if ( !userInfo || !userInfo.userType || userInfo.userType!=1 ) return;

			if ( userInfo.scrappedJobAdIds ) return userInfo.scrappedJobAdIds;
			return null;
		},
		
		addScrappedJobAdId: function(jobAdId) {
			_addScrappedJobAdId(jobAdId);
		},
		removeScrappedJobAdId: function(jobAdId) {
			_removeScrappedJobAdId(jobAdId);
		},
		updateLocalScrappedJobAdId : function(jobAdIdArr) {
			_updateLocalScrappedJobAdId(jobAdIdArr);
		},


		// afterSignup: function(newUserInfo) {
		// 	if ( newUserInfo ) {
		// 		clear();
		// 		userInfo = newUserInfo;                
		// 		save();
		// 	} else return false;
		// },

		getToken: function() {
			if ( userInfo && userInfo.token ) return userInfo.token;
			else return null;
		}
	};
})();


/******************************************************************************/
/*  로그인 사용자 정보 객체
/*
/*
/******************************************************************************/
// var LOGIN_INFO_OLD = (function() {

// 	// var AFTER_LOGOUT_PAGE_URL = ""; // 로그아웃 후 이동할 페이지 URL
// 	// var LOGIN_PAGE_URL = ""; // 로그인 페이지의 URL

// 	var STORAGE_ITEM_NAME = "USER_INFO";
// 	//var STORAGE_ITEM_NAME_SCRAP = STORAGE_ITEM_NAME + "_SCRAPPED_JOB_AD_IDS"
// 	var LOGIN_API_URL = "/api/login/";
// 	var LOGOUT_API_URL = "/api/logout/";

// 	//var userInfo = {"id":"", "email":"", "name":""};
// 	var userInfo;

// 	// 스크랩된 공고 : 스토리지 관련하여 동일 디바이스에 여러 사용자 있을 경우, 문제 될 수 있음. ==> userInfo 안에 추가하는 방식으로 변경하여야 할 듯
// 	//var userInfo.scrappedJobAdIds.


// 	// 서버 로그인 처리
// 	var callLogin = function(email, password, successProcFunc, errorProcFunc) {

// 		var loginParam = "email=" + email + "&" + "password=" + password;
// 		callApi("POST", LOGIN_API_URL, loginParam,
// 			function(resData) {
// 				userInfo = resData;
// 				save(); // 로컬에 저장
// 				if (successProcFunc != null) successProcFunc();
// 			},

// 			function(resCode, resMsg) {
// 				clear();
// 				if (errorProcFunc != null) errorProcFunc(resCode, resMsg);
// 				else alert("로그인 ERROR " + resMsg);

// 				//return false;
// 			}
// 		);

// 		//return success;
// 	};


// 	var callLogout = function() {
// 		if (userInfo == null) {
// 			alert("로그인되어 있지 않습니다.");
// 			return;
// 		}
// 		// 서버에 로그아웃 정보를 날려준다 (1. 혹시라도 ServerSession으로 바꿀까봐.    2. Client 세션이라고 해도 DB에 LOGOUT 기록 남기려고).
// 		callApi("POST", LOGOUT_API_URL, "userId=" + userInfo.useId,
// 			function(resData) { // 로그아웃 성공하면...
// 				clear();
// 				alert("로그아웃 성공");

// 				//TODO JWT를 무효화한다!!! ==> 필요없다!
// 			},
// 			function(resCode, resMsg) { // 로그아웃 실패하면...
// 				alert("로그아웃 실패");
// 				//return false;
// 			}
// 		);

// 		// 로컬 로그아웃
// 		clear();
// 	};



// 	// 서버로부터 스크랩된 공고의 ID들을 가져온다.
// 	var _getScrappedJobAdIds = function() {
// 		if (userInfo == null) {
// 			alert("로그인되어 있지 않습니다.");
// 			return;
// 		}

// 		var SCRAPPED_JOB_AD_ID_URL = "/api/user/" + userInfo.id + "/scrappedJobAdId/";
// 		callApi("GET", SCRAPPED_JOB_AD_ID_URL, null,
// 			function(resData) {
// 				userInfo.scrappedJobAdIds = resData;
// 				save();
// 			},
// 			function(resCode, resMsg) {
// 				// clear();
// 				alert("스크랩 가져오기 ERROR " + resMsg);
// 			}
// 		);
// 	};
// 	//  , callbackFunction
// 	//var _addScrappedJobAdId = function(jobAdId, memo) {
// 	var _addScrappedJobAdId = function(jobAdId, callbackFunction) {
// 		if (userInfo == null) {
// 			alert("로그인되어 있지 않습니다.");
// 			return;
// 		}
// 		var memo = "";

// 		var SCRAPPED_JOB_AD_ID_URL = "/api/user/" + userInfo.userId + "/scrappedJobAdId/" + jobAdId + "/";
// 		callApi("POST", SCRAPPED_JOB_AD_ID_URL, "memo=" + memo,
// 			function(resData) {
// 				userInfo.scrappedJobAdIds = resData;
// 				save();
// 				callbackFunction();
// 			},
// 			function(resCode, resMsg) {
// 				// clear();
// 				alert("스크랩 가져오기 ERROR " + resMsg);
// 			}
// 		);
// 	};
// 	var _removeScrappedJobAdId = function(jobAdId, callbackFunction) {
// 		if (userInfo == null) {
// 			alert("로그인되어 있지 않습니다.");
// 			return;
// 		}

// 		var SCRAPPED_JOB_AD_ID_URL = "/api/user/" + userInfo.userId + "/scrappedJobAdId/" + jobAdId + "/";
// 		callApi("DELETE", SCRAPPED_JOB_AD_ID_URL, null,
// 			function(resData) {
// 				userInfo.scrappedJobAdIds = resData;
// 				save();
// 				callbackFunction();
// 			},
// 			function(resCode, resMsg) {
// 				// clear();
// 				alert("스크랩 가져오기 ERROR " + resMsg);
// 			}
// 		);
// 	};
// 	// var _updateScrappedJobAdId = function(jobAdId, memo, callbackFunction) {
// 	var _updateScrappedJobAdId = function(jobAdId, callbackFunction) {
// 		if (userInfo == null) {
// 			alert("로그인되어 있지 않습니다.");
// 			return;
// 		}
// 		var memo = "";
// 		var SCRAPPED_JOB_AD_ID_URL = "/api/user/" + userInfo.userId + "/scrappedJobAdId/" + jobAdId + "/";
// 		callApi("PUT", SCRAPPED_JOB_AD_ID_URL, "memo=" + memo,
// 			function(resData) {
// 				userInfo.scrappedJobAdIds = resData;
// 				save();
// 				callbackFunction();
// 			},
// 			function(resCode, resMsg) {
// 				// clear();
// 				alert("스크랩 가져오기 ERROR " + resMsg);
// 			}
// 		);
// 	};
// 	var _updateLocalScrappedJobAdId = function(jobAdIdArr) {
// 		if (userInfo == null) {
// 			alert("로그인되어 있지 않습니다.");
// 			return;
// 		}

// 		userInfo.scrappedJobAdIds = jobAdIdArr;
// 		save();
// 		console.log("스크랩 ID가 Local에서 업데이트되었음");


// 	};
	


// 	// 로컬 스토리지에 저장한다.
// 	var save = function() { // return boolean
// 		if (userInfo != null) {
// 			//localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(userInfo));
// 			localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(userInfo));

// 			return true;
// 		} else {
// 			return false;
// 		}
// 	};

// 	// 로컬 스토리지에서 불러온다.
// 	var load = function() { // return boolean
// 		var storageItem = localStorage.getItem(STORAGE_ITEM_NAME);
// 		if (storageItem != null) {
// 			userInfo = JSON.parse(storageItem);

// 			return true;
// 		} else {
// 			return false;
// 		}
// 	};

// 	// 로컬  스토리지와 현재 메로리 상의 사용자 정보를 삭제한다.
// 	var clear = function() { // return void
// 		localStorage.removeItem(STORAGE_ITEM_NAME);
// 		userInfo = null;
// 	};

// 	// 로그인 상태 확인
// 	var init = function() { // return void

// 		// 로드한다.
// 		if (!load()) {
// 			console.log("LOGIN_INFO : 로그인되지 않은 상태임");
// 			// load가 실패하면 로그아웃 상태이므로, 현재 페이지가 로그인이 필요한 페이지인지 확인한다.

// 			// 만일 로그인이 필요하지 않은 상태이면 바로 리턴한다.

// 			// 로그인이 필요한 페이지이면, 현재 page를 history push하고 로그인 페이지로 이동한다.
// 			// LOGIN_PAGE_URL
// 		}

// 	};

// 	// Initialize
// 	init();


// 	return {
// 		login: function(email, password, successProcFunc, errorProcFunc) {
// 			callLogin(email, password, successProcFunc, errorProcFunc);
// 		},
// 		// formLogin: function(queryString) {
// 		//     return callFormLogin(queryString);
// 		// },
// 		logout: function() {
// 			// 로그아웃 후에 이동할 초기 페이지를 지정해야 함.
// 			return callLogout();
// 		},
// 		getName: function() {
// 			if (userInfo != null) return userInfo.name;
// 			else return;
// 		},
// 		getEmail: function() {
// 			if (userInfo != null) return userInfo.email;
// 			else return;
// 		},
// 		getId: function() {
// 			if (userInfo != null) return userInfo.userId;
// 			else return;
// 		},

// 		getUserType: function() {   // 1:구직(개인)회원, 2:구인(병원)회원
// 			if ( userInfo != null ) return userInfo.userType;
// 			else return;
// 		},
		
// 		isHospitalMember: function() {
// 			if ( userInfo != null && userInfo.userType != null && userInfo.userType==2 ) return true;
// 			return false;
// 		},
// 		isPersonalMember: function() {
// 			if ( userInfo != null && userInfo.userType != null && userInfo.userType==1 ) return true;
// 			return false;
// 		},

// 		getHospitalId: function() {
// 			if ( userInfo != null && userInfo.userType != null && userInfo.userType==2 ) return userInfo.hospitalId;
// 			else return null;
// 		},


// 		// 스크랩된 공고의 LIST를 가져온다.
// 		// 서버에서 가져오지 않고, 로컬 메모리에서만 처리한다.
// 		// 주의 : 로그인 시에는 이 정보를 한번은 가져와야 한다. 다른 단말(App vs Mobile Web)과의 동기화 필요
// 		getScrappedJobAdIds: function() {            
// 			if ( userInfo && userInfo.scrappedJobAdIds ) 
// 				return userInfo.scrappedJobAdIds;
// 		},
// 		// 공고를 스크랩한다.
// 		// 서버에 추가 명령을 내린 후,
// 		//      응답값으로 전체 스크랩 리스트를 받아 와서, 이를 로컬에 update하고,
// 		//      화면단에서는 이를 가지고 화면에 보이는 전체 공고에 대해서 다시 별표 표시 처리하여야 함(동일 공고가 프리미엄과 일반에 나오는 경우가 문제됨)
// 		addScrappedJobAdId: function(jobAdId, callbackFunction) {
// 			_addScrappedJobAdId(jobAdId, callbackFunction);
// 			return userInfo.scrappedJobAdIds;
// 		},
// 		// 스크랩된 공고를 삭제한다.
// 		removeScrappedJobAdId: function(jobAdId, callbackFunction) {
// 			_removeScrappedJobAdId(jobAdId, callbackFunction);
// 			return userInfo.scrappedJobAdIds;
// 		},
// 		// 서버로부터 리로드한다.
// 		refreshScrappedJobAdIds: function() {
// 			//
// 		},
// 		updateLocalScrappedJobAdId : function(jobAdIdArr, callbackFunction) {
// 			_updateLocalScrappedJobAdId(jobAdIdArr, callbackFunction);
// 		},

// 		// 관심지역 리스트를 가져온다.
// 		// getInterstingLocationList: function() {
// 		//     return _getInterstingLocationList();
// 		// },


// 		isLoggedIn: function() {
// 			if (userInfo != null) return true;
// 			return false;
// 		},
// 		afterSignup: function(newUserInfo) {
// 			if ( newUserInfo != null ) {
// 				clear();
// 				userInfo = newUserInfo;                
// 				save();
// 			} else return false;
// 		},

// 		getToken: function() {
// 			if ( userInfo != null && userInfo.token != null ) return userInfo.token;
// 			else return null;
// 		}
// 	};
// })();


var CODE_CONTAINER = (function() {

	return {

		getCode: function(value, funcGetter) {
			if ( !funcGetter ) return null;

			if ( !value ) value = "";

			var codeArr = funcGetter();
			for ( var i=0; codeArr && i<codeArr.length; i++ ) {
				if ( codeArr[i].value == value ) return codeArr[i];
			}
			return null;
		},

		getApplyWay: function() {
			return [{value:"", text:"전체", default:true}, {value:"homepage",text:"홈페이지"}, {value:"oneclick",text:"원클릭지원"}, {value:"email", text:"이메일지원"}, {value:"tel", text:"전화문의"} ];
		},
		getExpType: function() {
			return [{value:"", text:"경력 무관", default:true}, {value:"1", text:"신입"}, {value:"2", text:"경력"} ];
			// expType
		},
		getEduLevel: function() {
			return [{value:"", text:"학력 무관", default:true}, {value:"1", text:"고졸 이상"}, {value:"2", text:"대학교 졸업 이상(졸업예정자 포함)"}, {value:"3", text:"대학원 졸업 이상"}];
		},
		getSalaryType: function() {
			return [{value:"1", text:"면접 후 협의"}, {value:"0", text:"직접 입력"}];
		},
		getRoleType: function() {
			return [{value:"", text:"무관", default:true}, {value:"1", text:"팀장"}, {value:"2", text:"실장"}, {value:"3", text:"스텝"}, {value:"0", text:"직접 입력"}];
		},
		getHiringTermType: function() {
			return [{value:"1", text:"상시채용"}, {value:"2", text:"기간채용"}];
		},

		getSalaryWanted: function() {
			return [{value:"1", text:"협의"}, {value:"2", text:"내규에 따름"}, {value:"0", text:"직접 입력"}];
		},
		// getRoleWanted: function() {
		//     return getRoleType();
		//     //return [{value:"", text:"무관"}, {value:"1", text:"팀장"}, {value:"2", text:"실장"}, {value:"3", text:"스텝"}, {value:"0", text:"직접 입력"}];
		// },
		getEduLevelOnResume: function() {   // getEduLevel과 통합 여부 고려할 것
			return [{value:"", text:"선택", default:true}, {value:"1", text:"초등학교"}, {value:"2", text:"중학교"},{value:"3", text:"고등학교"},{value:"4", text:"대학(2,3년)"},{value:"5", text:"대학교"},{value:"6", text:"대학원"} ];
		},
		getEduStatus: function() {          // getEduLevel과 통합 여부 고려할 것
			return [{value:"", text:"선택", default:true}, {value:"1", text:"졸업"}, {value:"2", text:"재학중"}, {value:"3", text:"졸업예정"}, {value:"4", text:"중퇴"}, {value:"5", text:"검정고시"}];
		},

		getHolyday: function() {
			return [{value:"1", text:"공휴일"}, {value:"2", text:"매주 토요일"}, {value:"3", text:"매주 일요일"}, {value:"4", text:"1,3주 토요일"}, {value:"5", text:"2,4주 토요일"}, {value:"0", text:"기타/추가"}];
		},

		getHospitalTypeCode: function() {
			return [{value:"HIRA_41", text:"치과의원"}, {value:"HIRA_51", text:"치과병원"}, {value:"DP_10", text:"치과기공소"}, 
					{value:"HIRA_11", text:"종합병원"}, {value:"DP_45", text:"네트워크치과"}, {value:"DP_00", text:"개원예정"}, {value:"0", text:"기타(직접 입력)"} ];
		},

		getAdTypeCode: function() {
			return [{value:"1", text:"일반공고"}, {value:"2", text:"프리미어"}];
		},
	 



		getAttrs: function() {
			return [
						{
							group:"EMP",
							text: "고용형태",
							element: [
								//{value:"",      group:"EMP", text:"무관", default:true},   
								{value:"EMP.1", group:"EMP", text:"정규직"}, 
								{value:"EMP.2", group:"EMP", text:"계약직"},         
								{value:"EMP.3", group:"EMP", text:"아르바이트"}
							]
						},

						{
							group:"AREA", 
							text:"채용부문",
							element: [
								//{value:"",       group:"AREA", text:"무관", default:true},
								{value:"AREA.1", group:"AREA", text:"치위생사"},
								{value:"AREA.2", group:"AREA", text:"간호조무사"},
								{value:"AREA.3", group:"AREA", text:"치기공사"},
								{value:"AREA.4", group:"AREA", text:"보험청구사"},
								{value:"AREA.5", group:"AREA", text:"코디네이터"},
								{value:"AREA.6", group:"AREA", text:"의사"},
								{value:"AREA.7", group:"AREA", text:"기타"}
							]
						},

						{
							group:"TASK",
							text:"담당업무",
							element: [
								//{value:"",       group:"TASK", text:"무관", default:true},
								{value:"TASK.1", group:"TASK", text:"진료실"},
								{value:"TASK.2", group:"TASK", text:"데스크"},
								{value:"TASK.3", group:"TASK", text:"상담"},
								{value:"TASK.4", group:"TASK", text:"보험청구"},
								{value:"TASK.5", group:"TASK", text:"치과내 기공실"},
								{value:"TASK.6", group:"TASK", text:"치과기공소"},
								{value:"TASK.7", group:"TASK", text:"관리및경영"},
								{value:"TASK.8", group:"TASK", text:"의사"},
								{value:"TASK.9", group:"TASK", text:"기타"},
							]
						},
					];            
		},

		getAttrMap: function() {
			return {
				"EMP" : {
					text: "고용형태",
					order : 1,
					element: {
						"EMP.1" : {group: "EMP", order: 1, deprecated: "N", text: "정규직"},
						"EMP.2" : {group: "EMP", order: 2, deprecated: "N", text: "계약직"},
						"EMP.3" : {group: "EMP", order: 3, deprecated: "N", text: "아르바이트"}
					}
				},

				"AREA" : {
					text: "채용부문",
					order : 2,
					element: {
						"AREA.1" : {group: "AREA", order: 1, deprecated: "N", text: "치위생사"},
						"AREA.2" : {group: "AREA", order: 2, deprecated: "N", text: "간호조무사"},
						"AREA.3" : {group: "AREA", order: 3, deprecated: "N", text: "치기공사"},
						"AREA.4" : {group: "AREA", order: 4, deprecated: "N", text: "보험청구사"},
						"AREA.5" : {group: "AREA", order: 5, deprecated: "N", text: "코디네이터"},
						"AREA.6" : {group: "AREA", order: 6, deprecated: "N", text: "의사"},
						"AREA.7" : {group: "AREA", order: 7, deprecated: "N", text: "기타"}
					}
				},

				"TASK" : {
					text: "담당업무",
					order : 3,
					element: {
						"TASK.1" : {group: "TASK", order: 1, deprecated: "N", text: "진료실"},
						"TASK.2" : {group: "TASK", order: 2, deprecated: "N", text: "데스크"},
						"TASK.3" : {group: "TASK", order: 3, deprecated: "N", text: "상담"},
						"TASK.4" : {group: "TASK", order: 4, deprecated: "N", text: "보험청구"},
						"TASK.5" : {group: "TASK", order: 5, deprecated: "N", text: "치과내 기공실"},
						"TASK.6" : {group: "TASK", order: 6, deprecated: "N", text: "치과기공소"},
						"TASK.7" : {group: "TASK", order: 7, deprecated: "N", text: "관리및경영"},
						"TASK.8" : {group: "TASK", order: 8, deprecated: "N", text: "의사"},
						"TASK.9" : {group: "TASK", order: 9, deprecated: "N", text: "기타"}
					}
				}

			};
		}



	};


})();


var CHANGE_EVENT = new Event("change");

/*************************************************************************************************************** */

/**
 * JS의 KeyValue Object의 값을 FORM 데이터로 변경한다.
 * 
 * TODO. 현재는 Object 내에 존재하는 배열이 1단계까지만 처리한다. 향후, n단계도 지원되도록 변경 필요 (재귀)
 */
function convertObjectToFormDataString(obj) {
	if ( obj==null ) return "";

	var str = "";
	Object.keys(obj).forEach(function(key) {
		var value = obj[key];
		if ( Array.isArray(value) ) {
			var temp = "";
			value.forEach(function(eachVal) {       // TODO 재귀로 변경 필요
				temp += key + "=" + eachVal + "&";
			});
			str += temp;
		} else { 
			str += key + "=" + value + "&";
		}
	});

	return str;

}



/**
 * formElement의 내용으로 JSON 객체를 생성한다.
 * @param {*} formElement 
 */
function createObjectFromFormData(formElement) {
	if ( !formElement ) throw '처리할 FORM이 지정되지 않았습니다.';

	var obj = {};

	function add(name, value) {
		console.log("ADD : [" + name + "] == [" + value + "]");
		if ( name.indexOf("[]") > -1 ) {

			var parentName = name.split("[]")[0];
			var childName  = name.split("[]")[1];
			console.log("\tparent [" + parentName + "]   child [" + childName + "]");

			// 기존 코드 보호
			if ( childName && childName.length>0 ) {

				if ( obj[parentName]!==undefined ) {
					var len = obj[parentName].length;

					var added = false;
					for ( var i=0; i<len; i++ ) {
						if ( obj[parentName][i][childName]===undefined ) {
							obj[parentName][i][childName] = value;
							added = true;
							console.log("\tA\t " + i + "번째 " + parentName + "의 " + childName + "==" + value);
							break;
						}
					}
					if ( !added ) {
						obj[parentName][len] = {};
						obj[parentName][len][childName] = value;
						console.log("\tB\t " + len + "번째 " + parentName + "의 " + childName + "==" + value);
					}


				} else {
					obj[parentName] = [];
					obj[parentName][0] = {};
					obj[parentName][0][childName] = value;
					console.log("\tC\t 0번째 [" + parentName + "][0]의 [" + childName + "] == [" + value + "]");
				}


				return;

			// 단순 배열 처리 추가
			} else {
				console.log("단순 배열 추가 ", parentName);
				if ( !value || value.trim()=='' ) return;   // 값이 null이거나 빈 값이면, skip
				if ( obj[parentName] ) {  // 이미 존재하는데, 다른 값을 넣는 것이면, 이는 배열 처리
			
					if ( !Array.isArray(obj[parentName]) ) {  // 기존 값이 배열이 아니라면, 배열로 만들고 기존 값을 push한다.
						var oldValue = obj[parentName];
						obj[parentName] = [];
						obj[parentName].push(oldValue);
					}
		
					obj[parentName].push(value);
		
				} else {
					obj[parentName] = [];
					obj[parentName].push(value);
				}

				return;
			}
		}

		


		if ( !value || value.trim()=='' ) return;   // 값이 null이거나 빈 값이면, skip 

		/* 2018.04.15 이주현 추가. JSON Object 형식 처리 */
		if ( name.indexOf(".") > -1 ) {
			var parentName = name.split(".")[0];
			var childName  = name.split(".")[1];
			console.log("\tparent [" + parentName + "]   child [" + childName + "]");

			if ( Array.isArray(obj[parentName]) ) {
				throw "젠장....";
			}

			if ( !obj[parentName] ) obj[parentName] = {};

			obj[parentName][childName] = value;

			return;
		}
		/************************************************************/


		if ( obj[name] ) {  // 이미 존재하는데, 다른 값을 넣는 것이면, 이는 배열 처리
			
			if ( !Array.isArray(obj[name]) ) {  // 기존 값이 배열이 아니라면, 배열로 만들고 기존 값을 push한다.
				var oldValue = obj[name];
				obj[name] = [];
				obj[name].push(oldValue);
			}

			obj[name].push(value);

		} else {
			obj[name] = value;
		}
	}


	var len = formElement.elements.length;
	for ( var i=0; i<len; i++ ) {
		var element = formElement.elements[i];

		if ( !element.name || element.name.trim()=='' ) continue;   // 엘리먼트의 이름이 없거나 빈 값이면 skip.
		if ( element.disabled ) continue;       // disabled된 입력값은 확인하지 않음


		if ( element.type=='checkbox' || element.type=='radio' ) {
			if ( element.checked ) {
				add(element.name, element.value);
			}

		// } else if ( element.type=='text' || element.type=='number' || element.type=='tel' || element.type=='email' ) {
		//     add(element.name, element.value);

		} else if ( element.type=='textarea' ) {
			add(element.name, element.value);

		} else if ( element.type=='select-multiple' ) {
			for ( var j=0; element.options && j<element.options.length; j++ ) {
				if ( element.options[i].selected ) {
					add(element.name, element.options[i].value);
				}
			}

		} else if ( element.type=='select-one' || element.type=='select' ) {
			add(element.name, element.value);
		
		} else {
			add(element.name, element.value);
		}

	}

	console.log("변환값 ", obj);
	console.log(JSON.stringify(obj));

	return obj;

}


/**
 * JSON 수신데이터로 formElement의 값들을 채운다.
 * 
 * @param {*} formElement 
 * @param {*} initData 
 */
function initFormData(formElement, initData) {
	if ( !formElement ) throw '처리할 FORM이 지정되지 않았습니다.';

	
	Object.keys(initData).forEach(function(name) {
		console.log("처리 중 : ", name);

		var val = initData[name];

		if ( Array.isArray(initData[name]) ) {      // ------------------- 입력 값이 배열인 경우     20180303: 수신되는 데이터가 배열인 경우에 대상 FORM 엘리먼트는 name이 name[] 형식이어야 한다.
			var formElementName = name + "[]";
			console.log("    배열 [" + name + "][" + val + "]:" + (typeof val) + "==>", val);

			// 해당 checkbox 그룹을 초기화한다.
			formElement.querySelectorAll("input[type='checkbox'][name='" + formElementName + "']").forEach(function(el) {
				if ( el.value=="" ) el.checked = true;
				else el.checked = false;
			});

			// 값이 있는 것들만 check한다.
			val.forEach(function(eachVal) {
				var target = formElement.querySelector("input[type='checkbox'][name='" + formElementName + "'][value='" + eachVal + "']");
				if ( target ) {
					target.checked = true;
					target.dispatchEvent(CHANGE_EVENT);
					console.log("    배열 처리 완료 ", target.name, target.checked, target.value);
				}
			});

			// console.log("    배열 [" + name + "][" + val + "]:" + (typeof val) + "==>", val);

			// // 해당 checkbox 그룹을 초기화한다.
			// formElement.querySelectorAll("input[type='checkbox'][name='" + name + "']").forEach(function(el) {
			//     if ( el.value=='' ) el.checked = true;
			//     else el.checked = false;
			// });

			// // 값이 있는 것들만 check한다.
			// val.forEach(function(eachVal, idx) {
			//     var target = formElement.querySelector("input[type='checkbox'][name='" + name + "'][value='" + eachVal + "']");
			//     if ( target ) {
			//         target.checked = true;
			//         target.dispatchEvent(CHANGE_EVENT);
			//         console.log("    배열 처리 완료 ", target.name, target.checked, target.value);
			//     }
			// });

		} else if ( typeof initData[name] === "object" ) {		// Object이면 
			console.log("OBJECT 찾았음 ===> ", initData[name]);

			Object.keys(initData[name]).forEach(function(subName) {
				var fullName = name + "." + subName;
				console.log("\t\t" + fullName);
				formElement.querySelectorAll("[name='" + fullName + "']").forEach(function(element) {
					element.value = initData[name][subName];
				});
			});


		} else {                                    // ------------------- 입력 값이 단일 값(배열이 아님)인 경우
			console.log("    단일값");

			formElement.querySelectorAll("[name='" + name + "']").forEach(function(element) {
				if ( element.type=="textarea" ) {
					//element.innerHTML = val;
					element.value = val;
				} else if ( element.type=="radio" || element.type=="checkbox" ) {
					console.log("    찾아봐 : ", element);
					if ( element.value == val ) {
						element.checked = true;
					} else {
						element.checked = false;        // 이게 문제가 될 수도 있겠다.
					}
				} else if ( element.type=="fieldset" ) {
					// Do Nothing.
				} else {
					element.value = val;
				}

				element.dispatchEvent(CHANGE_EVENT);

			});
			
		}
	});

	console.log("초기값 설정 완료");
}




/**
 * ES5 이하에서 사용하기 위한 Set 객체
 */
function SimpleSet(hashFunction) {
	this._hashFunction = hashFunction || JSON.stringify;
	this._values = {};
	this._size = 0;
}
SimpleSet.prototype = {
	add: function add(value) {
		if ( !this.contains(value) ) {
			this._values[this._hashFunction(value)] = value;
			this._size++;
		}
		return this;
	},
	clear: function clear() {
		this._values = {};
		this._size = 0;
	},
	remove: function remove(value) {    // delete(value)
		if ( this.contains(value) ) {
			delete this._values[this._hashFunction(value)];
			this._size--;
		}
	},
	delete: function(value) {    // delete(value)
		if ( this.contains(value) ) {
			delete this._values[this._hashFunction(value)];
			this._size--;
			return true;
		} else {
			return false;
		}
	},
	contains: function contains(value) {
		return typeof this._values[this._hashFunction(value)] !== 'undefined';
	},
	has: function has(value) {
		return typeof this._values[this._hashFunction(value)] !== 'undefined';
	},
	size: function size() {
		return this._size;
	},
	forEach: function foeEach(iteratorFunction, thisObj) {
		for (var value in this._values) {
			iteratorFunction.call(thisObj, this._values[value]);
		}
	},
	test: function test() {
		return this._values;
	}
};
/* 참고 ES6 Set
	Set.prototype.add(value)
		Set 객체에 주어진 값을 갖는 새로운 요소를 추가합니다. Set 객체를 반환합니다.
	Set.prototype.clear()
		Set 객체에서 모든 요소를 제거합니다.
	Set.prototype.delete(value)
		value와 관련된 요소를 제거하고 Set.prototype.has(value)가 이전에 반환했던 값을 반환합니다. Set.prototype.has(value)는 그 뒤에 false를 반환합니다.
	Set.prototype.entries()
		삽입 순으로 Set 객체 내 각 값에 대한 [value, value] 배열을 포함하는 새로운 Iterator 객체를 반환합니다. 이는 Map 객체와 비슷하게 유지되므로 여기서 각 항목은 그 key와 value에 대해 같은 값을 갖습니다.
	Set.prototype.forEach(callbackFn[, thisArg])
		삽입 순으로 Set 객체 내에 있는 각 값에 대해 한 번 callbackFn을 호출합니다. thisArg 매개변수가 forEach에 제공된 경우, 이는 각 콜백에 대해 this 값으로 사용됩니다.
	Set.prototype.has(value)
		Set 객체 내 주어진 값을 갖는 요소가 있는지를 주장하는(asserting, 나타내는) boolean을 반환합니다.
	Set.prototype.keys()
		values() 함수와 같은 함수로 삽입 순으로 Set 객체 내 각 요소에 대한 값을 포함하는 새로운 Iterator 객체를 반환합니다.
	Set.prototype.values()
		삽입 순으로 Set 객체 내 각 요소에 대한 값을 포함하는 새로운 Iterator 객체를 반환합니다.
	Set.prototype[@@iterator]()
		삽입 순으로 Set 객체 내 각 요소에 대한 값을 포함하는 새로운 Iterator 객체를 반환합니다.
*/


var DynamicCheckboxGroupWithGroupName = function(formElement, checkboxGroupName, funcAfterChanged) {
	var dataTagNameForGroup   = "data-checkbox-group";
	var dataNameForGroup      = "checkboxGroup";


	function onChangeReset(event) {
		console.log("-- onChangeReset 호출됨");
		var members = formElement.querySelectorAll("input[type=checkbox][" + dataTagNameForGroup + "='" + checkboxGroupName + "']:not([value=''])");

		if ( this.checked ) {
			members.forEach(function(member) {
				member.checked = false;
			});
		} else {
			// var totalMemberCount = members.length;
			// var checkedMemberCount = formElement.querySelectorAll("input[type=checkbox][" + dataTagNameForGroup + "='" + checkboxGroupName + "']:not([value='']):checked").length;

			// if ( checkedMemberCount == 0 || totalMemberCount == checkedMemberCount  ) {
			//     this.checked = true;
			//     members.forEach(function(member) {
			//         member.checked = false;
			//     });
			// }
		}
	}
	formElement.querySelectorAll("input[type=checkbox][" + dataTagNameForGroup + "='" + checkboxGroupName + "'][value='']").forEach(function(reset) {
		reset.addEventListener("change", onChangeReset);
	});


	function onChangeMemeber(event) {
		console.log("-- onChangeMemeber 호출됨 ", this);
		var reset = formElement.querySelector("input[type=checkbox][" + dataTagNameForGroup + "='" + checkboxGroupName + "'][value='']");
		var members = formElement.querySelectorAll("input[type=checkbox][" + dataTagNameForGroup + "='" + checkboxGroupName + "']:not([value=''])");
		var totalMemberCount = members.length;
		var checkedMemberCount = formElement.querySelectorAll("input[type=checkbox][" + dataTagNameForGroup + "='" + checkboxGroupName + "']:not([value='']):checked").length;


		if ( checkedMemberCount == 0 ) {
			reset.checked = true;
			members.forEach(function(member) {
				member.checked = false;
			});
		} else if ( totalMemberCount == checkedMemberCount ) {    // 모두 check되었다면, 'reset'를 check & 'member'들은 모두 uncheck.
			reset.checked = true;
			members.forEach(function(member) {
				member.checked = false;
			});
		} else if ( checkedMemberCount > 0 ) {
			reset.checked = false;
		}

		// if ( checkedMemberCount == 0 ) {
		//     reset.checked = true;
		// } else if ( totalMemberCount == checkedMemberCount ) {    // 모두 check되었다면, 'reset'를 check & 'member'들은 모두 uncheck.
		//     reset.checked = true;
		// } else if ( checkedMemberCount > 0 ) {
		//     reset.checked = false;
		// }

		// reset.dispatchEvent(new Event('change'));
	}
	formElement.querySelectorAll("input[type=checkbox][" + dataTagNameForGroup + "='" + checkboxGroupName + "']:not([value=''])").forEach(function(member) {
		member.addEventListener("change", onChangeMemeber);
	});
}

/**
 *  동일한 name과 동일한 data-checkbox-group 값을 가진 checkbox(input type="checkbox")를 그룹으로 묶는다.
 *  단, 이벤트 발생 시 마다 새롭게 그룹을 찾아서 처리한다. 
 * 
 *  a. 동일한 그룹의 checkbox들은 reset checkbox와 member checkbox들로 나뉜다.
 *      - reset checkbox : 동일 그룹 내에서 value의 값이 ''인 것. 동일 그룹 내에서는 1개만 있어야 한다.
 *      - member checkboxes : 동일 그룹 내에서 value의 값이 ''가 아닌 것
 *  b. reset checkbox가 check되면, 동일 그룹 내의 member checkbox들은 uncheck된다.
 *  c. 동일 그룹 내의 member checkbox들이 모두 check되면, reset checkbox가 check되고, member checkbox들은 uncheck된다.
 *  d. member checkbox들 중에 하나라도 check되면, reset checkbox는 uncheck된다.
 * 
 */
var DynamicCheckboxGroup = function(formElement, checkboxName, funcAfterChanged) {
	var dataTagNameForGroup   = "data-checkbox-group";
	var dataNameForGroup      = "checkboxGroup";
	

	function onChangeResetDynamic(event) {
		if ( this.checked ) {
			var groupName = this.dataset[dataNameForGroup];
			var members = formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value=''])");
			members.forEach(function(member) {
				member.checked = false;
			});
		
		} else {
			var members = formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value=''])");
			var totalMemberCount = members.length;
			var checkedMemberCount = formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value='']):checked").length;

			if ( checkedMemberCount == 0 || totalMemberCount == checkedMemberCount  ) {
				members.forEach(function(member) {
					member.checked = false;
				});
				this.checked = true;
			}
		}

		if ( funcAfterChanged != null ) {
			funcAfterChanged();
		}
	}
	formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "'][value='']").forEach(function(resetElement) {
		resetElement.addEventListener("change", onChangeResetDynamic);
	});

	

	function onChangeMembersDynamic(event) {
		//console.log(this, " ==> dataset ", this.dataset[dataNameForGroup]);

		var groupName = this.dataset[dataNameForGroup];
		var members = formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value=''])");
		var totalMemberCount = members.length;
		var checkedMemberCount = formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value='']):checked").length;

		//console.log(members);
		//console.log(totalMemberCount + ", " + checkedMemberCount);

		if ( totalMemberCount == checkedMemberCount ) {    // 모두 check되었다면, 'reset'를 check & 'member'들은 모두 uncheck.
			formElement.querySelector("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='']").checked = true;
			members.forEach(function(member) {
				member.checked = false;
			});

		} else if ( checkedMemberCount > 0 ) {
			console.log("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='']");
			formElement.querySelector("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='']").checked = false;

		} else if ( checkedMemberCount == 0 ) {
			//console.log("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='']");
			formElement.querySelector("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='']").checked = true;

		}

		if ( funcAfterChanged != null ) {
			funcAfterChanged();
		}
	}
	formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "']:not([value=''])").forEach(function(member) {
		member.addEventListener("change", onChangeMembersDynamic);
	});


	// name이 동일한 모든 그룹을 초기화(reset을 check로, member들을 uncheck으로)한다.
	function resetAll() {
		//console.log("모든 그룹에 대하여 reset");
		formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "']:not([value=''])").forEach(function(anyMember) {
			anyMember.checked = false;
		});

		formElement.querySelectorAll("input[type=checkbox][name='" + checkboxName + "'][value='']").forEach(function(anyReset) {
			anyReset.checked = true;
		});
	}

	return {
		check: function(checkedValues) {
			if ( checkedValues==null || checkedValues.length==0 ) {
				// 그룹이 다르더라도 모두 처리한다.
				resetAll();

			} else {
				// 각 그룹마다 따로 처리하여야 한다.
				resetAll();

				var groupNames = new SimpleSet();
				checkedValues.forEach(function(value) {
					//console.log("check함 : ", value);
					if ( value == '' ) return;      // reset의 경우에는 value='' 이므로 skip.
															
					var member = formElement.querySelector("input[type='checkbox'][name='" + checkboxName + "'][value='" + value + "']");
					member.checked = true;
					groupNames.add( member.dataset[dataNameForGroup] );
				});
				
				//console.log(groupNames);
				groupNames.forEach(function(groupName) {
					formElement.querySelector("input[type=checkbox][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='']").checked = false;
				});
			}
		}
	};

};
// 사용법
// var checkboxGroup1 = new CheckboxGroup(document.getElementById("jobAdForm"), "attr", "TASK");
// var checkboxGroup2 = new CheckboxGroup(document.getElementById("jobAdForm"), "attr", "EMP");
// var checkboxGroup3 = new CheckboxGroup(document.getElementById("jobAdForm"), "attr", "AREA");
// var checkboxGroup = new DynamicCheckboxGroup(document.getElementById("jobAdForm"), "attr");
/**
 *  동일한 name과 동일한 data-checkbox-group 값을 가진 checkbox(input type="checkbox")를 그룹으로 묶는다.
 * 
 *  a. 동일한 그룹의 checkbox들은 reset checkbox와 member checkbox들로 나뉜다.
 *      - reset checkbox : 동일 그룹 내에서 value의 값이 ''인 것. 동일 그룹 내에서는 1개만 있어야 한다.
 *      - member checkboxes : 동일 그룹 내에서 value의 값이 ''가 아닌 것
 *  b. reset checkbox가 check되면, 동일 그룹 내의 member checkbox들은 uncheck된다.
 *  c. 동일 그룹 내의 member checkbox들이 모두 check되면, reset checkbox가 check되고, member checkbox들은 uncheck된다.
 *  d. member checkbox들 중에 하나라도 check되면, reset checkbox는 uncheck된다.
 * 
 */
var CheckboxGroup = function(formElement, checkboxName, groupName, funcAfterChanged) {
	var dataTagNameForGroup   = "data-checkbox-group";
	var dataNameForGroup      = "checkboxGroup";

						
	var reset       = formElement.querySelector("input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='']");
	var members     = formElement.querySelectorAll("input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value=''])");
	var totalMemberCount = members.length;

	//console.log("reset :: " + "input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='']");
	//console.log("reset 객체 : ", reset);
	//console.log("member :: " + "input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value=''])");
	//console.log("member 객체들 : ", members);

	function onChangeReset(event) {
		if ( reset.checked ) {
			members.forEach(function(member) {
				member.checked = false;
			});
		}
		//reset.checked = true;

		if ( funcAfterChanged != null ) {
			funcAfterChanged();
		}
	}
	reset.addEventListener("change", onChangeReset);



	function onChangeMembers(event) {
		console.log("input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value='']):checked");
		var checkedMemberCount = formElement.querySelectorAll("input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value='']):checked").length;
		console.log("체크갯수 : ", checkedMemberCount, "   ", formElement.querySelector("input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value='']):checked"));

		// var checkedMembers = formElement.querySelector("input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "']:not([value='']):checked").length;
		// console.log("체크갯수 : ", checkedMembers.length, "   ", checkedMembers);


		if ( totalMemberCount == checkedMemberCount ) {    // 모두 check되었다면, 'reset'를 check & 'member'들은 모두 uncheck.
			reset.checked = true;
			members.forEach(function(member) {
				member.checked = false;
			});

		} else if ( checkedMemberCount > 0 ) {
			reset.checked = false;

		} else if ( checkedMemberCount == 0 ) {
			reset.checked = true;
		}


		if ( funcAfterChanged != null ) {
			funcAfterChanged();
		}
	}
	members.forEach(function(member) {
		member.addEventListener("change", onChangeMembers);
	});


	return {
		check: function(checkedValues) {
			if ( checkedValues==null || checkedValues.length==0 ) {
				members.forEach(function(member) {
					member.checked = false;
				});

				reset.checked = true;
			} else {
				// 멤버들 전체를 uncheck한 후에,
				members.forEach(function(member) {
					member.checked = false;
				});
				// 값이 들어 온 것만 check한다.
				checkedValues.forEach(function(value) {
					if ( value == '' ) return;      // reset의 경우에는 value='' 이므로 skip.
					
					// 동일 value의 member가 2개 이상인 병신 같은 경우가 있을 수 있으므로, loop로 처리
					formElement.querySelectorAll("input[type='checkbox'][name='" + checkboxName + "'][" + dataTagNameForGroup + "='" + groupName + "'][value='" + value + "']").forEach(function(member) {
						member.checked = true;
					});
				});

				reset.checked = false;
			}
		}
	};

};

/**
 * SELECT 엘리먼트의 option을 생성하여 삽입한다. (기존 있던 option들은 없어짐)
 * 
 * @param {*} selectElement 
 * @param {*} codesForOption  배열 [ {value:"값1", text:"텍스트1"}, ..., {value:"값n", text:"텍트스n"}] 형식 
 */
function setSelectOptions(selectElement, codesForOption) {    // selectElement에 대한 예외처리는 안함. 오류인 경우에는 에러가 나야 함.
	if ( !codesForOption || !Array.isArray(codesForOption) || codesForOption.length==0 ) return;

	var htmlStr = "";
	codesForOption.forEach(function(code) {
		if ( code.default ) htmlStr += "<option value='" + code.value + "' selected>" + code.text + "</option>";
		else htmlStr += "<option value='" + code.value + "'>" + code.text + "</option>";
	});
	selectElement.innerHTML = htmlStr;
}

/**
 * SELECT 엘리먼트의 options들을 초기화한다.
 * 기본 option을 넣지 않으면, ""(빈 값)을 가지는 "선택"이라는 기본 option을 하나 생성한다.
 * 
 * @param {*} selectElement 
 * @param {*} defaultOptionText   기본 option의 text
 * @param {*} defaultOptionValue  기본 option의 value
 */
function clearSelectOptions(selectElement, defaultOptionText, defaultOptionValue) {
	if ( selectElement && selectElement.options && selectElement.options.length>0 ) {       // options 전체 초기화
		var len = selectElement.options.length;
		for ( var i=0; i<len; i++ ) {
			selectElement.options.remove(0);
		}
	}

	if ( selectElement ) {
		var option = document.createElement("option");

		if ( defaultOptionText )   option.text = defaultOptionText;
		else option.text = "선택";
		if ( defaultOptionValue )   option.value = defaultOptionValue;
		else option.value = "";

		// element가 required 속성일 때에는 하나라도 선택해야 하므로 "선택("")"은 선택할 수 없어야 하고, required=false인 경우에는 값을 선택하지 않을 수도 있으므로 "선택("")"도 선택할 수 있어야 한다. 
		if ( selectElement.required ) option.disabled = true;

		option.selected = true;
		console.log("*** ", selectElement );
		selectElement.options.add(option);            
	}

}



/**
 * 선택가능한 하나의 엘리먼트(select, checkbox, radio)와 텍스트 엘리먼트(text, textarea)를 바인딩한다.
 * 
 * 기능 1 : 텍스트 엘리먼트의 value가 없으면, 선택가능 엘리먼트의 특정 value(bindingValue)의 항목이 unchecked된다.
 * 기능 2 : 텍스트 엘리먼트의 value가 존재하면, 선택가능 엘리먼트의 특정 value(bindingValue)의 항목이 check된다.
 * 기능 3 : (Optional) autoHideTextElement가 true인 경우에는, 선택가능 엘리먼트의 특정 value(bindingValue)의 항목의 check여부에 따라, 텍스트 엘리먼트가 hidden/show 변경된다.
 * 기능 4 : (Optional) autoDisableTextElement true인 경우에는, 선택가능 엘리먼트의 특정 value(bindingValue)의 항목의 check여부에 따라, 텍스트 엘리먼트가 disabled/enabled 변경된다.
 * 
 * 
 * @param {*} checkableElementName      (Required)
 * @param {*} bidingValue               (Required)
 * @param {*} autoHideTextElement       (Optional)
 * @param {*} autoDisableTextElement    (Optional)
 */
function bindCheckableElementWithTextElement(checkableElementName, bidingValue, autoHideTextElement, autoDisableTextElement) {

	var boundTextElement = document.querySelector("[name='" + bidingValue + "']");    
	console.log("bindCheckableElementWithTextElement ", boundTextElement);
	if ( boundTextElement==null || !(boundTextElement.type=="text" || boundTextElement.type=="textarea") ) throw "형식 오류";
	
	function setText(text) {
		if ( boundTextElement.type=="text" ) boundTextElement.value = text;
		else if ( boundTextElement.type=="textarea" ) boundTextElement.innerHTML = text;
		else throw "형식 오류";
	}
	function getText() {
		if ( boundTextElement.type=="text" ) return boundTextElement.value;
		else if ( boundTextElement.type=="textarea" ) return boundTextElement.innerHTML
		else throw "형식 오류";
	}
	function showText(flag) {
		if ( autoHideTextElement==true ) boundTextElement.hidden = !flag;
	}
	function enableText(flag) {
		if ( autoDisableTextElement==true ) boundTextElement.disabled = !flag;
	}
	function doOptionForText(flag) {
		showText(flag);
		enableText(flag);
	}

	

	var checkableElementBase = document.querySelector("[name='" + checkableElementName + "']");

	// ----------------- select 엘리먼트인 경우
	if ( checkableElementBase.type.startsWith("select") ) {
		if ( checkableElementBase.value==undefined || checkableElementBase.value==null || checkableElementBase.value!=bidingValue ) {
			doOptionForText(false);
		} else {
			doOptionForText(true);
		}

		checkableElementBase.addEventListener("change", function(event) {
			if ( this.value==undefined || this.value==null || this.value!=bidingValue ) {
				setText(null);
				doOptionForText(false);
			} else {
				doOptionForText(true);
			}
		});
	
		boundTextElement.addEventListener("input", function(event) {
			var text = getText();
			//console.log("TEXT [" + text + "]");
			if ( text==undefined || text==null || text.trim()=="" ) {
				checkableElementBase.options[0].selected = true;
				doOptionForText(false);
			} else {
				checkableElementBase.value = bidingValue;
				doOptionForText(true);
			}
		});



	// ----------------- checkbox 또는 radio 엘리먼트인 경우
	} else if ( checkableElementBase.type=="checkbox" || checkableElementBase.type=="radio" ) {
		var checkableElement = document.querySelector("[name='" + checkableElementName + "'][value='" + bidingValue + "']");
		if ( !checkableElement.checked ) {
			doOptionForText(false);
		} else {
			doOptionForText(true);
		}

		checkableElement.addEventListener("change", function(event) {
			if ( !this.checked ) {
				setText(null);
				doOptionForText(false);
			} else {
				doOptionForText(true);
			}
		});
	
		boundTextElement.addEventListener("input", function(event) {
			var text = getText();
			if ( text==undefined || text==null || text.trim()=="" ) {
				checkableElement.checked = false;
				doOptionForText(false);
			} else {
				checkableElement.checked = true;
				doOptionForText(true);
			}
		});
	}



}

/**
 *  초기 데이터를 해당 element의 value에 삽입한다.
 *  @param  selectedValues  초기 데이터.
 *                  예) {'choice':['a', 'c', 'choice-text], 'choice-text':'가나다라' }
 *                          ==> checkbox 중에서 name이 'choice'인 것을 찾아, value가 'a', 'c'인 것들의 checked를 true로 변경
 *                          ==> text(textarea) 중에서 name이 'choice-text'인 것을 찾아, value(text) 또는 innerHTML(textarea)를 '가나다라'로 바꿈.
 *
 *          <label><input type="checkbox" id="a" name="choice" value="a">A선택</label>
 *          <label><input type="checkbox" id="b" name="choice" value="b">B선택</label>
 *          <label><input type="checkbox" id="c" name="choice" value="c">C선택</label>
 *          <label><input type="checkbox" id="d" name="choice" value="choice-text">직접입력</label>
 *          <input type="text" name="choice-text">
 *
 *          var selectedValues1 = { choice:['a', 'c', 'choice-text'], 'choice-text':'가나다라' };
 *          initElementValues(document.getElementById("form1"), selectedValues1);
 * 
 *          
 */
function initFormElementValues(formElement, selectedValues) {
	if ( formElement==undefined || formElement==null ) return;
	if ( selectedValues==undefined || selectedValues==null ) return;

	Object.keys(selectedValues).forEach(function(name) {
		
		var value = selectedValues[name];
		console.log("name[", name , "]  value[", value, "]");
		if ( typeof value === "string" || typeof value === "number") {

			//form.getElementsByName(name).forEach(function(element) {    // 보통은 1개일 것
			var elements = formElement.querySelectorAll("[name='" + name + "']");
			if ( elements==undefined || elements==null ) return;

			
			console.log("name[", name, "]  element ", elements, "  length:", elements.length);

			elements.forEach(function(element) {
				console.log("\t==>\t", element);

				//if ( element.type=='textarea' ) element.innerHTML = value;
				//else element.value = value;
				element.value = value;
			});
			

		} else if ( Array.isArray(value) ) {                // 'choice':['a', 'c'] 형태
			console.log(">>> ", value);
			value.forEach(function(eachValue) {
				var elements = formElement.querySelectorAll("input[name='" + name + "'][value='" + eachValue + "']");
				if ( elements==undefined || elements==null ) return;

				elements.forEach(function(element) {
					element.checked = true;
				});

			});

		}

	});
}





/**
 * 현재 페이지가 호출될 때의 GET 방식 파라미터 문자열을 추출한다.
 */
function getHtmlCallParamString() {
	var loc = document.location + "";
	var idx = loc.indexOf("?");
	if ( idx > -1 ) {   // 파라미터가 있으면
		return loc.substring(idx+1);
	} else {            // 파라미터가 없으면
		return null;
	}

}
/**
 * 현재 페이지가 호출될 때의 GET 방식 파라미터들을 객체로 변환하여 리턴한다.
 *  - 파라미터가 하나도 없었던 경우 : 빈 객체 {} 를 리턴한다.
 *  - 파라미터에 동일한 이름이 2개 이상인 경우 : 해당 이름은 반환 객체 안에 배열로 설정된다.
 * 
 * 
 *  예: page.html?a=A&B=B
 *      반환 객체 : {a: "A", b:"B"}
 * 
 *  예: page.html?a=A&b=B&a=Z
 *      반환 객체 : {a: ["A", "Z"], b: B}
 * 
 *  예: page.html  또는 page.html?
 *      반환 객체 : {}
 * 
 * 주의 : 페이지 호출 시에 파라미터가 하나도 없더라도 리턴값은 null이 아니고, {} 객체임
 * 
 */
function getHtmlCallParams() {

	var paramString = getHtmlCallParamString();
	return parseParamString(paramString);
}

function parseParamString(paramString) {
	if ( !paramString ) return null;

	var paramMap = {};

	if ( paramString ) {
		paramString.split("&").forEach(function(param) {
			var token = param.split("=");

			var key = token[0];
			var val = token[1];

			if ( paramMap[key] ) {
				if ( Array.isArray(paramMap[key]) ) {
					paramMap[key].push(val);
				} else {
					var tempVal = paramMap[key];
					paramMap[key] = [];
					paramMap[key].push(tempVal);
					paramMap[key].push(val);
				}
			} else {
				paramMap[key] = val;
			}
			
		});
	}
	
	return paramMap;
}



/**
 * 30분 간격의 시간 선택용 select의 option들을 만든다.
 * TODO. ES6문법(`) 사용하였음. 최종 출시 전에 이를 일반 통문자열로 변경할 것.
 * @param {*} timeSelectElement 해당 option들이 삽입될 select 엘리먼트
 */
function createTimeSelect(timeSelectElement) {

	var timeSelectOptionHtmlEvery30min = '<option value="">선택</option> <option value="0000">00:00</option> <option value="0030">00:30</option> <option value="0100">01:00</option> <option value="0130">01:30</option> <option value="0200">02:00</option> <option value="0230">02:30</option> <option value="0300">03:00</option> <option value="0330">03:30</option> <option value="0400">04:00</option> <option value="0430">04:30</option> <option value="0500">05:00</option> <option value="0530">05:30</option> <option value="0600">06:00</option> <option value="0630">06:30</option> <option value="0700">07:00</option> <option value="0730">07:30</option> <option value="0800">08:00</option> <option value="0830">08:30</option> <option value="0900">09:00</option> <option value="0930">09:30</option> <option value="1000">10:00</option> <option value="1030">10:30</option> <option value="1100">11:00</option> <option value="1130">11:30</option> <option value="1200">12:00</option> <option value="1230">12:30</option> <option value="1300">13:00</option> <option value="1330">13:30</option> <option value="1400">14:00</option> <option value="1430">14:30</option> <option value="1500">15:00</option> <option value="1530">15:30</option> <option value="1600">16:00</option> <option value="1630">16:30</option> <option value="1700">17:00</option> <option value="1730">17:30</option> <option value="1800">18:00</option> <option value="1830">18:30</option> <option value="1900">19:00</option> <option value="1930">19:30</option> <option value="2000">20:00</option> <option value="2030">20:30</option> <option value="2100">21:00</option> <option value="2130">21:30</option> <option value="2200">22:00</option> <option value="2230">22:30</option> <option value="2300">23:00</option> <option value="2330">23:30</option>';

	// var timeSelectOptionHtml = `
	//     <option value="">선택</option>
	//     <option value="0000">00:00</option>
	//     <option value="0030">00:30</option>
	//     <option value="0100">01:00</option>
	//     <option value="0130">01:30</option>
	//     <option value="0200">02:00</option>
	//     <option value="0230">02:30</option>
	//     <option value="0300">03:00</option>
	//     <option value="0330">03:30</option>
	//     <option value="0400">04:00</option>
	//     <option value="0430">04:30</option>
	//     <option value="0500">05:00</option>
	//     <option value="0530">05:30</option>
	//     <option value="0600">06:00</option>
	//     <option value="0630">06:30</option>
	//     <option value="0700">07:00</option>
	//     <option value="0730">07:30</option>
	//     <option value="0800">08:00</option>
	//     <option value="0830">08:30</option>
	//     <option value="0900">09:00</option>
	//     <option value="0930">09:30</option>
	//     <option value="1000">10:00</option>
	//     <option value="1030">10:30</option>
	//     <option value="1100">11:00</option>
	//     <option value="1130">11:30</option>
	//     <option value="1200">12:00</option>
	//     <option value="1230">12:30</option>
	//     <option value="1300">13:00</option>
	//     <option value="1330">13:30</option>
	//     <option value="1400">14:00</option>
	//     <option value="1430">14:30</option>
	//     <option value="1500">15:00</option>
	//     <option value="1530">15:30</option>
	//     <option value="1600">16:00</option>
	//     <option value="1630">16:30</option>
	//     <option value="1700">17:00</option>
	//     <option value="1730">17:30</option>
	//     <option value="1800">18:00</option>
	//     <option value="1830">18:30</option>
	//     <option value="1900">19:00</option>
	//     <option value="1930">19:30</option>
	//     <option value="2000">20:00</option>
	//     <option value="2030">20:30</option>
	//     <option value="2100">21:00</option>
	//     <option value="2130">21:30</option>
	//     <option value="2200">22:00</option>
	//     <option value="2230">22:30</option>
	//     <option value="2300">23:00</option>
	//     <option value="2330">23:30</option>
	// `;

	timeSelectElement.innerHTML = timeSelectOptionHtmlEvery30min;
}


/**
 * 두 개의 시각 선택용 select 엘리먼트들을 '시작'시각과 '종료'시각을로 묶는다.
 * 
 * '시작'시각용 select 엘리먼트에 다음의 event를 부착한다.
 *  - '시작'시각이 선택되지 않은 상태이면, '종료'시각은 선택이 불가능(diabled)하게 된다.
 *  - '시작'시각이 선택되면, '종료'시각은 그 이후의 시각만을 선택할 수 있다.
 * 
 * @param {*} startTimeSelectElement '시작'시각용 select 엘리먼트 (option들을 새로 생성하지 않음. 기존 option 그대로 사용)
 * @param {*} endTimeSelectElement   '종료'시각용 select 엘리먼트 (option들을 새로 생성하지 않음. 기존 option 그대로 사용)
 */
function bindTimeSelectPair(startTimeSelectElement, endTimeSelectElement) {

	startTimeSelectElement.addEventListener("input", function(e) {
		
		var selected = this.value;

		//console.log("SELECTED ", selected);
		if ( selected && selected != "" ) {
			
			var options = Array.from(endTimeSelectElement.options);
			options.forEach(function(entry) {
				console.log("시간 비교 : ", entry.value, " - ", selected);
				if ( entry.value <= selected )  entry.disabled = true;
				else entry.disabled = false;
			});
			if ( endTimeSelectElement.value!=null && endTimeSelectElement.value!='' && endTimeSelectElement.value<selected )  endTimeSelectElement.value = ''; 

			endTimeSelectElement.disabled = false;
		} else {
			endTimeSelectElement.value = "";
			endTimeSelectElement.disabled = true;
		}
		
	});
}

/**
 *  시간 선택을 위한 SELECT의 option들을 생성하고, 시작 시각 SELECT와 종료 시각 SELECT 간의 이벤트를 건다.
 *  @param  startTimeElement    시작시간 select 엘리먼트 객체
 *  @param  endTimeElement      종료시각 select 엘리먼트 객체
 *  @param  startTimeSelected   option: 이미 선택된 시작 시각이 있는 경우, 그에 대한 value 값. ex) 0230 등
 *  @param  endTimeSelected     option: 이미 선택된 종료 시각이 있는 경우, 그에 대한 value 값. ex) 2330 등
 *
*/
//var TimeSelectPair = function(startTimeElement, endTimeElement, startTimeSelected, endTimeSelected) {
function createTimeSelectPair(startTimeElement, endTimeElement, startTimeSelected, endTimeSelected) {

	createTimeSelect(startTimeElement);
	createTimeSelect(endTimeElement);


	if ( startTimeSelected!=null && startTimeSelected!="" )     startTimeElement.value  = startTimeSelected;
	if ( endTimeSelected!=null && endTimeSelected!="" )         endTimeElement.value    = endTimeSelected;

	//console.log("startTimeElement.value ", startTimeElement.value);
	//if ( startTimeElement.value==null || startTimeElement.value=='' )       endTimeElement.disabled = true;
	
	bindTimeSelectPair(startTimeElement, endTimeElement);
}


function renderYYYYMMDDWithDot(yyyymmdd) {
	if ( !yyyymmdd || typeof yyyymmdd !== "string" || yyyymmdd.length !== 8 ) {
		return "";
	}

	return yyyymmdd.substring(0, 4) + "." + yyyymmdd.substring(4, 6) + "." + yyyymmdd.substring(6, 8);
	
}





/**
 * '로딩 중' 표시를 위한 모달 창을 띄운다.
 * 
 * @param   loadingModalElement '로딩 중' 모달 창으로 띄워질 엘리먼트
 *          만약에 이 값이 입력되지 않으면, 디폴트 모달 엘리먼트를 모달 창으로 띄운다. (참고: DEFAULT_LOADING_MODAL_ELEMENT_ID)
 *          현재 DEFAULT_LOADING_MODAL_ELEMENT_ID은 'loadingModal'로 지정되어 있음
 * 
 */
var LoadingModal = function(loadingModalElement) {
	var targetElement;
	if ( loadingModalElement==undefined || loadingModalElement==null ) {
		targetElement = loadingModalElement;
	} else {
		var DEFAULT_LOADING_MODAL_ELEMENT_ID = "loadingModal";
		targetElement = document.getElementById(DEFAULT_LOADING_MODAL_ELEMENT_ID);
		if ( targetElement==undefined || targetElement==null ) {
			alert("ERROR : 디폴트 로딩 모달 엘러먼트를 찾을 수 없음");
			return;
		}
	}

	var LOADING_MODAL_OPENED = false;

	return {
		open: function() {
			if ( !LOADING_MODAL_OPENED ) {
				LOADING_MODAL_OPENED = true;
				targetElement.classList.add("active");
			} else {
				console.log("INFO: 이미 모달 떠 있어서 다시 못 띄움");
			}
		},
		close: function() {
			if ( LOADING_MODAL_OPENED ) {
				LOADING_MODAL_OPENED = false;
				targetElement.classList.remove("active");
			} else {
				console.log("INFO: 이미 모달 닫혀 있어서 닫을 대상이 없음");
			}
		}
	}
}


/*************************************************************************************************************** */
/*************************************************************************************************************** */
/*************************************************************************************************************** */




var Validator = (function() {

	return {

		email: function(val) {
			if (val == null) return false;

			var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
			if (val.trim().match(regExp) != null) return true;
			else return false;
		},

		bizNo: function(val) {
			if (val == null) return false;
			val = this.removeHyphen(val).trim();
		},

		eng: function(val) {
			if (val == null) return false;

		},

		hangul: function(val) {
			if (val == null) return false;

		},

		number: function(val) {
			if (val == null) return false;
			return isNaN(val.trim());
		},

		removeHyphen: function(val) {
			if (val == null) return val;

			return val.replace(/\-/g, '');
		},

		checkInjection: function(val) {
			if (val == null) return true;

			if (val.length > 0) {
				//특수문자 제거
				var expText = /[%=><]/;
				if (expText.test(val) == true) {
					alert("특수문자를 입력 할수 없습니다.");
					//val = val.split(expText).join(""); 
					return false;
				}

				//특정문자열(sql예약어의 앞뒤공백포함) 제거
				var sqlArray = new Array(
					//sql 예약어
					"OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
					"UNION", "FETCH", "DECLARE", "TRUNCATE"
				);

				console.log("중간 검증 ", val);

				var regex;
				var regex_plus;
				for (var i = 0; i < sqlArray.length; i++) {
					regex = new RegExp("\\s" + sqlArray[i] + "\\s", "gi");
					if (regex.test(val)) {
						alert("\"" + sqlArray[i] + "\"와(과) 같은 특정문자로 검색할 수 없습니다.");
						//val =val.replace(regex, "");
						return false;
					}

					regex_plus = new RegExp("\\+" + sqlArray[i] + "\\+", "gi");
					if (regex_plus.test(val)) {
						alert("\"" + sqlArray[i] + "\"와(과) 같은 특정문자로 검색할 수 없습니다.");
						//val =val.replace(regex_plus, "");
						return false;
					}
				}
			}
			console.log("검증완료 ", val);
			return true;
		}

	};

})();

/** ================================================================================ **/
/*
/*  이하는 기존 코드 참조용
/*
/** ================================================================================ **/

// var USER_INFO;
// var UserInfo = function(userId, email, name) {
//     this.id = userId;
//     this.email = email;
//     this.name = name;
// }
// function login(email, password) {
//     // 로그인 수행
//     //USER_INFO = UserInfo('jhlee', '이주현');
//     var API_URL = "/api/login/";
//     var loginParam = "email=" + email + "&password=" + password;
//     console.log(loginParam);

//     callApi("POST", API_URL, loginParam,
//         function(resData) {
//             USER_INFO = new UserInfo(resData.id, resData.email, resData.name);
//             console.log("로그인 결과 : " + USER_INFO);
//             saveUserInfo(USER_INFO);
//             //localStorage.setItem("USER_INFO", JSON.stringify(USER_INFO));
//         },
//         function(resCode, resMsg) {
//             alert("로그인 ERROR");
//         },
//         "FORM"
//     );
// }
// function saveUserInfo(newUserInfo) {
//     if ( newUserInfo==null ) {
//         console.log("USER_INFO가 null임. 저장 불가");
//         alert("로그인되어 있지 않습니다.");
//         location.href="//user/login.html"; // 절대경로를 어떻게 쓰지? 하이브리드에서는 경로 문제 생기는데
//         return;
//     }
//     if ( newUserInfo.id==null || newUserInfo.email==null ) {
//         console.log("USER_INFO 정보가 올바르지 않음");
//         alert("로그인되어 있지 않습니다.");
//         location.href="//user/login.html"; // 절대경로를 어떻게 쓰지? 하이브리드에서는 경로 문제 생기는데
//         return;
//     }
//     localStorage.setItem("USER_INFO", JSON.stringify(newUserInfo));
//     USER_INFO = newUserInfo;
// } 
// function loadUserInfo() {
//     // 로컬 스토리지에서 사용자 세션 데이터를 가져온다.
//     var STORAGE_ITEM_NAME = "USER_INFO";
//     var storageItem = localStorage.getItem(STORAGE_ITEM_NAME);
//     if ( storageItem!=null ) {
//         USER_INFO = JSON.parse(storageItem);
//         console.log("load USER_INFO from localStorage. ==> " + USER_INFO.length);
//         return true;
//     } else {
//         console.log("사용자 정보 없음 from localStorage");
//         return false;
//     }
// }
// function logout() {
//     localStorage.removeItem("USER_INFO");
//     USER_INFO = null;
// }






/*
function loadLocationCode(refresh) {
	
	// ======== 지역코드 정보를 로드한다 (from storage or server) ========
	var STORAGE_ITEM_NAME = "LOCATION_CODE";
	var API_URL = "/api/code/locationContainer/";
	var storageItem = localStorage.getItem(STORAGE_ITEM_NAME);
	if ( refresh==true || storageItem==null ) {
		callApiSync("GET", API_URL, null,
		function(resData) {
			LOCATION_CODE = resData;
			localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(LOCATION_CODE));
			console.log("load LOCATION_CODE from SERVER. ==> " + LOCATION_CODE.length);
		},
		function(resCode, resMsg) {
			alert("ERROR");
		}
	);
	} else {
		LOCATION_CODE = JSON.parse(storageItem);
		console.log("load LOCATION_CODE from localStorage. ==> " + LOCATION_CODE.length);
	}


	// ======== LOCATION_CODE에 메서드 추가 ========

	LOCATION_CODE.getSiguListBySidoCode = function(sidoCode) {      // 시도코드로 해당 시도의 하위 시구 목록(배열)을 추출
		//console.log("선택된 시도: " + sidoCode);
		for ( var i=0; i<this.length; i++ ) {
			//console.log(this[i]);
			if ( this[i].sidoCode==sidoCode ) {
				//console.log("찾았음 ==> ", this[i].siguCodeList);
				return this[i].siguCodeList;
			}
		}
	}
	LOCATION_CODE.getSigu = function(sidoCode, siguCode) {          // 시도코드와 시구코드로 특정 시구에 대한 데이터를 추출
		//console.log(this.length);
		for ( var i=0; i<this.length; i++ ) {
			//console.log(this[i].sidoCode);
			if ( this[i].sidoCode==sidoCode ) {
				//console.log(sidoCode, ":", this[i].sidoCode);
				for ( var j=0; j<this[i].siguCodeList.length; j++ ) {
					var sigu = this[i].siguCodeList[j];
					if ( sigu.siguCode==siguCode ) return sigu;
				}
			}
		}
	}
	LOCATION_CODE.getSiguBySiguCode = function(siguCode) {          // 시구코드로 특정 시구에 대한 데이터를 추출  //TODO 성능 개선 필요
		for ( var i=0; i<this.length; i++ ) {
			for ( var j=0; j<this[i].siguCodeList.length; j++ ) {
				if ( this[i].siguCodeList[j].siguCode==siguCode ) return this[i].siguCodeList[j];
			}
		}
	}

}
*/


// function loadJobAttr(refresh) {

//     var STORAGE_ITEM_NAME = "JOB_AD_ATTR";
//     var API_URL = "/api/code/jobAdAttrContainer/";
//     /*
//     if ( refresh==true ) {
//         console.log("JOB_AD_ATTR will be RELOADED.");
//         callApiSync("GET", API_URL, null,
//             function(resData) {
//                 JOB_AD_ATTR = resData;
//                 localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(JOB_AD_ATTR));
//                 console.log("load JOB_AD_ATTR from SERVER. ==> " + JOB_AD_ATTR.length);
//             },
//             function(resCode, resMsg) {
//                 alert("ERROR");
//             }
//         );

//         return;
//     }
//     */
//     var storageItem = localStorage.getItem(STORAGE_ITEM_NAME);

//     if ( refresh==true || storageItem==null ) {
//         callApiSync("GET", API_URL, null,
//             function(resData) {
//                 JOB_AD_ATTR = resData;
//                 localStorage.setItem(STORAGE_ITEM_NAME, JSON.stringify(JOB_AD_ATTR));
//                 console.log("load JOB_AD_ATTR from SERVER. ==> " + JOB_AD_ATTR.length);
//             },
//             function(resCode, resMsg) {
//                 alert("ERROR");
//             }
//         );
//     } else {
//         JOB_AD_ATTR = JSON.parse(storageItem);
//         console.log("load JOB_AD_ATTR from localStorage. ==> " + JOB_AD_ATTR.length);
//     }

// }