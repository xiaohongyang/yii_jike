<?php
use yii\bootstrap\Alert;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

?>

<div style="width: 700px;">



    <div class="row" style="margin-bottom: -10px;">
        <div class="col-md-2 text-left" style="display: inline-block; width: 95px;"></div>
        <div class="col-md-5 text-left" style="display: inline-block; padding-left: 0; ">
        </div>
    </div>
    <div  >

        <?php
        $templateInput = <<<STD
                <div class="row">
                    <div class="col-md-2 text-left" style="display: inline-block; width: 95px;">{label}</div>
                    <div class="col-md-5 text-left" style="display: inline-block; padding-left: 0;">
                        {input} {hint} {error}
                    </div>
                </div>
STD;
        ?>

        <?php
        $form = ActiveForm::begin([
        ]);
        ?>

        <?=$form->field($model, 'old_password', [
            'options' => [
                'class' => 'form-inline'
            ],
            'template' => $templateInput
        ])->passwordInput()->label('输入旧密码:')?>
        <?=$form->field($model, 'password', [
            'options' => [
                'class' => 'form-inline'
            ],
            'template' => $templateInput
        ])->passwordInput()->label('设置新密码:')?>
        <?=$form->field($model, 'repeat_password', [
            'options' => [
                'class' => 'form-inline'
            ],
            'template' => $templateInput
        ])->passwordInput()->label('重复新密码:')?>

        <?php
        if( Yii::$app->getSession()->getFlash('success') ){

            ?>
            <div class="row " style="color: #f00;">
                <div class="col-md-2 text-left" style="display: inline-block;  width: 95px;"> <div class="control-label">  </div> </div>
                <div class="col-md-8 text-left" style="display: inline-block; padding-left: 0;">
                    <?=Yii::$app->getSession()->getFlash('success')?>
                </div>
            </div>
            <?php
        }
        ?>

        <div class="row <?=Yii::$app->getSession()->getFlash('success')?'':'  '?>">
            <div class="col-md-2 text-left" style="display: inline-block;  width: 95px;"> <div class="control-label">  </div> </div>
            <div class="col-md-8 text-left" style="display: inline-block; padding-left: 0;">
                <?=Html::submitButton("提交", ['class'=>'btn  '])?>
            </div>
        </div>


        <?php
        $form->end();
        ?>

    </div>



    <input type="hidden" id="edit-success" value="<?=Yii::$app->getSession()->getFlash('success')?>">

</div>