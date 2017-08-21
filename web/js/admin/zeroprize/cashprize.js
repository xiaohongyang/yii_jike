$(function(){

    //回复投诉
    $('table').on('click','.btn_reply', function(){

        var cont = '<div class="text-left">站内信回复处理结果： <br/><br/> ' +
            '<textarea class="msg_content" class="mt-dl" style="width:90%; height: 70px;"></textarea> </div>';

        var t = $(this);
        $.x_say_m(
            {
                cont:cont,
                contStyle:{padding : '35px 20px 20px 20px'},
                btnOption:{marginTop: '50px', yesLabel : '确定回复'},
                time : 0,
                btn : ['yes'],
                yesCallback : function( exports ){
                    var url = $.fn.apihost + '/api/order/feedbackReply';
                    var data = {
                        parent_id : t.attr('data-parent-id'),
                        order_id : t.closest('.tr_id').attr('data-order-id'),
                        msg_content : exports.cont.find('.msg_content').val()
                    }
                    $.ajax({
                        url : url,
                        data : data,
                        dataType : 'json',
                        type : 'post',
                        success : function(json){
                            $.x_say_m({cont : json.message})
                            if(json.status==1)
                                window.location.href = window.location.href
                        }
                    })

                }
            }
        );
    })


    $('table').on('click', '.btn_cash_order', function(){

        var cont = $('<div class="wrap_cash text-left">  </div>');
        cont.append($('.wrap_cash_order').html());
        cont.find('label').css('display','block')

        var t = $(this);

        $.x_say_m({
            cont : cont,
            time : 0,
            btnOption : {marginTop:'50px'},
            contOption : {padding : '30px 20px 20px 20px'},
            yesCallback : function(exports){

                var orderId = t.closest('.tr_id').attr('data-order-id');
                var shippingStatus = exports.cont.find("input[name='shipping_status']:checked").val();
                var data  = {
                    order_id : orderId,
                    shipping_status : shippingStatus
                };
                var url = $.fn.apihost + '/api/order/setShippingStatus';
                $.ajax({
                    url : url,
                    data : data,
                    dataType : 'json',
                    type : 'post',
                    success : function(json){

                        $.x_say_m({cont : json.message})
                        if(json.status == 1)
                            window.location.href = window.location.href;
                    }
                })


            }
        })


    });


})