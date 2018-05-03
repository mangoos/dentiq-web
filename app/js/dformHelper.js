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