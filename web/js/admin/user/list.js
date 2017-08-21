$(function(){

    $("body").on('click','.btn_del',function(){
        var t= $(this)
        $.x_say_m({cont:'是否确定要删除?', yesCallback:function(){
            var user_id = t.closest('tr').attr('data-id');
            var url = $.fn.apihost + '/api/adminuser/remove';
            $.ajax({
                url : url,
                data : {id : user_id, _csrf : $.fn.csrf_xhy},
                type : 'post',
                dataType : 'json',
                success : function(json){

                    $.x_alert({cont: json.message});
                    if(json.status == 1)
                        window.location.href = window.location.href
                }
            })
        }})
    })

    $('body').on('click', '.btn_add_admin_user', function(){
        var cont = $('.wrap_create').html();
        $.x_say_m({
            cont : cont,
            time :0,
            contStyle : {
                padding : '35px 20px 20px 20px'
            },
            btnOption : {
                marginTop : '30px'
            },
            yesCallback : function(exports){
                var item_name = exports.cont.find('select[name="item_name"]').val();
                var user_name = exports.cont.find('input[name="user_name"]').val();
                var user_mobile = exports.cont.find('input[name="user_mobile"]').val();
                var url = $.fn.apihost + "/api/adminuser/create";
                var data = {
                    item_name : item_name,
                    user_name : user_name,
                    user_mobile : user_mobile
                }

                result = false;
                $.ajax({
                    url : url,
                    data : data,
                    dataType : 'json',
                    type : 'post',
                    async : false,
                    success : function(json){

                        $.x_alert({cont : json.message})

                        if(json.status == 1)
                            result = true;
                    }
                })

                if(result)
                    window.location.href = window.location.href;
                return result;
            }
        })
    })

    $('body').on('click', '.btn_edit', function(){


        var t = $(this)
        var itemName = t.attr('data-item-name')

        $('.wrap_edit').find("select[name='item_name']").find("option:selected").attr('selected',false)
        $('.wrap_edit').find("select[name='item_name']").find("option[value='"+itemName+"']").attr('selected',true)
        cont = ""
        cont = $('.wrap_edit').html();

        $.x_say_m({
            cont : cont,
            time :0,
            contStyle : {
                padding : '35px 20px 20px 20px'
            },
            btnOption : {
                marginTop : '80px'
            },
            yesCallback : function(exports){

                 var item_name = exports.cont.find('select[name="item_name"]').val();
                var url = $.fn.apihost + "/api/adminuser/changeUserRole";
                var data = {
                    item_name : item_name,
                    id : t.attr('data-id')
                }

                $.ajax({
                    url : url,
                    data : data,
                    dataType : 'json',
                    type : 'post',
                    async : false,
                    success : function(json){

                        $.x_alert({cont : json.message})

                        if(json.status == 1)
                            result = true;
                    }
                })

                if(result)
                    window.location.href = window.location.href;
                return result;
            }
        })
    })
})