var http = require("http");
var fs = require("fs");
var Querystring = require("querystring");
var Url = require("url");
var path = require("path");
var Userdata =[];
start();

function readData() {
    fs.readFile("data.txt", (err, data) => {
        //读取本地的数据
        if (err) throw err;
        var data1 = data.toString();
        var reg = /(\{|\})/
        var exarr = data1.split(reg).filter(item => item !== "" && 
                    item !== "{" && item !== "}" && item !== '\n');
        for (var i = 0; i < exarr.length; i++) {
            //还有一个疑问就是为何换行符的长度会是2
            if (exarr[i].length > 2)
                Userdata.push(exarr[i]);
        }
    });
}

function onRequest(request, response) {
    var req = "";
    request.on('data', function(chunk){
        req += chunk;
    });
    request.on('end', function() {
        //读取数据到文件的末尾的时候要检测一下是否是注册信息
        if (req !== "") 
            HandleSignUpRequest(request, response, req, Userdata);
        req = "";
    });
    HandleSerch(request, response, Userdata);
}

function CreateWebPageDynamically(response, username, studentid, phone, email) {
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write("<!DOCTYPE \"html\">");
    response.write("<html>");
    response.write("<head>");
    response.write("<meta charset=\"UTF-8\">");
    response.write("<title>Hello World Page</title>");
    response.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"details.css\">");
    response.write("</head>");
    response.write("<body>");
    response.write("<div>");
    response.write("<h>用户信息详情</h>");
    response.write("<p>用户名：");
    response.write(username);
    response.write("</p>");
    response.write("<p>学号：");
    response.write(studentid);
    response.write("</p>");
    response.write("<p>电话：");
    response.write(phone);
    response.write("</p>");
    response.write("<p>邮箱：");
    response.write(email);
    response.write("</p>");
    response.write("</div>");
    response.write("</body>");
    response.write("</html>");
    response.end();
}

function HandleSignUpRequest(request, response, req, Userdata) {
    var _post = Querystring.parse(req);
    var inputdata = req;
    var reg = /(\&|\=)/;
    var exarr = inputdata.split(reg).filter(item => item !== "" && item != "\&" && item != "\=");
    var userExist = false;
    var str = "\n" + inputdata;
    var error_info = "";
    console.log("inputdata: "+inputdata);
    for (var i = 0; i < Userdata.length; i++) {
        var existdata = Userdata[i].split(reg).filter(item =>
            item !== "" && item != "\&" && item != "\=");
         mailbox = exarr[7];
        var index = mailbox.indexOf("%");
        var st = mailbox.substr(0, index);
        st += "@";
        st += mailbox.substr(index+3);
        console.log("st: "+st);
        if (exarr[1] == existdata[1]) {
            //这里需要的操作是转到详情界面
            userExist = true;
            error_info += "Username:" + exarr[1] + " exist";
        }
        if (exarr[3] == existdata[3]) {
            userExist = true;
            error_info += " Userid:" + exarr[3] + " exist";
        }
        if (exarr[5] == existdata[5]) {
            userExist = true;
            error_info += " Tel:" + exarr[5] + " exist";
        }
        if (st == existdata[7]) {
            userExist = true;
            error_info += " Mail:" + st + " exist";
        }
    }
    if (!userExist) {
        Userdata.push(inputdata);
        console.log("user not exist");
        //如果用户不存在那么就将用户的信息添加到数据列表里面去
        //并且动态的创建列表来显示已有的数据信息
        var str1 = "\n{" + str;
            str = str1 + "}";
        var index = inputdata.indexOf("%");
        var front = inputdata.substr(0, index);
        var end = inputdata.substr(index + 3);
        var mailbox = front + "@" + end;
        var str = "{"+front+"@"+end+"}";
        fs.appendFile('data.txt', str, 'utf-8', function(err) {
            if (err) {
                console.error(err);
            }
        });
        CreateWebPageDynamically(response, _post.username, _post.userid, _post.tel, _post.mail);
    } else {
        console.log(error_info);
        //如果用户存在那么就返回用户存在的信息给客户端，并且客户端自动的跳转到详情界面
        //不成功需要返回注册界面并且显示注册的失败信息；
        //暂时还没有思路，不知道怎么搞比较好一点
        fs.readFile(__dirname+"/"+"signup.html", function(err, data) {
            if (err) 
                console.error(err);
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write(error_info);
            response.end(data);
        });
    }
}

function HandleSerch(request, response, Userdata) {
    var pathname = __dirname + Url.parse(request.url).pathname;
    console.log("pathname:"+pathname);
    var _query = Url.parse(request.url).query;
    console.log("_query" + _query);
    var reg = /(\=)/;
    var reg1 = /(\&|\=)/;
    var query = null;
    if (_query != null)
        query = _query.substr(_query.indexOf('=')+1);
    console.log("query:"+query);
    if (query != null) {
        var name = query;
        console.log("Begin query");
        var userexist = false;
        var existdata = new Array();
        for (var i = 0; i < Userdata.length; i++) {
            existdata = Userdata[i].split(reg1).filter(item =>
                item !== "" && item != "\&" && item != "\=");
            if (existdata[1] == name) {
                console.log("search exist");
                userexist = true;
                CreateWebPageDynamically(response, existdata[1], existdata[3], existdata[5], existdata[7]);
                break;
            }
        }
        if (!userexist) {
            //如果用户不存在的话那么就显示注册页面
            fs.readFile(__dirname+"/"+"signup.html", function(err, data) {
                if (err) console.log(err);
                response.writeHead(200, {"Content-Type":"text/html"});
                response.end(data);
            });
        }
    } else {
        console.log("begin find");
        if (path.extname(pathname) == "") {
            pathname += '/';
        }
        if (pathname.charAt(pathname.length - 1) == '/') {
            pathname += "signup.html";
        }
        fs.stat(pathname, function(error, stats) {
            if (error)
                console.error(error);
            if (stats) {
                switch(path.extname(pathname)) {
                    case ".html":
                        response.writeHead(200, {'Content-Type':'text/html'});
                        break;
                    case ".css":
                        response.writeHead(200, {'Content-Type':'text/css'});
                        break;
                    case ".js":
                        response.writeHead(200, {'Content-Type':'text/javascript'})
                }
            }
            fs.readFile(pathname, function(err, data) {
                if (err) {
                    console.error(err);
                }
                response.end(data);
            });
        });
    }
}


function start() {
    readData();
    var server = http.createServer(onRequest);
    server.listen(8000);
    console.log("the Server is listening\n");
}
