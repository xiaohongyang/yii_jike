$(function(){

    $('table').on('click','.set_invoice', function(){
        var tr = $(this).closest('.tr_data');
        var id = tr.attr('data-id');
        var url = $(this).attr('data-url')

        $.x_say_m({
            cont : $('.invoice_form').html(),
            contStyle : {
                'padding' : '25px 15px 15px 0px'
            },
            time : 0,
            yesCallback : function(exports){
                var invoice_sn = exports.cont.find("input[name='invoice_sn']").val()
                if($.trim(invoice_sn).length == 0){
                    $.x_alert({cont:"发票编号不能为空!"});
                    return false;
                } else {
                    $.ajax({
                        url : url,
                        data : {'invoice_id': id, 'invoice_sn': invoice_sn, _csrf : $.fn.csrf_xhy},
                        dataType : 'json',
                        type : 'post',
                        success : function(json){
                            $.x_alert({cont : json.message});
                            if(json.status == 1)
                                tr.remove();
                        }
                    })
                }
            }
        })

    })

})