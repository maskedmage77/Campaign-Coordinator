
    var contentView = document.getElementById("contentView");

    function sparkleDiv() {
        var sparkleDiv = document.createElement("div");
        var size1 = Math.random();
        var size = size1 * 0.4 + "em";
        sparkleDiv.style.borderRadius = size1 * 0.25 + "em";
        sparkleDiv.style.width =  size;
        sparkleDiv.style.height = size;

        var genTime = Math.random();
        if (genTime >= 0 && genTime < 0.5) {
            sparkleDiv.style.background = "yellow";
            sparkleDiv.style.boxShadow = "0px 0px 10px 3px yellow, 0px 0px 3px 1px yellow";
        }
        else if  (genTime >= 0.5 && genTime < 0.75) {
            sparkleDiv.style.background = "tomato";
            sparkleDiv.style.boxShadow = "0px 0px 10px 3px tomato, 0px 0px 3px 1px tomato";
        }
        else {
            sparkleDiv.style.background = "orange";
            sparkleDiv.style.boxShadow = "0px 0px 10px 3px orange, 0px 0px 3px 1px orange";
        }


        sparkleDiv.innerHTML = "";

        sparkleDiv.style.position = "absolute";
        sparkleDiv.style.top = Math.random() * 50 + 'px'
        sparkleDiv.style.left = Math.random() * 100 + 'vw';
        sparkleDiv.style.zIndex = "-1";
        document.body.insertBefore(sparkleDiv, contentView);

        sparkleDiv.animate([
            { transform: 'translate(0, 100vh)'}
        ], {
              duration: 10000,
              iterations: Infinity
        });

        var oppTime = Math.random() * 10000;

        sparkleDiv.animate([
            { filter: 'opacity(0%)'}
        ], {
              duration: oppTime

        });
        setTimeout(function(){ sparkleDiv.remove(); }, oppTime - 10
        )

    }

    window.setInterval(function(){
      sparkleDiv();
  }, 10);
