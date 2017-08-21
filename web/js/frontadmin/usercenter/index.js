$(function(){

    $('#user_info-wechat_address').focus(function(){
        $(this).keydown(function(e){
            if(e.which == 13){
                $(this).trigger('blur');
                $(this).next().trigger('focus');
                return false;
            }
        })
    })

    $('.edit-ok').click(function(){

        var edit_show = $(this).closest('.edit-wrap').find('.edit-show');

        $(this).closest('.edit-wrap').find('.edit-show').html($(this).prev().val());
        if(edit_show.attr('href') != 'undefined'){
            edit_show.attr('href', $(this).prev().val());
        }

        $(this).closest('.input-wrap').hide();

        $(this).closest('.edit-wrap').find('.edit-show').show();
        $(this).closest('.edit-wrap').find('.pencil').show();

        return false;
    })

    $('.pencil').click(function(){

        $(this).closest('.edit-wrap').find('.pencil').hide();
        $(this).closest('.edit-wrap').find('.edit-show').hide();

        $(this).closest('.edit-wrap').find('.input-wrap').show();

        $(this).closest('.edit-wrap').find('input').trigger('focus');
        $(this).closest('.edit-wrap').find('input').keydown(function(e){
            //回车
            if(e.which == 13){
                $(this).next().trigger('click');
                return false;
            }
        })

        $(this).closest('.edit-wrap').find('.input-wrap').css('display','inline');
    })

    $('.number').mouseover(function(){
        $('.jifenguize').show();
    }).mouseout(function(){
        $('.jifenguize').hide();
    })
})


