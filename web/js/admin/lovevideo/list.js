$(function(){

    $('.edit-btn').on('click',function(){

        var url = $(this).attr('data-url');
        url = url+'&time='+Math.random()

        $.fn.iframe_x_say({url : url, frameSize:[600, 300], size:[800,370], time:0, btn:[]})
    })

    $('.remove-btn').on('click',function(){


        var url = $(this).attr('data-url');
        $.x_say_m({cont:'确定要删除吗?', time:0,  yesCallback:function(exports){
            $.ajax({
                url : url,
                data : {_csrf : $.fn.csrf_xhy},
                dataType : 'json',
                type : 'post',
                success : function(json){
                    $.x_say_m({cont : json.message, btn :[], callback:function(){
                        window.location.href = window.location.href;
                    }})
                }
            })
        }})
    })
})