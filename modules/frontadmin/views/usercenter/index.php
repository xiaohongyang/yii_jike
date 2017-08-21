<?php
use app\modules\common\models\uploadform\I_Upload;
use app\widgets\AjaxFileUploadWidget;
use app\widgets\AjaxUploadWidget;
use kartik\icons\Icon;
use kartik\rating\StarRating;
use yii\helpers\Html;
    use yii\helpers\Url;
use yii\web\JsExpression;
use yii\web\View;
use yii\widgets\ActiveForm;

?>



        <div class="wra-form">
        <?php
            $form = ActiveForm::begin([

            ]);
        ?>

            <div class="div01">
                <ul>
                    <li class="headpic">
                        <!--<img src="" />
                        <button class="btn btn-xs btn-default">编辑</button>-->
                        <?php

                        $uploadUrl = Url::to(['/common/file/upload'], true);
                        $loadSrc= is_null($model->head_pic_model) ? '/images/default-headpic.png': '/'.$model->head_pic_model->file_dir .'/'. $model->head_pic_model->getAttribute('file_name');
                        $delIcon = \kartik\icons\Icon::show("remove-circle",[],\kartik\icons\Icon::BSG);

                        $ajaxParamId = "head_pic";
                        $dataId = "data_id_head_pic";
                        $fileDesc = I_Upload::FILE_DESC_USER_HEADPIC;
                        $fileType = I_Upload::FILE_TYPE_IMAGE_01;
                        $uploadIdValue = is_null($model->head_pic_model) ? 0 : $model->head_pic_model->upload_id ;

                        ?>

                        <?=AjaxUploadWidget::widget([
                            'loadSrc' => $loadSrc,
                            'ajaxParamId' => $ajaxParamId,
                            'dataId' => $dataId,
                            'fileDesc' => $fileDesc,
                            'fileType' => $fileType,
                            'uploadIdValue' => $uploadIdValue
                        ])?>

                        <button class="btn btn-xs btn-default" onclick="$(this).closest('.headpic').find('.ajax_upload_img').trigger('click'); return false;">编辑</button>

                    </li>
                    <li class="ml-dl">
                        <div class="username edit-wrap">
                            <span class="edit-show"><?=$model->user_name?></span>
                            <span class="btn btn-xs btn-default pencil"><?=Icon::show('pencil',[],Icon::BSG)?></span>
                            <div class="input-wrap inline">
                                <?=$form->field($model, 'user_name', [
                                    'template'=>'{input} ',
                                    'options'=>[
                                        'style'=>'display: inline;',
                                        'class' => 'form-inline'
                                    ]
                                ])->textInput()?>
                            </div>
                        </div>
                        <div class="love_level">
                            <span>爱心等级 :</span>
                            <?php
                                $start = StarRating::widget([
                                    'name' => 'ffd',
                                    'value' => $model->LovePointsLevel,

                                    'pluginOptions' => [
                                        'showCaption' => false,
                                        'readonly' => true,
                                        'size' => 'sm',
                                        'stars' => 5,
                                        'min' => 0,
                                        'max' => 5,
                                        'step' => 0.1,
                                        'filledStar'=> '<span class="krajee-icon krajee-icon-heart"></span>',
                                        'emptyStar' => '<span class="krajee-icon krajee-icon-heart"></span>',

                                        'showClear' => false,
                                        'disabled' =>true
                                    ]
                                ]);
                                echo $start;
                            ?>
                        </div>
                        <div class="love_points">
                            <span>爱心积分 :</span>
                            <span class="number"><?=$model->love_points?></span>分
                            <img src="<?=Url::to(['/images/jifenguize.png'])?>" class=" jifenguize" style="display:none;" />
                        </div>
                    </li>
                </ul>

            </div>
            <div class="qq_space_address edit-wrap ">
                QQ空间:
                <span class="content">
                    <a href="<?=$model->qq_space_address?>" class="edit-show" target="_blank"><?=$model->qq_space_address?></a>
                </span>
                <span class="edit pencil">
                    <span class="btn btn-xs btn-default"><?=Icon::show('pencil',[],Icon::BSG)?></span>
                </span>
                <div class="input-wrap inline " >
                    <?=$form->field($model, 'qq_space_address', [
                        'template'=>'{input}  ',
                        'options'=>[
                            'style'=>'display: inline;',
                            'class' => 'form-inline'
                        ]
                    ])->textInput()?>
                </div>
            </div>
            <div class="sina_space_address mt-row edit-wrap">
                新浪微博:
                <span>
                    <a href="<?=$model->sina_space_address?>" class="edit-show" target="_blank"><?=$model->sina_space_address?></a>
                </span>
                <span class="edit pencil">
                    <span class="btn btn-xs btn-default"><?=Icon::show('pencil',[],Icon::BSG)?></span>
                </span>
                <div class="input-wrap inline">
                    <?=$form->field($model, 'sina_space_address', [
                        'template'=>'{input}  ',
                        'options'=>[
                            'style'=>'display: inline;',
                            'class' => 'form-inline'
                        ]
                    ])->textInput()?>
                </div>
            </div>
            <div class="wechat_address mt-row edit-wrap">
                微信账号:

                <span>
                    <a href="<?=$model->wechat_address?>" class="edit-show" target="_blank"><?=$model->wechat_address?></a>
                </span>
                <span class="edit pencil">
                    <span class="btn btn-xs btn-default"><?=Icon::show('pencil',[],Icon::BSG)?></span>
                </span>
                <div class="input-wrap inline">
                    <?=$form->field($model, 'wechat_address', [
                        'template'=>'{input}  ',
                        'options'=>[
                            'style'=>'display: inline;',
                            'class' => 'form-inline'
                        ]
                    ])->textInput()?>
                </div>
            </div>
            <div class="wechar_ewm_pic mt-row">

                上传微信二维码: <br/>
                <?php

                $loadSrc = is_null($model->wechar_ewm_pic_model)
                    ? '/images/icon_upload_wxcode.png'
                    : '/'.$model->wechar_ewm_pic_model->getAttribute('file_dir').'/'.$model->wechar_ewm_pic_model->getAttribute('file_name');
                $delIcon = \kartik\icons\Icon::show("remove-circle",[],\kartik\icons\Icon::BSG);

                $ajaxParamId = "wechar_ewm_pic";
                $dataId = "data_id_wechar_ewm_pic";
                $fileDesc = I_Upload::FILE_DESC_USER_WECHAR_EWM_PIC;
                $fileType = I_Upload::FILE_TYPE_IMAGE_01;

                $uploadIdValue = is_null($model->wechar_ewm_pic_model) ? 0 : $model->wechar_ewm_pic_model->upload_id ;


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
            </div>

            <div class="mt-row">
                <button class="btn btn-primary">确定</button>
            </div>


            <?php
                $form->end();
            ?>
        </div>
        <!--<div class="main-wrapper">
        </div>-->



<?php
echo AjaxFileUploadWidget::widget(['btnClass'=>'.ajax_upload_img','inputClass'=>'.ajax_upload']);
?>


