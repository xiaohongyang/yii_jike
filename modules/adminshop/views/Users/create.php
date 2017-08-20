<?php
use dosamigos\ckeditor\CKEditor;
use dosamigos\ckeditor\CKEditorInline;
use kartik\editable\Editable;
use kartik\icons\Icon;
use kucha\ueditor\UEditor;
use yii\bootstrap\Html;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>
<?php
$this->params['breadcrumbs'][] = Yii::$app->params['lang']['04_users_add'];
$this->params['breadcrumbs'][] = [
        'label'=>Yii::$app->params['lang']['03_users_list'],
        'url'=> Url::to(['users/list']),
        'class'=>'pull-right btn btn-xs btn-success ',
        'template'=>'{link}'];

?>

<?php
    $form = ActiveForm::begin([
        'options' =>[
            'layout' => 'horizontal'
        ],

    ]);
?>

    <?=$form->field($model, 'user_name', ['options'=>['class'=>'form-inline']])->textInput() ?>
    <?=$form->field($model, 'email', ['options'=>['class'=>'form-inline']])->textInput() ?>
    <?=$form->field($model, 'password', ['options'=>['class'=>'form-inline']])->passwordInput() ?>
    <?=$form->field($model, 'repeat_password', ['options'=>['class'=>'form-inline']])->passwordInput() ?>
    <?=$form->field($model, 'user_rank', ['options'=>['class'=>'form-inline']])->dropDownList(
        ArrayHelper::merge([
            '0'=>Yii::$app->params['lang']['not_special_rank'],
        ],ArrayHelper::map($rank_list, 'rank_id', 'rank_name'))
    )
    ?>

    <?=$form->field($model,'post')->passwordInput(['value'=>99922]) ?>

    <?=Html::submitButton(Yii::$app->params['lang']['button_save'],['class'=>'btn btn-success'])?>
<?php
//echo $form->field($model, "user_name")->widget(UEditor::className(),[
//]);
?>

<?php

    ActiveForm::end();
?>

<?//=Icon::show("user")?>
<!---->
<?//= Icon::show('watch', [], Icon::UNI) ?><!-- Watch<br>-->
<!---->
<?//=Icon::show("star-8", [], Icon::UNI)?>

