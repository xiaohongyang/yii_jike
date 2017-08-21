<?php
use kartik\helpers;
use kartik\icons\Icon;
use kartik\popover\PopoverX;
use yii\base\Event;
use yii\bootstrap\Modal;
use yii\captcha\Captcha;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\web\View;
use yii\widgets\ActiveForm;

?>

<div class="public-register">

    <div class="text-center">

        <div class="row">
            <div class="col-md-offset-5 col-md-7 text-left ">
                <span class="h5">请<?=Html::a("点此登录", Url::to(["public/login"]))?></span>
                <div class="mt-dl h4">找回密码</div>
            </div>
        </div>

        <?php
        $form = ActiveForm::begin([
            'method' => 'post',
            'action' => Url::to(['public/findPassword']),
            'options' => [
                'class'=>'mt-row'
            ]
        ]);


        $captchaUrl = Url::to(["public/captcha"]);
        $captchaReloadBtn = Html::button(Icon::show("reload",[],Icon::OI), [
            'style' => 'background: none; border:none; ',
            'onclick' => "
                    var img = $(this).prev('img');
                    $.get('".$captchaUrl."',{refresh:1},function(data){
                    evaldata=eval(data);
                    img.attr('src',evaldata.url);
                });
                ",
            'class' => 'chagecaptcha'
        ]);
        $btnGetCheckCode = Html::button("获取短信验证码",[
            'onclick' => '',
            'id'=>'btnGetCheckCode',
            'class' => 'btn btn-default'
        ]);



        $templateInput = <<<STR
            <div class="row">
                <div class="col-md-5 text-right" style="height: 30px; line-height: 30px;">{label} </div>
                <div class="col-md-7 text-left"> {input} {hint} {error}
                </div>
            </div>
STR;

        $templateInputCaptcha = <<<STR
            <div class="row row-captcha">
                <div class="col-md-5 text-right" style="height: 30px; line-height: 30px;">{label} </div>
                <div class="col-md-7 text-left"> {input} {hint}
                <img src="{$captchaUrl}"  />
                {$captchaReloadBtn}
                {error}
                </div>
            </div>
STR;

        $templateInputCheckCode = <<<STD
            <div class="row">
                <div class="col-md-5 text-right" style="height: 30px; line-height: 30px;">{label} </div>
                <div class="col-md-7 text-left"> {input} {hint}
                {$btnGetCheckCode}
                {error}
                </div>
            </div>
STD;

        ?>

        <?=$form->field($model, 'captcha', [
            'options'=>['class' => 'form-inline',],
            'template' => $templateInputCaptcha,
        ])->textInput([
            'placeholder' => $model->Placeholder['captcha'],
            'style' => 'width: 110px;'
        ])
        ?>


        <?=$form->field($model, 'user_mobile', [
            'options'=>['class'=>'form-inline'],
            'template' => $templateInput
        ])->textInput([
            'placeholder' => $model->Placeholder['user_mobile'],
            'maxlength' => '11'
        ]);
        ?>
        <?=$form->field($model, 'mobile_check_code', [
            'options'=>['class'=>'form-inline'],
            'template' => $templateInputCheckCode
        ])->textInput([
            'placeholder' => $model->Placeholder['mobile_check_code'],
        ])
        ?>
        <?=$form->field($model, 'user_password', [
            'options'=>['class'=>'form-inline'],
            'template' => $templateInput
        ])->passwordInput([
            'placeholder' => $model->Placeholder['user_password'],
        ])
        ?>


        <div class="row margin-top-10">
            <div class="col-md-offset-5 col-md-7 ">
                <?=Html::submitButton("确定", ['class'=>'btn btn-success pull-left']) ?>
            </div>
        </div>

        <?php ActiveForm::end()?>
    </div>


</div>


<?php

$urlGetMobileCheckcode = Url::to(['public/getMobileFindPwdCheckcode']);

$jsRefreshCheckcode = <<<STR

        //点击刷新验证码
        $(function(){
            $('.chagecaptcha').prev('img').hide();
            $('.chagecaptcha').trigger('click')
            $('.chagecaptcha').prev('img').show();
        })

        //modal高度
        $(function(){
            $('.wrapper-protocal').css('height','300px')
        })

        //获取手机验证码按钮点击
        var btnGetCheckCode = $('#btnGetCheckCode');
        var constTimeLimit=120
        var timeLimit = constTimeLimit;
        var intervalGetMobileCodeBtn
        btnGetCheckCode.click(function(){

            if(!$('#jike_user-user_mobile').val()){
                $.x_alert({'cont':'请输入手机号!'});
                return;
            } else {
                if($('#jike_user-user_mobile').val().length !=11 ){
                    $.x_alert({'cont':'请输入正确的手机号!'});
                    return;
                } else {
                    $.get('{$urlGetMobileCheckcode}',{user_mobile : $('#jike_user-user_mobile').val()}, function(json){

                        console.log(json);
                        $.x_alert({cont : json.message})
                    })
                }
            }

            if( btnGetCheckCode.attr('disabled') != 'disabled' && intervalGetMobileCodeBtn == null ){
                intervalGetMobileCodeBtn = setInterval(function(){
                    if(timeLimit>0){
                        //1.设置按钮文字,将按钮置为disabled状态 //2.设置等待秒数值  //3.发送短信
                        btnGetCheckCode.html(timeLimit+"秒后重新获取")
                        btnGetCheckCode.attr('disabled','disabled');
                        timeLimit = timeLimit-1;
                        //发送短信
                        $.post('')
                    } else {
                        timeLimit = constTimeLimit;
                        btnGetCheckCode.attr('disabled',false);
                        btnGetCheckCode.html('点击刷新验证码');
                        clearInterval(intervalGetMobileCodeBtn);
                        intervalGetMobileCodeBtn = null;
                    }
                },1000)
            }
        })
STR;
Yii::$app->view->registerJs($jsRefreshCheckcode, View::POS_END );

?>

<script type="text/javascript">

</script>
