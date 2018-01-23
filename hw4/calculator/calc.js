var text = document.getElementById("output_field");
text.value = "";
var uptext = document.getElementById("output_field2");
uptext.value = "";
var output = document.querySelector("#output_field");
var upoutput = document.querySelector("#output_field2");
var error_output = document.querySelector("#error");
var computed = false;

var zero = document.getElementById("zero");
var one = document.getElementById("one");
var two = document.getElementById("two");
var three = document.getElementById("three");
var four = document.getElementById("four");
var five = document.getElementById("five");
var six = document.getElementById("six");
var seven = document.getElementById("seven");
var eight = document.getElementById("eight");
var nine = document.getElementById("nine");

var divide = document.getElementById("divide");
var multiply = document.getElementById("multiply");
var subtract = document.getElementById("subtract");
var add = document.getElementById("add");
var dot = document.getElementById("dot");
var back = document.getElementById("back");
var lbracket = document.getElementById("lbracket");
var rbracket = document.getElementById("rbracket");
var delete_ = document.getElementById("delete_");
var equal = document.getElementById("equal");

function drawOutput() {
    output.innerHTML = text.value;
}

function drawOutputAnswer() {
    output.innerHTML = text.value;
    upoutput.innerHTML = uptext.value;
}

function Delete() {
    upoutput.innerHTML = "";
}

function drawOutputError(strin) {
    error_output.innerHTML = strin;
}

zero.addEventListener("click", function() {
    var str = String(text.value);
    alert(str);
    if (uptext.value != "") {
        Delete();
        text.value = "0";
    }
    else {
        text.value +=  "0";
    }
    drawOutput();
});

one.addEventListener("click", function() {
    text.value +=  "1";
    drawOutput();
});

two.addEventListener("click", function() {
    text.value +=  "2";
    drawOutput();
});

three.addEventListener("click", function() {
    text.value +=  "3";
    drawOutput();
});

four.addEventListener("click", function() {
    text.value +=  "4";
    drawOutput();
});

five.addEventListener("click", function() {
    text.value +=  "5";
    drawOutput();
});

six.addEventListener("click", function() {
    text.value +=  "6";
    drawOutput();
});

seven.addEventListener("click", function() {
    text.value +=  "7";
    drawOutput();
});

eight.addEventListener("click", function() {
    text.value +=  "8";
    drawOutput();
});

nine.addEventListener("click", function() {
    text.value +=  "9";
    drawOutput();
});

divide.addEventListener("click", function() {
    var num = '';
    var temp = text.value;
    if (temp.length >= 1) {
        num = temp[temp.length - 1];
        if (num == '*' || num == '/' || num == '+' || num == '-') {
            text.value = text.value.substring(0, temp.length - 1);
            text.value += '/';
        } else {
            text.value += '/';
        }
    }
    computed = false;
    drawOutput();
});

multiply.addEventListener("click", function() {
    var num = '';
    var temp = text.value;
    if (temp.length >= 1) {
        num = temp[temp.length - 1];
        if (num == '*' || num == '/' || num == '+' || num =='-') {
            text.value = text.value.substring(0, temp.length - 1);
            text.value += '*';
        } else {
            text.value += '*';
        }
    }
    computed = false;
    drawOutput();
});

add.addEventListener("click", function() {
    var num = '';
    var temp = text.value;
    if (temp.length >= 1) {
        num = temp[temp.length - 1];
        if (num == '*' || num == '/' || num == '+' || num == '-') {
            text.value = text.value.substring(0, temp.length - 1);
            text.value += '+';
        } else {
            text.value += '+';
        }
    }
    computed = false;
    drawOutput();
});

subtract.addEventListener("click", function() {
    var num = '';
    var temp = text.value;
    if (temp.length >= 1) {
        num = temp[temp.length - 1];
        if (num == '+' || num == '-') {
            text.value = text.value.substring(0, temp.length - 1);
            text.value += '-';
        } else {
            text.value += '-';
        }
    } else if (temp.length == 0) {
        text.value += '-';
    }
    computed = false;
    drawOutput();
});

lbracket.addEventListener("click", function() {
    text.value +=  "(";
    drawOutput();
});


rbracket.addEventListener("click", function() {
    text.value +=  ")";
    drawOutput();
});


dot.addEventListener("click", function() {
    text.value +=  ".";
    drawOutput();
});


delete_.addEventListener("click", function() {
    text.value = "";
    uptext.value = "";
    computed = false;
    drawOutput();
    drawOutputError("");
});

back.addEventListener("click", function() {
    var temp = text.value;
    text.value = String(temp).substring(0, temp.length - 1);
    computed = false;
    drawOutput();
});

equal.addEventListener("click", function() {
    if (!computed) {
        //在已经计算的时候点击等于符号
        var arr = new Array();
        var num = 0;
        var str = "";
        arr = InfixToPostfix(text.value);
        num = PostfixCompute(arr);
        str = String(num);
        //alert(num);
        if (str != "Wrong Input!" && str != "NaN" && str != "Inifity")
            str ="";
        uptext.value = text.value + " = ";
        text.value = String(num);
        drawOutputError(str);
        drawOutput(); 
        drawOutputAnswer();
        //drawOutput2(num)
        computed = true;
    }
});

/*这里所做的操作就是将中缀表达式转化为后缀表达式，在转化之前将字符串处理一下，将数字和操作符分开
，并且着重处理以下负数*/
function InfixToPostfix(input) {
    /*在实现的时候我觉得最强大的一点就是JavaScript关于数组的栈操作、队列操作等模拟操作*/
    //这里首先要处理一下负数的情况
    var sta = new Array(); //这个数组作为栈来使用，保存基本信息；
    var arr = new Array();  //这个数组用来存储基本的操作数信息；
    var que = new Array();  //将字符串转化为数字和操作符并存储在这里面
    var num = 0;
    var temp = '';
    var temp1 = '';
    var flag = true;
    var ze = 0;
    //处理数字前面的0
    for (var i = 0; i < input.length - 1; i++) {
        if (input[i] == '0' && input[i + 1] != '.')
            ze++;
        else
            break;
    }
    if (ze) {
        input = input.substring(ze);
    }
    for (var i = 0; i < input.length; i++) {
        //在计算之前处理一下字符串，将数字和操作符分开，并且着重处理负数的情况
        temp = input[i];
        switch (temp) {
            case '(':
                que.push(temp);
                break;
            case ')':
                que.push(temp);
                break;
            case '+':
                if (i != 0 && i != input.length - 1)
                    que.push(temp);
                break;
            case '*':
                if (i != input.length - 1)
                    que.push(temp);
                break;
            case '/':
                if (i != input.length - 1)
                que.push(temp);
                break;
            case '-':
                //要考虑到是负数的情况
                if (i > 0 && i != input.length - 1) {
                    temp1 = input[i - 1];
                    if (temp1 == '*' || temp1 == "/" || temp1 == '(') {
                        var str = input.substring(i + 1);
                        num = parseFloat(str);
                        if (num) {
                            num = -num;
                            que.push(num);
                            i = i + String(num).length - 1;
                        } else if (num == 0) {
                            que.push('-');
                            que.push(0);
                        } else {
                            flag = false;
                        }
                    } else {
                        que.push('-');
                    }
                } else if (i == 0) {
                    que.push(0);
                    que.push('-');
                }
                break;
            default:
                temp = input.substring(i);
                num = parseFloat(temp);
                var len = String(num).length;
                if (num < 1 && input[i] == '.')
                    i -= 1;
                i = i + len;
                if (i < input.length && input[i] == '.')
                    i += 1;
                if (i < input.length && input[i] == '0') {
                    while (i < input.length) {
                        if (input[i] == '0')
                            i++;
                        else
                            break;
                    }
                }
                i -= 1;
                if (num || num == 0) {
                    num = Number(num);
                    que.push(num);
                    //alert(num);
                } else {
                    flag = false;
                }
                break;
        }
    }

    if (flag == false)
        return arr;

    while (que.length) {
        //中缀表达式转为后缀表达式
        if (flag == false)
            break;
        temp = que.shift();
        temp = String(temp);
        switch (temp) {
            case '(':
                sta.push(temp);
                break;
            case ')':
                //这种情况下要保证有左括号
                if (sta.length == 0) {
                    flag = false;
                    //alert("wong1");
                } else {
                    temp1 = sta.pop();
                    while (temp1 != '(') {
                        arr.push(temp1);
                        if (sta.length > 0) {
                            temp1 = sta.pop();
                        } else {
                            flag = false;
                            break;
                        }
                    }
                }
                break;
            case '+':
                //将遇到左括号前的所有操作符弹出
                var yes = true;
                while (yes) {
                    if (sta.length) {
                        temp1 = sta.pop();
                        temp1 = String(temp1);
                        if (temp1 != '(') {
                            arr.push(temp1);
                        } else if (temp1 == '(') {
                            sta.push(temp1);
                            yes = false;
                        }
                    } else {
                        yes = false;
                    }
                }
                sta.push('+');
                break;
            case '-':
                var yes = true;
                while (yes) {
                    if (sta.length) {
                        temp1 = sta.pop();
                        temp1 = String(temp1);
                        if (temp1 != '(') {
                            arr.push(temp1);
                        } else if (temp1 == '(') {
                            sta.push(temp1);
                            yes = false;
                        }
                    } else {
                        yes = false;
                    }
                }
                sta.push('-');
                break;
            case '*':
                var yes = true;
                while (yes) {
                    if (sta.length) {
                        temp1 = sta.pop();
                        temp1 = String(temp1);
                        if (temp1 != '(' && temp1 != '+' && temp1 != '-') {
                            arr.push(temp1);
                        } else {
                            sta.push(temp1);
                            yes = false;
                        }
                    } else {
                        yes = false;
                    }
                }
                sta.push('*');
                break;
            case '/':
                var yes = true;
                while (yes) {
                    if (sta.length) {
                        temp1 = sta.pop();
                        temp1 = String(temp1);
                        if (temp1 != '(' && temp1 != '+' && temp1 != '-') {
                            arr.push(temp1);
                        } else {
                            sta.push(temp1);
                            yes = false;
                        }
                    } else {
                        yes = false;
                    }
                }
                sta.push('/');
                break;
            default:
                temp = Number(temp);
                arr.push(temp);
        }
    }

    while (sta.length > 0) {
        temp1 = sta.pop();
        if (temp1 != '(') {
            arr.push(temp1);
        } else {
            flag = false;
            //alert("wong in sta");
            break;
        }
    }

    if (flag == false) {
        //alert("wong3");
        var ret = new Array();
        return ret;
    }
    return arr;
}

/*       this function is to compute the number of the postfix expression*/
function PostfixCompute(arr) {
    if (arr.length == 0) {
        var str = "Wrong Input!";
        return str;
    }
    var stac = new Array();
    var temp1 = 0;
    var temp2 = 0;
    var temp3 = 0;
    var flag = true;
    var num = 0;
    var isNaN = false;
    while (arr.length > 0) {
        temp1 = arr.shift();
        temp1 = String(temp1);
        switch (temp1) {
            case '+':
                if (stac.length < 2) {
                    flag = false;
                    //alert("+ length < 2");
                } else {
                    temp2 = stac.pop();
                    temp3 = stac.pop();
                    temp2 = Number(temp2);
                    temp3 = Number(temp3);
                    temp2 = temp2 + temp3;
                    stac.push(temp2);
                }
                break;
            case '-':
                 if (stac.length < 2) {
                    flag = false;
                } else {
                    temp2 = stac.pop();
                    temp3 = stac.pop();
                    temp2 = Number(temp2);
                    temp3 = Number(temp3);
                    temp2 = temp3 - temp2;
                    stac.push(temp2);
                }
                break;
            case '*':
                 if (stac.length < 2) {
                    flag = false;
                } else {
                    temp2 = stac.pop();
                    temp3 = stac.pop();
                    temp2 = Number(temp2);
                    temp3 = Number(temp3);
                    temp2 *= temp3;
                    stac.push(temp2);
                }
                break;
            case '/':
                 if (stac.length < 2) {
                    flag = false;
                } else {
                    temp2 = stac.pop();
                    temp3 = stac.pop();
                    temp2 = Number(temp2);
                    temp3 = Number(temp3);
                    if (temp2 == 0) {
                        isNaN = true;
                    } else {
                        temp2 = temp3 / temp2;
                        stac.push(temp2);
                    }
                }
                break;
            default:
                stac.push(temp1);
                break;
        }
        if (flag == false) {
            break;
        }
    }

    if (isNaN == true) {
        var str = "NaN";
        return str;
    }
    else if (flag == false) {
        var str = "Wrong Input!";
        return str;
    }
    else if (stac.length > 0) {
        num = stac.pop();
        num = Number(num);
        if (!isFinite(num)) {
            num = "Inifity";
        } else {
            num = num.toPrecision(10);
            num = String(num);
            var len = num.length;
            for (var i = num.length - 1; i >= 0; i--) {
                if (num[i] == '0')
                    len--;
                else
                    break;
            }
            if (num[len - 1] == '.')
                len--;
            num = num.substring(0, len);
            num = Number(num);
            if (Math.abs(num) < 0.000000000001)
                num = 0;
        }
        return num;
    }
}

/*
var reg = /(\+|\-|\*|\/|\(|\))/;
var expression = "1+2.00+(-2)-5";
var expArr = expression.split(reg).filter(item => item !== "");
for (var i = 0; i < expArr.length; i++)
    alert(expArr[i]);
    */

