<?php

/* @var $this \yii\web\View */
/* @var $content string */

use kartik\icons\Icon;
use kartik\icons\OpenIconicAsset;
use xj\bootbox\BootboxAsset;
use yii\bootstrap\Alert;
use yii\bootstrap\Modal;
use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\helpers\Url;
use yii\web\View;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;

AppAsset::register($this);


BootboxAsset::register($this);
BootboxAsset::registerWithOverride($this);
OpenIconicAsset::register($this);
Icon::map($this);

?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title)?:'新一代优惠返利平台' ?></title>
    <meta name="description" content="免费抽奖，0元夺宝，分享有奖，红包达人，捡钱神器，环游世界，梦想人生…天天有优惠，天天有返利…">
    <meta name="Keywords" content="jike,jike365,集客, 集客365, 0元夺宝,优惠卷,抢红包,免费彩票,环游世界,免费旅游,免费抽奖, 0元购物,二维码,自媒体,互联网广告,有奖转发,企业之窗,梦想人生, 爱心传递,阿妹逛街,购物卷,食客准备">
    <?php $this->head() ?>

    <?=Html::cssFile("@web/css/jike/common.css") ?>
    <?php registerActionCssFile(); ?>
</head>
<body class="jike body-<?=implode('-',get_site_array())?>">
<?php $this->beginBody() ?>

<div class="wrap">


    <?php
    if(Yii::$app->params['show_index_header']){
        ?>

        <?php
    }
    ?>
    <?php
    NavBar::begin([
        'brandLabel' => '',
        'brandUrl' => Yii::$app->homeUrl,
        'options' => [
            'class' => 'navbar-inverse navbar-fixed-top',
            'items' => [
                ['label' => '首页', 'url' => ['/']],
            ],
        ],
    ]);

    echo Nav::widget([
        'options' => ['class' => 'navbar-nav navbar-left'],
        'items' => [
            ['label' => Icon::show('home').'首页', 'url' => ['/']],
        ],
        'encodeLabels' => false
    ]);


    if(Yii::$app->jike_user->isGuest){
        echo Nav::widget([
            'options' => ['class' => 'navbar-nav navbar-right'],
            'items' => [
                ['label' => '登录', 'url' => ['/public/login']],
                ['label' => '注册', 'url' => ['/public/register']],
                ['label' => '|','linkOptions'=>['url'=>'javascript:void(0)','class'=>'nav-a-line'],'tag'=>'span'],
                ['label' => '我的集客', 'url' => ['/frontadmin/usercenter/index']],
                ['label' => '内容营销', 'url' => ['/frontadmin/usercenter/marktingAccountRecharge']],
                [
                    'label' => '消息3',
                    'url' => ['/public/login'],
                    'linkOptions' => ['data-method' => 'post']
                ],
            ],
        ]);
    }else{
        echo Nav::widget([
            'options' => ['class' => 'navbar-nav navbar-right'],
            'items' => [

                ['label' => Yii::$app->jike_user->identity['user_name'], 'url' => ['/frontadmin/usercenter/index']],
                ['label' => '退出', 'url' => [Url::to(['public/logout'])]],
                ['label' => '|'],
                ['label' => '我的集客', 'url' => ['/frontadmin/usercenter/index']],
                ['label' => '内容营销', 'url' => ['/frontadmin/usercenter/marktingAccountRecharge']],
                ['label' => '|'],
                [
                    'label' => '消息
                    <span class=" data-ajax-update-html" id="message" data-url="'.Url::to(['/api/msg/notReadNumber']).'" data-data="{}"></span>',
                    'url' => ['/frontadmin/usercenter/msg'],
                    'linkOptions' => ['data-method' => 'post'],
                    'encode' => false
                ]
            ],
        ]);
    }


    NavBar::end();
    ?>

    <div class="container">


        <?php
            if(is_array($this->params['breadcrumbs']) && count($this->params['breadcrumbs'])){

        ?>
        <div class="breadcrumb">
            <?=Icon::show("flag",[],Icon::BSG)?>
            当前位置:
            <?php
            $key=0;
            if(isset($this->params['breadcrumbs'])) {
                foreach ($this->params['breadcrumbs'] as $link) {
                    $link['url'] = empty($link['url'])?"":$link['url'];
                    ?>
                    <?=($key>0) ? '/' : '' ?>
                    <a href="<?=$link['url']?>"><?=$link['label']?></a>
                    <?php
                    $key++;
                }
            }
            ?>
        </div>
        <?php

            }
        ?>

        <?= $content ?>
    </div>
</div>

<footer class="footer">
    <div class="row margin_lr_0">
        <div class="col-md-7 left">
            <div class="text-right">
                <a href="<?=Url::to(['/jike/other/detail','id'=>3])?>" class="cl_default"> 关于集客 </a> <span class="line">|</span>
                <a href="<?=Url::to(['/jike/other/detail','id'=>4])?>" class="cl_default"> 联系我们 </a> <span class="line">|</span>
                <a href="<?=Url::to(['/jike/other/detail','id'=>5])?>" class="cl_default"> 招聘英才 </a> <span class="line">|</span>
                <a href="<?=Url::to(['/jike/other/detail','id'=>6])?>" class="cl_default"> 商务合作 </a>
                <br/>
                <span class="cl_default fs_df">
                    苏州优集客网络版权所有 &nbsp;&nbsp; 备案:苏ICP备16045534号
                </span>
            </div>
        </div>
        <div class="col-md-5 right">

            <a href="" style="display: inline-block">
                <?=Html::img(Yii::getAlias("@web/css/images/index/index/site_wx_pic.png"))?>
            </a>
            <div class="text" style="display: inline-block;">
                扫描二维码 <br/>
                下载集客客户端
            </div>


        </div>

    </div>

</footer>

<?php $this->endBody() ?>

<?php
    $this->registerJsFile("/js/common_xhy.js");
    registerActionJsFile();
?>

<div id="login-modal-wrapper">
    <?php
        Modal::begin([
            'header' => '用户登录',
            'toggleButton' => [
                'label'=>'登录','class'=>'loginModalBtn hidden', 'onclick'=>''
            ],
            'options' => [
                'class' => 'login-modal',
            ],
        ]);
    ?>
        <iframe src="<?=Url::to(['public/loginModal'])?>" style="border: none;" scrolling="NO" />
    <?php
        Modal::end();
    ?>
</div>

<?php
    $urlLoginModal = Url::to(['public/loginModal']);
    $strModalJs = <<<STD
        $(function(){
            $('.login-modal').on('hidden.bs.modal',function(){
                $("#login-modal-wrapper iframe").attr("src","{$urlLoginModal}")
            })
        })
        $(function(){
            $('.login-modal .modal-body').width('340px');
        })
STD;
   Yii::$app->view->registerJs($strModalJs, View::POS_END);

?>



<input type="text" id="csrf_xhy"   value="<?=Yii::$app->request->getCsrfToken()?>" />


</body>
</html>
<?php $this->endPage() ?>
