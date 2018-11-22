
// 一级分类页

$(function () { 

  // 功能1 页面渲染

  var currentPage = 1; //当前页
  var pageSize = 5;    // 每页条数
  
  // 一进页面渲染一次
  render();

  function render() { 
    // 发ajax请求 拿数据渲染页面
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function ( info ) { 
        console.log(info);

        // 调用模板 渲染页面
        var htmlStr = template("firstTmp", info );
        $("tbody").html( htmlStr );


        //功能2 分页功能 当数据回来后, 进行分页初始化
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil( info.total / info.size ),
          // 绑定页码点击事件
          onPageClicked: function (a, b, c, page) { 
            console.log(page);

            //更新当前页
            currentPage = page;

            // 重新渲染
            render();
           }
        })
       }
    })
   }
  
  
   //功能3. 点击添加按钮, 显示添加模态框
   $("#addBtn").click(function () { 

    $("#addModal").modal("show");
    })

  //功能4. 表单校验功能
  $("#form").bootstrapValidator({
     // 配置小图标
     feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置字段校验
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 配置非空校验
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  })

  // 功能5. 注册表单校验成功事件, 阻止默认的表单提交, 通过 ajax 提交
  $("#form").on("success.form.bv", function ( e ) { 
    // 阻止默认的提交
    e.preventDefault();

    // ajax 提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("#form").serialize(),
      dataType: "json",
      success: function ( info ) { 
        console.log( info );

        if( info.success ) {
          // 添加成功 模态框消失
          $("#addModal").modal("hide");

          //重新渲染页面, 重新渲染第一页
          currentPage = 1;
          render();

          // 内容和状态都要重置
          $('#form').data("bootstrapValidator").resetForm(true);
        }
       }
    })
   })
 })