<?php
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>

<div class="public-loginModal">

    <?php
    $form = ActiveForm::begin([
        'method' => 'post'
    ]);
    ?>
    <?php
        $template = <<<STD
            {input} {error}
STD;

    ?>
        <?=$form->field($model,'user_mobile',[
            'template' => $template,
            'options' => [],
        ])->textInput([
            'placeholder'=>$model->placeHolder['user_mobile']
        ])?>

        <?=$form->field($model,'user_password',[
            'template' => $template,
        ])->passwordInput([
            'placeholder'=>$model->placeHolder['user_password'],
        ])?>

        <?=Html::submitButton("登 录",[
            'class' => 'btn btn-success '
        ])?>

        <?php
        $linkFindPassword = Html::a("忘记密码",Url::to(['public/findPassword']),['class'=>'find-password','target'=>'_blank']);
        $linkRegisterUser = Html::a("免费注册",Url::to(['public/register']),['class'=>'register-user','target'=>'_blank']);
        echo $form->field($model,'remember_user',[
            'options' => ['class' => 'remember_user'],
            'template' => "{input} {$linkFindPassword} {$linkRegisterUser}",

        ])->checkbox(['checked'=>1,'value'=>1])
        ?>

    <?php
        ActiveForm::end();
    ?>

</div>