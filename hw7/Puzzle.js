(function() {
	var imgA = document.getElementById("imgArea");
	var start = false;
	var Blank = document.getElementById('image15');
	var Start_ = document.getElementById("restart");
	Start_.addEventListener("click", Start);
	imgA.addEventListener("click", handleClick);
	for (var i = 0; i < 16; i++) {
		//动态的创建16个元素出来
		var Div = document.createElement('div');
		Div.className = "image-panada " + "pos" + String(i) + " Find";
		Div.id = "image" + String(i);
		if (i == 15) {
			Div.className = "blank" + " Find";
		}
		//Div.addEventListener("click", handleClick);
		imgA.appendChild(Div);
	}
	
	function getRandom(n) {
		var output = new Array();
		var claculate = function(n) {
			return Math.floor(Math.random() * n);
		}
		for (var i = 0; i < n; i++) {
			var order = claculate(n);
			if (output.length > 0) {
				while (jQuery.inArray(order, output) > -1) {
					order = claculate(n);
				}
			}
			output.push(order);
		}
		return output;
	}

	function isValid() {
		//要保证大乱的图片是能够恢复到初始界面的
		//验证算法的参考链接如下所示
		//http://blog.csdn.net/mindhawk/article/details/1445013
		var Total = document.getElementsByClassName("Find");
		var num = 0;
		var num1 = 0;
		var pos1 = 0;
		var pos2 = 0;
		for (var i = 0; i < 15; i++) {
			num = 0;
			pos1 = Number(Total[i].id.substr(5));
			for (var j = i + 1; j < 15; j++) {
				pos2 = Number(Total[j].id.substr(5));
				if (pos2 < pos1) {
					num++;
				}
			}
			num1 += num;
		}
		if (num1 % 2 == 0)
			return true;
		return false;
	}

	function Start() {
		start = true;
		document.querySelector("#state").innerText = "The Game is goning on";
		var out = getRandom(15);
		var clsName = new Array();
		var clsId = new Array();
		var temp;
		var Total = document.getElementsByClassName("Find");
		for (var i = 0; i < 15; i++) {
			temp = document.getElementById('image' + String(out[i]));
			clsName.push(temp.className);
			clsId.push(temp.id);
		}
		for (var i = 0; i < 15; i++) {
			temp = Total[i];
			temp.className = clsName[i];
			temp.id = clsId[i];
		}

		while (!isValid()) {
			//无论如何要保证在最开始的状态下函数是能够复原的,经过测试可以证明所有初始化的只要操作正确都是可以恢复到原来的图片的
			Start();
		}
	}
	function handleClick(event) {
		//移动图片的位置
		if (start) {
			var clicked = event.target;
			var testpos = 0;
			var posx = clicked.offsetTop - imgA.offsetTop;
			var posy = clicked.offsetLeft - imgA.offsetLeft;
			var find = false;
			posx /= 95;
			posy /= 95;
			testpos = posx * 4 + posy + 0.2;   //计算出当前被点击的元素在框图中的位置
			testpos = parseInt(String(testpos));
			var Total = document.getElementsByClassName("Find");
			var str;
			for (var i = 0; i < 16; i++)
				str += Total[i].id + ' ';
			if (testpos % 4 != 0) {
				//left 只要下标不能被4整除，那么都可以寻找当前元素的左边
				var exchange = Total[testpos - 1];
				if (exchange.id == 'image15') {
					find = true;
				}
			}
			if (!find && testpos >= 4) {
				//top 下标大于4的都可以寻找当前元素的上边
				var exchange = Total[testpos - 4];
				if (exchange.id == 'image15') {
					find = true;
				}
			}
			if (!find && testpos % 4 != 3) {
				//right 下标不是3,7,11,15的都可以寻找右边
				var exchange = Total[testpos + 1];
				if (exchange.id == 'image15') {
					find = true;
				}
			}
			if (!find && testpos < 12) {
				//bottom
				var exchange = Total[testpos + 4];
				if (exchange.id == 'image15') {
					find = true;
				}
			}
			if (find) {
				//alert(find);
				var str = clicked.className;
				var id = clicked.id;
				clicked.className = exchange.className;
				clicked.id = exchange.id;
				exchange.className = str;
				exchange.id = id;
			}

			if (isGameOver()) {
				start = false;
				document.querySelector("#state").innerText = "You Win";
			}
		}
	}

	function isGameOver() {
		var testid = 0;
		var Total = document.getElementsByClassName("Find");
		for (var i = 0; i < 15; i++) {
			testid = Number(Total[i].id.substr(5));
			if (testid != i)
			return false;
		}
		return true;
	}
})();
	