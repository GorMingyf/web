function CheckuserName(str) {
    var len = str.length;
    if (len < 6 || len > 18) {
    	$("#error1").text("Invalid Username");
        return false;
    }
    var usrname = /^[A-Za-z]+\w+$/;
    if (!usrname.test(str)) {
        $("#error1").text("Invalid Username");
    } else {
    	 $("#error1").text("");
    }
    return (usrname.test(str));
}

function CheckuserId(userid) {
    if (userid.length != 8) {
    	$("#error2").text("Invalid UserID");
        return false;
    }
    var usrid = /^[1-9]+\d+$/;
    if (!usrid.test(userid)) {
        $("#error2").text("Invalid UserID");
    } else {
    	$("#error2").text("");
    }
    return (usrid.test(userid));
}

function CheckTel(tel) {
    if (tel.length != 11) {
    	$("#error3").text("Invalid Tel");
        return false;
    }
    var teltest = /^[1-9]+\d+$/;
    if (!teltest.test(tel)) {
        $("#error3").text("Invalid Tel");
    } else {
    	$("#error3").text("");
    }
    return (teltest.test(tel));
}

function CheckMail(mail) {
	if (mail.length == 0)
		$("#error4").text("");
    var mail_RegEx = /^[a-zA-Z_\-]+[a-zA-Z_0-9\-]*@(([a-zA-Z_0-9\-])+\.)+[A-Za-z]{2,4}$/;
    if (!mail_RegEx.test(mail)) {
        $("#error4").text("Invalid MailBox");
    } else {
    	$("#error4").text("");
    }
    return mail_RegEx.test(mail);
}

function CheckInput() {
    var username = $("#username").val();
    var userid = $("#userid").val();
    var tel = $("#Tel").val();
    var mail = $("#Mail").val();
    if (CheckuserName(username) && CheckuserId(userid) && CheckTel(tel) && CheckMail(mail))
        return true;
    return false;
}
