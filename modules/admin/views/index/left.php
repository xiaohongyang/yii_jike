<?php
use yii\web\View;
?>

<div class="tool_btn">
</div>

<ul id="J_Nav" class="nav-list ks-clear">
    <li class="nav-item dl-selected active">
        <div class="nav-item-inner nav-setup " >业务管理</div>
        <ul class="active">
            <li>
                <a href="<?= \Yii::$app->urlManager->createUrl('/admin/busyness/custom')?>" target="main"> 客户信息管理 </a>
            </li>
        </ul>
    </li>
    <li class="nav-item">
        <div class="nav-item-inner nav-order">网站管理</div>
        <ul>
            <li>
                <a href="<?=\Yii::$app->urlManager->createUrl('/admin/lovevideo/list')?>" target="main" > 公益广告管理 </a>
            </li>
            <li>
                <a href="<?=\Yii::$app->urlManager->createUrl('/admin/articletype/channel')?>" target="main"> 附属信息管理 </a>
            </li>
            <li>
                <a href="<?=\Yii::$app->urlManager->createUrl('/admin/config/index')?>" target="main"> 配置管理 </a>
            </li>
        </ul>
    </li>
    <li class="nav-item">
        <div class="nav-item-inner nav-inventory">客服管理</div>
        <ul>
            <li>
                <a href="<?=Yii::$app->urlManager->createUrl('/admin/zeroprize/verify')?>" target="main"> 0元夺宝奖品信息审核 </a>
            </li>
            <li>
                <a href="<?=Yii::$app->urlManager->createUrl('/admin/zeroprize/cashprize')?>" target="main"> 0元夺宝兑奖管理 </a>
            </li>
            <li>
                <a href="<?=Yii::$app->urlManager->createUrl('/admin/activity/release')?>" target="main"> 集客狂欢活动信息管理 </a>
            </li>
        </ul>
    </li>
    <li class="nav-item">
        <div class="nav-item-inner nav-supplier">财务管理</div>
        <ul>
            <li>
                <a href="<?=Yii::$app->urlManager->createUrl('/admin/finance/invoice')?>" target="main"> 营销账户充值及发票管理 </a>
            </li>
            <li>
                <a href="<?=Yii::$app->urlManager->createUrl('/admin/finance/integrate')?>" target="main"> 积分兑现管理 </a>
            </li>
            <li>
                <a href="<?=Yii::$app->urlManager->createUrl('/admin/finance/frozen')?>" target="main"> 保证金退款管理 </a>
            </li>
        </ul>
    </li>
    <li class="nav-item">
        <div class="nav-item-inner nav-marketing">管理员管理</div>
        <ul>
            <li>
                <a href="<?=Yii::$app->urlManager->createUrl('/admin/user/list')?>" target="main"> 管理员管理 </a>
            </li>
            <li>
                <a href="<?=Yii::$app->urlManager->createUrl('/admin/user/count')?>" target="main"> 数据统计 </a>
            </li>
        </ul>
    </li>
</ul>


<?php
    $jsString = <<<STD
        $(function(){

            $('.tool_btn').click(function(){

                if( $('ul.nav-list > li.active') ){
                    $('ul.nav-list > li.active').each(function(){
                        $(this).find('div').trigger('click')
                    })
                }
            })

            $('ul.nav-list > li > div').click(function(){



                if($(this).closest('li').find('ul').hasClass('active'))
                    $(this).closest('li').find('ul').removeClass('active')
                else
                    $(this).closest('li').find('ul').addClass('active')

                if($(this).closest('li').hasClass('active')){
                   $(this).closest('li').removeClass('active')
                } else {
                    $(this).closest('li').addClass('active')
                }


            })

            $('ul.nav-list > li >ul >li a').click(function(){

                $('ul.nav-list  > li > ul > li.active').each(function(){
                    $(this).removeClass('active')
                });
                $(this).closest('li').addClass('active');


            })
        })
STD;

    echo Yii::$app->view->registerJs($jsString, View::POS_END);
?>