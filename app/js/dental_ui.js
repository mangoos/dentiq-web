    
"use strict";

var dentalModal = function (id) {
    var basicElmObj = { 
        modal: id || "alertModal", 
        toast: "toastAlert", 
        instant: "toastInform" 
    };

    var alertModal = document.getElementById(basicElmObj.modal);
    var toastAlertElm = document.getElementById(basicElmObj.toast);
    var instantMsgElm = document.getElementById(basicElmObj.instant);

    var alertReset = function () {
        alertModal.removeAttribute("class");
        modalCloseBtn.checked = false;
        alertModalBody.innerText = "";
        alertModal.classList.add("dental-modal", "dental-alert");
    };
    // modal 이벤트리스너
    alertModal.addEventListener( "click", function(e) {  
        var inputTitle = e.target.title;

        switch(inputTitle) {
            case "close":
                console.log("닫기 버튼 클릭, 그냥 닫음");
                alertReset();
                return;
            case "confirm":
                console.log("확인버튼 클릭, 요기에 실행함수");
                alertReset();
                // loadingModal.classList.toggle("active");
                return;
            case "cancel":
                console.log("취소 버튼 클릭, 요기에 실행함수");
                alertReset();
                return;
            default:
                return ;
        };
    })
    // toast alert 이벤트리스너
    toastAlertElm.addEventListener("click", function(e) {
        console.log(e.target);
        e.target.innerText="";
    })

    return {
        modalFunc : function (msg, type) {
                // 모달 실행 함수, opt 는 현재 type2 1개 있음,  안넣거나 다른거 넣으면 기본형으로 작동
                 // type2 는 타이틀 있는 모달 
            var activeFlag = alertModal.classList.contains("active");
            if( activeFlag ) {
                console.log("alert 있음, 초기화 진행");
                alertReset();
            }else {
                alertModalBody.innerText = msg || "완료를 위해 확인 버튼을 눌러주세요.";
                if ( type ) { alertModal.classList.toggle(type); }      
                alertModal.classList.toggle("active");
            }
        },
        alertFunc : function (msg) { 

            console.log("추가메시지: ", msg, toastAlertElm);
            console.log( toastAlertElm.hasChildNodes() );
            if ( !toastAlertElm.hasChildNodes() ) {
                toastAlertElm.innerText = msg || "완료되었습니다";
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


var formUIInit = function () {

    document.body.addEventListener("change", function(e) {
        var target = e.target;
        var hasClass = target.classList.contains("styled-select") || target.classList.contains("styled-input");
        //console.log(target)
        //console.log(target.value);
        //console.log("hasClass: ", hasClass, target);
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
}



