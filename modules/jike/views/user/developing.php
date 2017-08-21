<?php
    use kartik\helpers\Html;
use kartik\icons\Icon;
use yii\helpers\Url;

?>
<div class="other-developing row text-center">
    <div class="developing center-block">
        <?=Html::a(Icon::show('glyphicon glyphicon-home',[],Icon::BSG)."返回首页",Url::to(['/']),['class'=>'btn btn-default'])?>
    </div>
</div>

<?php
    echo Html::cssFile("/css/jike/other.css");
?>