<?php
use yii\captcha\Captcha;
use yii\helpers\Html;

?>

<?=Html::cssFile("@web/source/admin/css/public/login.css") ?>

<div class="container">

    <div class="row">

        <div class="  logcen test">


            <?php $form = \yii\widgets\ActiveForm::begin([
//            'method'    =>  'post',
//            'action'    =>  [Url::current()],

                'id' => 'login-form',
                'options' => ['class' => 'form-horizontal'],
                'fieldConfig' => [
                    'template' => "{label}\n<div class=\"col-lg-9\">{input}</div>\n",
                    'labelOptions' => ['class' => 'col-lg-3 control-label'],
                    'inputOptions' => ['class' => 'form-control'],
                ],
                'enableAjaxValidation' => false
            ]); ?>
            <div class="wrap-div">
                <h3 class="col-md-offset-1">集客后台登录系统</h3>

                 <div>
                     <?=$form->errorSummary($model); ?>
                 </div>
                <div class="margin-top-small" style="margin-top: 20px;"> </div>


                <?= $form->field($model, 'user_name')->textInput(['placeholder'=>'请输入用户名']) ?>

                <?= $form->field($model, 'user_password')->passwordInput(['placeholder'=>'请输入密码'])->label('密 &nbsp;&nbsp;码') ?>

                <?php

                    $template = <<<STD
                        <div class="form-group field-user-password required has-error">
                            <div class="col-lg-6">{input}</div>
                            <span class="col-lg-3 control-label" for="user-password">{image}</span>
                        </div>
STD;
                    echo $form->field($model, 'captcha')->widget(Captcha::className(),[

                    //configure
                    'captchaAction' => '/admin/public/captcha',
//                    'template' => '<div class="row"><div class="col-lg-3">{image}</div><div class="col-lg-6">{input}</div></div>',
                    'template' => $template,

                    'imageOptions' => [
                        'style' => 'width: 80px; height: 30px;'
                    ],
                    'options' => ['placeholder'=>'请输入验证码']

                ])?>

                <div class="form-group">

                    <!--<input type="submit" value="登录" class="btn btn-success center-block">-->

                    <div class=" col-lg-11">
                        <?= Html::submitInput('登录', [
                            'class' => 'btn btn-success '
                        ]); ?>
                    </div>
                </div>
            </div>
            <?php \yii\widgets\ActiveForm::end() ?>
        </div>
    </div>

</div>



