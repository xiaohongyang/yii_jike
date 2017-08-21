$(function(){

    $('body').on('click', '.btn_bail_back', function(){
        $.x_say_m({
            cont : '您是否确定申请保证金退款?',
            btnOption : {'noLabel':'点错了'},
            time : 0,
            yesCallback : function(){
                var url = $.fn.apihost + '/api/user/getBailAmount'
                $.ajax({
                    url : url,
                    data : {_csrf : $.fn.csrf_xhy},
                    dataType : 'json',
                    type : 'post',
                    success : function(json){
                        if(json.status==0){
                            $.fn.alert(json.message)
                        } else {
                            var cont = $("<div class='text-left form-inline'></div>")
                            cont.append("您的保证金账户当前可退款额：<span class='money' style='color:#ff7f27;font-weight: 900'>"+ json.data.frozen_account + "</span>  提交退款申请后，客服将在三个工作日内完成退款，请设置收款账户：<br/>")
                            var account = $("<div class='mt-row'> <span class='h5'>支付宝收款账户：</span><input type='text' name='account' class='form-control input-sm' > </div>")
                            var user = $("<div class='mt-row'>  <span class='h5'>支付宝实名认证：</span><input type='text' name='user' class='form-control input-sm' >  </div>")
                            cont.append(account)
                            cont.append(user)

                            $.x_say_m({
                                cont : cont,
                                time : 0,
                                contStyle : {
                                    padding : '22px 20px 20px 20px'
                                },
                                btnOption : {
                                    'marginTop' : '30px'
                                },
                                yesCallback : function(exports){
                                    var accountValue = exports.cont.find("input[name='account']").val()
                                    var userValue = exports.cont.find("input[name='user']").val()
                                    var data = {
                                        account : accountValue,
                                        user : userValue,
                                        action : 'cash',
                                    }
                                    var url = $.fn.apihost + "/api/"

                                    var result = false;
                                    $.ajax({
                                        url : '/frontadmin/usercenter/frozenAccount',
                                        data : data,
                                        dataType : 'json',
                                        type : 'post',
                                        async : false,
                                        success : function(json){

                                            $.x_alert({cont : json.message, time : 4000})
                                            if(json.status == 1){
                                                result = true
                                            }
                                        }
                                    })
                                    return result
                                }
                            })
                        }
                    }
                })
            }
        })
    })

})