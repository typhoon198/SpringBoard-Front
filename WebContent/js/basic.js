var backContextPath = '/boardrestspring';
var frontContextPath = '/boardrestfront';

        window.onscroll = function () { myFunction() };

        var navbar = document.getElementById("navbar");
        var sticky = navbar.offsetTop;

        function myFunction() {
            if (window.pageYOffset >= sticky) {
                navbar.classList.add("sticky")
            } else {
                navbar.classList.remove("sticky");
            }
        }
        
        
  const cntPerPageGroup = 5;

        function logined() {
            $('#navbar>div>a.signup').hide();
            $('#navbar>div>a.login').hide();
            $('#navbar>div>a.mypage').show();
            $('#navbar>div>a.logout').show();
        }
        function logouted() {
            $('#navbar>div>a.signup').show();
            $('#navbar>div>a.login').show();
            $('#navbar>div>a.mypage').hide();
            $('#navbar>div>a.logout').hide();
        }
        function checkLogined() {
            var url = '/boardrestspring/checklogined';
            $.ajax({
                url: url,
                success: function (responseObj) {
                    if (responseObj.status == 1) {
                        logined();
                    } else {
                        logouted();
                    }
                },
            });
        }
        function checkIntervalLogined() {
            window.setInterval(checkLogined, 1000 * 10);
        }
        $(function () {
            checkLogined();
            $('nav a').not(':first').not('a.logout').click(function () {
                var href = $(this).attr('href');
                $('section').load(href);
                return false;
            });

            $('#navbar>div>a.logout').click(function () {
                var url = $(this).attr('href');
                $.ajax({
                    url: url,
                    success: function () {
                        logouted();
                        location.href = './index.html';

                    },
                });
                return false;
            });

        });