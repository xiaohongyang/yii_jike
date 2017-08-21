<?php
use app\modules\common\models\uploadform\I_Upload;
use app\widgets\AjaxFileUploadWidget;
use app\widgets\AjaxUploadWidget;
use yii\bootstrap\Alert;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>


<?=Html::button("活动预告", ['class'=>'btn btn-primary', 'style'=>'cursor:default']) ?>

<div>

    <?php

    $templateInput = <<<STD
            <div class="row">
                <div class="col-md-2 text-left" style="width: 100px ">{label}</div>
                <div class="col-md-10 text-left" style=" ">
                    {input} {hint} {error}
                </div>
            </div>
STD;
    ?>

    <div>
        <h5>一.设置活动标题：</h5>
    </div>

    <?php
    $form = ActiveForm::begin([
     ]);
    ?>

    <?php

        if(!is_null($model->id))
            echo Html::hiddenInput($model->formName()."[id]", $model->id);
    ?>

    <?=$form->field($model, 'info', [
        'options' => [
            'class' => 'form-inline'
        ],
        'template' => $templateInput
    ])->textInput()->label('活动地点:')?>

    <?=$form->field($model, 'title', [
        'options' => [
            'class' => 'form-inline'
        ],
        'template' => $templateInput
    ])->textInput()->label('活动标题:')?>




    <div class="form-inline   required ">
        <h5>二.上传/更新活动预览图片：(900x380)</h5>

        <div class="upload_pic_wrap">
            <div class="title">图片上传</div>
            <div class="content">

                <?php
                for($i=0; $i<3; $i++){

                    ?>
                    <?php

                    /*$loadSrc = is_null($model->wechar_ewm_pic_model)
                        ? '/images/icon_upload_wxcode.png'
                        : '/'.$model->wechar_ewm_pic_model->getAttribute('file_dir').'/'.$model->wechar_ewm_pic_model->getAttribute('file_name');*/

                    $pic = $model->pics[$i];
                    $loadSrc = is_null($pic) ? '/images/icon_upload.png' : '/'.$pic->getAttribute('file_dir').'/'.$pic->getAttribute('file_name');
                    $delIcon = \kartik\icons\Icon::show("remove-circle",[],\kartik\icons\Icon::BSG);

                    $ajaxParamId = "article_pic_{$i}";
                    $dataId = "data_id_article_pic_{$i}";
                    $fileDesc = I_Upload::FILE_DESC_ARTICLE_PIC;
                    $fileType = I_Upload::FILE_TYPE_IMAGE_01;

//                    $uploadIdValue = is_null($model->wechar_ewm_pic_model) ? 0 : $model->wechar_ewm_pic_model->upload_id ;
                    $uploadIdValue = $pic->upload_id;


                    echo AjaxUploadWidget::widget([
                        'loadSrc' => $loadSrc,
                        'ajaxParamId' => $ajaxParamId,
                        'dataId' => $dataId,
                        'fileDesc' => $fileDesc,
                        'fileType' => $fileType,
                        'uploadIdValue' => $uploadIdValue,
                        'isShowDelBtn' => true
                    ]);
                    ?>
                    <?php

                }
                ?>
                <?=$form->field($model,'article_pic',[
                    'options' => ['class'=>'test', 'style'=>'display:inline'],
                    'template' => "{error}",
                    'errorOptions' => ['id'=>'article_pic_error', 'class'=>'help-block'],
                ])->textInput()?>

                <div class="note">
                    提示: <br/>
                    1.图片格式PNG或JPEG,建议尺幅500*500PX以内;大小不要超过500K;最多可上传3张图片....<br/>
                </div>
            </div>
        </div>
    </div>

    <?php
    if( Yii::$app->getSession()->getFlash('result') ){

        ?>
        <div class="row mt-dl" style="color: #f00;">
            <div class="col-md-2 text-left" style="display: inline-block;  width: 95px;"> <div class="control-label">  </div> </div>
            <div class="col-md-8 text-left" style="display: inline-block; padding-left: 0;">
                <?=Yii::$app->getSession()->getFlash('result')?>
            </div>
        </div>
        <?php
    }
    ?>

    <div class="row mt-dl">
        <div class="col-md-12 text-left" >
            <?=Html::submitButton("发布/更新", ['class'=>'btn  '])?>
        </div>
    </div>

    <?php
    $form->end();
    ?>

</div>




<?php
echo AjaxFileUploadWidget::widget(['btnClass'=>'.ajax_upload_img','inputClass'=>'.ajax_upload']);
?>