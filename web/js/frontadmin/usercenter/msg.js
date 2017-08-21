$(function(){
    $('.btn_read').click(function(){

        if($(this).closest('td').find('.desc').hasClass('hide')){

            $(this).closest('td').find('.desc').removeClass('hide');
            var url = $.fn.apihost + '/api/msg/readMessage';
            $.post(url, {id : $(this).closest('tr').attr('data-key')}, function(){});
        }else {
            $(this).closest('td').find('.desc').addClass('hide');
        }
    })
})