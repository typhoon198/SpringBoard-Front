 function moveShow(cPage, tPage, sPage, ePage) {
        //PageBean에 prev, next만 Boolean으로 저장해서 보여주는게 나아보임
        //else안써주면 안됨 페이지 로드될때마다 검사~MVC에서는 뷰가계속바껴서 안해줘도될듯?
        //<< 1페이지일때만 숨김
        if (cPage == 1) {
            $('div.pagination a.first').hide();
        } else {
            $('div.pagination a.first').show();
        }
        //< 첫섹션일때 (1~10) 숨김
        if (sPage == 1) {
            $('div.pagination a.prev').hide();
        } else {
            $('div.pagination a.prev').show();
        }
        //> 마지막섹션일때 숨김
        if (ePage == tPage) {
            $('div.pagination a.next').hide();
        } else {
            $('div.pagination a.next').show();
        }
        //>>마지막 페이지일때만 숨김
        if (cPage == tPage) {
            $('div.pagination a.last').hide();
        } else {
            $('div.pagination a.last').show();
        }
    }

    function boardlist(url, page) {//로드함수, 페이징 누를때함수, 검색버튼 누를때함수 거의 비슷 통합~!
        $.ajax({
            "method": "GET",
            "transformRequest": [
                null
            ],
            "transformResponse": [
                null
            ],
            "jsonpCallbackParam": "callback",
            "url": url + page,
            "headers": {
                "Accept": "application/json, text/plain, */*"
            },
            "data": "",
            "timeout": {},
            "success": function (responseObj) {
                if (responseObj.status == 0) {
                    alert(responseObj.msg);
                    return false;
                }

                var $trObj = $('table.boardlist tr.list').first();//load랑 다른점: 숨겨있는 첫번째 껍데기 복사
                $('table.boardlist tr.list').not(":first").remove();//load랑 다른점: 이전 글목록 지우고
                $(responseObj.pb.list).each(function (i, e) {
                    var $copyObj = $trObj.clone();
                    var title = "";
                    for (let k = 2; k <= e.lvl; k++) {
                        if (k == 2) {
                            title += "└";
                            continue;
                        }
                        title += "─";
                    }
                    title += e.boardTitle;
                    var href = "/boardrestspring/board/" + e.boardNo;
                    $copyObj.find('td.boardNo').html(e.rn);
                    $copyObj.find('td.boardTitle a').text(title).prop("href", href);
                    $copyObj.find('td.boardCId').html(e.boardC.id);
                    $copyObj.find('td.boardDt').html(e.boardDt);
                    $copyObj.find('td.boardViewcount').html(e.boardViewcount);
                    $copyObj.show();
                    $trObj.parent().append($copyObj);

                });
                var cPage = responseObj.pb.currentPage;
                var tPage = responseObj.pb.totalPage;
                var sPage = responseObj.pb.startPage;
                var ePage = responseObj.pb.endPage;
                moveShow(cPage, tPage, sPage, ePage);
                $('div.pagination a.first').prop('href', url + '1');
                $('div.pagination a.prev').prop('href', url + (sPage - 1)); //숨겨서 0이여도 됨
                $('div.pagination a.next').prop('href', url + (ePage + 1));
                $('div.pagination a.last').prop('href', url + tPage);

                var aHtml = '';
                for (let k = sPage; k <= ePage; k++) {
                    aHtml += ' <a href="';
                    aHtml += url + k;  //'/boardrestspring/board/list2/단어/' + '1'
                    aHtml += '" class="num'

                    if (k == cPage) {
                        aHtml += ' active'
                    }
                    aHtml += '">'
                    aHtml += k;
                    aHtml += '</a>'
                }
                $('div.pagination a.num').remove();  //load랑 다른점: 숫자 지우고 다시 추가
                $('div.pagination a.prev').after(aHtml);
            }
        });
    };

    $(function () {
        var url = '/boardrestspring/board/list2/';
        var page = 1;
        boardlist(url, page);

        //제목검색, 제목+내용검색, 작성자검색 :  PageBean처럼 DTO(검색타입,검색어)만들어서 종합적으로 전달 후 동적SQL
        //index hidden에 저장했다가 다음페이지 눌렀을때 검색타입,검색어 저장해서 다시보냄
        $('form.search').submit(function () {
            var word = $('form.search input[name=word]').val();
            var url = '/boardrestspring/board/list2/' + word + '/';
            var page = 1;
            boardlist(url, page);
            return false;
        });

        //페이징 a 누를때
        $('div.pagination').on('click', 'a', function () {
            var href = $(this).attr('href');
            //href : AJAX요청에 사용
            //href = '/boardrestspring/board/list2/15
            //href = '/boardrestspring/board/list2/단어/15
            var lastIndex = href.lastIndexOf('/');
            var url = href.substring(0, lastIndex + 1);//처음부터 /까지
            var page = href.substring(lastIndex + 1);
            //url : 페이징 a태그 href에 사용 (aHtml+=)
            //url = '/boardrestspring/board/list2/';
            //url = '/boardrestspring/board/list2/단어/';
            boardlist(url, page);
            return false;

        });

        //게시글 제목누를때
        $('table.boardlist').on('click', 'tr.list a', function () {
            $.ajax({
                "method": "GET",
                "transformRequest": [null],
                "transformResponse": [null],
                "jsonpCallbackParam": "callback",
                "headers": {
                    "Accept": "application/json, text/plain, */*"
                },
                "data": "",
                "timeout": {},
                "url": $(this).attr("href"),
                "success": function (responseObj) {
                    if (responseObj.status == 0) {
                        alert(responseObj.msg);
                        return false;
                    } // responseObj.status == 1,2인경우 모두 원글 출력
                    $('section').load("./detail.html", function () {
                        $('table.detail').find('td.datailNo').text(responseObj.repBoard.boardNo);
                        $('#detailNo').text(responseObj.repBoard.boardNo);
                        $('#detailId').text(responseObj.repBoard.boardC.id);
                        $('#detailDt').text(responseObj.repBoard.boardDt);
                        $('#detailViewcount').text(responseObj.repBoard.boardViewcount);
                        $('#detailTitle').val(responseObj.repBoard.boardTitle);
                        $('#detailContent').val(responseObj.repBoard.boardContent);
                        //이미지 존재하지 않으면 imgFileName=0 존재하면 imgFileName=경로
                        if (responseObj.imgFileName != 0) {
                            $('table.detail tr.viewImg').show();
                            $('img#upImg').attr("src", '/boardrestspring/upload/' + responseObj.imgFileName);
                            $('input#imgname').val(responseObj.imgFileName);
                            $('button#downImg').val(responseObj.imgFileName);
                        }
                        //자식글이 있는경우만 자식글 출력
                        if (responseObj.status == 2) {
                            var divHtml = "";
                            $(responseObj.list).each(function (i, e) {
                                divHtml += '<div class="replylist">';
                                divHtml += '<button type="button" class="collapsible">';
                                divHtml += e.boardTitle;
                                divHtml += '</button>';
                                divHtml += '<div class="replycontent">';
                                divHtml += e.boardContent;
                                divHtml += '</div>';
                                divHtml += '</div>';
                            });
                            $('div.replyview').show().html(divHtml);
                        }
                    });
                }
            });
            return false;
        });
    });