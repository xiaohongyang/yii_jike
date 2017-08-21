<?php
use kartik\icons\Icon;
use kartik\icons\OpenIconicAsset;
use xj\bootbox\BootboxAsset;
use yii\bootstrap\Modal;
use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\helpers\Url;
use yii\web\View;
use app\assets\AppAsset;

NavBar::begin([
    'brandLabel' => '',
    'brandUrl' => Yii::$app->homeUrl,
    'options' => [
        'class' => 'navbar-inverse  navbar-fixed-top ',
        'items' => [
            ['label' => '首页', 'url' => ['/']],
        ]
    ],
]);

echo Nav::widget([
    'options' => ['class' => 'navbar-nav navbar-left   '],
    'items' => [
        ['label' => Icon::show('home').'首页', 'url' => ['/']],
    ],
    'encodeLabels' => false
]);

echo Nav::widget([
    'options' => ['class' => 'navbar-nav navbar-right'],
    'items' => [

        ['label' => Yii::$app->jike_user->identity['user_name'], 'url' => ['/frontadmin/usercenter/index']],
        ['label' => '退出', 'url' => [Url::to(['/jike/public/logout'])]],
        ['label' => '|'],
        ['label' => '我的集客', 'url' => ['/frontadmin/usercenter/index']],
        ['label' => '内容营销', 'url' => ['/frontadmin/usercenter/marktingAccountRecharge']],
        ['label' => '|'],
        [
            'label' => '消息
                    <span class=" data-ajax-update-html" id="join_number" data-url="'.Url::to(['/api/msg/notReadNumber']).'" data-data="{}"></span>',
            'url' => ['/frontadmin/usercenter/msg'],
            'linkOptions' => ['data-method' => 'post'],
            'encode' => false
        ]
    ],
]);

NavBar::end();
?>

<div class="jumbotron masthead header-block-link " style="background:#f5f5f5">
    <div class="container text-left" >
        <?=Html::img("/css/images/logo_03.png",["style"=>'display:inline-block; float:left;'])?>

        <p>

        </p>

        <?php
            $controllerId = Yii::$app->controller->id;
            $action = Yii::$app->controller->action->id;
            $active01=$active02=$active03 = '';
            if ($controllerId=='usercenter' && in_array($action,['index','integrateAccount','cashPrize','msg']) ){
                $active01 = 'active';
            }
            if ($controllerId=='usercenter' && in_array($action,['marktingAccountRecharge','frozenAccount']) ){
                $active02 = 'active';
            }
            if ( $controllerId=='advideo'|| $controllerId=='marketingpromotion'){
                $active02 = 'active';
            }
        ?>
        <ul>
            <li>

                <?=Html::a("我的集客",Url::to("/frontadmin/usercenter/index"), ['class'=>$active01])?>
            </li>
            <li>
                <?=Html::a("营销推广",Url::to("/frontadmin/usercenter/marktingAccountRecharge"), ['class'=>$active02])?>
            </li>

        </ul>


        <div class="div-edit-password"
             class="pull-right text-right"
             style="display: inline-block; float:right;"
             onclick="$.fn.iframe_x_say({'url':'<?=Url::to(['/frontadmin/usercenter/editpassword'])?>',title:'修改密码',size:[600,243],frameSize:[530,210],btn:[], time: 999999})"
        >
            <a href="javascript:void(0)">修改密码</a>
        </div>
    </div>




</div>