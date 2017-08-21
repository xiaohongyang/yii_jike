<?php

use app\modules\jike\models\prize_goods\Prize_goods;

use kartik\popover\PopoverX;
use rmrevin\yii\fontawesome\FA;
use yii\bootstrap\Dropdown;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\web\JqueryAsset;

Yii::$app->view->registerJsFile(Yii::getAlias("@web").'js/ext/jqzoom/jquery.imagezoom.min.js',['depends'=>JqueryAsset::className()]);

if($model instanceof Prize_goods){
?>




<div class="jike-goods-detail">

    <div class="floater">
        <div class="wrapper">
            <ul>
                <li class="dropdown">
                    <a href="javascript:void(0)" title="商家微信" class="float-01" data-toggle="dropdown" aria-haspopup="true" onmouseover="$(this).trigger('click')" aria-expanded="false">商家微信</a>
                    <div class="dropdown-menu" aria-labelledby="dLabel" style="right:0; left: auto; top: 0; z-index: 99999; position: absolute; margin-top:0; ">
                        <img
                            src="<?=is_object($model->wxQrcode) ? getImageHost().'/'.$model->wxQrcode->file_dir.'/'.$model->wxQrcode->getAttribute('file_name') : ''?>"
                            onmouseout=" setTimeout(function(){$('body').trigger('click')},200)"
                        /><br/>
                        <span>扫描关注微博微信</span>
                    </div>
                </li>
                <li><a href="<?=$model->goods_link?>" target="_blank" title="在线购买" class="float-02">在线购买</a></li>
                <li><a href="javascript:void(0);" onclick="$('#zero-prize-btn').focus();" title="0元夺宝" class="float-03">0元夺宝</a></li>
                <li><a href="<?=$model->offcial_website?>" target="_blank" title="品牌相关" class="float-04">品牌相关</a></li>
                <li class="to_top"><a href="javascript:void(0)" onclick=" window.scrollTo(0,0)"></a> </li>

            </ul>
        </div>
    </div>

    <div class="row ">
        <div class="col-md-12" style="overflow: hidden;">
            <div class="title">
                <!-- <?php
                echo 321321;
                p($model);
                p($model->pics);
                ?>
            -->
                <?=$model->prize_name?>

            </div>
            <div class="pics">
                <?php
                if(is_array($model->pics) && count($model->pics)){
                    foreach($model->pics as $pic){
                        $picHtml = Html::img(
                            getImageHost().'/'.$pic->file_dir.'/'.$pic->getAttribute('file_name'),
                            ['class' => 'img-responsive']
                        );
                        echo $picHtml;
                    }
                }
                ?>
            </div>

            <div class="detail">
                <!--jquery zoom begin-->
                <div class="jq-zoom">
                    <div class="box">
                        <div class="tb-booth tb-pic tb-s310">
                            <?php
                                if(is_array($model->pics) && count($model->pics)){
                            ?>
                                    <a href="images/01.jpg"><img
                                            src="<?=getImageHost().'/'.$model->pics[0]->file_dir.'/'.$model->pics[0]->getAttribute('file_name')?>" alt=""
                                            rel="<?=getImageHost().'/'.$model->pics[0]->file_dir.'/'.$model->pics[0]->getAttribute('file_name')?>"
                                            class="jqzoom"/></a>
                            <?php
                                }
                            ?>

                        </div>
                        <div class="wrap-thumb">
                            <span class="scroll-left" data-target="#thumblist"><?=FA::icon('chevron-left')?></span>
                            <ul class="tb-thumb" id="thumblist">

                                <?php
                                    if(is_array($model->pics) && count($model->pics)){
                                        foreach($model->pics as $serialize => $pic){
                                ?>
                                            <li <?=$serialize==0 ? "class='tb-selected'" : ''?>>
                                                <div class="tb-pic tb-s40"><a href="javascript:void(0);"><img
                                                            src="<?=getImageHost().'/'.$pic->file_dir.'/'.$pic->getAttribute('file_name')?>"
                                                            mid="<?=getImageHost().'/'.$pic->file_dir.'/'.$pic->getAttribute('file_name')?>"
                                                            big="<?=getImageHost().'/'.$pic->file_dir.'/'.$pic->getAttribute('file_name')?>"></a></div>
                                            </li>
                                <?php
                                        }
                                    }
                                ?>
                            </ul>
                            <span class="scroll-right" data-target="#thumblist"><?=FA::icon('chevron-right')?></span>
                        </div>
                    </div>
                </div>
                <!--jquery zoom end-->

                <div class="content container">

                    <div class="title">
                        <?=$model->prize_name?>
                    </div>

                    <div class="price">
                        市场价值：<span class="money"><?=$model->market_price?>¥</span>
                    </div>

                    <div class="need-times">
                        <div class="total">夺宝总需求：<span class="times"><?=$model->market_price*10?></span>次</div>

                        <div  class="row">
                            <div class=" col-md-10">
                                <div class="progress_xhy_bg">
                                    <div class="progress_xhy">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                已参与人次:
                                <span class="nopadding data-ajax-update-html" id="join_number"
                                      data-url="<?=Url::to(['/api/zeroprize/prizeTimes'])?>"
                                      data-data='{"id":"<?=$model->prize_id?>"}'></span>
                            </div>
                            <div class="col-md-4 text-right">
                                剩余人次:
                                <span class="data-ajax-update-html" id="left_number"
                                          data-url="<?= Url::to(['/api/zeroprize/prizeLeftTimes']) ?>"
                                          data-data='{"id":"<?= $model->prize_id ?>"}'></span>
                            </div>
                        </div>

                        <div>
                            您还有3次0元夺取本商品的机会
                        </div>
                    </div>

                    <div class="buy buttons div_id" data-prize_id="<?=$model->prize_id?>">
                        <a href="<?=$model->goods_link?>" class="btn btn-warning " target="_blank">去天旗舰店购买</a>
                        <a href="javascript:void(0);" class="btn btn-warning popup-lucky" id="zero-prize-btn" data-prize-id="<?=$model->prize_id?>"
                           data-title="开始抽奖" data-url="<?=Url::to(['index/luckydraw'])?>">
                            0元夺宝
                        </a>
                        <a href="javascript:void(0)" class="btn btn-warning btn_one_prize">
                            积分抽奖
                        </a>
                    </div>


                    <div class="desc">
                        <h4>0元夺宝规则：</h4>

                        1. 每件商品，每天你有3次夺宝机会；<br/>
                        2. 每完成一次夺宝，你将获得一组夺宝序列号，存入你的兑奖信息列表内；登录后，在我的集客之0元夺宝兑奖页面，查看兑奖结果…<br/>
                        3. 当前商品完成夺宝总需求次数后，系统将自动抽取出中奖序列号，随机抽取…<br/>
                        4. 夺宝后，请及时返回查看开奖状态；如有中奖，系统将短信通知您中奖，请在10天内，返回兑奖（选择奖品型号，设置奖品收件地址），否则系统将默认您已放弃兑奖…<br/>

                        <p>
                        注1： 夺宝总需求，商品0元夺宝的总需求次数 = 商品市场价值 * 10 <br/>
                        注2： 夺宝序列号，夺宝序列号 = 您参加本商品夺宝的顺序，序位号 <br/>
                        注3： 关于公正性，集客0元夺宝是由品牌供应商直接提供给消费者的一种奖励；奖品由供应商直接发布和发货，夺宝信息及中奖信息将受到供应商的严格监督，公平公正…
                        </p>

                        <br/>
                        <br/>
                        <h4>奖品描述：</h4>
                        <?=$model->prize_describe?>



                    </div>


                </div>
            </div>

        </div>
    </div>
</div>

    <input type="hidden" name="prize_id" value="<?=Yii::$app->getRequest()->get('id')?>" />





<?php
}


?>


<?php

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
                                    $('.popup-lucky').trigger('click');
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


                $('body').on('click', '.popup-lucky', function(){
                    $.fn.zeroPrize.luckyDraw($(this));
                })

STD;


Yii::$app->view->registerJs($jsString, \yii\web\View::POS_READY);
?>




<div class="hide">
    <a class="playbtn-hide" href="javascript:;" title="开始抽奖"></a>
    <br/><br/><br/>
</div>
    <input type="hidden" id="csrf_xhy"   value="<?=Yii::$app->request->getCsrfToken()?>" />
<?php
    Yii::$app->view->registerJsFile(Yii::getAlias("@web").'/js/ext/jquery.rotate.min.js', ['depends'=>'yii\web\YiiAsset']);
?>



