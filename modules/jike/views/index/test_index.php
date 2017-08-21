<?php
use app\ext\common\helpers\MobileMsgHelpers;
use app\modules\frontadmin\models\article\Article;
use kartik\icons\Icon;
use yii\bootstrap\Html;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\widgets\Pjax;

?>

<?php
    Yii::$app->view->registerCssFile("/css/jike/index/index.css");
?>

<style type="text/css">

    body.jike.body-jike-index-index .wrap .goods-wrapper .btn-wrp{
        background: none !important;
    }

    body.jike.body-jike-index-index .wrap .goods-wrapper .btn-wrp a, body.jike.body-jike-index-index .wrap .goods-wrapper .btn-wrp a.btn-buy{

        background: #ff7516 !important;
        border-radius: 3px;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;

        text-align: center;
        padding-left: 0;
        padding: 0;
        text-indent: 0;
        line-height: 29px;

        font-size: 13px;
        right: 74px;
        width: 90px;
    }

</style>

<div class="index-index">

    <div class="floater" style="top: 587px;" position="middle">
        <div class="wrapper" >
            <ul>
                <li class="to_top"><a href="javascript:void(0)" onclick=" window.scrollTo(0,0)"><img src="/images/btn_to_top_02.png"></a></li>
            </ul>
        </div>
    </div>

    <div class="head row">
        <div class="left col-md-3">
            <img src="/images/logo.png" />
        </div>

        <div class="right col-md-9 pull-right">
            <?php
                if(isGuest()){
            ?>
                    <ul class="not-login">
                        <li><a href="<?=Url::to(['/frontadmin/usercenter/index'])?>"><img  src="/images/head_pic_not_login.png" /></a></li>
                        <li><?=Html::a("登录", Url::to(["/public/login"]) )?></li>
                        <li><?=Html::a("注册", Url::to(["/public/register"]) )?></li>
                        <li></li>
                    </ul>
            <?php
                } else {
            ?>
                    <ul class="loged">
                        <li><a href="<?=Url::to(['/frontadmin/usercenter/index'])?>"><img  src="<?=Yii::$app->jike_user->identity->getHeadPic()?>" /></a></li>
                        <li>&nbsp;&nbsp;<?=Yii::$app->jike_user->identity->user_name?></li>
                        <li><?=Html::a("退出", Url::to(["/public/logout"]) )?></li>
                        <li></li>
                    </ul>
            <?php
                }
            ?>

        </div>
    </div>


    <?php
        if(!is_null($activity) && $activity instanceof Article){

                if(is_array($activity->pics) && count($activity->pics)){

                    $arr = [];
                    foreach($activity->pics as $pic){
                        $img = '/'.$pic->getAttribute('file_dir').'/'.$pic->getAttribute('file_name');
                        $arr[] = ['img'=>$img, 'href'=>'javascript:void(0)'];
                    }
                }
            ?>
            <div class="barnner">
            <div class="pics">

                <div class="x_slider"
                     data-items='<?=json_encode($arr)?>'
                     style="width:900px; height:385px; border:1px solid gray;"></div>

            </div>
            <div class="lucky-draw">
                <div>
                    <img src="<?=Yii::getAlias("@web/images/earth_pic_01.png")?>">

                    <div class="draw center-block">


                        <p class="p1">
                            &nbsp;
                            <!--集客大奖-->
                        </p>
                        <p class="p2">
                            集客大奖
                        </p>
                        <p class="p3">
                            免费环游世界,活动进行中...
                        </p>

                        <div class="buttons">
                            <button class="btn btn-warning btn-act01  popup-lucky" data-title="开始抽奖" data-url="<?=Url::to(['index/luckydraw'])?>">开始抽奖</button>
                            <!--<button class="btn btn-primary btn-act02 pull-right x_popup" data-title="兑奖">兑奖</button>-->
                            <?=Html::a("兑奖", Url::to(['/frontadmin/usercenter/cashPrize']),['class'=>'btn btn-primary btn-act02 pull-right '])?>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        <?php
        }
    ?>


    <div class="content-wrapper">

        <div class="catgory-nav">
            <ul>

                <li >
                    <span></span><a href="#" class="btn-ajax-link active " data-type-id="0">今日值得买</a>
                </li>
            </ul>

        </div>

        <?php
            $goodsList = [];
            $file = Yii::getAlias('@webroot'). '/string_goods.txt';

            echo '<!--';
            $list = file($file);
            echo '-->';

            if(is_array($list) && count($list)){
                foreach ($list as $item){
                    $arr = explode('$==$', $item);
                    $goods = [];
                    $goods['src'] =  'http:' . $arr[1];
                    $goods['href'] =  'http:' . $arr[0];
                    $goods['title'] =  $arr[2];

                    if( strlen($goods['src']) < 15 || strlen($goods['href']) < 15 || strpos($goods['src'], 'http:data:image')!==false)
                        continue;

                    $goodsList[] = $goods;
                }
            }

        ?>

        <div class="goods-list text-center" id="goods- ">
            <table class="table table-bordered text-center">

                <tbody>
                <tr>

                    <?php
                        $i=0;
                        foreach ($goodsList as $goods){
                            $i++;
                            if(($i-1)%4==0 && $i!=1)
                                echo "</tr><tr>";
                    ?>
                            <td class="goods-wrapper">
                                <div class="pic" style="padding-top: 20px;">
                                    <a href="<?=$goods['href']?>" target="_blank">
                                        <img
                                            src="<?=$goods['src']?>">
                                    </a>
                                </div>
                                <div class="title">
                                    <a href="<?=$goods['href']?>" target="_blank"><?=$goods['title']?></a>
                                </div>
                                <div class="btn-wrp">

                                    <a href="<?=$goods['href']?>" target="_blank"   class="btn  btn-warning   btn-buy"
                                       id="zero-prize-btn" data-prize-id="110" data-title="开始抽奖" data-url="/jike/index/luckydraw">立刻购买</a>

                                </div>
                            </td>
                    <?php
                        }
                    ?>

                </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>


    <?php

        $luckydrawstep01Url = Url::to(['/api/video/luckydrawstep01']);
        $luckydrawstep02Url = Url::to(['/api/video/luckydrawstep02']);
        $loginUrl = Url::to(['/public/login']);
        $jsString = <<<STD

                var cnt = '鼓励奖！本次抽奖，您获得5点积分，已存入您的积分账户...请再接再厉，赢取环游世界大奖...';

                //抽奖成功
                var luckySuccess = function(x_popup,json){
                    $.x_say_m({
                        cont : json.message,
                        btnOption : { yesLabel : '再来一次', noLabel : '退出'},
                        btn : ['no','yes'],
                        title : '提示',
                        time : 0,
                        bg : true,
                        yesCallback : function(exports, btn){
                            //再来一次
                            /*var src = $(x_popup.wrapper).find('iframe').attr('src');
                            $(x_popup.wrapper).find('iframe').attr('src', src);
                            var time=15;
                            fnLucky(time, x_popup)*/
                            x_popup.wrapper._del();
                            exports.wrapper._del();
                            $(".popup-lucky").trigger('click');
                        },
                        noCallback : function(exports, btn){
                            //退出
                            x_popup.wrapper._del();
                            exports.wrapper._del();
                        }
                    });
                }

                //未登录抽奖失败
                var luckyFailLogin = function(x_popup,json){
                    $.x_say_m({
                        cont : json.message,
                        btnOption : { yesLabel : '退出', noLabel : '立刻登录'},
                        time : 0,
                        bg : true,
                        yesCallback : function(exports, btn){
                            //退出
                            x_popup.wrapper._del();
                            exports.wrapper._del();
                        },
                        noCallback : function(exports, btn){
                            //立刻登录
                            document.location.href= '{$loginUrl}'
                        }
                    });
                }


                //抽奖第一步播放视频
                var luckyDraw = function(obj){
                    var t = obj;
                    var url = t.attr('data-url');

                    $.ajax({
                        url : '{$luckydrawstep01Url}',
                        type : 'get',
                        dataType : 'json',
                        success : function (json){


                            if(json.status == 1){
                                //抽奖视频
                                url = url+'?vu='+json.data.vu;
                                var lDraw = $.fn.luckyDraw({'url' : url,'link' : json.data.link, title:' 广告 &nbsp;&nbsp; 抽奖进行中...'});
                                fnLucky($.fn.luckyTime, lDraw);
                            } else if( json.status == 2 ){
                                //公益视频
                                url = url+'?vu='+json.data.vu;
                                var lDraw = $.fn.luckyDraw({'url' : url, title:' 广告 &nbsp;&nbsp; 抽奖进行中...'});
                                fnLucky($.fn.luckyTime, lDraw);
                            } else {
                                $.x_say_x({cont : "暂无抽奖活动!"});
                            }
                        }
                    })

                }

                $('.popup-lucky').click(function(){
                    luckyDraw($(this));
                })

                //指定时间后执行抽奖第二步-积分抽奖
                var fnLucky = function(time, x_popup){

                    var title = x_popup.opt.title;
                    var timer = setInterval(function(){

                        if(time < 0){

                            $.ajax({
                                url : '{$luckydrawstep02Url}',
                                type : 'get',
                                dataType : 'json',
                                async : false,
                                success : function(json){

                                    clearInterval(timer);
                                    x_popup.title.html("抽奖结束");
                                    if(json.status==1 || json.status==-1){
                                        luckySuccess(x_popup, json);
                                    }else {
                                        luckyFailLogin(x_popup, json);
                                    }
                                    return;
                                }
                            })
                        }else{
                            x_popup.win.find('.title').html('<span class="time">' + time + '</span>' + title);
                            time = time - 1;
                        }
                    },1000)

                    //取消抽奖timer
                    x_popup.opt.callback = function(){
                        clearTimeout(timer);
                    }
                }
STD;


        Yii::$app->view->registerJs($jsString, \yii\web\View::POS_READY);
    ?>



<?php
//0元抽奖
$zeroLuckydrawstep01Url = Url::to(['/api/zeroprize/zeroPrizeStep01']);
$zeroLuckydrawstep02Url = Url::to(['/api/zeroprize/zeroPrizeStemp02']);
$loginUrl = Url::to(['/public/login']);
$jsString = <<<STD


                $.fn.ajax_update_html({fn:$.fn.updateProgress_xhy});
                $.fn.zeroPrize = {
                    cnt : '鼓励奖！本次抽奖，您获得5点积分，已存入您的积分账户...请再接再厉，赢取环游世界大奖...',
                    luckySuccess : function(x_popup,json){


                            $.x_say_m({
                                cont : json.message,
                                btnOption : { yesLabel : '退出', noLabel : '再来一次'},
                                time : 0,
                                bg : true,
                                yesCallback : function(exports, btn){
                                    //退出
                                    x_popup.wrapper._del();
                                    exports.wrapper._del();
                                },
                                noCallback : function(exports, btn){
                                    //再来一次
                                    x_popup.wrapper._del();
                                    exports.wrapper._del();
                                    $(".zero-popup-lucky[data-prize-id='"+json.data.prize_id+"']").trigger('click');
                                }
                            });
                        },
                    //未登录抽奖失败
                    luckyFailLogin : function(x_popup,json){
                            $.x_say_m({
                                cont : json.message,
                                btnOption : { yesLabel : '退出', noLabel : '立刻登录'},
                                time : 0,
                                bg : true,
                                yesCallback : function(exports, btn){
                                    //退出
                                    x_popup.wrapper._del();
                                    exports.wrapper._del();
                                },
                                noCallback : function(exports, btn){
                                    //立刻登录
                                    document.location.href= '{$loginUrl}'
                                }
                            });
                        },
                    //抽奖第一步播放视频
                    luckyDraw : function(obj){
                            var t = obj;
                            var url = t.attr('data-url');
                            var id = t.attr('data-prize-id');
                            var data = {id:id};

                            $.ajax({
                                url : '{$zeroLuckydrawstep01Url}',
                                data : data,
                                type : 'post',
                                dataType : 'json',
                                success : function (json){

                                    if(json.status == 1){
                                        url = url+'?vu='+json.data.vu;

                                        luckyData = {'url' : url, title:' 广告 &nbsp;&nbsp; 夺宝进行中...'}
                                        luckyData.link = json.data.link ? json.data.link : ''
                                        var lDraw = $.fn.luckyDraw(luckyData);
                                        $.fn.zeroPrize.fnLucky($.fn.luckyTime, lDraw, json.data.prize_id);
                                    } else {
                                        if(json.message == '您尚未登录，请先登录!'){
                                            $.fn.showLoginModal();
                                        } else {
                                            $.x_say_x({cont : json.message ? json.message : "暂无抽奖活动!"});
                                        }
                                    }
                                }
                            })

                        },
                    //指定时间后执行抽奖第二步-积分抽奖
                    fnLucky : function(time, x_popup, prize_id){

                            var title = x_popup.opt.title;
                            var timer = setInterval(function(){

                                if(time < 0){

                                    var id = prize_id;
                                    var data = {id:id};
                                    $.ajax({
                                        url : '{$zeroLuckydrawstep02Url}',
                                        type : 'post',
                                        data : data,
                                        dataType : 'json',
                                        async : false,
                                        success : function(json){

                                            clearInterval(timer);
                                            x_popup.title.html("抽奖结束");

                                            if(json.status==1 || json.status==0){
                                                $.fn.zeroPrize.luckySuccess(x_popup, json);
                                                $.fn.ajax_update_html({fn:$.fn.updateProgress_xhy});
                                            }else {
                                                $.fn.zeroPrize.luckyFailLogin(x_popup, json);
                                            }
                                            return;
                                        }
                                    })
                                }else{
                                    x_popup.win.find('.title').html('<span class="time">' + time + '</span>' + title);
                                    time = time - 1;
                                }
                            },1000)

                            //取消抽奖timer
                            x_popup.opt.callback = function(){
                                clearTimeout(timer);
                            }
                        }
                }

                $('body').on('click', '.zero-popup-lucky', function(){
                    $.fn.zeroPrize.luckyDraw($(this));
                })

STD;

Yii::$app->view->registerJs($jsString, \yii\web\View::POS_READY);
?>