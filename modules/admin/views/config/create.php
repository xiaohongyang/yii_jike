<?php
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>



<?php

    $form = ActiveForm::begin([
        'options' => [
            'class' => 'form-inline'
        ]
    ])
?>
<?php
    $isEdit = Yii::$app->request->get('id') ? true : false;
?>
        <?=$form->field($model, 'config_id', ['options' => ['class'=>'hide']])->hiddenInput()?>

        <?=$form->field($model, 'name')->textInput( ['disabled'=> $isEdit ? 'disabled' : false])?>
        <br/>
        <br/>
        <?=$form->field($model, 'value')->textInput()?>

        <br/>
        <br/>
        <?=Html::submitButton("提交",['class'=>'btn btn-primary btn-sm'])?>
        <?=Html::a("返回","",['class'=>'btn btn-primary  btn-sm ml-row', 'onclick' => 'window.location.href=history.back()'])?>

<?php
    $form->end();
?>
