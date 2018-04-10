




/******************************************************************************/
/*
/*  calendar.js
/*
/*  author : jhlee@gmail.com
/*  last updated : 2018.02.13
/* 
/*  SELECT 엘리먼트로 구성되는 달력 객체
/*
/******************************************************************************/

var CalendarSelect = function (valueBoundHiddenElement, selectElementYYYY, selectElementMM, selectElementDD,                                 
                                startYYYYMMDD, endYYYYMMDD,
                                exceptListMM, exceptListDD ) {
                                // selectableStartYYYYMMDD, selectableEndYYYYMMDD) {
    console.log("CalendarSelect was Created!!!");
    
    var DEFAULT_YYYY_START  = Number( (new Date()).getFullYear() ) - 50;        // <== 수정 가능
    var DEFAULT_YYYY_END    = Number( (new Date()).getFullYear() ) + 2;         // <== 현재 년도에서 2년 이후. 수정가능



    if ( startYYYYMMDD && endYYYYMMDD && ( Number(startYYYYMMDD) > Number(endYYYYMMDD) ) )
        throw '시작년월일[' + startYYYYMMDD + ']은 종료년월일[' + endYYYYMMDD + ']보다 클 수 없습니다.';


    // ----------------------------- 년도 관련 변수 초기화 -----------------------------
    var startYYYY = DEFAULT_YYYY_START;
    if ( startYYYYMMDD && startYYYYMMDD.length>=4 )     startYYYY = Number(startYYYYMMDD.substring(0, 4));

    var endYYYY = DEFAULT_YYYY_END;
    if ( endYYYYMMDD && endYYYYMMDD.length>=4 )          endYYYY =   Number(endYYYYMMDD.substring(0, 4));


    // -----------------------------  월 관련 변수 초기화 -----------------------------
    var startMM = 1;
    if ( startYYYYMMDD && startYYYYMMDD.length>=6 )     startMM     = Number(startYYYYMMDD.substring(4, 6));
    
    var endMM = 12;
    if ( endYYYYMMDD && endYYYYMMDD.length>=6 )         endMM       = Number(endYYYYMMDD.substring(4, 6));

    console.log("startMM=" + startMM + ", endMM=" + endMM);

    

    // ----------------------------- 일 관련 변수 초기화 -----------------------------
    var startDate;      // 시작일자
    if ( startYYYYMMDD && startYYYYMMDD.length>=8 )     startDate = Number(startYYYYMMDD);

    
    var endDate;        // 종료일자
    if ( endYYYYMMDD && endYYYYMMDD.length>=8 )         endDate = Number(endYYYYMMDD);
    



    renderYYYY();
    renderMM();
    renderDD();



    function renderYYYY() {
        if ( !selectElementYYYY ) return;
        console.log('rednerYYYY() : ', startYYYY, " ", endYYYY);

        clearSelectOptions(selectElementYYYY, '선택', '');
        
        for ( var year=startYYYY; year<=endYYYY; year++ ) {
            var option = document.createElement("option");
            option.text = year;
            option.value = year;
            
            selectElementYYYY.options.add(option);            
        }
    }



    function renderMM() {
        if ( !selectElementMM ) return;

        clearSelectOptions(selectElementMM, '선택', '');        

        for ( var mon=startMM; mon<=endMM; mon++ ) {
            var option = document.createElement("option");
            option.text = mon;
            if ( mon<10 ) option.value = '0' + mon;
            else          option.value = ''  +mon;

            if ( startMM > endMM ) {    // 시작월이 종료월보다 이후이므로, overflow된 것이다. 
                option.disabled = true;
                if ( mon >= startMM ) option.disabled = false;
                if ( mon <= endMM )   option.disabled = false;
            }

            if ( exceptListMM && exceptListMM.length>0 && exceptListMM.indexOf(option.value) > -1 ) option.disabled = true;

            
            selectElementMM.options.add(option);
        }
    }
    
    function renderDD() {

        if ( !selectElementDD ) return;
        console.log("renderDD : 시작");
        

        console.log('[', selectElementYYYY.value, ']');
        console.log('[', selectElementMM.value, ']');

        console.log( selectElementYYYY && selectElementYYYY.value && selectElementYYYY.value!='' );
        console.log( selectElementMM && selectElementMM.value && selectElementMM.value!='' );

     

        if ( selectElementYYYY && selectElementYYYY.value && selectElementYYYY.value!='' && selectElementMM && selectElementMM.value && selectElementMM.value!='' ) {
            
            // 현재 선택된 YYYYMM 값
            var selectedYYYYMMstr = selectElementYYYY.value + selectElementMM.value;


            // 현재 선택된 월의 최대 날짜
            var maxDD   = 31;
            var temp = new Date(Number(selectElementYYYY.value), Number(selectElementMM.value), 0);    // JS에서는 월이 0부터 시작. 마지막 달을 구하려면 월 + 1에서 일을 0으로 해서 overflow. 여기서는 입력값이 1부터 이므로 +1 안해도 됨
            maxDD = temp.getDate();

                
            clearSelectOptions(selectElementDD, '선택', '');
            
            for ( var dd=1; dd<=maxDD; dd++ ) {
                var option = document.createElement("option");
                option.text = dd;
                if ( dd<10 ) option.value = '0' + dd;
                else         option.value = '' + dd;


                //console.log(selectedYYYYMMstr + option.value);
                var currentDate = Number(selectedYYYYMMstr + option.value);
				//console.log(currentDate);

                // 현재 selectedYYYYMM이 시작년월에 포함되면... 해당월의 일부 날짜만 나온다.
                if ( startDate && endDate ) {
                    if ( startDate<=currentDate && currentDate <= endDate ) {
                        option.disabled = false;
                        //console.log("범위에 있음 : ", startDate, " <= ", currentDate, " <= ", endDate);
                    } else {
                        option.disabled = true;
                        //console.log("범위에 없음 : ", startDate, " !!! ", currentDate, " !!! ", endDate);
                    }
                }

                if ( exceptListDD && exceptListDD.length>0 && exceptListDD.indexOf(option.value) > -1 ) option.disabled = true;

                selectElementDD.options.add(option);                
            }


        } else {
            clearSelectOptions(selectElementDD, '선택', '');
        }   
        


    }


    function clearSelectOptions(selectElement, defaultOptionText, defaultOptionValue) {
        if ( selectElement && selectElement.options && selectElement.options.length>0 ) {       // options 전체 초기화
            var len = selectElement.options.length;
            for ( var i=0; i<len; i++ ) {
                selectElement.options.remove(0);
            }
        }

        if ( selectElement && defaultOptionText ) {
            var option = document.createElement('option');
            option.text = defaultOptionText;
            if ( defaultOptionValue )   option.value = defaultOptionValue;
            else option.value = '';

            // element가 required 속성일 때에는 하나라도 선택해야 하므로 "선택('')"은 선택할 수 없어야 하고, required=false인 경우에는 값을 선택하지 않을 수도 있으므로 "선택('')"도 선택할 수 있어야 한다. 
            if ( selectElement.required ) option.disabled = true;

            option.selected = true;
            selectElement.options.add(option);            
        }
        
    }

    function _removeEventListeners() {
        if ( selectElementYYYY )    selectElementYYYY.removeEventListener("change", onChangeYYYY);
        if ( selectElementMM )      selectElementMM.removeEventListener("change", onChangeMM);
    }

    // 년이 변경될 때, 월과 일을 초기화
    function onChangeYYYY() {
        if ( selectElementMM ) {
            selectElementMM.value = '';
        }
        if ( selectElementDD ) {
            //renderDD();
            selectElementDD.value = '';
        }
        if ( valueBoundHiddenElement ) valueBoundHiddenElement.value = _getValue();
    }
    if ( selectElementYYYY )    selectElementYYYY.addEventListener("change", onChangeYYYY);

    // 월이 변경될 때 ==> 일을 초기화한다.
    function onChangeMM() {
        if ( selectElementDD ) {
            renderDD();
            selectElementDD.value = '';
        }
        if ( valueBoundHiddenElement ) valueBoundHiddenElement.value = _getValue();
    }
    if ( selectElementMM )      selectElementMM.addEventListener("change", onChangeMM);


    function _getValue() {
        if ( selectElementYYYY && selectElementMM && selectElementDD ) {              // 년, 월, 일
            if ( selectElementYYYY.value != '' && selectElementMM != '' && selectElementDD != '' ) return selectElementYYYY.value + selectElementMM.value + selectElementDD.value != '';

        } else if ( selectElementYYYY && selectElementMM && !selectElementDD ) {      // 년, 월
            if ( selectElementYYYY.value != '' && selectElementMM != '' ) return selectElementYYYY.value + selectElementMM.value;
            
        // } else if ( selectElementYYYY && !selectElementMM && selectedElementDD ) {      // 년, 일
        // 
        } else if ( selectElementYYYY && !selectElementMM && !selectElementDD ) {     // 년
            if ( selectElementYYYY.value != '' ) return selectElementYYYY.value;

        } else if ( !selectElementYYYY && selectElementMM && selectElementDD ) {      // 월, 일
            if ( selectElementMM.value != '' && selectElementDD != '' ) return selectElementMM.value + selectElementDD.value;

        } else if ( !selectElementYYYY && selectElementMM && !selectElementDD ) {     // 월
            if ( selectElementMM.value != '' ) return selectElementMM.value;

        } else if ( !selectElementYYYY && !selectElementMM && selectElementDD ) {     // 일
            if ( selectElementDD.value != '' ) return selectElementDD.value;

        }

        return null;
    }

    return {
        getValue: function() {
            return _getValue();
        },
        
        removeEventListeners: function() {
            _removeEventListeners();
        },
        
        getElementMM: function() {
            return selectElementMM;
        }
    };
}