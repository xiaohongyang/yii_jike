<?php

use yii\bootstrap\Html;
use yii\helpers\Url;

$this->params['breadcrumbs'] = [
        ['label'=>'关于集客','#'],
        ['label'=> $model->type_name,'#'],
    ];
?>
<div class="wrap_content">


<div class="left">
    <ul>
        <?php
            foreach($models as $modelItem){
                echo "<li>".Html::a($modelItem->type_name, Url::to([
                        '/jike/other/detail',
                        'id'=>$modelItem->type_id,
                    ]),['class' => $modelItem->type_id == Yii::$app->request->get('id') ? 'active' : '']) . "</li>";
            }
        ?>
    </ul>
</div>

<div class="right">
    <?=$model->type_content?>
</div>

</div>