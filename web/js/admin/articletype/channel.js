$(function(){

    $('.type_id').change(function(){
        var typeId = $(this).val();
        var href = '/admin/articletype/channel?type_id=' + typeId;
        window.location.href = href;
    })


})