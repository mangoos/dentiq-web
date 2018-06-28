// if ( LOGIN_INFO.isLoggedIn() ) { // 회원 초기화 로직;


//     if ( isPersonalMember() ) ;

//     if( isHospitalMemeber() ) ;

// } else {
//     // 비회원 초기화 로직
// }


var HEADER = {
    "GNB" : {
        "anonymous" : [ { "href" : "login.html", "text" : "로그인" }, { "href" : "signup.html", "text" : "무료회원가입" } ],
        "memberPerson" : [ { "href" : "register_resume.html", "text" : "이력서 등록" }, { "href" : "logout.html", "text" : "로그아웃" } ],
        "memberHospital" : { 
            "normal" : [ { "href" : "register_jobad.html", "text" : "채용공고 등록" }, { "href" : "logout.html", "text" : "로그아웃" } ],
            "annual" : [ { "href" : "register_jobad.html", "text" : "채용공고 등록" }, { "href" : "logout.html", "text" : "로그아웃" } ] 
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
    "returnAuth" : function (element) {
        
        if ( !LOGIN_INFO.isLoggedIn() ) {
            
            return this[element].anonymous;

        } else if ( LOGIN_INFO.isPersonalMember() ) {
            
            return this[element].memberPerson;

        } else {

            if ( LOGIN_INFO.isHospitalMember() ) {
                return this[element].memberHospital.normal;
            }

        }
    }
};

// var RENDER_SCHEME = {
//     "anonymous" : {
//         "GNB" : [
//             [ "login.html", "로그인"],
//             [ "signup.html", "무료회원가입"]
//         ],
//         "SIDEBAR" : "",
//         "HEADER_NAV" : ""
//     },
//     "memberPerson" : {
//         "GNB" : [
//             [ "register_resume.html", "이력서 등록"],
//         ],
//         "SIDEBAR" : "",
//         "HEADER_NAV" : ""
//     },
//     "memberHospital_normal" : {
//         "GNB" : [
//             [ "register_jobad.html", "이력서 등록"],
//         ],
//         "SIDEBAR" : "",
//         "HEADER_NAV" : ""
//     },
//     "memberHospital_annual" : {
//         "GNB" : [
//             [ "register_jobad.html", "이력서 등록"],
//         ],
//         "SIDEBAR" : "",
//         "HEADER_NAV" : ""
//     }

// };