$(function () { 

   // 功能需求: 登录拦截, 对于未登录的用户, 拦截到登录页
   // 由于前端不知道当前用户的登录状态, 但是后台知道, 所以需要发送ajax请求, 来判断
  
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",   
    success: function ( info ) { 
      console.log(info);
      if( info.success ) {
          console.log("用户已登录");
      }
      if( info.error == 400) {
        location.href = "login.html";
      }
     }
  })

 })