$(function () {

  //功能1 用户页面渲染功能

  var currnetPage = 1; //当前页
  var pageSize = 5; //每页条数

  var currentId;   // 当前点击编辑用户的 id
  var isDelete;   // 状态

  // 1. 一进入页面, 发送ajax请求, 获取用户列表数据, 通过模板引擎渲染
  render();

  //1.1 通过ajax 拿数据渲染页面
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currnetPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);

        //1.2  调用模板方法与数据进行绑定
        var htmlStr = template("tmp", info);
        // 渲染页面
        $("tbody").html(htmlStr);

        //1.3 根据后台返回的数据, 进行分页初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填

          currentPage: info.page, //当前页
          totalPages: Math.ceil( info.total / info.size  ),//总页数

          // 给页码添加点击事件
          onPageClicked: function(a, b, c, page) {
             console.log(page);
            // 根据 page 重新请求数据, 进行渲染
            currnetPage = page; //更新当前页

            // 根据当前页, 重新渲染
            render();
          }
        });

      }
    })

  }


  //功能2 点击禁用启用按钮，显示模态框(事件委托)
  $("tbody").on("click",".btn", function () { 

    //显示模态框
    $("#userModal").modal("show");

    // 获取用户id
    currentId = $(this).parent().data("id");
    // console.log(currentId);

    // 获取需要修改的状态, 根据按钮的类名来判断具体传什么
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;

   });

   //功能3. 点击模态框确认按钮, 完成用户的启用禁用
   $("#submitBtn").click(function () { 

     $.ajax({
       type: "post",
       url: "/user/updateUser",
       data: {
         id: currentId,
         isDelete: isDelete
       },
       dataType: "json",
       success: function ( info ) { 
         console.log(info);

         // 关闭模态框
         $("#userModal").modal("hide");

         //重新渲染页面
         render();
        }
     })

    })






})