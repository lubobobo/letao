

// 公用的功能:


$(function () { 

    //1. 进度条功能
    // 在第一个ajax请求发送时开启进度条
    $(document).ajaxStart(function () { 
      //开启进度条
      NProgress.start();
     })
    
     // 在所有的ajax请求完成时关闭进度条
    $(document).ajaxStop(function () { 

      setTimeout(function () { 
        //关闭进度条
        NProgress.done();
       },500)

     })


    
   //功能2. 左侧二级切换功能
   $("#category").click(function () { 

     $(this).next().stop().slideToggle();
    })


  //功能3. 左侧菜单切换功能
  $(".main_harder .harder_left").click(function () { 
 
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
    $(".main_harder").toggleClass("hidemenu");

   })


   //功能4. 退出功能
   $(".main_harder .harder_right").click(function () { 

    // 显示退出模态框
    $("#logoutModal").modal("show");
    });
    
     // 调用接口, 让后台销毁当前用户的登录状态
   $("#logoutBtn").click(function () { 
      $.ajax({
        type: "get",
        url: "/employee/employeeLogout",
        dataType: "json",
        success: function ( info ) { 

          if( info.success ) {
             location.href = "login.html";
          }
         }
      })
     });

 });