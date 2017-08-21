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
                <span class="h5">已有账号,请<?=Html::a("点此登录", Url::to(["public/login"]))?></span>
                <div class="mt-dl h4">用户注册</div>
            </div>
        </div>

        <?php
        $form = ActiveForm::begin([
            'method' => 'post',
            'action' => Url::to(['public/register']),
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

        <?=$form->field($model, 'user_name', [
            'options'=>['class'=>'form-inline'],
            'template' => $templateInput,
        ])->textInput(['placeholder' => $model->Placeholder['user_name']])
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
        <?=$form->field($model, 'repeat_password', [
            'options'=>['class'=>'form-inline'],
            'template' => $templateInput
        ])->passwordInput([
            'placeholder' => $model->Placeholder['repeat_password'],
        ])
        ?>


        <div class="row margin-top-10">
            <div class="col-md-offset-5 col-md-7 ">
                <?=Html::submitButton("同意协议并注册", ['class'=>'btn btn-success pull-left']) ?>
            </div>
        </div>

        <?php ActiveForm::end()?>
    </div>

    <div class="row margin-top-15">
        <div class="col-md-5"> </div>
        <div class="col-md-7 text-left law" >

            <?php
                Modal::begin([
                    'header' => '集客360用户注册协议',
                    'size' => Modal::SIZE_LARGE,
                    'toggleButton' => ['label'=>'《 集客360用户注册协议 》','class'=>'gray','tag'=>'a','style'=>'cursor:pointer'],
                    'footerOptions'=>['class'=>'text-center'],
                    'footer' => '<button type="button" class="btn form-submit center-block " data-dismiss="modal" aria-hidden="true">同意并继续</button>'
                ]);
            ?>
                <div class="wrapper-protocal" >
                    <div class="header">
                        <h5> 一、 声明与承诺 </h5>
                        <p> （一） 您确认，在您注册成为集客365用户以接受本服务之前，你已充分阅读、理解并接受本协议的全部内容，一旦您使用本服务，即表示您同意遵循本协议之所有约定。 </p>
                        <p> （二） 您同意，本公司有权随时对本协议内容进行单方面的变更，一旦公告，无需另行单独通知您；若您在本协议内容公告变更后继续使用本服务的，表示您已充分阅读、理解并接受修改后的协议内容，也将遵循修改后的协议内容使用本服务；若您不同意修改后的协议内容，您应停止使用本服务。 </p>
                        <p> （三） 您声明，在您同意接受本协议并注册成为集客365用户时，您是具有法律规定的完全民事权利能力和民事行为能力。 </p>
                    </div>
                    <div class="content">
                        <h5>1 知识产权声明</h5>
                        <ul>
                            <li>1.1 本网站系统是由苏州优集客网络科技有限公司（以下简称集客）开发。网站的一切版权、商标权、专利权、商业秘密等知识产权，以及与网站相关的所有信息内容，包括但不限于：文字表述、图标、图饰、色彩、界面设计、版面框架、有关数据等。</li>
                            <li>1.2 未经许可，任何抄袭本网站的行为，以及包括对本网站进行反向工程、反向汇编、反向编译等，集客公司均有权对其采取法律行动。</li>
                        </ul>

                        <h5>2 用户接受以下规定：</h5>
                        <ul>
                            <li>2.1 用户应保证其提供给集客365的资料均为真实无误，该资料对于使用集客365的服务及找回丢失的帐号至关重要。如因用户提供虚假资料或被他人获悉自己的注册资料，从而导致的一切损失由用户本人承担。</li>
                            <li>2.2 集客365帐号</li>
                            <li>
                                <ul>
                                    <li>2.2.1 用户可以通过注册集客365帐号使用集客365提供的各种服务。集客365保留对公司未来服务改变和说明的权利。用户使用集客365的服务时，须同时遵守各项服务的规定条款。</li>
                                    <li>2.2.2 集客365帐号的所有权归集客365，用户完成申请注册手续后，获得帐号的使用权。</li>
                                    <li>2.2.3 用户承担帐号与密码的保管责任，并就其帐号及密码项下之一切活动负全部责任。</li>
                                    <li>2.2.4 用户帐号或密码遗忘后，如提供的信息不准确，可能无法找回，集客365不承担任何责任。</li>
                                    <li>2.2.5 用户注册集客365帐号后如果长期不使用（12个月内无任何活动既被认为长期不使用），集客365有权回收帐号，以免造成资源浪费，由此带来的包括并不限于帐号使用中断、用户资料、帐内数据丢失等损失由用户自行承担。</li>
                                    <li>2.2.6 如果是商家用户,您同意加入集客365的推广系统,表示您认可集客365的服务: 必须按照栏目服务规定,兑现您向消费者的一切承诺。如果有严重欺诈行为，集客365将有权暂停，或永久停止您的服务，收回帐号。</li>
                                </ul>
                            </li>
                            <li>2.3 本网站同大多数网站一样，受包括但不限于用户原因、网络服务质量、社会环境等因素的差异影响，可能受到各种安全问题的侵扰，如木马，病毒等，继而影响本网站的正常使用，集客365不承担任何责任。</li>
                            <li>2.4 用户同意个人隐私信息是指那些能够对用户进行个人辨识或涉及个人通信的信息，包括下列信息：用户的姓名，身份证号，手机号码，IP地址，电子邮件地址，以及支付账号等信息。而非个人隐私信息是指用户对本网站的操作状态以及使用习惯等一些明确且客观反映在集客365服务器端的基本记录信息和其他一切个人隐私信息范围外的普通信息。 尊重用户个人隐私信息的私有性是集客365的一贯制度，集客365将会采取合理的措施保护用户的个人隐私信息，除法律或有法律赋予权限的政府部门要求或用户同意等原因外，集客365未经用户同意不向除合作单位以外的第三方公开、 透露用户个人隐私信息。</li>
                            <li>2.5 集客365特别提请用户注意：集客365为了保障公司业务发展和调整的自主权，集客365拥有随时自行修改或中断服务授权而不需通知用户的权利，如有必要，修改或中断会以通告形式公布于集客365网站重要页面上。</li>
                            <li>2.6 使用本网站由用户自己承担风险，集客365对不作任何类型的担保，不论是明示的、默示的或法令的保证和条件，包括但不限于本网站的适销性、适用性、无病毒、无疏忽或无技术瑕疵问题、所有权和无侵权的明示或默示担保和条件，对在任何情况下因使用或不能使用本网站所产生的直接、间接、偶然、特殊及后续的损害及风险，集客365及合作单位不承担任何责任。</li>
                            <li>2.7 因技术故障等不可抗事件影响到服务的正常运行的，包括单不限于互联网正常的设备维护，互联网络连接故障，电脑、通讯或其他系统的故障，电力故障，罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，战争，政府行为，司法行政机关的命令或第三方的不作为而造成的不能服务或延迟服务，集客365承诺在第一时间内与相关单位配合，及时处理进行协调处理及修复，但用户因此而遭受的一切损失，集客365不承担责任。</li>
                            <li>2.8 用户在使用集客365服务过程中，所产生的应纳税赋，及运费方面的费用，均由用户自行承担。</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <div> 本《协议》版权由集客365所有，集客365保留一切解释权利。</div>
                        <div class="text-right">苏州优集客网络科技有限公司</div>
                    </div>
                </div>
            <?php
                Modal::end()
            ?>

        </div>
    </div>
</div>


<?php

    $urlGetMobileCheckcode = Url::to(['/public/getMobileCheckcode']);


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
                    var url
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
