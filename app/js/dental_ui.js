/**
 *  dental_ui import 마크업은 문서 하단 에 위치
 *  DOM content 로딩 후, 다른 js 보다 우선순위로 로딩되어야 함.
 *
 */

var dModal = dentalModal(); // 모달 세팅


/**
 * 문서 로딩 이후 로딩
 */

$(document).ready(function() {
	var formUIInit = (function() {  // 나중에 폼헬퍼로 이동, 폼 없는 페이지는 의미없음.
		document.body.addEventListener("change", function(e) {
			var target = e.target;
			var hasClass = target.classList.contains("styled-select") || target.classList.contains("styled-input");
			console.log("hasClass: ", hasClass, target);
			if (hasClass) {
				if (!target.classList.contains("hasValue")) { target.classList.add("hasValue"); }
			}
		});
		// 바디에 위임해서 포커스 아웃 처리 애매함. ㅠ 참고용 나중에 변경
		document.body.addEventListener("focusout", function(e) {
			var target = e.target;
			var hasClass = target.classList.contains("styled-select") || target.classList.contains("styled-input");
			if (hasClass) {
				if (!target.value || target.value == "") {
					target.classList.remove("hasValue");
					console.log("값 없음, hasValue 클래스 삭제");
				} else { console.log("값 있음, hasValue 유지"); return ; }
			}
		});
		console.log("form 꾸미기 css 완료");
	})();
	// setTimeout( function() {
	//     // dModal.toast(navigator.userAgent);
	//     var ua = navigator.userAgent;
	//     if(/iphone/i.test(ua)) {

	//         dModal.alert("iphone/safari 네", function() {
	//             dModal.instant(window.screen);
	//         });
	//     }
	// if(/android/i.test(ua)) {

	//     dModal.alert("안드로이드 네", function() {
	//         dModal.instant(window.screen.orientation.type);
	//     });
	// }
	// var sOrientation = window.screen.orientation || window.screen.msOrientation || windown

	// }, 1000);
});

(function() {
	window.addEvent = function(elm, type, fn) {
		elm.addEventListener(type, fn, false);
		return fn;
	};
	window.removeEvent = function(elm, type, fn) {
		elm.removeEventListener(type, fn, false);
		return fn;
	};

	// forEach pollyfill

	if (window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = function(callback, thisArg) {
			thisArg = thisArg || window;
			for (var i = 0; i < this.length; i++) {
				callback.call(thisArg, this[i], i, this);
			}
		};
	}

	// toBlob pollyfill

	if (!HTMLCanvasElement.prototype.toBlob) {
		console.log("toBlob 폴리필 실행");
		Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
			value: function(callback, type, quality) {
				var canvas = this;
				setTimeout(function() {
					var binStr = atob(canvas.toDataURL(type, quality).split(",")[1]);
					var len = binStr.length;
					var arr = new Uint8Array(len);

					for (var i = 0; i < len; i++) {
						arr[i] = binStr.charCodeAt(i);
					}

					callback(new Blob([arr], {type: type || "image/png"}));
				});
			}
		});
	}

	// common.js로 이동 // CustomEvent constructor pollyfill, because of explore.

	// if ( typeof window.CustomEvent != "function" ) {
	//     function CustomEvent ( event, params ) {
	//         params = params || { bubbles: false, cancelable: false, detail: undefined };
	//         var evt = document.createEvent( 'CustomEvent' );
	//         evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
	//         return evt;
	//        }

	//       CustomEvent.prototype = window.Event.prototype;

	//       window.CustomEvent = CustomEvent;
	// }
})();


function dentalModal() {
	var modalHtml =
            "<div class=\"dental-modal dental-alert\" id=\"alertModal\" hidden>"   +
        "<div class=\"dental-modal-container\">"       +
        "<div class=\"modal-container-body\"></div>"       +
        "<div class=\"modal-container-footer\" id=\"btnBox\">"          +
        "<button class=\"btn btn-action\" title=\"confirm\">확인</button>"          +
        "<button class=\"btn btn-action\" title=\"cancel\">취소</button>"       +
        "</div>"   +
        "</div>"   +
        "<div class=\"dental-modal-overlay\" hidden></div>" +
        "</div>" +
        "<div class=\"dental-toast\" id=\"dentalToast\">"    +
        "<div class=\"toast-alert\" id=\"toastAlert\"></div>"    +
        "<div class=\"toast-alert-overlay\"></div>"    +
        "<div class=\"toast-inform\" id=\"toastInform\"></div>" +
        "</div>";

	var template = document.createElement("div");
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

	var _modalReset = function() {
		modalBody.innerText = "";
		alertModal.classList.remove("active");
		modalCloseBtn.removeAttribute("style");
	};

	var toastHandle = function(e) {
		e.target.innerText = "";
		removeEvent(e.target, "click", toastHandle);
	};

	var clickHandler = function(e) {
		var btnTitle = e.target.title;
		switch (btnTitle) {
		case "confirm":
			console.log(btnTitle, "CLICK!!");
			return true;
		case "cancel":
			console.log(btnTitle, "CLICK!!");
			return false;
		default:
			
		}
	};

	var keydownHandler = function(e) {
		var keynum = e.keyCode ? e.keyCode : e.which;
		switch (keynum) {
		case 13:
			console.log("keyCode: ", keynum, "Enter!!");
			return true;
		case 27:
			console.log("keyCode: ", keynum, "ESC!!");
			return false;
		default:
			
		}
	};

	return {
		isModal: function() {
			var isModal = modal.classList.contains("active");
			return isModal;
		},
		confirm: function(msg, callback) {
			if (!this.isModal()) {
				modalBody.innerText = msg || "완료를 위해 확인 버튼을 눌러주세요.";
				modal.classList.add("active");

				addEvent(modalBtnBox, "click", _click = function(e) {
					var flag = clickHandler(e);

					if (flag === undefined) return;
					if (flag && typeof callback === "function") callback();

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
			} else { console.log("이미 존재합니다, dental-modal is not stackable."); }
		},
		alert: function(msg, callback) {
			modalCloseBtn.style.display = "none";
			this.confirm(msg, callback);
		},
		toast: function(msg) {
			if (!toastAlertElm.hasChildNodes()) {
				toastAlertElm.innerText = msg || "완료되었습니다";
				addEvent(toastAlertElm, "click", toastHandle);
			} else { console.log("이미 메시지가 있습니다."); }
		},
		instant: function(msg) {
			console.log("추가메시지: ", msg, instantMsgElm);
			console.log(instantMsgElm.hasChildNodes());
			if (!instantMsgElm.hasChildNodes()) {
				instantMsgElm.innerText = msg || "완료되었습니다";
				setTimeout(function() { instantMsgElm.innerText = ""; }, 1500);
			} else { console.log("이미 메시지가 있습니다."); }
		}
	};
}

var toggleSpinner = function() {
	var wrapper = document.createElement("div");
	// wrapper.classList.add("dental-loading");
	// wrapper.hidden = true; ie 10에서 작동 안함, 하드코딩된 hidden 은 인식

	var spinnerHtml =
        "<div class=\"dental-loading\" id=\"dentalSpinner\" hidden>"       +
    "<div class=\"fa-icon\"><i class=\"fas fa-spinner fa-pulse fa-2x\"></i></div>"       +
    "<div class=\"loading-overlay\" hidden=\"\"></div>"   +
    "</div>";

	if (!document.querySelector(".dental-loading")) {
		wrapper.innerHTML = spinnerHtml;
		document.body.appendChild(wrapper);
	}

	var spinnerElem = document.querySelector(".dental-loading");
	// spinnerElem.classList.toggle("active");
	if (spinnerElem.classList.contains("active")) spinnerElem.classList.remove("active");
	else spinnerElem.classList.add("active");
};

var imageFit = function(arg, size) {
	var hei = arg.naturalHeight;
	var wid = arg.naturalWidth;
	console.log("height: ", hei, " px, width: ", wid," px");
	if (hei > wid) {
		arg.style.width = size + "px";
		arg.style.height = "auto";
		console.log("height 기준으로 정렬");
	} else {
		arg.style.width = "auto";
		arg.style.height = size + "px";
		console.log("width 기준으로 정렬");
	}
};

var listZero = function() {
	var wrapper = document.createElement("div");
	var listZeroHtml = "<div class='list-zero'></div>";

	if (!document.querySelector(".list-zero")) {
		wrapper.innerHTML = listZeroHtml;
		document.body.appendChild(wrapper);
	}
};

// 임시로 간략하게 브라우져 스니핑 함수(나중에 개선)

// function browserSniff () {
//     var ua = window.navigator.userAgent;
//     var iosTag = /iphone|ipod|ipad/.test( userAgent );
// }

// 선정우가 작성, yyyymmdd 인자 기준, 프런트 날짜 출력 스크립트

function returnDateObj(yyyymmdd) {
	if (!yyyymmdd) return false;
	var dateStr = yyyymmdd + "";
	if (dateStr.length < 8 || dateStr.length > 8) return false;

	var year = dateStr.substring(0, 4);
	var month = dateStr.substring(4, 6);
	var day = dateStr.substring(6, 8);
	return new Date(year, month - 1, day);
}

function returnYYYYMMDD(dateObj) {
	var year = dateObj.getFullYear() + "";
	var month = dateObj.getMonth() + 1;
	month = (month < 10) ? ("0" + month) : month;
	var day = dateObj.getDate();
	day = (day < 10) ? ("0" + day) : day;

	return year + month + day + "";
}

function renderFullDateKR(yyyymmdd) {
	var date = returnDateObj(yyyymmdd);
	if (date) {
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		// var dayOfWeek = returnDayOfWeekFromIndex(date.getDay());

		return year + "년 " + month + "월 " + day + "일";
	}
	console.log("입력값: ", yyyymmdd, ", yyyymmdd 형식에 맞춰 입력해 주세요");
	return false;
}

function renderTimeKR(hhmm) {
	if (!hhmm) return "";

	var hour = hhmm.substring(0, 2);
	var min = hhmm.substring(2, 4);

	return hour + "시 " + min + "분";
}

function renderMslashD(yyyymmdd) {
	if (!yyyymmdd) return false;

	var date = returnDateObj(yyyymmdd);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var dayOfWeek = returnDayOfWeekFromIndex(date.getDay());

	return month + "/" + day + " (" + dayOfWeek + ")";
}

// 주어진 날을 비교해서 남은 날을 계산, 2번째 인자가 없으면 오늘과 차이.
function returnDday(yyyymmdd_end, yyyymmdd_start) {
	var date1 = returnDateObj(yyyymmdd_start) || Date.now();
	var date2 = returnDateObj(yyyymmdd_end);
	if (date1 && date2) {
		var dDay = (date2 - date1) / (60 * 60 * 24 * 1000);
		return dDay;
	}

	return false;
}

function renderMstrDstr(yyyymmdd) {
	if (!yyyymmdd) return false;

	var date = returnDateObj(yyyymmdd);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var dayOfWeek = returnDayOfWeekFromIndex(date.getDay());

	return month + "월" + day + "일 (" + dayOfWeek + ")";
}

function returnDayOfWeekFromIndex(index) {
	if (typeof index !== "number" && !index) return false;

	var arr = ["일", "월", "화", "수", "목", "금", "토"];
	return arr[index];
}


function renderAdCardHiringEndDate(yyyymmdd) {
	if (!yyyymmdd) return false;

	var hiringEndDate = yyyymmdd + "";
	var today = returnYYYYMMDD(new Date());
	var dDay = returnDday(hiringEndDate, today);

	if (dDay < 10) return "D - " + dDay;
	if (dDay == "1") return "오늘 마감";

	return renderMslashD(hiringEndDate);
}

// 요기까지 선정우가 작성

// viewport checker

function returnClientWidth() {
	var monitor = window.document.documentElement.getBoundingClientRect();
	console.log(monitor);
	return monitor.width;
}

