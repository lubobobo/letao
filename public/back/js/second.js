
// 二级分类

$(function () { 

  // 功能1 页面渲染
  var currentPage = 1;  // 当前页
  var pageSize = 5;     // 一页多少条

  // 一进页面 根据 currentPage当前页渲染页面
  render();

  // 封装render 方法渲染页面
  function render() { 
    // 发ajax 请求
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      datatType: "json",
      success: function ( info ) { 
        console.log(info);

        // 调用模板 渲染页面
        var htmlStr = template( "secondTmp", info );
        $("tbody").html(htmlStr);


        // 根据返回的总条数，进行分页初始化
        $("#paginator").bootstrapPaginator({

           bootstrapMajorVersion: 3,
           currentPage: info.page,
           totalPage: Math.ceil( info.total / info.size ),

           // 给每个页码添加点击事件
           onPageClicked: function (a, b, c, page) { 
             // 更新当期页, 并且重新渲染
             currentPage: page;
             render();
            }

        })
       }

    })
   }

   
   




 })