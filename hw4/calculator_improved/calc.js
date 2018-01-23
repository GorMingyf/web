(function() {
	//这个的作用是将不同的函数给分离开来

	var computed = 0;
	var initial = true;
	var out = document.querySelector("#output_field").value = "0";

	window.onload = function() {
		var totalbutton = document.getElementsByClassName("button")[0];
		totalbutton.addEventListener("click", handleBtnClick);
	};

	function handleBtnClick(event) {
		var element = event.target;
		var text = element.value;
		switch (text) {
			case "CE":
				Reset();
				break;
			case "<-" :
				Back();
				break;
			case "=":
				Calculate();
				break;
			default:
				Click(text);
				break;
		}
	}

	function Reset() {
		initial = true;
		var output1 = document.querySelector("#output_field");
		var output2 = document.querySelector("#upoutput_field");
		var error = document.querySelector("#error");
		output1.value = "0";
		output2.value = "";
		error.value = "";
	}

	function Back() {
		var output1 = document.querySelector("#output_field");
		var len = (output1.value).length;
		if (output1.value == "Wrong Input!" || output1.value == "NaN") {
			output1.value = "0";
		} else {
			output1.value = (output1.value).substring(0, len - 1);
		}
		len = (output1.value).length;
		if (len == 0) {
			output1.value = "0";
		}
	}

	function Click(text) {
		if (computed) {
			if (isOperator(text)) {
				document.querySelector("#output_field").value += text;
				computed = false;
			} else {
				Reset();
				Input(text);
			}
		} else {
			Input(text);
		}
	}

	function OperatorRepall(text) {
		return text === "+" || text === "-";
	}

	function isOperator(text) {
		return text === "+" || text === "-" || text === "*" || text === "/";
	}

	function OperatorRepl(text) {
		return text === "*" || text === "/";
	}

	function OperatorRep(text) {
		return text === "+" || text === "*" || text === "/";
	}

	function Input(text) {
		if (document.querySelector("#output_field").value == "Wrong Input!" ||
			document.querySelector("#output_field").value == "NaN") {
			document.querySelector("#output_field").value = text;
			document.querySelector("#upoutput_field").value = "";
		} else {
			if (initial && text == "0") {
				return;
			} else if (initial && text !== "0") {
				if (text === "." || isOperator(text)) {
					document.querySelector("#output_field").value += text;
				} else {
					document.querySelector("#output_field").value = text;
				}
				initial = false;
			} else {
				//这里要对操作符做特殊的处理
				var temp = document.querySelector("#output_field").value;
				var len = temp.length;
				var foretext = temp[len - 1];
				if (OperatorRepall(foretext) && isOperator(text)) {
					//前面是+ - 操作符，再次输入操作符的时候需要更换掉原来的操作符
					temp = temp.substring(0, len - 1);
					temp += text;
					document.querySelector("#output_field").value = temp;
				} else if (OperatorRepl(foretext) && OperatorRep(text)) {
					//前面是* / ,则遇到* / +替换
					temp = temp.substring(0, len - 1);
					temp += text;
					document.querySelector("#output_field").value = temp;
				} else {
					if (text == ".") {
						//不允许1.2.3这样形式的数字输入进去
						var str = document.querySelector("#output_field").value;
						var dot = true;
						for (var i = str.length - 1; i >= 0; i--) {
							if (isNumber(str[i])) {
								i += 0;
							} else if (str[i] == ".") {
								dot = false;
								break;
							} else { break;}
						}
						if (dot) {
							document.querySelector("#output_field").value += text;
						}
					} else {
						document.querySelector("#output_field").value += text;
					}
				}
			}
		}
	}
	
	function Calculate() {
		if (!computed) {
			var expression = document.querySelector("#output_field").value;
			var expression1 = expression;
			expression = ChangeStrToNode(expression);
			expression = InFixToPostFix(expression);
			expression = PostFixCompute(expression);
			document.querySelector("#output_field").value = expression;
			document.querySelector("#upoutput_field").value = expression1 + " = ";
		}
	}

	function isNumber(num) {
		var regExp = /^-?\d+\.?\d*$/
		return regExp.test(num);
	}

	function ChangeStrToNode(text) {
		//在将中缀表达式转化为后缀表达式之前先将字符串转化为字符数组，
		//并进行一些表达式规范检查
		//使用正则表达式匹配简直太强大了
		var reg = /(\+|\-|\*|\/|\(|\))/;
		text = text.split(reg).filter(item => item !== "");
		var que = new Array();
		var pos = -1;
		for (var i = 0; i < text.length - 1; i++) {
			//这里要处理* / 后面直接跟负号的情况，如6*-8等
			var flag = false;
			if (isNumber(Number(text[i + 1])) && (OperatorRepl(String(text[i - 1])) || String(text[i - 1]) == "("))
				flag = true;
			if (text[i] == "-" && flag) {
				que.push(-Number(text[i + 1]));
				i = i + 1;
				pos = i;
			} else {
				que.push(text[i]);
			}
		}
		if (pos != text.length - 1) {
			if (!isOperator(text[text.length - 1]))
				que.push(text[text.length - 1]);
		}
		return que;
	}

	function getWeight(item) {
		switch(item) {
			case "+":
				return 1;
			case "-":
				return 1;
			case "*":
				return 2;
			case "/":
				return 2;
			default:
				return 0;
		}
	}

	function CompareWeight(item1, item2) {
		if (getWeight(item1) >= getWeight(item2))
			return true;
		return false;
	}

	function InFixToPostFix(que) {
		//（1）遇到的是操作数则直接输出；
		//（2）遇到左括号直接入栈；
		//（3）遇到右括号，将栈元素弹出，直到遇到左括号，并且将左括号弹出，但是左括号不入队列
		//（4）遇到操作符则将栈元素弹出直到栈顶元素的优先级低于当前元素，或者栈顶元素是（
		//（5）到了输入的末尾则直接将栈元素弹出
		var temp;
		var temp1;
		var sta = new Array();
		var que1 = new Array();
		var comp = true;
		var flag = true;
		while (que.length) {
			temp = que.shift();
			if (isNumber(temp)) {
				que1.push(temp);
				//alert(temp);
				//遇到操作数直接输出
			} else if (temp == "(" || isOperator(temp)) {
				if (temp == "(") {
					sta.push(temp);
				} else {
					//处理操作符的情况
					temp1 = sta[sta.length - 1];
					while (CompareWeight(temp1, temp) && sta.length > 0) {
						que1.push(temp1);
						sta.pop();
						temp1 = sta[sta.length - 1];
					}
					sta.push(temp);
				}
				//alert(temp);
			} else if (temp == ")") {
				//将遇到的左括号前的元素全部弹出，并且将左括号也弹出
				while (sta.length) {
					temp1 = sta.pop();
					if (temp1 == "(") {
						flag = true;
						break;
					} else {
						que1.push(temp1);
					}
				}
			}
		}

		while(sta.length) {
			temp = sta.pop();
			if (temp == "(" || temp == ")")
				flag = false;
			else
				que1.push(temp);
		}
		var ne = new Array();
		if (flag == false)
			return ne;
		return que1;
	}

	function Add(item1, item2) {
    //为了避免浮点数的运算的精度问题，可以将浮点数转化为整数
    //计算完成周再将整数转化为浮点数
    //alert(item1);
    var max = 0;
    var len1 = String(item1).length;
    var len2 = String(item2).length;
    var num1 = String(item1).split(".")[1];
    var num2 = String(item2).split(".")[1];
    var len1_ = String(num1).length;
    var len2_ = String(num2).length;
    max = Math.max(len1, len2);
    item1 *= Math.pow(10, max);
    item2 *= Math.pow(10, max);
    item1 += item2;
    item1 /= Math.pow(10, max);
    return item1;
}

	function Subtraction(item1, item2) {
		var max = 0;
    var len1 = String(item1).length;
    var len2 = String(item2).length;
    var num1 = String(item1).split(".")[1];
    var num2 = String(item2).split(".")[1];
    var len1_ = String(num1).length;
    var len2_ = String(num2).length;
    max = Math.max(len1, len2);
    item1 *= Math.pow(10, max);
    item2 *= Math.pow(10, max);
    item1 = item2 - item1;
    item1 /= Math.pow(10, max);
    return item1;
	}

	function Multiply(item1, item2) {
		var max = 0;
    var len1 = String(item1).length;
    var len2 = String(item2).length;
    var num1 = String(item1).split(".")[1];
    var num2 = String(item2).split(".")[1];
    var len1_ = String(num1).length;
    var len2_ = String(num2).length;
    max = Math.max(len1, len2);
    item1 *= Math.pow(10, max);
    item2 *= Math.pow(10, max);
    item1 *= item2;
    item1 /= Math.pow(10, max + max);
    return item1;
	}

	function Divide(item1, item2) {
		if (Number(item1) == 0)
			return NaN;
		var max = 0;
	  var len1 = String(item1).length;
    var len2 = String(item2).length;
    var num1 = String(item1).split(".")[1];
    var num2 = String(item2).split(".")[1];
    var len1_ = String(num1).length;
    var len2_ = String(num2).length;
    max = Math.max(len1, len2);
    item1 *= Math.pow(10, max);
    item2 *= Math.pow(10, max);
    item1 = item2 / item1;
    return item1;
	}

	function PostFixCompute(que) {
		//在计算后缀表达式的时候遇到操作数则入栈，遇到操作符则将操作数
		//弹出栈并完成运算
		if (que.length == 0) {
			return "Wrong Input!"
		}
		var sta = new Array();
		var temp;
		flag = true;
		var num1 = 0;
		var num2 = 0;
		var nan = false;
		while (que.length && flag) {
			temp = que.shift();
			if (isNumber(temp)) {
				sta.push(temp);
			} else if (isOperator(temp)) {
				if (sta.length < 2) {
					flag = false;
					//alert("leng < 2");
				} else {
					num1 = sta.pop();
					num2 = sta.pop();
					switch(temp) {
						case "+":
							sta.push(Add(num1, num2));
							break;
						case "-":
							sta.push(Subtraction(num1, num2));
							break;
						case "*":
							sta.push(Multiply(num1, num2));
							break;
						default:
							var number = Divide(num1, num2);
							if (String(number) != "NaN") {
								sta.push(number);
							} else {
								flag = false;
								nan = true;
							}
					}	
				}
			} else {
				flag = false;
			}
		}
		if (nan == true) {
			return "NaN";
		} else if (flag == false) {
			return "Wrong Input!";
		} else {
			return sta.pop();
		}
	}

})();