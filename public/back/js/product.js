
// 商品管理

$(function () { 

  var picArr = []; // 专门用于存储需要上传的图片

  // 功能1 页面渲染
  var currentPage = 1;
  var pageSize = 3;

   // 一进页面渲染一次
   render();

  function render() {  
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function ( info ) { 
          console.log(info);

          //调用模板 渲染页面
          var htmlStr = template("productTmp", info );
          $("tbody").html( htmlStr );


          //功能2 分页功能
          $(".paginator").bootstrapPaginator({
            bootstrapMajorVersion: 3,
            currentPage: info.page,
            totalPages: Math.ceil( info.total / info.size ),

            onPageClicked: function (a, b, c, page) { 
                 // 更新当前页 重新渲染
                 currentPage = page;
                 render();
             }
          })
       }
    })

   };



  //功能3. 点击添加商品按钮, 显示添加模态框
  $("#addBtn").on("click", function () { 
    $("#addModal").modal("show");

    //功能4 点击添加商品按钮时发送 ajax, 请求所有的二级分类数据, 进行渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function ( info ) { 
        console.log( info );

        //调用模板 渲染二级分类
        var htmlStr = template("dropdownTmp", info );
        $(".dropdown-menu").html( htmlStr );
       }
    })
   });


   //功能5. 给下拉框的 a 添加点击事件 (通过事件委托)
   $(".dropdown-menu").on("click", "a", function () { 
     // 获取a的文本
     var txt = $(this).text();
     //设置给按钮的span
     $("#dropdownText").text( txt );

     //获取选中项的id, 赋值给隐藏域 用于提交
     var id = $(this).data( "id" );
     $("[name='brandId']").val( id );
     

    //下拉校验后 将隐藏域的校验状态改成VALID
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    });


  //功能6 调用文件上传插件 实现文件上传
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，
    // 文件上传的回调函数
    done: function (e, data) {
      console.log(data.result);

      // 获取图片信息
      var picObj = data.result;

     // 把图片往数组的最前面追加
      picArr.unshift( picObj );

       //获取图片地址, 
       var picUrl = picObj.picAddr;
       //将图片添加到结构最前面
       $('#imgBox').prepend('<img src="'+ picUrl +'" style="width: 100px;">');


       // 如果长度 > 3 说明超出长度范围, 需要将最后的图片移除
       if(picArr.length > 3) {
         // 删除数组的最后一项
         picArr.pop();

         // 删除最后一张图片
         $("#imgBox img:last-of-type").remove();

         // 图片校验
         if( picArr.length = 3 ) {
           // 说明当前图片已经上传满 3 张, 需要将 picStatus 校验状态改成 VALID
           $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
         }
       }
    }
});



//功能7. 配置表单校验
$("#form").bootstrapValidator({
    // 配置排除项, 需要对隐藏域进行校验
    excluded: [],

    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置校验规则
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
    proName: {
      validators: {
        notEmpty: {
          message: "请输入商品名称"
        }
      }
    },
    proDesc: {
      validators: {
        notEmpty: {
          message: "请输入商品描述"
        }
      }
    },
    num: {
      validators: {
        notEmpty: {
          message: "请输入商品库存"
        },
        //正则校验
        regexp: {
          regexp: /^[1-9]\d*$/,
          message: '商品库存必须是非零开头的数字'
        }
      }
    },
    size: {
      validators: {
        notEmpty: {
          message: "请输出商品尺码"
        },
        //正则校验
        regexp: {
          regexp: /^\d{2}-\d{2}$/,
          message: '必须是xx-xx的格式, xx是两位数字, 例如: 36-44'
        }
      }
    },
    oldPrice: {
      validators: {
        notEmpty: {
          message: "请输入商品原价"
        }
      }
    },
    price: {
      validators: {
        notEmpty: {
          message: "请输入商品现价"
        }
      }
    },
    picStatus: {
      validators: {
        notEmpty: {
          message: "请上传3张图片"
        }
      }
    }
  }
});


// 功能8. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax提交
$("#form").on("success.form.bv", function ( e ) { 
  //阻止表单默认提交
  e.preventDefault();

  //获取所有表单内容数据
  var paramsStr = $("#form").serialize(); 
  
  // 还需要拼接上图片地址和名称
  // paramsStr += "&key1=value1&key2=value2"
  paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
  paramsStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
  paramsStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

  // 通过 ajax提交
  $.ajax({
    type: "post",
    url: "/product/addProduct",
    data: paramsStr,
    dataType: "json",
    success: function (info) { 
      console.log(info);

      if( info.success ){
        // 添加成功关闭模态框
        $("#addModal").modal("hide");

        //// 页面重新渲染第一页
        currentPage = 1;
        render();

          // 重置所有的表单内容和状态
          $('#form').data("bootstrapValidator").resetForm(true);

          // 由于下拉菜单  和  图片 不是表单元素, 需要手动重置
          $('#dropdownText').text("请选择二级分类");

          // 删除图片的同时, 清空数组
          $('#imgBox img').remove();
          picArr = [];
      }
     }
  })
 })



 })