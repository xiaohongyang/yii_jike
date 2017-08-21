<?php

use app\modules\common\lib\GridView;
use app\widgets\AjaxSubmitForm;
use app\widgets\AreaPickerWidget;
use kartik\grid\SerialColumn;
use kartik\icons\Icon;
use xj\bootbox\BootboxAsset;
use yii\bootstrap\Alert;
use yii\bootstrap\Html;
use yii\bootstrap\Modal;
use yii\helpers\Url;
use yii\web\View;
use yii\widgets\ActiveForm;
use yii\widgets\LinkPager;

$this->params['breadcrumbs'] = [
    ['label'=>'营销推广','#'],
    ['label'=>'视频广告营销','#'],
    ['label'=>'夺宝奖品发布与管理','url'=>'#']
];
?>


        <nav >
            <ul >
                <li>
                    <?=Html::a("产品及服务说明",Url::to(['advideo/info']),['class'=>' btn-gray'])?>
                </li>
                <li>
                    <?=Html::a("广告视频发布/管理",Url::to(['advideo/index']),['class'=>' btn-active'])?>
                </li>

            </ul>
        </nav>

        <div class="clearfix"></div>

        <div class="main-wrapper">
            <div class="row mt-dl">
                <div class="col-md-12 create-row">
                    <span class="bold">广告视频列表:</span>
                    <span class="lightgray ">&nbsp;
                        (同一个账户,可同时发布多个广告,广告子账户充值后,播出广告)
                    </span>

                    <button class="btn btn-active pull-right" data-toggle="modal" data-target="#create">添加广告</button>
                </div>
            </div>

            <div class="row ">
                <div class="col-md-12">
                    <?=GridView::widget([
                        'dataProvider' => $dataProvider,
                        'striped' => false,
                        'columns' => [
                            ['class' => SerialColumn::className()],
                            'ad_title',
                            [
                                'attribute' => 'account.money',
                                'format' => 'raw',
                                'value' => function($model){
                                    $content = <<<STD
                                        <div class="current-money">{$model->account->money}</div>
STD;
                                    return $content;
                                }
                            ],
                            [
                                'attribute' => 'accountAdd',
                                'format' => 'raw',
                                'value' => function($model, $key, $index){

//                                    $minus = Icon::show('minus',[],Icon::BSG);
//                                    $plus = Icon::show('plus',[],Icon::BSG);
                                    $minus = '-';
                                    $plus = '+';

                                    $result = <<<STR
                                        <div class="money_set_div">
                                            <button class="btn btn-xs sub">{$minus}</button><input type="text" class="money" value="100" style="width: 80px" /><input type="hidden" class="id" value="{$model->ad_id}" /><button class="btn btn-xs add">{$plus}</button>
                                            <button class="btn btn-xs recharge">确定</button>
                                        </div>
STR;
                                    return $result;
                                }
                            ],
                            [
                                'attribute' => 'advertiserState',
                                'format' => 'raw',
                                'value' => function ($model, $key, $index, $grid){
                                    $html = "<div class='ajax-video-status' data-id='{$model->ad_id}'>获取获取中...</div>";
                                    return $html;
                                }
                            ],
                            [
                                'attribute' => 'edit',
                                'format' => 'raw',
                                'value' => function ($model, $key, $index, $grid){
                                    $result = Html::a("修改", 'javascript:void(0)', [
                                        'class' => 'edit-btn',
                                        'data-url' => Url::to(['advideo/edit','id'=>$model->ad_id]),
                                        'data-toggle' => 'modal',
                                        'data-target' => '#edit'
                                    ]);
                                    return  $result;
                                }
                            ],
                            [
                                'attribute' => 'del',
                                'format' => 'raw',
                                'value' => function($model, $key, $index, $grid){
                                    $result = Html::a("删除",'javascript:void(0)', [
                                        'class' => 'remove-btn',
                                        'data-url' => Url::to(['advideo/remove','id'=>$model->ad_id])
                                    ]);
                                    return  $result;
                                }
                            ],
                            [
                                'attribute' => 'down',
                                'format' => 'raw',
                                'value' => function($model){
                                    $html = Html::a("下载", Url::to(['advideo/downAccountLog','id'=>$model->ad_id]), ['class'=>'warning']);
                                    return $html;
                                }
                            ]
                        ]
                    ]);?>
                </div>
            </div>

        </div>




<?php
    Modal::begin([
        'header' => '添加广告信息',
        'size' => Modal::SIZE_LARGE,
        'toggleButton' => [
            'label' => '添加广告', 'class' => 'btn btn-success hide', 'tag'=>'a'
        ],
        'options' => ['id'=>'create']
    ]);
?>
<div>
    <iframe id="iframe_create_video" class="actionIframe" src="<?=Url::to(['advideo/create'])?>"  scrolling="auto"
    ></iframe>
</div>
<?php
    Modal::end();
?>


<?php
    Modal::begin([
        'header' => '修改广告信息',
        'size' => Modal::SIZE_LARGE,
        'toggleButton' => [
            'label' => '修改广告', 'class' => 'btn btn-success hide', 'tag'=>'a'
        ],
        'options' => ['id'=>'edit']
    ]);
?>
<div>
    <iframe id="iframe_edit_video" class="actionIframe" src=""  scrolling="auto"
    ></iframe>
</div>
<?php
    Modal::end();
?>


<?php
    Yii::$app->view->on(View::EVENT_END_PAGE, function(){

        $infoSuccess = Yii::$app->session->getFlash('info_success');
        $infoFail = Yii::$app->session->getFlash('info_fail');
        $delInfo = $infoSuccess ? : ($infoFail ? : '') ;

        $ajaxVieoStatusUrl = Url::to(['/api/video/status']);
        $ajaxRechargeUrl = Url::to(['/api/video/recharge']);
        $str = <<<STD
            <script type="text/javascript">

                //1.加价和减价
                $.fn.videoAccount = {
                    moneyError : '充值金额必须大于0!',
                    stepMoney : 100,
                    init : function(){
                        this.btnSub = $('button.sub');
                        this.btnAdd = $('button.add');
                        this.rechargeBtn = $('button.recharge')
                        this.setEvent();
                    },
                    setEvent : function(){
                        this.eventSub();
                        this.eventAdd();
                        this.eventRecharge();
                    },
                    eventSub : function(){
                        //减少金额
                        var videoAccount = this;
                        this.btnSub.on('click',function(){
                            var money = $(this).parent().find('input.money');
                            if(isNaN(money.val()))
                                money.val(0)
                            var moneyValue = parseFloat(money.val()) - videoAccount.stepMoney;
                            if(moneyValue < 0){
                                return;
                            }else{
                                money.val(moneyValue);
                            }
                        })
                    },
                    eventAdd : function(){
                        //增加金额
                        var videoAccount = this;
                        this.btnAdd.on('click',function(){
                            var money = $(this).parent().find('input.money');
                            if(isNaN(money.val()))
                                money.val(0);
                            var moneyValue = parseFloat(money.val()) + videoAccount.stepMoney;
                            money.val(moneyValue);
                        })
                    },
                    eventRecharge : function(){

                        videoAccount = this;
                        this.rechargeBtn.on('click',function(){
                            var money = $(this).parent().find('input.money');
                            var id = $(this).parent().find('input.id');
                            var changeObj = $(this).closest('tr').find('.current-money');

                            var idValue = id.val();
                            if(isNaN(money.val())){
                                $.x_alert({'cont':'金额必须为数字!'})
                                return;
                            }

                            var moneyValue = parseFloat(money.val());
                            if(moneyValue <=0 ){
                                //$.fn.alert.show(videoAccount.moneyError)
                                $.x_alert({'cont': videoAccount.moneyError})
                            }else{
                                videoAccount.recharge(idValue, moneyValue, changeObj);
                            }
                        })
                    },
                    recharge : function(id, money, changeObj){
                        $.ajax({
                            url : "{$ajaxRechargeUrl}",
                            data : {id:id, money:money, _csrf : $.fn.csrf_xhy},
                            type : 'post',
                            dataType : 'json',
                            success : function(json){

                                $.x_alert({'cont': json.message})

                                if(json.status == 1){
                                    changeObj.html(parseFloat(changeObj.html()) + money)
                                }
                            }
                        })
                    }

                }

                $.fn.ajaxGetVideoStatus = {
                    init : function(){
                        $('.ajax-video-status').each(function(){

                            var showDiv = $(this);
                            var id = showDiv.attr('data-id');
                            $.ajax({
                                url : "{$ajaxVieoStatusUrl}?id="+id,
                                type : 'get',
                                dataType : 'json',
                                success : function(json){
                                    if(json.message.length > 0)
                                        showDiv.html(json.message)
                                }
                            })
                        })
                    }
                }

                $.fn.delVideo = {
                    init : function(){
                        $('.remove-btn').click(function(){

                            var url = $(this).attr('data-url');
                            bootbox.setDefaults({locale:'zh_CN'});
                            bootbox.confirm("确认要删除吗?", function(result) {
                                if (result) {
                                    window.location.href=url;
                                } else {
                                }
                            });
                        })
                    }
                }

                $(function(){

                    $.fn.videoAccount.init();
                    $.fn.ajaxGetVideoStatus.init();
                    $.fn.delVideo.init();

                    $('.edit-btn').on('click',function(){

                        var url = $(this).attr('data-url');
                        $('#iframe_edit_video').attr('src',url+'&time='+Math.random())
                    })

                    var delInfo="{$delInfo}";
                    if(delInfo.length>0){
                        $.x_alert({
                            cont: delInfo
                        });
                    }

                })
            </script>
STD;

        echo $str;

    })
?>