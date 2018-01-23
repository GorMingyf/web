(function() {
	var start = false;
	var flag = false;
	var alreadyend = false;
	var timerId = 0;
	window.onload = function() {
		//这个函数控制对全体会变颜色的墙壁的颜色改变
		var total = document.getElementById("changeColor");
		var total_ = document.getElementById("changeColorDown");
		total.addEventListener("mouseover", ChangeColor);
		total.addEventListener("mouseout", ResetColor);
		total_.addEventListener("mouseover", ChangeColor);
		total_.addEventListener("mouseout", ResetColor);
	};

	//以下是对不能统一处理的函数的基本处理
	var Start = document.querySelector("#start");
	var Flag = document.querySelector("#flag");
	var End = document.querySelector("#end");
	Start.addEventListener("mouseover", function() {
		Reset();
		start = true;
	});

	Flag.addEventListener("mouseover", function() {
		flag = true;
	});

	End.addEventListener("mouseover", function() {
		if (start && flag) {
			var str = "You Win";
			document.querySelector("#output").innerText = str;
			GameOver();
		} else if ((start == false || flag == false) && alreadyend == false) {
			var str =  "Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!";
			document.querySelector("#output").innerText = str;
			GameOver();
		}
	});
	
	function ChangeColor(obj) {
		if (start == true) {
			obj.target.setAttribute("class", "change");
			var str = "You Lose";
			document.querySelector("#output").innerText = str;
			GameOver();
		}
	}

	function ResetColor(obj) {
		obj.target.setAttribute("class", "");
	}

	function Reset() {
		start = false;
		flag = false;
		alreadyend = false;
		document.querySelector("#output").innerText = "";
	}

	function GameOver() {
		start = false;
		flag = false;
		alreadyend = true;
	}
})();