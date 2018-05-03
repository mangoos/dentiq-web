var formUIInit = function () {

    document.body.addEventListener("change", function(e) {
        var target = e.target;
        var hasClass = target.classList.contains("styled-select") || target.classList.contains("styled-input");
        console.log("hasClass: ", hasClass, target);
        if(hasClass) {
            if(!target.classList.contains("hasValue")) { target.classList.add("hasValue"); }
         }
    });
    // 바디에 위임해서 포커스 아웃 처리 애매함. ㅠ 참고용
    document.body.addEventListener("focusout", function(e) {
        var target = e.target;
        var hasClass = target.classList.contains("styled-select") || target.classList.contains("styled-input");
        if( hasClass ) {
            if(!target.value || target.value == "") { 
                target.classList.remove("hasValue");
                console.log("값 없음, hasValue 클래스 삭제"); 
            } else { console.log("값 있음, hasValue 유지"); return ; }
         }
    });
    console.log("form 꾸미기 css 완료");
};

var DRexPattern = {

    "name" : {
        "match" : /[ㄱ-힣a-zA-Z0-9\s]{2,15}/, 
        "errMsg" : "2~15자 이내로 입력해 주세요. 특수문자 제외.", 
        "delKey" : /[^ㄱ-힣a-zA-Z0-9\s\(\)]+/g,
        "delMsg" : "",
        "suffix" : "님"
    },

    "title" : {
        "match" : /[ㄱ-힣a-zA-Z0-9\s]{10,50}/, 
        "errMsg" : "10~50자 이내로 입력해 주세요. 특수문자 제외.", 
        "delKey" : /[^ㄱ-힣a-zA-Z0-9\s\(\)]+/g,
        "delMsg" : "",
        "suffix" : "",
        "option" : { "optElm" : ".spellCounting", "optionFunc" : inputValueLengthChecker }
    },

    "phone" : {
        "match" : /^\s?(02|0\d{2}|0505)[-\s]?(\d{3,4})[-\s]?(\d{4})$/,
        "errMsg" : "국번을 포함해서 정확한 전화번호를 입력해 주세요",
        "delKey" : /[^\d]+/g,
        "delMsg" : "",
        "suffix" : null
    },

    "mobile" : {
        "match" : /^\s?(010|011|0\d{2}|0505)[-\s]?(\d{3,4})[-\s]?(\d{4})$/,
        "errMsg" : "국번을 포함해서 정확한 전화번호를 입력해 주세요",
        "delKey" : /[^\d]+/g,
        "delMsg" : "",
        "suffix" : null
    },

    "onlyNumber" : {
        "match" : /^[\d]+$/, 
        "errMsg" : "숫자만 입력할 수 있습니다.",
        "delKey" : /[^\d]+/g,
        "delMsg" : "",
        "suffix" : null 
    },

    "onlyKor" : {
        "match" : /^[ㄱ-힣,\s\(\)\-0-9~]{1,}$/, 
        "errMsg" : "한글로 정확하게 입력해주세요(한글, 숫자, ' , ' , 괄호)",
        "delKey" : /[a-zA-Z\@\*\^_?<>\|]+|[^ㄱ-힣,\s()-~0-9]+/g,
        "delMsg" : "",
        "suffix" : null 
    },

    "onlyText" : {
        "match" : /[ㄱ-힣a-zA-Z0-9\s,()-]{2,20}/, 
        "errMsg" : "2~20자 이내로 입력해 주세요. (한글, 영어, 숫자, ' , ', 괄호)", 
        "delKey" : /[\@\*\^_?<>|]+|[^ㄱ-힣a-zA-Z0-9\s,()-]+/g,
        "delMsg" : "",
        "suffix" : ""
    },

    "email" : {
        "match" : /^.{1,}@.*\.?[\w\d]+$/,   // ^(?:([\w-\.]+)@([\w-]+)\.?[\w-]{0,4})$
        "errMsg" : "정확한 이메일을 입력해 주세요", 
        "delKey" : null,
        "delMsg" : "",
        "suffix" : null 
    },

    "url" : {
        "match" : /^(www|\w+)?\.{1}([\w\S]*\.?[\w\S]+[^\.]+)$/, // 아직 불완전, <<<특수문자 허용 // ^(www|\w+)?\.{1}(\w*\.?\w+)$ << 특수문자 허용안함
        "errMsg" : "정확한 홈페이지 url 을 입력해 주세요.",
        "delKey" : /[^\S\.\w]/g,
        "delMsg" : "",
        "suffix" : null 
    },
    
    "date" : {
        "match" : /^(?:(19|20)\d{2})(\d{1,2})(\d{1,2})$/, 
        "errMsg" : "날짜를 예시 양식에 맞게 입력해 주세요.  (예 - 19980724)",
        "delKey" : /[^\d]+/g,
        "delMsg" : "",
        "suffix" : null 
    },

    "bizNum" : {
        "match" : /\d{10}/,
        "errMsg" : "사업자 등록 번호를 정확하게 입력해 주세요",
        "delKey" : /[^\d]+/g,
        "delMsg" : "",
        "suffix" : null
    },

    "password" : {
        "match" : /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        "errMsg" : "최소 1개 이상의 특수문자, 대문자를 포함해서 8자 이상",
        "delKey" : null,
        "delMsg" : "",
        "suffix" : null
    }
}
// var regExp = /[\{\}\[\]\/?,;:|\)*~`!^\_+<>@\#$%&\\\=\(\'\"]/gi  온나라에서 쓰는 정규표현식 모지?
// ^(((http(?:s)?\:\/\/))?([a-zA-Z0-9\-]+\.?)+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+((\.[a-zA-Z]{2,4})?)(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$ㄴ


var dFormValidator = dFormValidator || {};
dFormValidator.validator = function (formGroupElm, pattern) {

    "use strict";
    var inputElm = formGroupElm.querySelector(".styled-input");
    var str = inputElm.value.trim();
    var tag = inputElm.className.replace(/(?:^.*d-reg-)(\w+)(?:.*)$/,"$1");
    var regex =  pattern || DRexPattern[tag] ? DRexPattern[tag].match : "";

    if( !regex ) return; 

    var flag = regex.test(str);
    var msgBox = inputElm.parentElement.querySelector(".form-group-msg2");

    if (!flag) {
        inputElm.classList.remove("valid");
        inputElm.classList.add("invalid");
        msgBox.innerText = DRexPattern[tag].errMsg;
    } else {
        inputElm.classList.remove("invalid");
        msgBox.innerText = "";
    }

    if( DRexPattern[tag].option ) {
        var value = DRexPattern[tag].option.optionFunc(inputElm);
        console.log(value);
        var optElm = formGroupElm.querySelector(DRexPattern[tag].option.optElm);
        optElm.innerText = value ;
    }
};

dFormValidator.inputValueReplacer = function (formGroupElm, pattern) {

    "use strict";
    var inputElm = formGroupElm.querySelector(".styled-input");
    var str = inputElm.value.trim();
    var tag = inputElm.className.replace(/(?:^.*d-reg-)(\w+)(?:.*)$/,"$1");
    var regex =  pattern || DRexPattern[tag] ? DRexPattern[tag].delKey : "";

    if( !regex ) return;

    var str = str.replace(regex,"").replace(/\s+/g," ");

    inputElm.value = str;
};

dFormValidator.inputValueMatch = function (formGroupElm, pattern) {

    "use strict";

    var inputElm = formGroupElm.querySelector(".styled-input");
    var str = inputElm.value.trim();
    var tag = inputElm.className.replace(/(?:^.*d-reg-)(\w+)(?:.*)$/,"$1");
    var regex =  pattern || DRexPattern[tag] ? DRexPattern[tag].match : "";

    if ( !regex ) return;

    var flag = regex.test(str);
    var msgBox = inputElm.parentElement.querySelector(".form-group-msg2");
    console.log("tag: ", tag, "regex: ",regex, "flag: ", flag, DRexPattern[tag]);

    if (!flag && str.length > 0) {
        inputElm.classList.remove("valid");
        inputElm.classList.add("invalid");
        msgBox.innerText = DRexPattern[tag].errMsg;
        setTimeout( function() { msgBox.innerText="";}, 1500);

    } else {

        inputElm.classList.remove("invalid");
        inputElm.classList.add("valid");
        msgBox.innerText = "";
        // if( inputElm.value.length && DRexPattern[tag].suffix ) inputElm.value = inputElm.value + " " + DRexPattern[tag].suffix;
    }
};

function inputValueLengthChecker(inputElm) {
    var value = inputElm.value;
    var length = value.length;
    return length;
}

$(document).ready(function() {
    
    formUIInit();

    var $card = $(".dental-card");
    var $formCard= $card.find(".form-group");


    function is$formCard () {

        if( $formCard ) return true;
        return false;
    }

    if ( is$formCard() ) {

        var $needValidator = $formCard.filter(".need-validator");
        console.log( ".need-validator" + $needValidator.length + " 개");

    }

    $needValidator.on("input", function inputHandle(e) {  // 복붙 등 모든 인풋 발생하면 keyup trigger
        console.log(e.type);
        this.dispatchEvent(new CustomEvent("keyup"));
    });

    $needValidator.on("keyup", function keyupHandle(e) {
        console.log(e.type)
        this.classList.remove("valid");
        dFormValidator.validator(this);
    });

    $needValidator.on("focusout", function focusoutHandle(e) {
        console.log(e.type);
        dFormValidator.inputValueReplacer(this);
        dFormValidator.inputValueMatch(this);
        //this.removeEventListener("focusout", focusoutHandle);
    });
});


// 알바몬 패턴 벤치마크해서 우리꺼 개선할 것
// switch (v_pat) {
//     case 1 :    //공고제목, 기업명 등
//         pattern = /^[ㄱ-힣a-zA-Z\d\(\)\-\+\#\[\]\%\&\㈜\㈔\/\,\.\ \t]+$/gi;
//         message = " 바르게 입력해주세요. \n한글, 영문, 숫자\n일부 특수문자(() - + # [] % & ㈜ ㈔ / , . )만 사용할 수 있습니다.";
//         break;
//     case 2:    //이메일 체크
//         pattern = /^[0-9a-zA-Z-_\.]+@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{1,9}$/i;
//         message = " 바르게 입력 하세요."
//         break;
//     case 3:    //정수 숫자 입력만 허용
//         pattern = /^[0-9]+$/gi;
//         message = " 숫자로만 입력 하세요."
//         break;
//     case 4:    //정수 한글(초성입력(ㄱㅇㄷㄹ)X) 영어만 허용
//         pattern = /^[ 0-9가-힣a-zA-Z]+$/gi;
//         message = "";   // 메세지 공백일 경우 리액션 없이 false 만 리턴
//         break;
//     case 5:    //전화번호(숫자+-허용)
//         pattern = /^[0-9\+\-]+$/gi;
//         message = " 바르게 입력해주세요.\n숫자 및 + - 만 입력 가능 합니다.";
//         break;
//     case 6:    //내선번호
//         //pattern = /^[0-9]+$|^[0-9]+[\,\-\~]$/gi;
//         pattern = /^[0-9\,\-\~]+$/gi;
//         message = " 바르게 입력해주세요.\n숫자만 입력이 가능하며,\n , - ~ 에 한해 특수문자 입력이 가능합니다.";
//         break;
//     case 7:    //팩스(숫자 - , ~ 허용)
//         pattern = /^[0-9\-\,\~]+$/gi;
//         message = " 바르게 입력해주세요.\n숫자 및 - , ~ 만 입력 가능 합니다.";
//         break;
//     case 8:    //근무지상세
//         pattern = /^[ㄱ-힣a-zA-z\d\-\+\#\(\)\[\]\<\>\%\&\,\.\:\㈜\㈔\/\內\ \t]+$/gi;
//         message = " 바르게 입력해주세요.\n한글, 영문, 숫자, 일부 특수문자(- + # () [] <> % & , . : ㈜ ㈔ / 內)만 사용할 수 있습니다.";
//         break;
//     case 9:    //정수 한글(초성입력(ㄱㅇㄷㄹ)X) 영어만 허용, 메세지 있음
//         pattern = /^[ 0-9가-힣a-zA-Z]+$/gi;
//         message = " 바르게 입력해주세요.\n특수문자는 입력하실수 없습니다.";
//         break;
//     case 10:    //특수문자 , 사용 금지
//         pattern = /^[ㄱ-힣a-zA-Z\d\~\!\@\#\$\%\^\&\*\(\)\_\+\.\"\'\;\:\?\/ \t]+$/gi;
//         message = " 바르게 입력해주세요.\n콤마, 는 입력하실수 없습니다.";
//         break;
//     case 11:    //특수문자 , 사용 금지
//         pattern = /[ㄱ-힣a-zA-Z\d\+\#\-\-\(\)\[\]\. \t]+$/gi;
//         message = " 바르게 입력해주세요.\n한글, 영문, 숫자\n일부 특수문자( + # - ( ) [ ] .)만 사용할 수 있습니다.";
//         break;
//     case 12:	// URL 입력 체크
//         pattern = /([a-z]+):\/\/((?:[a-z\d\-]{1,}\.)+[a-z]{1,})(:\d{1,5})?(\/[^\?]*)?(\?.+)?$/i;
//         message = " 바르게 입력해주세요.";
//         break;
// }

    // 사업자 등록 번호 유효성 체크
    // CorporateRegNumChk: function (v_form01_Id, v_form02_Id, v_form03_Id) {
    //     var biz_value = new Array(10);

    //     if (!this.TextCharacterChk($("#" + v_form01_Id).val(), 12)) {
    //         $("#" + v_form01_Id).focus();
    //         return false;
    //     }

    //     if (!this.TextCharacterChk($("#" + v_form02_Id).val(), 12)) {
    //         $("#" + v_form02_Id).focus();
    //         return false;
    //     }

    //     if (!this.TextCharacterChk($("#" + v_form03_Id).val(), 12)) {
    //         $("#" + v_form03_Id).focus();
    //         return false;
    //     }

    //     if ($.trim($("#" + v_form01_Id).val()) == "000" && $.trim($("#" + v_form02_Id).val()) == "00" && $.trim($("#" + v_form03_Id).val()) == "00000")
    //     {
    //         $("#" + v_form01_Id).focus();
    //         return false;
    //     }

    //     var objstring = $.trim($("#" + v_form01_Id).val()) + "-" + $.trim($("#" + v_form02_Id).val()) + "-" + $.trim($("#" + v_form03_Id).val());
    //     //alert(objstring);
    //     var li_temp, li_lastid;

    //     if ( objstring.length == 12 ) {
    //         biz_value[0] = ( parseFloat(objstring.substring(0 ,1)) * 1 ) % 10;
    //         biz_value[1] = ( parseFloat(objstring.substring(1 ,2)) * 3 ) % 10;
    //         biz_value[2] = ( parseFloat(objstring.substring(2 ,3)) * 7 ) % 10;
    //         biz_value[3] = ( parseFloat(objstring.substring(4 ,5)) * 1 ) % 10;
    //         biz_value[4] = ( parseFloat(objstring.substring(5 ,6)) * 3 ) % 10;
    //         biz_value[5] = ( parseFloat(objstring.substring(7 ,8)) * 7 ) % 10;
    //         biz_value[6] = ( parseFloat(objstring.substring(8 ,9)) * 1 ) % 10;
    //         biz_value[7] = ( parseFloat(objstring.substring(9,10)) * 3 ) % 10;
    //         li_temp = parseFloat(objstring.substring(10,11)) * 5 + "0";
    //         biz_value[8] = parseFloat(li_temp.substring(0,1)) + parseFloat(li_temp.substring(1,2));
    //         biz_value[9] = parseFloat(objstring.substring(11,12));
    //         li_lastid = (10 - ( ( biz_value[0] + biz_value[1] + biz_value[2] + biz_value[3] + biz_value[4] + biz_value[5] + biz_value[6] + biz_value[7] + biz_value[8] ) % 10 ) ) % 10;
    //         if (biz_value[9] != li_lastid) {
    //             $("#" + v_form01_Id).focus();
    //             return false;
    //         }
    //         else
    //             return true;
    //     }
    //     else {
    //         $("#" + v_form01_Id).focus();
    //         return false;
    //     }
    // },
    // CorporateRegNumChk_New: function (obj1, focusOn) {
	// 	focusOn = (focusOn == undefined || focusOn == null) ? true : focusOn;

    //     biz_value = new Array(10);
    //     var str1 = obj1.val().split("-").join("");

    //     if (isBizInteger(str1, 10) == false) {
	// 		if(focusOn) {
	// 			obj1.focus();
	// 			obj1.select();
	// 		}
    //         return false;
    //     }

    //     if (str1 == "0000000000") {
	// 		if(focusOn) {
	// 			obj1.focus();
	// 			obj1.select();
	// 		}
    //         return false;
    //     }


    //     var objstring = str1.substring(0, 3) + "-" + str1.substring(3, 5) + "-" + str1.substring(5, 10);
    //     var li_temp, li_lastid;

    //     if (objstring.length == 12) {
    //         biz_value[0] = (parseFloat(objstring.substring(0, 1)) * 1) % 10;
    //         biz_value[1] = (parseFloat(objstring.substring(1, 2)) * 3) % 10;
    //         biz_value[2] = (parseFloat(objstring.substring(2, 3)) * 7) % 10;
    //         biz_value[3] = (parseFloat(objstring.substring(4, 5)) * 1) % 10;
    //         biz_value[4] = (parseFloat(objstring.substring(5, 6)) * 3) % 10;
    //         biz_value[5] = (parseFloat(objstring.substring(7, 8)) * 7) % 10;
    //         biz_value[6] = (parseFloat(objstring.substring(8, 9)) * 1) % 10;
    //         biz_value[7] = (parseFloat(objstring.substring(9, 10)) * 3) % 10;
    //         li_temp = parseFloat(objstring.substring(10, 11)) * 5 + "0";
    //         biz_value[8] = parseFloat(li_temp.substring(0, 1)) + parseFloat(li_temp.substring(1, 2));
    //         biz_value[9] = parseFloat(objstring.substring(11, 12));
    //         li_lastid = (10 - ((biz_value[0] + biz_value[1] + biz_value[2] + biz_value[3] + biz_value[4] + biz_value[5] + biz_value[6] + biz_value[7] + biz_value[8]) % 10)) % 10;
    //         if (biz_value[9] != li_lastid) {
	// 			if(focusOn) {
	// 				obj1.focus();
	// 				obj1.select();
	// 			}
    //             return false;
    //         }
    //         else
    //             return true;
    //     }
    //     else {
	// 		if(focusOn) {
	// 			obj1.focus();
	// 			obj1.select();
	// 		}
    //         return false;
    //     }
    // },
    // isBizInteger: function (st, maxLength) {

    //     if (st.length == maxLength) {
    //         for (j = 0; j > maxLength; j++)
    //             if (((st.substring(j, j + 1) < "0") || (st.substring(j, j + 1) > "9"))) {
    //                 return false;
    //             }
    //     }
    //     else {
    //         return false;
    //     }
    //     return true;

    // }