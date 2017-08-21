$(function(){
    $.x_slider({wrap_class : '.x_slider'})

    $.fn.getGoodsList = function(typeId){

        var data = {};
        if(typeId)
            data.type_id = typeId;
        $.ajax({
            url : '/jike/index/goodsList',
            dataType : 'html',
            type : 'get',
            data : data,
            success : function(html){
                $('#goods-list').html(html)
            }
        })
    }

    $.fn.getGoodsListByLink = function(url){

        $.ajax({
            url : url,
            dataType : 'html',
            type : 'get',
            success : function(html){
                //移除前一页分頁按钮
                $('body').find('.pagination').remove();
                $('#goods-list').append(html)
            }
        })
        return false;
    }

    $('select[name="prize_type"]').change(function(){
        var typeId= $(this).val();
        $.fn.getGoodsList(typeId)
    })
    $('.btn-ajax-link').click(function(){

        $('.catgory-nav .active').removeClass('active');
        $(this).addClass('active');

        var typeId = $(this).attr('data-type-id');
        $.fn.getGoodsList(typeId);
        return false;
    })


    $.fn.getGoodsList();


})


