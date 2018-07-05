// if ( LOGIN_INFO.isLoggedIn() ) { // 회원 초기화 로직;


//     if ( isPersonalMember() ) ;

//     if( isHospitalMemeber() ) ;

// } else {
//     // 비회원 초기화 로직
// }


var HEADER = {
	"GNB" : {
		"anonymous" : [
			{ "href" : "login.html", "text" : "로그인" },
			{ "href" : "signup.html", "text" : "무료회원가입" }
		],
		"memberPerson" : [
			{ "href" : "register_resume.html", "text" : "이력서 등록" },
			{ "href" : "logout.html", "text" : "로그아웃" }
		],
		"memberHospital" : { 
			"normal" : [
				{ "href" : "register_jobad.html", "text" : "채용공고 등록" },
				{ "href" : "logout.html", "text" : "로그아웃" }
			],
			"annual" : [
				{ "href" : "register_jobad.html", "text" : "채용공고 등록" },
				{ "href" : "logout.html", "text" : "로그아웃" }
			] 
		}
	},
	"SIDEBAR" : {
		"anonymous" : [ 
			{ "href" : "login.html?returnUrl=" + location.pathname, "text" : "로그인" },
			{ "href" : "signup.html?returnUrl=" + location.pathname, "text" : "무료회원가입" },
			{ "href" : "user_panel.html" , "text" : "설정" } 
		],
		"memberPerson" : [ 
			{ "href" : "logout.html?returnUrl=" + location.pathname, "text" : "로그아웃" },
			// { "href" : "signup.html" + location.href, "text" : "무료회원가입" },
			{ "href" : "user_panel.html" , "text" : "설정" } 
		],
		"memberHospital" : { 
			"normal" : [ 
				{ "href" : "logout.html?returnUrl=" + location.pathname, "text" : "로그아웃" },
				// { "href" : "signup.html" + location.href, "text" : "무료회원가입" },
				{ "href" : "dentist_panel.html" , "text" : "설정" } 
			],
			"annual" : [ 
				{ "href" : "logout.html?returnUrl=" + location.pathname, "text" : "로그아웃" },
				// { "href" : "signup.html" + location.href, "text" : "무료회원가입" },
				{ "href" : "dentist_panel.html" , "text" : "설정" } 
			] 
		}        
	},
	"HEADER_NAV" : {
		"anonymous" : [ 
			{ "href" : "liveboard.html?LIVEBOARD", "text" : "라이브보드"},
			{ "href" : "liveboard.html?INTEREST", "text" : "관심지역"},
			{ "href" : "liveboard.html?HOME", "text" : "우리동네"},
			{ "href" : "user_panel.html", "text" : "My 메뉴"},
		],
		"memberPerson" : [ 
			{ "href" : "liveboard.html?LIVEBOARD", "text" : "라이브보드"},
			{ "href" : "liveboard.html?INTEREST", "text" : "관심지역"},
			{ "href" : "liveboard.html?HOME", "text" : "우리동네"},
			{ "href" : "user_panel.html", "text" : "My 메뉴"},
		],
		"memberHospital" : { 
			"normal" : [ 
				{ "href" : "liveboard.html?LIVEBOARD", "text" : "라이브보드"},
				{ "href" : "hr_management.html", "text" : "추천인재"},
				{ "href" : "hospital_interaction.html", "text" : "공고 관리"},
				{ "href" : "dentist_panel.html", "text" : "My 메뉴"},
			],
			"annual" : [ 
				{ "href" : "liveboard.html?LIVEBOARD", "text" : "라이브보드"},
				{ "href" : "hr_management.html", "text" : "추천인재"},
				{ "href" : "hospital_interaction.html", "text" : "공고 관리"},
				{ "href" : "dentist_panel.html", "text" : "My 메뉴"},
			] 
		}        
	},
	"HEADER_SUB" : {
		"anonymous" : [ 
			{ "href" : "user_panel.html", "text" : ""}
		],
		"memberPerson" : [ 
			{ "href" : "user_panel.html", "text" : ""}
		],
		"memberHospital" : { 
			"normal" : [ 
				{ "href" : "dentist_panel.html", "text" : ""}
			],
			"annual" : [ 
				{ "href" : "dentist_panel.html", "text" : ""}
			] 
		}        
	},
	"returnAuth" : function (element) {
        
		if ( !LOGIN_INFO.isLoggedIn() ) {
			return HEADER[element].anonymous;
		} else if ( LOGIN_INFO.isPersonalMember() ) {
			return HEADER[element].memberPerson;
		} else {
			if ( LOGIN_INFO.isHospitalMember() ) {
				return HEADER[element].memberHospital.normal;
			}
		}
	}
};


// header-sub 동적 링크 생성 부분 간단 조치.

(function() {
	var HEADER_SUB = document.querySelector(".header-sub");
	var headerSubDynamicAnchor = document.getElementById("headerSubDynamicAnchor");
	if(HEADER_SUB)  headerSubDynamicAnchor.setAttribute("href", HEADER.returnAuth("HEADER_SUB")[0].href);
})();


/*********************************************
 * 
 * HEADER 모듈, 핸들바 템플릿 으로 HTML 내부에 남겨두는 것으로 일단 패쓰
 * 전체 content 렌더링 전략에 대해 고민해서 결론
 * 
 *********************************************/
// var dHeader = (function() {

// 	var returnAuthScheme = function (element) {
        
// 		if ( !LOGIN_INFO.isLoggedIn() ) {
// 			return HEADER[element].anonymous;
// 		} else if ( LOGIN_INFO.isPersonalMember() ) {
// 			return HEADER[element].memberPerson;
// 		} else {
// 			if ( LOGIN_INFO.isHospitalMember() ) {
// 				return HEADER[element].memberHospital.normal;
// 			}
// 		}
// 	};

// 	var gnbGen = function (selector) {
// 		var scheme = returnAuthScheme("GNB");
// 		var tempHTML = "";
        
// 		scheme.forEach(function(elm, idx) {
// 			console.log("elm", elm, "idx", idx);
// 			tempHTML += "<a href="+ elm.href +">"+ elm.text +"</a>";
//         });
        
// 		document.querySelector(selector).innerHTML = tempHTML;

// 	};

// 	gnbGen("#headerGNB");
// 	return; 
// })();