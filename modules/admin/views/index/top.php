
<?php
use yii\helpers\Html;
use yii\helpers\Url;

?>


<a href="/" target="_blank"><img src="/css/images/admin/admin_log.png" width="126" height="35" /></a>

<?=Html::a('管理后台','javascript:void(0)',['target'=>'main', 'onclick'=>'window.top.location.href=\'/admin/index/main\''])?>

<div class="pull-right" style="margin-right:30px;">
    你好，&nbsp;
    <?=Yii::$app->user->identity->user_name?>
    &nbsp;
    <?=Html::a("退出", 'javascript:void(0)' ,['target'=>'top', 'onclick'=>'window.top.location.href="'.Url::to(['/admin/public/logout']).'"'])?>
    &nbsp;
    <?=Html::a("修改密码",'javascript:void(0)',[
        'class'=>'editPwd',
        'onclick'=>' $("#cntFrame",parent.document.body).contents().find("body").find("#main_frame").contents().find(".div-edit-password").trigger("click") '])?>
</div>
