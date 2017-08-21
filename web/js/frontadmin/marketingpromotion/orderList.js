$(function(){

    $.fn.send = {

        init : function(){
            this.event_send_right_now();
        },
        event_send_right_now : function(){
            $('table').on('click', '.btn_send_now', function(){
                var t = $(this)
                var select = $('.wrap_transport_list').html();
                var cont = $("<div class='wrap_send_form'></div>");
                cont.append(select);

                $.x_say_m({cont:cont, contStyle: {padding : '20px 20px 20px 20px'}, btnOption:{yesLabel:'确定发货'},time:0, yesCallback : function(exports){
                    var tr = t.closest('.tr_id');
                    var order_id = tr.attr('data-id');
                    var transport_id = exports.cont.find('select[name=transport_id]').val()
                    var transport_sn = exports.cont.find('input[name=transport_sn]').val()
                    var url = $.fn.apihost + '/api/order/sender';
                    var data = {
                        order_id : order_id,
                        transport_id : transport_id,
                        transport_sn : transport_sn
                    };
                    $.ajax({
                        url : url,
                        data : data,
                        dataType : 'json',
                        type : 'post',
                        success : function(json){

                            $.x_say_m({cont : json.message, callback : function(){
                                if(json.status == 1){
                                    window.location.href = window.location.href
                                }
                            }, time:3000, btn:[]})
                        }
                    })

                }})


            })
        }
    }

    $.fn.send.init();

})