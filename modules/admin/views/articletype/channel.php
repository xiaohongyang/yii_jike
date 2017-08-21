<?php
use app\widgets\XUeditorWidget;
use dosamigos\ckeditor\CKEditor;
use kartik\helpers\Html;
use kucha\ueditor\UEditor;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>



<div class="h5">
    <?php
    $form = ActiveForm::begin([
        'method' => 'post'
    ]);

    $inputTemplate = " {input}{error}";
    $inputParams = [
        'options'=>['class' => 'form-inline'],
        'template' => $inputTemplate
    ];
    ?>

    内容所属栏目：

    <?=Html::dropDownList($model->formName()."[type_id]", $typeId, ArrayHelper::map(ArrayHelper::toArray($models), 'type_id','type_name'),['class'=>'type_id'])?>





    <?=$form->field($model,'type_content',[
        'options' => ['class' => 'form-inline mt-row'],
        'template' => $inputTemplate,
        'errorOptions' => ['id'=>'prize_describe_error', 'class'=>'help-block',  'style' => 'width: 300px;']
    ])->widget(XUeditorWidget::className(),[
    ])?>



    <?=Html::submitButton("发布/更新", ['class' => 'btn btn-sm btn-primary'])?>

    <?php
        $form->end();
    ?>

</div>