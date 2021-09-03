 $(function () {
        var $tableObj = $('table.boardlist');
        var url = '/boardrestspring/board/list';
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
            "url": url,
            "success": function (responseObj) {
                if (responseObj.status == 0) {
                    alert(responseObj.msg);
                    return false;
                }
                var $trObj = $('table.boardlist tr.list');
                $(responseObj.list).each(function (i, e) {
                    var $copyObj = $trObj.clone();
                    var no = "";
                    var title = "";
                    for (let k = 2; k <= e.level; k++) {
                        if (k == 2) {
                            no += "└";
                            title += "　";
                            continue;
                        }
                        no += "─";
                        title += "　";
                    }
                    no += e.boardNo;
                    title += e.boardTitle;
                    var herf = "/boardrestspring/board/" + e.boardNo;
                    $copyObj.find('td.boardNo').html(no);
                    $copyObj.find('td.boardTitle a').text(title);
                    $copyObj.find('td.boardTitle a').prop("href", herf);
                    $copyObj.find('td.boardCId').html(e.boardC.id);
                    $copyObj.find('td.boardDt').html(e.boardDt);
                    $copyObj.find('td.boardViewcount').html(e.boardViewcount);
                    $copyObj.show();
                    $trObj.parent().append($copyObj);
                });
            }
        });
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
                    } else if (responseObj.status == 1) { //자식글이 없는경우
                        $('section').load("./detail.html", function () {
                            $('table.detail').find('td.datailNo').text(responseObj.repBoard.boardNo);
                            $('#detailNo').text(responseObj.repBoard.boardNo);
                            $('#detailId').text(responseObj.repBoard.boardC.id);
                            $('#detailDt').text(responseObj.repBoard.boardDt);
                            $('#detailViewcount').text(responseObj.repBoard.boardViewcount);
                            $('#detailTitle').val(responseObj.repBoard.boardTitle);
                            $('#detailContent').val(responseObj.repBoard.boardContent);
                        });
                    } else {//responseObj.status == 2 //자식글이 있는경우
                        $('section').load("./detail.html", function () {
                            $('table.detail').find('td.datailNo').text(responseObj.repBoard.boardNo);
                            $('#detailNo').text(responseObj.repBoard.boardNo);
                            $('#detailId').text(responseObj.repBoard.boardC.id);
                            $('#detailDt').text(responseObj.repBoard.boardDt);
                            $('#detailViewcount').text(responseObj.repBoard.boardViewcount);
                            $('#detailTitle').val(responseObj.repBoard.boardTitle);
                            $('#detailContent').val(responseObj.repBoard.boardContent);
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
                            console.log(divHtml);
                            $('div.replyview').show().html(divHtml);
                        });
                    }
                }
            });
            return false;
        });

        $('form.search').submit(function () {
            var word = $('form.search input[name=word]').val();
            console.log(word);
            $.ajax({
                "method": "GET",
                "transformRequest": [
                    null
                ],
                "transformResponse": [
                    null
                ],
                "jsonpCallbackParam": "callback",
                "url": "/boardrestspring/board/list/" + word,
                "headers": {
                    "Accept": "application/json, text/plain, */*"
                },
                "data": "",
                "timeout": {},
                "success": function (responseObj) {
                    if (responseObj.status == 1) {
                        var $trObj = $('table.boardlist tr.list').first();
                        $('table.boardlist tr.list').not(":first").remove();
                        $(responseObj.list).each(function (i, e) {
                            var $copyObj = $trObj.clone();
                            var href = "/boardrestspring/board/" + e.boardNo;
                            $copyObj.find('td.boardNo').html(e.boardNo);
                            $copyObj.find('td.boardTitle a').text(e.boardTitle);
                            $copyObj.find('td.boardTitle a').prop("href", href);
                            $copyObj.find('td.boardCId').html(e.boardC.id);
                            $copyObj.find('td.boardDt').html(e.boardDt);
                            $copyObj.find('td.boardViewcount').html(e.boardViewcount);
                            $copyObj.show();
                            $trObj.parent().append($copyObj);
                        });

                    } else {//if(responseObj.status == 0)){
                        alert(responseObj.msg);
                    }
                }
            });
            return false;

        });
    });