$(function(){

    $.fn.verifyGoods = function(){
        $('table').on('click','.btn-verify',function(){
            var t = $(this)
            var prizeId = t.closest('.tr_id').attr('data-prize-id');
            var cont = $('.wrap_verify_form').html();
            $.x_say_m({
                cont : cont,
                time : 0,
                btn : ['yes'],
                yesCallback : function(exports){

                    var status = exports.cont.find("input[name='status']:checked").val()
                    var url = $.fn.apihost + "/api/zeroprize/verify";
                    var data = {
                        prize_id : prizeId,
                        status : status
                    }

                    $.ajax({
                        url : url,
                        data : data,
                        dataType : 'json',
                        type : 'post',
                        success : function(json){

                            $.x_say_m({cont : json.message, btn : [], callback : function(){window.location.href = window.location.href;}})
                        }
                    })

                }
            })
        })
    }

    $.fn.filter = function(){
        $("select[name='prize_type_id']").change(function(){
            $(this).closest('form').trigger('submit')
        })
    }

    $.fn.verifyGoods();
    $.fn.filter();
})