<?php
    //iframe modal 弹出窗
    app\widgets\ModalWidget::widget();
?>
<?php
    use yii\helpers\Html;

    \app\assets\admin\AppAsset::register($this);

?>
<?php $this->beginPage(); ?>
<!DOCTYPE html>
<html lang="utf-8">
<head>
    <meta charset="utf-8">
    <?=HTML::csrfMetaTags() ?>
    <title><?=$this->title?></title>
    <?php $this->head(); ?>
    <?=Html::cssFile("@web/css/jike/vendor.css") ?>
    <?=Html::cssFile("@web/css/jike/common.css") ?>
</head>
<body class="admin body-<?=implode('-',get_site_array())?>">
<?php $this->beginBody();?>
    <?= $content ?>
<?php $this->endBody(); ?>

<?php
$this->registerJsFile("/js/common_xhy.js");
registerActionJsFile();
?>

<?php
    $actionString = implode('-',get_site_array());
    if(!in_array($actionString, ['admin-index-top','admin-index-left'])){
?>
        <div class="div-edit-password" style="display: none; float:right;" onclick="$.fn.iframe_x_say({'url':'/admin/user/changepassword',title:'修改密码',size:[600,243],frameSize:[530,210],btn:[], time: 999999})">
            <a href="javascript:void(0)">修改密码</a>
        </div>
<?php
    }
?>

<input type="hidden" id="csrf_xhy"   value="<?=Yii::$app->request->getCsrfToken()?>" />
</body>
</html>
<?php $this->endPage(); ?>



