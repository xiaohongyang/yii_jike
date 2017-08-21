<?php
    use kartik\helpers;
use yii\captcha\Captcha;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>

<div class="public-login text-center">

    <div class="row">
        <div class="col-md-offset-4 col-md-8 text-left ">
            <span class="h5"><?=Html::a("注册账号",Url::to(['public/register']))?> </span> >
            <div class="mt-dl h4">用户登录</div>
        </div>
    </div>

    <?php
        $form = ActiveForm::begin([
            'method' => 'post'
        ]);
    ?>

    <?php
        $templateInput = <<<STD
            <div class="row">
                <div class="col-md-4 text-right" style=""></div>
                <div class="col-md-8 text-left"> {input} {hint} {error}
                </div>
            </div>
STD;
    ?>


    <?=$form->field($model, 'user_mobile', [
        'options'=>['class'=>'form-inline'],
        'template' => $templateInput
    ])->textInput([
        'placeholder' => $model->placeHolder['user_mobile'],
        'maxlength' => '11'
    ]);
    ?>

    <?=$form->field($model, 'user_password', [
        'options'=>['class'=>'form-inline'],
        'template' => $templateInput
    ])->passwordInput([
        'placeholder' => $model->Placeholder['user_password'],
    ]);
    ?>

    <?php
        if($model->isShowCaptcha()){

            $captchaImage = $form->field($model, 'captcha',[
                'options'=>['class'=>'','tag'=>'span'],
                'template' => " {input} ",
            ])->widget(Captcha::className(),[
                'captchaAction' => Url::to(['public/captchaLogin']),
                'imageOptions' => ['alt'=>'点击换图','title'=>'点击换图','style' => 'cursor: pointer;  '],
                'template' => "  {image}  ".Html::a("<i class=\"oi oi-reload\"></i>","javascript:void(0)",["onclick"=>"$(this).prev('img').trigger('click')"]),
            ]);
            echo $form->field($model, 'captcha',[
                'options'=>['class'=>'form-inline '],
                'template' => "
                <div class='row captcha'>
                    <div class='col-md-4'></div>
                    <div class='col-md-8'>
                      {input} {$captchaImage} \n {hint} \n {error}
                    </div>
                </div>
            ",
            ])->textInput(['placeholder' => '请输入验证码']) ;
        }
    ?>

    <?=$form->field($model,'remember_user',[
        'options'=>['class'=>'form-inline'],
        'template' => "
                        <div class='row remember-user'>
                            <div class='col-md-4'></div>
                            <div class='col-md-8 '>
                                {label}\n{input} ".Html::a("忘记密码?",Url::to(['public/findPassword']),['target'=>'_blank','class'=>'find-password'])." \n{hint}\n{error}
                            </div>
                        </div>
                    "
    ])->checkbox(['value'=>'1'])
    ?>

        <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-8 ">
                <?=Html::submitButton("登录", ['class'=>'btn btn-login btn-submit pull-left'])?>
            </div>
        </div>
    <?php
        ActiveForm::end();
    ?>

</div>