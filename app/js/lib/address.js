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



function Juso (selector) {
    // var jusoModuleWrapper= `<div class="juso-search-wrapper">주소</div>`;

    if ( selector ) this.wrapper = document.querySelector(selector);
    // this.testWrapper = jusoModuleWrapper;

    return this;
}