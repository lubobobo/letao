$(function () {

  /* 需求: 表单校验 */
  /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */

  $("#form").bootstrapValidator({

    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 配置校验字段  (配置之前, 需要先配置 input 的 name )
    fields: {
      // 配置用户名
      username: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6之间'
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      // 配置密码
      password: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在2到6之间'
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }

  });


  /*
   * 2. 注册表单校验成功事件, 在事件中阻止默认成功的表单提交,
   *    通过 ajax 进行提交
   * */
  $("#form").on("success.form.bv", function (e) {

    // 阻止默认的表单提交
    e.preventDefault();

    // 通过 ajax 提交
    $.ajax({
      type: "POST",
      url: "/employee/employeeLogin",
      data: $("#form").serialize(),
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error == 1000) {
          //用户名提示
          $("#form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback")
        }
        if (info.error == 1001) {
          // 密码提示
          $("#form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback")
        }
      }
    })


  });

  /*
   * 3. 重置功能 (本身reset按钮就可以重置内容, 需要调用表单校验插件的方法, 重置校验状态)
   * */
  $("[type='reset']").click(function () {

    $("#form").data("bootstrapValidator").resetForm();
  })

});