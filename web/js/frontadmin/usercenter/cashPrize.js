$(function(){

    $('body').on('click','.wrap_norms span',function(){
        //编辑商品属性
        $(this).closest('.wrap_norms').find('.active').removeClass('active');
        $(this).addClass('active');
    });
    $('body').on('click','.btn_trigger_edit_address',function(){
        //触发修改地址弹出窗口
        $('.btn_show_edit_address').trigger('click')
        if($(this).closest('.x_say_wrapper').find('.x_say_close_btn')){
            $(this).closest('.x_say_wrapper').find('.x_say_close_btn').trigger('click')
        }
    });

    $.fn.freshAddress = function(){
        $.ajax({
            url : $.fn.apihost + '/api/user/address',
            type : 'post',
            dataType : 'json',
            success : function( json ){
                var content = "";
                if(json.status == 1){
                    //获取数据成功
                    content = '<div class="div01">'+json.data.province_name+ json.data.city_name +'  <span>'+json.data.consignee+'收</span></div> \
                        <div class="div02">'+json.data.address+'<br/>'+json.data.mobile+'</div>';

                } else {
                    //获取数据失败
                }
                $('.user_address .info').html(content);
            }
        })
    }

    $.fn.cashPrize = function(){
        $('.btn_cash_prize').click(function(){

            var t = $(this);
            $.ajax({
                url : $.fn.apihost + '/api/user/address',
                type : 'post',
                dataType : 'json',
                success : function( json ){
                    var content = "";
                    var prize_norms_01 = '';
                    var prize_norms_02 = '';
                    var wrap_norms = '';
                    var marginTop = '50px';

                    var currentTr = t.closest('tr.tr_id');
                    json.data.prize_norms_01 = (currentTr.attr('data-prize_norms_01'));
                    json.data.prize_norms_02 = (currentTr.attr('data-prize_norms_02'));
                    if(json.data.prize_norms_01)
                        json.data.prize_norms_01 = $.parseJSON(json.data.prize_norms_01)
                    if(json.data.prize_norms_02)
                        json.data.prize_norms_02 = $.parseJSON(json.data.prize_norms_02)

                    if(json.status == 1){

                        //json.data.prize_norms_01 = ['白色','红色','灰色'];
                        //json.data.prize_norms_02 = ['白色','红色','灰色'];
                        //组织属性选择
                        //1>属性01
                        if(json.data.prize_norms_01 && json.data.prize_norms_01.length > 0){
                            prize_norms_01 = "<div class='norms_01'>";
                            for(var i in json.data.prize_norms_01){
                                var selectClass = i==0 ? "active" : '';
                                prize_norms_01 = prize_norms_01 + "<span class='"+selectClass+"'>"+json.data.prize_norms_01[i]+"</span>"
                            }
                            prize_norms_01 = prize_norms_01 + "</div>";
                        }
                        //2>属性02
                        if(json.data.prize_norms_02 && json.data.prize_norms_02.length > 0){
                            prize_norms_02 = "<div class='norms_02'>";
                            for(var i in json.data.prize_norms_02){
                                var selectClass = i==0 ? "active" : '';
                                prize_norms_02 = prize_norms_02 + "<span class='"+selectClass+"'>"+json.data.prize_norms_02[i]+"</span>"
                            }
                            prize_norms_02 += "</div>";
                        }
                        //3>属性连接
                        if(prize_norms_01.length>0 || prize_norms_02.length>0){
                            wrap_norms = '<div class="wrap_norms"> <div class="h5">选择奖品型号/规格</div> ';
                            if (prize_norms_01.length>0)
                                wrap_norms += prize_norms_01;
                            if (prize_norms_02.length>0)
                                wrap_norms += prize_norms_02;

                            wrap_norms += '</div>';
                        }

                        //1.获取地址数据成功 弹出窗口
                        content = '<div class="wrap_cash_prize">  \
                                        <div class="title h5">奖品收件信息</div> \
                                        <div class="div01">'+json.data.province_name+ json.data.city_name +'  <span>'+json.data.consignee+'收</span></div> \
                                        <div class="div02">'+json.data.address+'<br/>'+json.data.mobile+'</div> \
                                        <div class="btns"> \
                                        <a class="warning btn_trigger_edit_address" href="javascript:void(0)"  >设置/修改</a> </div> \
                                        '+wrap_norms+' \
                                    </div>';
                        //回调

                        /*$codeId = \Yii::$app->request->post('code_id');
                        $province = \Yii::$app->request->post('province');
                        $city = \Yii::$app->request->post('city');
                        $district = \Yii::$app->request->post('district',0);
                        $address = \Yii::$app->request->post('address');
                        $mobile = \Yii::$app->request->post('mobile');
                        $goodsDesc = \Yii::$app->request->post('goods_desc');*/

                        $.x_say_m({
                            cont: content,
                            btn : ['yes'],
                            btnOption : {yesLabel : '提交兑奖信息'},
                            contStyle :{padding : '10px 20px 20px 20px '},
                            time : 360000,
                            yesCallback : function(){

                                var goodsDesc = '';
                                $('.wrap_norms').find('.active').each(function(){
                                    goodsDesc = goodsDesc==''?$(this).html() : goodsDesc+'|'+$(this).html();
                                })

                                var callBackData = {
                                    code_id : currentTr.attr('data-id'),
                                    province : json.data.province,
                                    consignee : json.data.consignee,
                                    city : json.data.city,
                                    district : json.data.district,
                                    address : json.data.address,
                                    mobile : json.data.mobile,
                                    goods_desc : goodsDesc
                                }

                                $.ajax({
                                    url : $.fn.apihost + "/api/order/create",
                                    data : callBackData,
                                    type : 'post',
                                    success : function(json){
                                        $.x_say_m({
                                            cont : json.message,
                                            btn : {},
                                            time : 5000,
                                            bg : true,
                                            callback : function(){
                                                window.location.href = window.location.href;
                                            }
                                        });
                                    }
                                })
                            },
                            btnOption : {
                                yesLabel : '提交兑奖信息',
                                marginTop : marginTop
                            }
                        });

                    } else {
                        //2.获取地址数据失败 弹出窗口
                        marginTop = '90px';
                        content = '<div class="wrap_cash_prize">  \
                                        <div class="h5">暂未设置收件地址信息!</div>    \
                                        <a class="warning btn_trigger_edit_address" href="javascript:void(0)" >设置/修改</a> </div> \
                                        '+wrap_norms+' \
                                    </div>';

                        $.x_say_m({
                            cont: content,
                            btn : ['yes'],
                            btnOption : {yesLabel : '提交兑奖信息'},
                            contStyle :{padding : '10px 20px 20px 20px '},
                            time : 360000,
                            yesBtnExit : false,
                            yesCallback : function(){
                            },
                            btnOption : {
                                yesClass : 'yes btn btn-warning btn-primary disabled',
                                yesLabel : '提交兑奖信息',
                                marginTop : marginTop
                            }
                        });
                    }
                }
            })
        })
    }

    $.fn.lookShipping = function(){

        $('table').on('click','.look_shipping', function(){

            var currentTr = $(this).closest('.tr_id');
            var orderId = currentTr.attr('data-order-id');
            var cont = '<div class="text-left" style="line-height: 25px">' + $(this).attr('msg-title') + '</div>';
            $.x_say_m({
                cont : cont,
                contStyle : {padding : '40px 20px 20px 20px'},
                btnOption : {marginTop : '45px', yesLabel : '投诉', noLabel : '确定' },
                time : 0,
                yesCallback : function(){
                    var cont = '<div class="text-left">非物流原因，卖家故意拖延发货的，请及时投诉，我们将对供应商做出处罚... <br/><br/> ' +
                        '<textarea class="msg_content" class="mt-dl" style="width:90%; height: 50px;"></textarea> </div>'
                    $.x_say_m({
                        cont : cont,
                        contStyle : {padding : '40px 20px 20px 20px'},
                        btnOption : {marginTop : '45px', yesLabel : '确定投诉', noLabel : '点错了' },
                        time : 0,
                        yesCallback : function(exports){
                            var url = $.fn.apihost + '/api/order/feedback';
                            var msgContent = exports.cont.find('.msg_content').val();
                            var data = {
                                order_id : orderId,
                                msg_content : msgContent
                            }
                            $.ajax({
                                url : url,
                                data : data,
                                dataType : 'json',
                                type : 'post',
                                success : function(json){
                                    $.x_say_m({
                                        cont: json.message,
                                        time:5000,
                                        btn:[],
                                        callback:function(){
                                            if (json.status == 1)
                                                window.location.href = window.location.href;
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        })
    }

    $.fn.freshAddress();
    $.fn.cashPrize();
    $.fn.lookShipping();

})