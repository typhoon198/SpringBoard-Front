    $(function () {
        $('button.reply').click(function () {
            $('button.hide').hide();
            $('div.reply').show();
            $('form.reply input[name=boardTitle]').focus();
            
        });
        $('button.remove').click(function () {
            $('button.hide').hide();
            $('button.delete').show();
        });
        $('button.modify').click(function () {
            $('button.hide').hide();
            $('button.put').show();
            $('table.detail tr.viewImg').hide();
            // $('input#detailTitle').attr("disabled", true);
            $('#detailContent').prop("readonly", false);
            $('#detailContent').focus();
        });

        $("div.reply>form.reply").submit(function () {
            var no = $('td#detailNo').text();
            var formData = new FormData($(this)[0]);
            $.ajax({
                url: "/boardrestspring/board/reply/" + no,
                method: "post",
                processData: false,
                contentType: false,
                data: formData,
                success: function (responseObj) {
                    if (responseObj.status == 1) {
                        alert('글쓰기 성공');
                        //$('#navbar > a.board2').trigger('click');
                    } else {//if(responseObj.status == 0)){
                        alert(responseObj.msg);
                    }
                }, error: function (jqXHR) {
                    alert("에러:" + jqXHR.status);
                }
            });
            return false;
        });

        $("button.put").click(function () {
            var no = $('td#detailNo').text();
		var object = {};
        object["boardNo"] = no;
        object["boardContent"] =$('#detailContent').val();
        var data = JSON.stringify(object);
            //var title = $('#detailTitle').val();
            //제목도 수정가능하게 쿼리수정!
            $.ajax({
                "method": "PUT",
                "transformRequest": [null],
                "transformResponse": [null],
                "jsonpCallbackParam": "callback",
                "url": "/boardrestspring/board/" + no,
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json;charset=utf-8"
                },
                "data": data,
                "timeout": {},
                success: function (responseObj) {
                    if (responseObj.status == 1) {
                        alert('수정성공');
                        $('#navbar > a.board2').trigger('click');
                    } else {//if(responseObj.status == 0)){
                        alert(responseObj.msg);
                    }
                }
            });
        });

        $('button.delete').click(function () {
            var no = $('td#detailNo').text();
            $.ajax({
                "method": "DELETE",
                "transformRequest": [
                    null
                ],
                "transformResponse": [
                    null
                ],
                "jsonpCallbackParam": "callback",
                "url": "/boardrestspring/board/" + no,
                "headers": {
                    "Accept": "application/json, text/plain, */*"
                },
                "data": "",
                "timeout": {},
                success: function (responseObj) {
                    if (responseObj.status == 1) {
                        alert('삭제성공');
                        $('#navbar > a.board2').trigger('click');
                    } else {//if(responseObj.status == 0)){
                        alert(responseObj.msg);
                    }
                }
            });

        });
       // $('button#downImg').click(function () {//Ajax는 (버튼)클라이언트 컴퓨터에 자원에 접근 불가능
            // var encFileName = encodeURI($(this).val());
            // console.log($(this).val());
            // $.ajax({
            //     method: 'GET',
            //     url: '/boardrestspring/download',
            //     data: { name: $(this).val() },
            //     success: function (responseObj) {
            //         //window.location = "/boardrestspring/download/?name=" + encFileName;
            //         console.log("다운로드성공");
            //         // console.log(responseObj);
            //     }
            // });
            //var $a = $('a');
            //$a.prop('href');
            //$a.get(0).click;
        //    return false;
       // });

        var coll = document.getElementsByClassName("collapsible");
        var i;
        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    });