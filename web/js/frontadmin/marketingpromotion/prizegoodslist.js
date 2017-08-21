$(function(){

    $.fn.zeroGoodsNumberAdmin = {
        t : null,
        init : function(){
            this.listenGoodsNumberBtnEvent();
            this.listenOneMoneyStatusBtnEvent();
            this.deleteBtnEvent();
        },
        listenGoodsNumberBtnEvent : function(){

            $('.set-goods-number-btn').click(function(){
                var t = $(this);
                var id = t.attr('data-id');
                var price = t.attr('data-price');

                var cont = $('#goods_number_edit');

                cont.find('input[name="goods-number"]').attr('data-id', id).attr('data-price', price);

                var a = $.x_say_m({
                    cont : cont.html(),
                    time : 999999,
                    size : [500, 300],
                    contStyle : {padding : '30px 20px 30px 20px ', textAlign : 'left'},
                    btnOption : {marginTop : '30px'},
                    yesCallback : function(exports, btn, id){

                        var item = exports.wrapper.find('input[name="goods-number"]');
                        var goodsNumber = item.val();
                        var price = item.attr('data-price')
                        id = item.attr('data-id');
                        $.ajax({
                            url : $.fn.apihost + '/api/zeroprize/setGoodsNumber',
                            data : {id : id, goods_number : goodsNumber, _csrf : $.fn.csrf_xhy},
                            type : 'post',
                            dataType : 'json',
                            success : function( json ){

                                $.x_say_m({cont:json.message, time:15000, btn: ['yes']});

                                if(json.status == 1){
                                    $('#tr-'+id).find('.number_store').html(goodsNumber);
                                    if(goodsNumber > 0)
                                        $('#tr-'+id).find('.number_active').html(1);
                                    else
                                        $('#tr-'+id).find('.number_active').html(0);
                                }
                            }
                        })
                    }
                })

                //获取当前最新数量
                $.ajax({
                    url : $.fn.apihost + '/api/zeroprize/getGoodsNumber',
                    data : {id : id, _csrf : $.fn.csrf_xhy},
                    type : 'post',
                    dataType : 'json',
                    success : function( json ){
                        if(json.status == 1){
                            $('input[name="goods-number"]').val(json.data.goodsNumber);

                        } else {
                            console.log('获取数据失败!');
                        }
                    }
                })
            })

        },
        listenOneMoneyStatusBtnEvent : function(){
            $('.set-one-money-status-btn').click(function(){

                var t = $(this);
                var id = t.attr('data-id');
                var status = t.attr('data-status');
                var cont = $("<div></div>");
                cont.append("<input type='hidden' />");
                cont.find('input').attr('data-id', id).attr('data-status', status);

                var enableYesCallback = function(exports, btn, id){

                    var item = exports.cont.find('input');
                    var id = item.attr('data-id');
                    var status = item.attr('data-status')

                    $.ajax({
                        url : $.fn.apihost + '/api/zeroprize/enableOneMoneyBuy',
                        data : {id : id, _csrf : $.fn.csrf_xhy},
                        type : 'post',
                        dataType : 'json',
                        success : function( json ){

                            $.x_say_m({cont:json.message, time:15000, btn: ['yes']});

                            if(json.status == 1){
                                $('#tr-'+id).find('.one_money_status').html('开启中');
                                $('#tr-'+id).find('.set-one-money-status-btn').attr('data-status',2);
                            }
                        }
                    })
                };
                var disableYesCallback = function(exports, btn, id){

                    var item = exports.cont.find('input');
                    var id = item.attr('data-id');
                    var status = item.attr('data-status')

                    $.ajax({
                        url : $.fn.apihost + '/api/zeroprize/disableOneMoneyBuy',
                        data : {id : id, _csrf : $.fn.csrf_xhy},
                        type : 'post',
                        dataType : 'json',
                        success : function( json ){

                            $.x_say_m({cont:json.message, time:15000, btn: ['yes']});

                            if(json.status == 1){
                                $('#tr-'+id).find('.one_money_status').html('未开启');
                                $('#tr-'+id).find('.set-one-money-status-btn').attr('data-status',1);
                            }
                        }
                    })
                };

                if(status == 1){
                    //当前未开启
                    var msg = "一元即开是集客的积分抽奖活动，完成发货后，商家可获取奖品等值的抵值广告费，充入商家的营销账户，用于营销支出...开启活动，需要冻结奖品市场价值等值的活动保证金，如商家违规不发货，将扣除保证金，并自动终止活动...";
                    cont.append(msg);
                    var a = $.x_say_m({
                        cont : cont.html(),
                        time : 999999,
                        size : [500, 230],
                        contStyle : {padding : '30px 20px 30px 20px ', textAlign : 'left'},
                        btn : ['yes'],
                        btnOption : {marginTop : '30px', yesLabel : '确定开启'},
                        yesCallback : enableYesCallback
                    })
                } else if(status == 2){
                    //当前已开启
                    var msg = "是否确定退出一元即开营销活动?";
                    cont.append(msg);
                    var a = $.x_say_m({
                        cont : cont.html(),
                        time : 999999,
                        size : [500, 230],
                        contStyle : {padding : '30px 20px 30px 20px ', textAlign : 'left'},
                        btnOption : {marginTop : '30px', yesLabel : '确定退出', noLabel : '点错了'},
                        yesCallback : disableYesCallback
                    })
                }


            })
        },
        deleteBtnEvent : function () {

            $('.delete_btn').click(function(){
                var t = $(this);
                var id = t.closest('tr').attr('data-id');
                var cont = $("<div></div>");
                cont.append("<input type='hidden' />");
                cont.find('input').attr('data-id', id);

                var deleteCallback = function(exports, btn, id){

                    var item = exports.cont.find('input');
                    var id = item.attr('data-id');

                    $.ajax({
                        url : $.fn.apihost + '/api/zeroprize/delete',
                        data : {id : id, _csrf : $.fn.csrf_xhy},
                        type : 'post',
                        dataType : 'json',
                        success : function( json ){

                            $.x_say_m({cont:json.message, time:15000, btn: ['yes']});

                            if(json.status == 1){
                                $('#tr-'+id).remove();
                            }
                        }
                    })
                };

                //当前未开启
                var msg = "是否删除当前活动?";
                cont.append(msg);
                var a = $.x_say_m({
                    cont : cont.html(),
                    time : 999999,
                    size : [300, 130],
                    contStyle : {padding : '30px 20px 30px 20px ', textAlign : 'left'},
                    btnOption : {marginTop : '30px', yesLabel : '确定删除', noLabel : '点错了'},
                    yesCallback : deleteCallback
                })
            })
        }

    }

    $.fn.zeroGoodsNumberAdmin.init();

    $('body').on('click','.btn-sub', function(){
        var value = $(this).next('input').val();
        value = parseFloat(value);
        if(isNaN(value)){
            $(this).next('input').val(0);
            return false;
        }

        value = value - 1;
        if( value<0 ){
            return false;
        }
        $(this).next('input').val(value);
    })

    $('body').on('click', '.btn-add', function(){
        var value = $(this).prev('input').val();
        value = parseFloat(value);
        if(isNaN(value)){
            $(this).prev('input').val(0);
            return false;
        }

        value = value + 1;
        $(this).prev('input').val(value);
    })
})