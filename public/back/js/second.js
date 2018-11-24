// 二级分类

$(function () {

  // 功能1 页面渲染

  var currentPage = 1; // 当前页
  var pageSize = 5; // 一页多少条

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
      success: function (info) {
        console.log(info);

        // 调用模板 渲染页面
        var htmlStr = template("secondTmp", info);
        $("tbody").html(htmlStr);


        // 根据返回的总条数，进行分页初始化
        $("#paginator").bootstrapPaginator({

          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),

          // 给每个页码添加点击事件
          onPageClicked: function (a, b, c, page) {
            // 更新当期页, 并且重新渲染
            currentPage = page;
            render();
          }

        })
      }

    })
  }



  // 功能2 点击添加分类 显示模态框
  $("#addBtn").click(function () {

    $("#addModal").modal("show");

    //功能3 发送 ajax 请求, 请求所有的一级分类列表, 进行渲染
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);


        // 根据返回数据 调用模板 渲染
        var htmlStr = template("dropdownTmp", info);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  });

  //功能4. 给下拉菜单添加选中功能 (事件委托)
  $(".dropdown-menu").on("click", "a", function () {

    // 获取 a 文本
    var txt = $(this).text();

    // 设置给按钮里的 span
    $("#dropdownText").text(txt);


    //功能6 点击添加 用隐藏域提交数据
    // 获取 a 中自定义属性存储的 id
    var id = $(this).data("id");
    // 赋值给隐藏域, 用于提交
    $("[name='categoryId']").val(id);

    // 手动将隐藏域的校验状态, 改成成功
    $('#form').data("bootstrapValidator").updateStatus( "categoryId", "VALID" );

  });

  //功能5. 调用 fileUpload 方法, 发送文件上传请求
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);
      var result = data.result // 后台返回的结果
      // 获取图片地址, 赋值给 img 的 src
      var url = result.picAddr;
      $("#imgBox img").attr("src", url);

      // 将图片地址赋值给隐藏域
      $('[name="brandLogo"]').val(url);

      
      // 手动将隐藏域的校验状态, 改成成功
      $('#form').data("bootstrapValidator").updateStatus( "brandLogo", "VALID" );
    }
  });


  //功能7 添加表单校验
  $("#form").bootstrapValidator({

    // 配置排除项, 需要对隐藏域进行校验
    excluded: [],

    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    // 配置校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })



  //功能8. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
  $("#form").on("success.form.bv", function ( e ) { 

      // 阻止表单默认的提交
      e.preventDefault();

      //通过 ajax 提交
      $.ajax({
        type: "post",
        url: "/category/addSecondCategory",
        data: $("#form").serialize(),
        dataType: "json",
        success: function ( info ) { 
          console.log(info);

          if( info.success ) {
            // 成功 关闭模态框
            $("#addModal").modal("hide");

            // 重新更新当前页
            currentPage = 1;
            render();


            //重置表单内容和状态
            $("#form").data("bootstrapValidator").resetForm(true);

            // 由于下拉框 和 图片 不是表单元素 需要手动重置
            $("#dropdownText").text("请选择一级分类");
            $("#imgBox img").attr("src", "./images/none.png");
          }
         }
      })


   })


})