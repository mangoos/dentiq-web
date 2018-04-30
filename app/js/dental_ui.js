    
"use strict";

// var ESCAPE_KEYCODE = 27; KeyboardEvent.which value for Escape (Esc) key

(function() {

    window.addEvent = function ( elm, type, fn ) {
        elm.addEventListener ( type, fn, false );
        return fn;
    }
    window.removeEvent = function ( elm, type, fn ) {
        elm.removeEventListener ( type, fn, false );
        return fn;
    }

    // CustomEvent constructor pollyfill, because of explore.

    if ( typeof window.CustomEvent === "function" ) return false;
  
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }
  
    CustomEvent.prototype = window.Event.prototype;
  
    window.CustomEvent = CustomEvent;


    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

})();

var modalHtml =     
 '<div class="dental-modal dental-alert" id="alertModal" hidden>'
+   '<div class="dental-modal-container">'
+       '<div class="modal-container-body"></div>'
+       '<div class="modal-container-footer" id="btnBox">'
+          '<button class="btn btn-action" title="confirm">확인</button>'
+          '<button class="btn btn-action" title="cancel">취소</button>'
+       '</div>'
+   '</div>'
+   '<div class="dental-modal-overlay" hidden></div>'
+'</div>'
+'<div class="dental-toast" id="dentalToast">'
+    '<div class="toast-alert" id="toastAlert"></div>'
+    '<div class="toast-alert-overlay"></div>'
+    '<div class="toast-inform" id="toastInform"></div>'
+'</div>';

var dentalModal = function () {

    var template = document.createElement('div');
    template.innerHTML = modalHtml;
    document.body.appendChild(template);

    var modal = document.getElementById("alertModal");
    var modalBody = modal.querySelector(".modal-container-body");
    var modalBtnBox = modal.querySelector(".modal-container-footer");
    var modalConfirmBtn = modal.querySelector("[title='confirm']");
    var modalCloseBtn = modal.querySelector("[title='cancel']");

    var dentalToast = document.getElementById("dentalToast");
    var toastAlertElm = dentalToast.querySelector("#toastAlert");
    var instantMsgElm = dentalToast.querySelector("#toastInform");
    var _click;
    var _keydown;

    var _modalReset = function () {
        modalBody.innerText = "";
        alertModal.classList.remove("active");
        modalCloseBtn.removeAttribute('style');
    };

    var toastHandle = function (e) {
        e.target.innerText = "";
        removeEvent(e.target, "click", toastHandle);
    };

    var clickHandler = function (e) {
        var btnTitle = e.target.title;
        switch(btnTitle) {
            case "confirm":
                console.log(btnTitle, "CLICK!!");
                return true;
            case "cancel":
                console.log(btnTitle, "CLICK!!");
                return false;
            default:
                return ;
        }
    };

    var keydownHandler = function (e) {
        var keynum = e.keyCode ? e.keyCode : e.which;
        switch(keynum) {
            case 13:
                console.log("keyCode: ", keynum, "Enter!!");
                return true;
            case 27:
                console.log("keyCode: ", keynum, "ESC!!");
                return false;
            default:
                return ;
        }
    };

    return {
        isModal : function () {
            var isModal = modal.classList.contains("active");
            return isModal;
        },
        confirm : function (msg, callback) {

            if( !this.isModal() ) {
                modalBody.innerText = msg || "완료를 위해 확인 버튼을 눌러주세요.";
                modal.classList.add("active");

                addEvent(modalBtnBox, "click", _click = function(e) {
                    var flag = clickHandler(e);

                    if( flag == undefined ) return;
                    if( flag && typeof callback === "function") callback();

                    _modalReset();
                    removeEvent(this, "click", _click); 
                });
                // addEvent(window, "keydown", _keydown = function(e) {
                //     e.preventDefault(); 
                //     var flag = keydownHandler(e);

                //     if( flag == undefined ) return;
                //     if( flag && typeof callback === "function") callback();

                //     _modalReset();
                //     removeEvent(this, "keydown", _keydown); 
                // });

            } else { console.log( "이미 존재합니다, dental-modal is not stackable."); }
        },
        alert : function (msg, callback) {
            modalCloseBtn.style.display = "none";
            this.confirm(msg, callback);
        },
        toast : function (msg) {
            if ( !toastAlertElm.hasChildNodes() ) {

                toastAlertElm.innerText = msg || "완료되었습니다";
                addEvent(toastAlertElm, "click", toastHandle);

            } else { console.log("이미 메시지가 있습니다."); }
        },
        instant : function (msg) { 
            console.log("추가메시지: ", msg, instantMsgElm);
            console.log( instantMsgElm.hasChildNodes() );
            if ( !instantMsgElm.hasChildNodes() ) {
                instantMsgElm.innerText = msg || "완료되었습니다";
                setTimeout( function() { instantMsgElm.innerText="";}, 1500);
            } else { console.log("이미 메시지가 있습니다."); }
        }
    }
};    

var toggleSpinner = function () {
    var wrapper = document.createElement("div");
    // wrapper.classList.add("dental-loading");
    // wrapper.hidden = true; ie 10에서 작동 안함, 하드코딩된 hidden 은 인식

    var spinnerHtml =
        '<div class="dental-loading" id="dentalSpinner" hidden>'   
    +       '<div class="fa-icon"><i class="fas fa-spinner fa-pulse fa-2x"></i></div>'
    +       '<div class="loading-overlay" hidden=""></div>'
    +   '</div>'

    if (!document.querySelector(".dental-loading")) {
        wrapper.innerHTML = spinnerHtml;
        document.body.appendChild(wrapper);
    } 

    var spinnerElem = document.querySelector(".dental-loading");    
    // spinnerElem.classList.toggle("active");
    if(spinnerElem.classList.contains("active")) spinnerElem.classList.remove("active");
    else spinnerElem.classList.add("active");
};

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

var imageFit = function (arg, size) {
    var hei = arg.naturalHeight;
    var wid = arg.naturalWidth;
    console.log("height: ", hei, " px, width: ", wid ," px");
    if( hei > wid) { 
        arg.style.width = size + "px"; 
        arg.style.height = "auto";
        console.log("height 기준으로 정렬"); 
    } else { 
        arg.style.width = "auto"; 
        arg.style.height = size + "px";
        console.log("width 기준으로 정렬");  
    }
};

var listZero= function () {
    var wrapper = document.createElement("div");
    var listZeroHtml = "<div class='list-zero'></div>";

    if (!document.querySelector(".list-zero")) {
        wrapper.innerHTML = listZeroHtml;
        document.body.appendChild(wrapper);
    } 
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

var dModal = dModal || {};
$(document).ready(function() {
    dModal = dentalModal();  // 모달 세팅
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



// 선정우가 작성, yyyymmdd 인자 기준, 프런트 날짜 출력 스크립트

function returnDateObj(yyyymmdd) {
	var year = yyyymmdd.substring(0,4);
	var month = yyyymmdd.substring(4,6);
	var day = yyyymmdd.substring(6,8);
	return new Date(year, month -1, day);
}

function renderFullDateKR(yyyymmdd) {
	var date = returnDateObj(yyyymmdd);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var dayOfWeek = returnDayOfWeekFromIndex(date.getDay());

	return year + "년 " + month + "월 " + day + "일";
}

function renderTimeKR(hhmm) {
	if( !hhmm ) return "";
	var hour = hhmm.substring(0,2);
	var min = hhmm.substring(2,4);

	return hour + "시 " + min + "분";
}

function renderMslashD(yyyymmdd) {
	var date = returnDateObj(yyyymmdd);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var dayOfWeek = returnDayOfWeekFromIndex(date.getDay());

	return month +"/" + day + " (" + dayOfWeek + ")";
}

function renderMstrDstr(yyyymmdd) {
	var date = returnDateObj(yyyymmdd);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var dayOfWeek = returnDayOfWeekFromIndex(date.getDay());

	return month +"월" + day +"일 (" + dayOfWeek + ")";
}

function returnDayOfWeekFromIndex(index) {
	var arr = ["일", "월", "화", "수", "목", "금", "토"];
	return arr[index];
}


// 요기까지 선정우가 작성


