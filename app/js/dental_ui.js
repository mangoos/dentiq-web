    
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

var DRexPattern = {

    "name" : {
        "match" : /[ㄱ-힣a-zA-Z0-9\s]{2,15}/, 
        "errMsg" : "2~15자 이내로 입력해 주세요. 특수문자 제외.", 
        "delKey" : /[^ㄱ-힣a-zA-Z0-9\s]+/g,
        "delMsg" : "",
        "suffix" : "님"
    },

    "basicInfoTelNo" : {
        "match" : /^\s?(02|0\d{2})[-\s]?(\d{3,4})[-\s]?(\d{4})$/,
        "errMsg" : "국번을 포함해서 정확한 전화번호를 입력해 주세요",
        "delKey" : /[^\d]+/g,
        "delMsg" : "",
        "suffix" : null
    },

    "onlyNumber" : {
        "match" : /^[\d]{1,}$/g, 
        "errMsg" : "숫자만 입력할 수 있습니다.",
        "delKey" : /[^\d]+/g,
        "delMsg" : "",
        "suffix" : null 
    },

    "email" : {
        "match" : /^.{1,}@.*\.?[\w\d]+$/,   // ^(?:([\w-\.]+)@([\w-]+)\.?[\w-]{0,4})$
        "errMsg" : "정확한 이메일을 입력해 주세요", 
        "delKey" : null,
        "delMsg" : "",
        "suffix" : null 
    },

    "www" : {
        "match" : /(www|\w+)?\.?(\w+\.{1}.*)/g, // 모든 경우의 수 소화 못함 ^https?://(?<domain>[^/?#]+)
        "errMsg" : "정확한 홈페이지 url 을 입력해 주세요.",
        "delKey" : null,
        "delMsg" : "",
        "suffix" : null 
    },
    
    "birthday" : {
        "match" : /^(?:(19|20)\d{2})(\d{1,2})(\d{1,2})$/, 
        "errMsg" : "생일을 입력해 주세요.  (예 - 19980724)",
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
var dModal = dModal || {};
$(document).ready(function() {
    dModal = dentalModal();  // 모달 세팅

    var $card = $(".dental-card");
    var $formCard= $card.find(".form-group");


    function is$formCard () {

        if( $formCard ) return true;
    
        return false;
    }

    if ( is$formCard() ) {

        dFormValidator.$formInput = $formCard.find(".styled-input");
        console.log("input " + dFormValidator.$formInput.length + " 개");

        var $needValidator = $formCard.filter(".need-validator");
        console.log( ".need-validator" + $needValidator.length + " 개");

        var $needReplacer = $formCard.filter(".need-validator-replacer");
        console.log( ".need-validator-replacer" + $needReplacer.length + " 개");
    }

    dFormValidator.validator = function (inputElm, pattern) {

        "use strict";
        var str = inputElm.value.trim();
        var tag = inputElm.className.replace(/(?:^.*d-reg-)(\w+)(?:.*)$/,"$1");
        var regex =  pattern || DRexPattern[tag] ? DRexPattern[tag].match : "";

        if( !regex ) return; 

        var flag = regex.test(str);
        var msgBox = inputElm.parentElement.querySelector(".form-group-msg2");

        if (!flag) {
            inputElm.classList.add("invalid");
            msgBox.innerText = DRexPattern[tag].errMsg;
        } else {
            inputElm.classList.remove("invalid");
            msgBox.innerText = "";
        }
    };

    dFormValidator.stringReplacer = function ( str, pattern) {
        if( typeof str !== "string") return;
        var str = str.trim();
        var pattern = new RegExp(pattern);
        return str.replace(pattern,"");
    }

    dFormValidator.inputValueReplacer = function (inputElm, pattern) {

        "use strict";
        var str = inputElm.value.trim();
        var tag = inputElm.className.replace(/(?:^.*d-reg-)(\w+)(?:.*)$/,"$1");
        var regex =  pattern || DRexPattern[tag] ? DRexPattern[tag].delKey : "";

        if( !regex ) return;

        var str = str.replace(regex,"").replace(/\s+/g," ");

        inputElm.value = str;
    };

    dFormValidator.inputValueMatch = function (inputElm, pattern) {

        "use strict";

        var str = inputElm.value.trim();
        var tag = inputElm.className.replace(/(?:^.*d-reg-)(\w+)(?:.*)$/,"$1");
        var regex =  pattern || DRexPattern[tag] ? DRexPattern[tag].match : "";

        if ( !regex ) return;

        var flag = regex.test(str);
        var msgBox = inputElm.parentElement.querySelector(".form-group-msg2");
        console.log("tag: ", tag, "regex: ",regex, "flag: ", flag, DRexPattern[tag]);

        if (!flag && str.length > 0) {

            inputElm.classList.add("invalid");
            msgBox.innerText = DRexPattern[tag].errMsg;

        } else {

            inputElm.classList.remove("invalid");
            inputElm.classList.add("valid");
            msgBox.innerText = "";
            // if( inputElm.value.length && DRexPattern[tag].suffix ) inputElm.value = inputElm.value + " " + DRexPattern[tag].suffix;
        }
    };

    $needValidator.on("input", function(e) {  // 복붙 등 모든 인풋 발생하면 keyup trigger
        this.dispatchEvent(new CustomEvent("keyup"));
    });

    $needValidator.on("keyup", function(e) {
        console.log("keyup");
        var self = $(this).find(".styled-input")[0];
        this.classList.remove("valid");
        dFormValidator.validator(self);
    });

    $needValidator.on("focusout", function(e) {
        var self = $(this).find(".styled-input")[0];
        console.log("focusout");
        dFormValidator.inputValueReplacer(self);
        dFormValidator.inputValueMatch(self);
    });

});






