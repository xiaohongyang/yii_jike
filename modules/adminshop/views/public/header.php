<?php
use kartik\helpers\Html;
use yii\helpers\Url;
?>
<div class="wrapper header" >

     <?=
     yii\widgets\Breadcrumbs::widget([
         'homeLink' => [
             'url'=>Url::toRoute('/adminshop/index/main'),
             'label' => '管理中心'
         ],
         'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
     ]) ?>
</div>