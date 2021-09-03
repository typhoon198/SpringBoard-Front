$(function () {
    // $('input.write').click(function () {
    //     var formSerializeArray = $('form.write').serializeArray();
    //     var object = {};
    //     for (var i = 0; i < formSerializeArray.length; i++) {
    //         object[formSerializeArray[i]['name']] = formSerializeArray[i]['value'];
    //     }
    //     var data = JSON.stringify(object);
    //     $.ajax({
    //         "method": "POST",
    //         "transformRequest": [null],
    //         "transformResponse": [null],
    //         "jsonpCallbackParam": "callback",
    //         "url": "/boardrestspring/board/write",
    //         "headers": {
    //             "Accept": "application/json, text/plain, */*",
    //             "Content-Type": "application/json;charset=utf-8"
    //         },
    //         "data": data,
    //         "timeout": {},
    //         "success": function (responseObj) {
    //             if (responseObj.status == 1) {
    //                 alert('글쓰기 성공');
    //             } else {//if(responseObj.status == 0)){
    //                 alert(responseObj.msg);
    //             }
    //         }
    //     });

    // });
    $("div.write>form.write").submit(function () {
        var formData = new FormData($(this)[0]);
        $.ajax({
            url: "/boardrestspring/board/write",
            method: "post",
            processData: false,
            contentType: false,
            data: formData,
            success: function (responseObj) {
                if (responseObj.status == 1) {
                    alert('글쓰기 성공');
                    $('#navbar > a.board2').trigger('click');

                } else {//if(responseObj.status == 0)){
                    alert(responseObj.msg);
                }
            }, error: function (jqXHR) {
                alert("에러:" + jqXHR.status);
            }
        });
        return false;
    });
});