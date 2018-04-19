    
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
    +       '<div class="fa-icon"><i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i></div>'
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
    if( hei > wid) { 
        arg.style.width = size + "px"; 
        arg.style.height = "auto"; 
    } else { 
        arg.style.width = "auto"; 
        arg.style.height = size + "px"; 
    }
};







