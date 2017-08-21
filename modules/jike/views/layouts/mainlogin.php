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
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>

    <?=Html::cssFile("@web/css/jike/common.css") ?>

</head>
<body>
<?php $this->beginBody() ?>

        <?= $content ?>

<?php $this->endBody() ?>

<?php
    $this->registerJsFile("/js/common_xhy.js");
?>

<input type="hidden" id="csrf_xhy"   value="<?=Yii::$app->request->getCsrfToken()?>" />
</body>
</html>
<?php $this->endPage() ?>
