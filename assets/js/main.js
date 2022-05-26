$(function () {
            var selectedClass = "";
            $("p").click(function () {
                selectedClass = $(this).attr("data-rel");
                $("#portfolio").fadeTo(50, 0.1);
                $("#portfolio div").not("." + selectedClass).fadeOut();
                setTimeout(function () {
                    $("." + selectedClass).fadeIn();
                    $("#portfolio").fadeTo(50, 1);
                }, 500);

            });
        });

        function openNav() {
            document.getElementById("myNav").style.width = "100%";
        }
        
        function closeNav() {
            document.getElementById("myNav").style.width = "0%";
        }
        
        function myFunction(imgs) {
            var expandImg = document.getElementById("expandedImg");
            var imgText = document.getElementById("imgtext");
            expandImg.src = imgs.src;
            //imgText.innerHTML = imgs.alt;
            expandImg.parentElement.style.display = "block";
        }
        