<?php
    use yii\helpers\Html;
    use yii\helpers\Url;

    $this->params['breadcrumbs'] = [
        ['label'=>'营销推广','#'],
        ['label'=>'视频广告营销','#'],
        ['label'=>'产品及服务说明','url'=>'#']
    ];

?>


<?php
    Yii::$app->view->registerCssFile('/css/frontadmin/advideo/info.css');
?>


        <nav >
            <ul >
                <li>
                    <?=Html::a("产品及服务说明",Url::to(['advideo/info']),['class'=>' btn-active'])?>
                </li>
                <li>
                    <?=Html::a("广告视频发布/管理",Url::to(['advideo/index']),['class'=>' btn-gray'])?>
                </li>

            </ul>
        </nav>


        <div class="main-wrapper">
            <div class="row mt-dl">
                <div class="col-md-12 create-row mt-dl">
                    <span class="bold ">集客爱心抽奖品牌视频广告产品说明：</span> <br/>
                    <ul>
                        <li>
                            <span class="bold">什么是集客抽奖视频广告：</span> <br/>
                            就是指用户参加集客爱心抽奖活动，抽奖期间，播放的一段15秒广告视频。
                        </li>

                        <li>
                            <span class="bold">爱心抽奖是什么意思：</span><br/>
                            集客的抽奖活动，用户所获积分，是由品牌广告商提供赞助，并返回给抽奖用户；用户获得积分后，可随意参加爱心捐助，捐助给求助人，从而完成爱心传递的过程...
                        </li>

                        <li>
                            <span class="bold">集客爱心抽奖视频广告产品有什么特点：</span><br/>
                            1.回避率低：单任务操作模式，每一次抽奖，只播放一段15秒广告... <br/>
                            2.展示效果更佳：页面纯粹干净，无任何干扰信息，视觉冲击力更佳，展示效果更好；<br/>
                            3.定位更精准：按照区域精确定位；<br/>
                            4.费用精准可控：<br/>
                            .投入自由，无最低金额限制，小额尝试，随时追加，随时停止，不会造成浪费... <br/>
                            .点播计费，同一个广告，每个用户，每天限播三次(随机抽取，重复率低) <br/>
                            .账目随时可查；每次点播都有流水记录，随时可查，真实有据，保证每一分钱广告费都花得值 <br/>
                            5.价格更便宜: 15秒(唯一标准)视频广告--50元/CPM,同样的视频广告,集客的价格偏低，效果最佳... <br/>
                        </li>
                        <li>
                            <span class="bold">如何加入推广:</span> <br/>
                            1.任何会员都可以发布广告视频...广告视频发布后，请等待视频审核和转码... <br/>
                            2.请及时给对应的广告子账户充值(子账户的充值金额从对应的营销账户扣除); <br/>
                            3.广告子账户余额为0,自动停止推广... <br/>
                            4.删除广告后，对应广告子账户余额将退还到对应营销账户...
                        </li>
                    </ul>

                </div>
            </div>

        </div>
