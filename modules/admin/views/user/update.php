<?php
    $form = \yii\widgets\ActiveForm::begin([
        'options' => ['class'=>'p20']
    ]);
?>

<?=$form->field($model, 'id')->hiddenInput(['value' => $model->id ])->label(false)?>
<?=$form->field($model, 'user_name')->textInput(['value' => $model->user_name, 'readonly' => 'readonly']); ?>
<?= $form->field($model, 'password')->textInput(['placeholder' => "为空则不修改密码", 'value' => '']); ?>

<?=\yii\helpers\Html::submitButton('提交', ['class'=>'btn btn-primary'])?>

<?php
    $form->end();
?>