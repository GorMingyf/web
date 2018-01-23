(function() {
  var initial = true;
  var calcutated = false;

  window.onload = function() {
    var wrapper = document.getElementsByClassName("btn-wrapper")[0];
    wrapper.addEventListener("click", handleBtnClick);
  };

  function handleBtnClick(event) {
    var element = event.target;
    var text = element.innerText;
    switch (text) {
      case "CE":
        reset();
        break;
      case "<":
        back();
        break;
      case "=":
        calculate();
        break;
      default:
        click(text);
        break;
    }
  }

  function reset() {
    document.querySelector(".display span").innerText = "0";
    initial = true;
    calcutated = false;
  }

  function back() {
    var context = document.querySelector(".display span").innerText;
    var len = context.length;
    if (initial) {
      return;
    } else if (len === 1) {
      reset();
    } else {
      document.querySelector(".display span").innerText = context.slice(
        0,
        len - 1
      );
    }
  }

  function calculate() {
    var expression = document.querySelector(".display span").innerText;
    var result;
    try {
      result = getResult(expression);
      // result = eval(expression);
      document.querySelector(".display span").innerText = result;
      calcutated = true;
    } catch (e) {
      reset();
      alert(e);
    }
  }

  function click(text) {
    if (calcutated) {
      if (isOperator(text)) {
        document.querySelector(".display span").innerText += text;
        calcutated = false;
      } else {
        reset();
        input(text);
      }
    } else {
      input(text);
    }
  }

  function input(text) {
    if (initial && text === "0") {
      return;
    } else if (initial && text !== "0") {
      if (text === "." || isOperator(text)) {
        document.querySelector(".display span").innerText += text;
      } else {
        document.querySelector(".display span").innerText = text;
      }
      initial = false;
    } else {
      document.querySelector(".display span").innerText += text;
    }
  }
 
  function isOperator(text) {
    return text === "+" || text === "-" || text === "*" || text === "/";
  }

  function isNumber(num) {
    var reg = /^-?\d+\.?\d*$/;
    return reg.test(num);
  }

  function getWeight(item) {
    switch (item) {
      case "*":
        return 2;
      case "/":
        return 2;
      case "+":
        return 1;
      case "-":
        return 1;
      default:
        return 0;
    }
  }

  function compareWeight(item1, item2) {
    return getWeight(item1) >= getWeight(item2);
  }

  function getRPN(expression) {
    var reg = /(\+|\-|\*|\/|\(|\))/;
    var expArr = expression.split(reg).filter(item => item !== "");
    var output = [];
    var stack = [];
    for (var i = 0; i < expArr.length; i++) {
      var item = expArr[i];
      if (isNumber(item)) output.push(item);
      if (isOperator(item) || item === "(") {
        if (item === "(") {
          stack.push(item);
        } else {
          var top = stack[stack.length - 1];
          while (compareWeight(top, item) && stack.length > 0) {
            output.push(top);
            stack.pop();
            top = stack[stack.length - 1];
          }
          stack.push(item);
        }
      } else if (item === ")") {
        while (true) {
          if (stack.length === 0) {
            throw new Error("错误的表达式");
            break;
          }
          var top = stack[stack.length - 1];
          stack.pop();
          if (top !== "(") {
            output.push(top);
          } else {
            break;
          }
        }
      }
    }
    while (stack.length > 0) {
      output.push(stack[stack.length - 1]);
      stack.pop();
    }
    return output;
  }

  function getResult(input) {
    var arr = getRPN(input);
    var stack = [];
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (isNumber(item)) {
        stack.push(Number(item));
      } else {
        switch (item) {
          case "+":
            var num1 = stack[stack.length - 1];
            stack.pop();
            var num2 = stack[stack.length - 1];
            stack.pop();
            stack.push(add(num1, num2));
            break;
          case "-":
            var num1 = stack[stack.length - 1];
            stack.pop();
            if (stack.length === 0) {
              num1 = -num1;
              stack.push(num1);
            } else {
              var num2 = stack[stack.length - 1];
              stack.pop();
              stack.push(sub(num2, num1));
            }
            break;
          case "*":
            var num1 = stack[stack.length - 1];
            stack.pop();
            var num2 = stack[stack.length - 1];
            stack.pop();
            stack.push(times(num1, num2));
            break;
          case "/":
            var num1 = stack[stack.length - 1];
            stack.pop();
            var num2 = stack[stack.length - 1];
            stack.pop();
            stack.push(div(num2, num1));
            break;
        }
      }
    }
    return stack[0];
  }

  function add(num1, num2) {
    var len1;
    try {
      len1 = num1.toString().split(".")[1].length;
    } catch (e) {
      len1 = 0;
    }
    var len2;
    try {
      len2 = num2.toString().split(".")[1].length;
    } catch (e) {
      len2 = 0;
    }
    var diff = Math.abs(len1 - len2);
    var power = Math.pow(10, Math.max(len1, len2));
    if (diff === 0) {
      num1 = Number(num1.toString().replace(".", ""));
      num2 = Number(num2.toString().replace(".", ""));
    } else {
      var cm = Math.pow(10, diff);
      if (len1 > len2) {
        num1 = Number(num1.toString().replace(".", ""));
        num2 = Number(num2.toString().replace(".", "")) * cm;
      } else {
        num1 = Number(num1.toString().replace(".", "")) * cm;
        num2 = Number(num2.toString().replace(".", ""));
      }
    }
    var result = (num1 + num2) / power;
    return result;
  }

  function sub(num1, num2) {
    var len1;
    try {
      len1 = num1.toString().split(".")[1].length;
    } catch (e) {
      len1 = 0;
    }
    var len2;
    try {
      len2 = num2.toString().split(".")[1].length;
    } catch (e) {
      len2 = 0;
    }
    var power = Math.pow(10, Math.max(len1, len2));
    var prec = len1 >= len2 ? len1 : len2;
    var result = ((num1 * power - num2 * power) / power).toFixed(prec);
    return result.toString();
  }

  function times(num1, num2) {
    var m = 0,
      s1 = num1.toString(),
      s2 = num2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {}
    try {
      m += s2.split(".")[1].length;
    } catch (e) {}
    return (
      Number(s1.replace(".", "")) *
      Number(s2.replace(".", "")) /
      Math.pow(10, m)
    );
  }

  function div(num1, num2) {
    var t1 = 0,
      t2 = 0,
      r1,
      r2;
    try {
      t1 = num1.toString().split(".")[1].length;
    } catch (e) { }
    try {
      t2 = num2.toString().split(".")[1].length;
    } catch (e) { }
    with (Math) {
      r1 = Number(num1.toString().replace(".", ""));
      r2 = Number(num2.toString().replace(".", ""));
      return r1 / r2 * pow(10, t2 - t1);
    }
  }
})();
