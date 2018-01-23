(function() {
	var start = false;
	var stop = true;
	var index = 0;
	var timerID = 0;    
	//每一次重新开始都要将原来已经有的计时器给去除掉，重新开始
	//动态的向屏幕添加元素
	var Total = document.getElementById("totalbutton");
	for  (var i = 0; i < 60; i++) {
		/*
		以下的内容相当于HTML中的以下内容
		<div class = "radiobutton">
			<input id = "input0" class = "radiusbutton" type = "radio"/>
			<label class="labelradio" for = "input0" value = "0"> </label>  
		</div>
		*/
		var Div = document.createElement('div');
		Div.className = 'radiobutton';
		Div.value = String(i);
		var Input = document.createElement('input');
		Input.className = "radiusbutton";
		Input.type = 'radio';
		var Label = document.createElement('label');
		Label.className = 'labelradio';
		Label.value = String(i);
		Div.appendChild(Input);
		Div.appendChild(Label);
		Total.appendChild(Div);
	}

	//以下基本的事件处理函数；
	window.onload = function() {
			var start_ = document.getElementById("startbutton");
			var stop_ = document.getElementById("stopbutton");
			start_.addEventListener("click", Start);
			stop_.addEventListener("click", Stop);
	};

	Total.addEventListener('click', handleClick);
	function handleClick(event) {
		if (start) {
			var id = (event.target.value);
			if (id >= 0) {
				if (id == index) {
					var sco = Number(document.querySelector("#record2").innerText);
					//var label = document.getElementsByTagName('label')[id];
					// label.setAttribute("class", change1);
					var label2 = document.getElementsByClassName('labelradio')[id];
					label2.setAttribute("class",  "change1 labelradio");
					sco = sco + 1;
					document.querySelector("#record2").innerText = String(sco);
					//紧接着触发下一次事件
					event.stopPropagation();
					index = parseInt(60*Math.random());
					var label1 = document.getElementsByTagName('label')[index];
					label1.setAttribute("class", "change labelradio");
				}  else {
					event.stopPropagation();
					var sco = Number(document.querySelector("#record2").innerText);
					sco -= 1;
					document.querySelector("#record2").innerText = String(sco);
				}
			}
		}
	}

	function Start(event) {
		//刚开始的时候要复位，将所有状态恢复到最开始的时候
		if (timerID) {
			clearTimeout(timerID);
		}
		//将上一轮中可能被改变的元素置回到正确的状态
		var label = document.getElementsByTagName('label')[index];
		label.setAttribute("class", "change1 labelradio");
		//初始化基本的数据信息
		start = true;
		stop = false;
		document.querySelector("#record1").innerText = "30";
		document.querySelector("#record2").innerText = "0";
		document.querySelector("#output").innerText= "Playing";
		Timer();
		index = parseInt(60*Math.random());
		var label = document.getElementsByTagName('label')[index];
		label.setAttribute("class", "change labelradio");
		event.stopPropagation();
	}

	function Stop() {
		stop = true;
		start = false;
		document.querySelector("#output").innerText = "Game over";
		var str = String(document.querySelector("#record2").innerText);
		if (str == "")
			str = "0";
		var st = "Game Over.\nYour score is: " + str;
		var label = document.getElementsByTagName('label')[index];
		label.setAttribute("class", "change1 labelradio");
		alert(st);
		clearTimeout(timerID);
		Total.removeEventListener('click', handleClick);
	}

	function Timer() {
		//设置计时器，如果是开始按钮则打开计时器如果是关闭按钮则结束计时；
		if (start) {
			if (document.querySelector("#record1").innerText == "") {
				document.querySelector("#record1").innerText = "30";
			}
			var oldtimer = timerID;
			if (oldtimer)
				clearTimeout(oldtimer);
			timerID = setTimeout(Count_down, 1000);
		}
	}

	function Count_down() {
		var num = Number(document.querySelector("#record1").innerText);
		if (!num) {
			Stop();
		} else if (num && !stop) {
			num -= 1;
			document.querySelector("#record1").innerText = String(num);
			var oldtimer = timerID;
			clearTimeout(oldtimer);
			timerID = setTimeout(Count_down, 1000);
		}
	}

})();