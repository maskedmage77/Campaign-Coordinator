
    var contentView = document.getElementById("contentView");

    function sparkleDiv() {
        var sparkleDiv = document.createElement("div");
        var size1 = Math.random();
        var size = size1 * 0.2 + "em";
        sparkleDiv.style.borderRadius = size1 * 0.25 + "em";
        sparkleDiv.style.width =  size;
        sparkleDiv.style.height = size;

        var genTime = Math.random();

        sparkleDiv.innerHTML = "";
        sparkleDiv.style.background = "white";
        sparkleDiv.style.boxShadow = "0px 0px 10px 1px white, 0px 0px 1px 1px white";
        sparkleDiv.style.position = "absolute";
        sparkleDiv.style.top = Math.random() * 50 + 'px'
        sparkleDiv.style.left = Math.random() * 100 + 'vw';
        sparkleDiv.style.zIndex = "-1";
        document.body.insertBefore(sparkleDiv, contentView);

        sparkleDiv.animate([
            { transform: 'translate(0, 100rem)'}
        ], {
              duration: 30000,
              iterations: Infinity
        });


        sparkleDiv.style.opacity = Math.random() * 100 + '%';


        setTimeout(function(){ sparkleDiv.remove(); }, 30000
        )

    }

    window.setInterval(function(){
      sparkleDiv();
  }, 80);
