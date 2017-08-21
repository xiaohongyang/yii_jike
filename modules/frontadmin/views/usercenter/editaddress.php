<?php
use yii\bootstrap\Alert;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

?>

<div class="row" style="margin-bottom: -10px;">
    <h5 class="col-md-5 text-left" style="display: inline-block; padding-left: 0; ">
        修改设置奖品收件信息
    </h5>
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
    $citySelectControl = <<<STD
        <span style="z-index:1002" class="zn_select_area"
                                  data-name="{$model->formName()}[province],{$model->formName()}[city],{$model->formName()}[district]"
                                  data-value="{$model->province},{$model->city},{$model->district}"
                                  >选择收货地址</span>
STD;

    $templateCitySelect = <<<STD
            <div class="row">
                <div class="col-md-2 text-left" style="display: inline-block; width: 95px;">{label}</div>
                <div class="col-md-5 text-left" style="display: inline-block; padding-left: 0;">
                    {$citySelectControl} {hint} {error}
                </div>
            </div>
STD;
    ?>

    <?php
    $form = ActiveForm::begin([
    ]);
    ?>

    <?php
        if($model->address_id){
    ?>
            <input type="hidden" name="<?=$model->formName()?>[address_id]" value="<?=$model->address_id?>" />
    <?php
        }
    ?>

    <?=$form->field($model, 'consignee', [
        'options' => [
            'class' => 'form-inline'
        ],
        'template' => $templateInput
    ])->textInput(['style'=>'display:inline-block; width:200px'])->label('收货人:')?>

    <?=$form->field($model, 'citySelect', [
        'options' => [
            'class' => 'form-inline'
        ],
        'template' => $templateCitySelect
    ])->textInput()->label('所在地区:')?>

    <?=$form->field($model, 'address', [
        'options' => [
            'class' => 'form-inline'
        ],
        'template' => $templateInput
    ])->textInput(['style'=>'display:inline-block; width:200px'])->label('收件地址:')?>





    <?=$form->field($model, 'mobile', [
        'options' => [
            'class' => 'form-inline'
        ],
        'template' => $templateInput
    ])->textInput(['style'=>'display:inline-block; width:200px'])->label('手机号码:')?>



    <?php
    if( Yii::$app->getSession()->getFlash('success') ){

        ?>
        <div class="row  " style="color: #f00;">
            <div class="col-md-2 text-left" style="display: inline-block;  width: 95px;"> <div class="control-label">  </div> </div>
            <div class="col-md-8 text-left" style="display: inline-block; padding-left: 0;">
                <?=Yii::$app->getSession()->getFlash('success')?>
            </div>
        </div>
        <?php
    }
    ?>

    <div class="row ">
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