<?php
    //iframe modal 弹出窗
    app\widgets\ModalWidget::widget();
?>
<?php
use app\assets\AppAsset;
use kartik\icons\Icon;
use xj\bootbox\BootboxAsset;
use yii\helpers\Html;

/**************** register css start ****************/
    //\app\assets\adminshop\AppAsset::register($this);
AppAsset::register($this);
BootboxAsset::register($this);
BootboxAsset::registerWithOverride($this);
Icon::map($this);
/**************** register css start ****************/


/***************** register js start *****************/
$js = <<< SCRIPT
    //1. register tooltip
    $('body').tooltip( {selector : '[data-toggle="tooltip"]'} );
SCRIPT;
$this->registerJs($js);
/***************** register js stop  *****************/

?>
<?php $this->beginPage(); ?>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="utf-8" class="no-js">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <?=HTML::csrfMetaTags() ?>
    <title><?=$this->title?></title>
<!--    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css" />-->
    <?php $this->head(); ?>

<!--    <link href="http://fonts.useso.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css" />-->
    <?=Html::cssFile("@web/css/adminshop.css") ?>

    <script type="text/javascript">


        <?php
            if( is_array(Yii::$app->params['lang']) && count(Yii::$app->params['lang'])):
                foreach(Yii::$app->params['lang']['js_languages'] as $_k=>$_v){
        ?>
        var <?=$_k?>="<?=$_v?>";
        <?php
                }
            endif;
        ?>
    </script>


    <link rel="shortcut icon" href="favicon.ico"/>
</head>
<body>

<?php $this->beginBody();?>


<!--<div class="wrapper">
    <?/*//=$content*/?>
</div>-->
<div class="page-content-wrapper">
    <div class="page-content" style="min-height:1656px; height: auto;">

        <?=Yii::$app->view->renderFile(Yii::$aliases['@moduleViewPath']."/public/header.php") ?>

        <div class="page-content-body">
            <?=$content?>
        </div>
        <!-- END PAGE HEADER-->
        <!-- BEGIN PAGE CONTENT-->


        <!-- END PAGE CONTAINER-->
    </div>
    <!-- BEGIN CONTENT -->
</div>





<?=Yii::$app->view->renderFile(Yii::$aliases['@moduleViewPath']."/public/footer.php") ?>

<?=Html::jsFile("@web/ecshop/js/admin/validator.js") ?>
<?php $this->endBody(); ?>


</body>
</html>
<?php $this->endPage(); ?>