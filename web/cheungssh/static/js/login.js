

function fullScreen(){
    var t=document.getElementById("main");
    t.style.height   =window.innerHeight+"px";
}

window.onresize=function() {
    fullScreen();
}

function showErrorInfo(info) {
    $("#showErrorInfoDIV").show("fast");
    var showWarnContent = document.getElementById("showWarnContent");
    showWarnContent.innerHTML = info;
    document.getElementById("shadow").style.display="block";
}

function errorAjax(XMLHttpRequest, textStatus, errorThrown) {
    status_code = XMLHttpRequest.status;
    var content = XMLHttpRequest.responseText || "";
    var mysqlSock = content.match("\/.*sock");
    if (content.match("Can.*connect.*server through socket")) {
        content = "CheungSSH连接不上后台数据库端口";
    }
    else if (content.match("Access.*denied")) {
        content = "CheungSSH登录MySQL的账号密码失败，请您确认是否是MySQL登录限制或账号密码错误的问题.";
    }
    else if (/Error 111 connecting to.*Connection refused/.test(content)) {
        content = "CheungSSH连接不上Redis服务，请您检查服务是否开启";
    }
    else {
        content = "CheungSSH已经响应,但是出现意外的错误，请联系您的管理员";
    }
    showErrorInfo(content);
}



function CheungSSHLogin() {
    var username=document.getElementById("username").value;
    var password=document.getElementById("password").value;
    if(/^ *$/.test(username) ){
        $("#username").effect("shake");
        return false;

    }
    if(/^ *$/.test(password) ){
        $("#password").effect("shake");
        return false;

    }


    jQuery.ajax({
        "url": "/cheungssh/login/",
        "type": "POST",
        "error": errorAjax,
        "data":{"username":username,"password":password},
        "success": function(data){
		data=JSON.parse(data)
            if(data.status){
                $("#loginDiv").animate({
                    "top":"100%",
                },function(){
                    window.location.href="/cheungssh/";
                });
            }
            else{
                showErrorInfo(data.content);
            }
    },
        "beforeSend": function(){
		document.getElementById("loginLoad").style.display="";

        },
        "complete": function(){

		document.getElementById("loginLoad").style.display="none";
        },
        "data": {"username": username, "password": password}
        //不能用jsonp
    });
}


function checkGoogle(){
var browserInfo = navigator.userAgent.toLowerCase();
        console.log(browserInfo)

    if (!browserInfo.match(/webkit/)) {
                alert("抱歉，您必须使用谷歌浏览器访问本系统，或者360浏览器的极速模式!")

    }



}



$(function(){
	checkGoogle();

    fullScreen();
	document.getElementById("password").onkeyup=function(){
		if(event.keyCode==13){
			CheungSSHLogin();
		}
	}
	document.getElementById("username").onkeyup=function(){
		if(event.keyCode==13){
			CheungSSHLogin();
		}
	}




    document.getElementById("login").onclick=function(){
        CheungSSHLogin();

    }

    document.getElementById("closeButton").onclick=function(){
        $("#showErrorInfoDIV").hide("fast");
        document.getElementById("shadow").style.display="none";
    }
	document.getElementById("username").focus();


//登录动画
$("#loginDiv").animate({
		"top":"40%",
	},1200)
})



