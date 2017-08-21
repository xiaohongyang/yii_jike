<?php
use yii\widgets\Pjax;
use yii\helpers\Html;
?>

<? Pjax::begin()?>
<?=Html::a('time',['time'],['class'=>'btn btn-lg btn-primary'])?>
    <h3>Current Time:<?=$time?></h3>
<? Pjax::end()?>