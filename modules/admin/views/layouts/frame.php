<?php
    use yii\helpers\Html;
    \app\assets\admin\ToFrameAsset::register($this);
?>
<?php $this->beginPage(); ?>
<!DOCTYPE html>
<html lang="utf-8">
<head>
    <meta charset="utf-8">
    <?=HTML::csrfMetaTags() ?>
    <title><?=$this->title?></title>
    <?php $this->head(); ?>
</head>
<body class="admin-s-page body-<?=implode('-',get_site_array())?>">
<?php $this->beginBody();?>
    <?= $content ?>
    <footer>&copy; 2014 by My Company</footer>
<?php $this->endBody(); ?>
<input type="hidden" id="csrf_xhy"   value="<?=Yii::$app->request->getCsrfToken()?>" />
</body>
</html>
<?php $this->endPage(); ?>