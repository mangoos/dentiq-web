var html = 
`<div class="juso-search-wrapper" id="jusoModal">
    <input class="juso-search-checkbox" type="checkbox" id="jusoSearchCheckbox" name="juso-search-checkbox" hidden><!-- 모달 체크박스 -->
    <!-- 배경, 체크박스로 하면 배경을 레이블로 해서 모달 죽일 수 있음-->
    <!-- <label for="jusoSearchCheckbox"><div class="dental-modal-overlay"></div></label>  -->
    <div class="juso-search">
        <div class="juso-search-header">
            <div class="juso-search-header-title">주소 검색</div>
            <div class="juso-search-header-desc">예시에 따라 검색하면 빠르게 찾을 수 있습니다.</div>
            <label class="juso-search-close-label" for="jusoSearchCheckbox" rel="juso-search" title="닫기"><i class="fa fa-window-close"></i></label>
        </div>
        <div class="juso-search-body address_search">
            <form id="jusoSearchForm">  <!-- 주소검색 Form -->
                <div class="form-group">
                    <input type="text" class="styled-input" name="keyword" id="jusoSearchInput" maxlength="40" placeholder="예) 판교역로 235, 운중 산운마을" required>
                    <!-- <label class="styled-label">주소</label> -->
                    <!-- <span class="form-group-desc">정확하게 입력</span> -->
                    <!-- <span class="form-group-icon" hidden><i class="fal fa-check-circle"></i></span> -->
                    <span class="form-group-btn"><button type="submit" class="btn btn-primary">검색</button></span>
                    <span class="form-group-underline"></span>
                    <!-- <div class="form-group-msg2" hidden></div> -->
                </div>
            </form>
            <div class="adderss-search-tip on" id="addrTip" hidden> 
                <div class="info_body">
                    <p class="tit_tip">tip</p>
                    <p class="desc_tip">아래와 같은 조합으로 검색을 하시면 더욱 정확한 결과가 검색됩니다.</p>
                    <p class="desc_tip">도로명 + 건물번호</p>
                    <span class="txt_example">예) 판교역로 235, 제주 첨단로 242</span>
                    <p class="desc_tip2">지역명(동/리) + 번지</p>
                    <span class="txt_example">예) 삼평동 681, 제주 영평동 2181</span>
                    <p class="desc_tip2">지역명(동/리) + 건물명(아파트명)</p>
                    <span class="txt_example">예) 분당 주공, 연수동 주공3차</span>
                    <p class="desc_tip2">사서함명 + 번호</p>
                    <span class="txt_example">예) 분당우체국사서함 1~100</span>
                </div>
            </div>
            <div class="address-search-result" id="addrResult" hidden>
                <p class="result-amount">총 <strong id="totalCount">0</strong>건</p>
                <ul id="jusoList" class="result_list"></ul>
                <script id="jusoListTemplate" type="text/x-handlebars-template">
                    {{#each .}}
                    <li data-juso-idx="{{jusoIdx}}">
                        <div class="address-item road-name"><span>도로명</span><p>{{roadAddr}}</p></div>
                        <div class="address-item jibun"><span>지번</span><p>{{jibunAddr}}</p></div>
                        <div class="zip-code">{{zipNo}}</div>                                
                    </li>
                    {{/each}}
                </script>
            </div>
        </div>
        <!-- <div class="juso-search-footer"></div> -->
    </div>
</div>`;

var eventFlag = false;

function JusoSearch (selector, objCalled) {
    // var jusoModuleWrapper= `<div class="juso-search-wrapper">주소</div>`;

    var JUSO_PER_PAGE = 10;         // 한번에 조회할 주소 아이템의 개수
    var SCROLL_LOCK = false;        // 주소 선택 영역 스크롤 락

    var lastPageNo = 1;             // 마지막 주소 아이템 페이지의 번호
    var lastJusoKeyword;            // 마지막 주소 검색 키워드 

    var totalJusoCount = 0;         // 검색된 주소 아이템의 개수
    var jusoContainer = {};         // 검색된 주소의 누적

    var inputElmCalledJusoSearch = objCalled;
    var wrapper = document.querySelector(selector);
    var moduleSwitch = wrapper.querySelector(".juso-search-checkbox");
    var searchResultWindow = wrapper.querySelector(".result_list");
    var jusoListTemplate = wrapper.querySelector("#jusoListTemplate").innerHTML; // 지역코드 - 시도 선택 템플릿 객체
    var searchForm = wrapper.querySelector("#jusoSearchForm");

    // if ( selector ) this.wrapper = wrapper;
    // this.testWrapper = jusoModuleWrapper;


    this.module = wrapper.querySelector(".juso-search");

    // // 주소모달을 Open한다.
    function _openJusoModal() { moduleSwitch.checked = true; }
    
    // 주소모달을 close한다.
    function _closeJusoModal() { moduleSwitch.checked = false; }

    function _resetJusoModal() {

        SCROLL_LOCK = false;
        addrTip.classList.add("on");
        addrResult.classList.remove("on");
        jusoList.innerHTML = "";
        jusoSearchInput.value = "";
    }

    /******************************************************************************/
    /*  스크롤했을 때, 주소 아이템에 대한 append 처리
    /*  
    /*******************************************************************************/
    function scrollEvent() {
        
        if ( totalJusoCount == 0 ) return;

        var maxPageNo = totalJusoCount / JUSO_PER_PAGE + 1;  // 한 페이지에 10개의 목록 지정 (개수 조정 시 변경 필요)
        if ( (lastPageNo+1) >= maxPageNo ) return;

        if ( SCROLL_LOCK ) {
            console.log("SCROLL : LOCKED" );
            setTimeout(function() {
                SCROLL_LOCK = false;
                console.log("SCROLL_LOCK 풀렸음");
            }, 500);
            return;
        }

        var element = searchResultWindow;
        console.log(element.scrollHeight, ", ", Math.ceil(element.scrollTop), ", ", element.scrollHeight - Math.ceil(element.scrollTop), ", ", element.clientHeight);
        
        if ( element.scrollHeight - Math.ceil(element.scrollTop) <= element.clientHeight ) {
            console.log("바닥");
            searchJuso(lastJusoKeyword, (lastPageNo+1));
        }
    }

    /******************************************************************************/
    /*  주소 검색 레이어에서 주소 검색 실행
    /*  
    /*******************************************************************************/

    function searchJuso(keyword, currentPage) {

        if ( SCROLL_LOCK ) {
            console.log("SCROLL LOCKED - in JS");
            setTimeout(function() {
                SCROLL_LOCK = false;
                console.log("listJobAds:SCROLL_LOCK 풀렸음");
            }, 500);
            return;
        }
        SCROLL_LOCK = true;

        var apiParam = "keyword=" + keyword;
        if ( currentPage!=null ) apiParam += "&currentPage=" + currentPage;

        // OADING 표시 - 시작
        // loadingModal.open();
        toggleSpinner();
        

        callApi("GET", "/api/location/", apiParam, 
            function(resData) {
                var errorCode = resData.common.errorCode;
                if ( errorCode!="0" && errorCode!="00" ) {
                    // 에러 팝업 띄울 것
                    if ( resData.common.errorMessage ) {
                        dModal.alert(resData.common.errorMessage + "  \n[" + errorCode + "]");
                    } else {
                        dModal.alert("주소 검색에 실패했습니다. [" + errorCode + "]");
                    }
                    _resetJusoModal();
                    // loadingModal.close(); // LOADING 표시 - 끝
                    toggleSpinner();
                    return;
                }

                console.log("주소 처리 시작 : 수신 데이터 : ", resData.juso);
                
                totalJusoCount = resData.common.totalCount;  
                
                if ( totalJusoCount === "0" ) {
                    dModal.alert("검색 결과가 없습니다. \n 팁을 참고해서 다른 키워드로 검색해 보세요.", function() {
                        jusoSearchInput.focus();
                    });
                    _resetJusoModal();
                    // loadingModal.close();
                    toggleSpinner();
                    return;
                }

                if ( currentPage != null ) lastPageNo = currentPage;
                
                resData.locationList.forEach(function(jusoItem) {
                    jusoContainer[jusoItem.jusoIdx] = jusoItem;
                    console.log("데이터 세팅 결과 : ", jusoContainer[jusoItem.jusoIdx]);
                    console.log("\t\t!!!! 현재까지의 jusoContainer : ", jusoContainer);
                });
                
                var jusoListContent = Handlebars.compile(jusoListTemplate)(resData.locationList);

                if ( currentPage != null && currentPage > 1 ) {
                    $("#jusoList").append(jusoListContent);
                } else {
                    $("#jusoList").html(jusoListContent);
                }

                $("#totalCount").html(totalJusoCount);
                //console.log(jusoList);

                SCROLL_LOCK = false;
                // loadingModal.close(); // LOADING 표시 - 끝
                toggleSpinner();
                if( addrTip.classList.contains("on") ) { addrTip.classList.remove("on"); } // 선정우가 한땀, 주소 검색 팁박스 hidden 처리
                if( !addrResult.classList.contains("on") ) { addrResult.classList.add("on"); } // 선정우가 한땀, 주소 검색 결과 박스 on 처리
                console.log("현재까지의 jusoContainer : ", jusoContainer);
            },
            function(errorCode, errorMsg) {
                dModal.alert("에러 [" + errorCode + "] ==> [" + errorMsg + "]");
                SCROLL_LOCK = false;
                // loadingModal.close(); // LOADING 표시 - 끝
                toggleSpinner();
            }
        );
    }

    // 주소 모달 submit (검색 실행)
    function submit(event) {
        console.log(event);
        event.preventDefault();
        lastJusoKeyword = $("#jusoSearchForm input[name=keyword]").val();
        lastPageNo = 1;         // 초기화
        jusoContainer = {};     // 초기화
        selectedJuso = null;    // 초기화
        $("#jusoList").html('');
        
        searchJuso(lastJusoKeyword, 1);
    }

    // 주소 선택 결과 리턴 func

    function returnSelectedJuso (event) {
        console.log(event.currentTarget);
        var jusoIdx = $(event.currentTarget).attr("data-juso-idx");

        console.log("선택된 주소 ", jusoContainer[jusoIdx]);
        if ( !jusoContainer[jusoIdx] ) {
            console.log("ERROR : jusoContainer의 값이 없음");
            return;
        }

        // 1. 좌표 검색 수행
        //getCoordiate(jusoContainer[jusoIdx]);
        var coordinateParam = convertObjectToFormDataString(jusoContainer[jusoIdx]);
        console.log("보낼 데이터 ", coordinateParam);

        callApi("GET", "/api/coordinate/", coordinateParam, 
            function(resData) {
                console.log(resData);

                jusoContainer[jusoIdx].entX          =   resData[0].entX;           // 출입구 X좌표
                jusoContainer[jusoIdx].entY          =   resData[0].entY;           // 출입구 X좌표
                console.log("주소 & 좌표 검색 완료 : ", jusoContainer[jusoIdx]);

                _closeJusoModal();              // 자신을 닫기

                console.log("+++++++++++++++++++++++++++++", inputElmCalledJusoSearch);                       
                inputElmCalledJusoSearch.value = jusoContainer[jusoIdx].roadAddrPart1;          // 주소 앞 부분 설정
                console.log("우리동네 - 주소 앞부분 [" + inputElmCalledJusoSearch.value + "]");

                inputElmCalledJusoSearch.readOnly = true;
            },
            function(errorCode, errorMsg) {
                alert("에러 [" + errorCode + "] ==> [" + errorMsg + "]");
            }
        );
    }

    this.open = _openJusoModal;
    this.close =_closeJusoModal;
    this.reset =_resetJusoModal;

    if( !eventFlag) {
        (function() {
            console.log(eventFlag, "++++++++++++++++++++++++++++++주소 모듈 이벤트 바인딩++++++++++++++++++++++++++");
            searchResultWindow.addEventListener( "scroll", scrollEvent );
            $(searchResultWindow).on( "click", "li" , returnSelectedJuso );
            searchForm.addEventListener("submit", submit );
        })();
        eventFlag = true;
    } else {
        console.log(eventFlag, "주소 모듈에 이벤트 이미 있음");
    } 
}
