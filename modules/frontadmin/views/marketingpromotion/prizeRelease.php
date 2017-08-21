<?php

use app\modules\common\models\uploadform\I_Upload;
use app\widgets\AjaxFileUploadWidget;
use app\widgets\AjaxSubmitForm;
use kucha\ueditor\UEditor;
use mihaildev\ckeditor\CKEditor;
use rmrevin\yii\fontawesome\component\Icon;
use yii\base\Event;
use yii\base\Model;
use yii\bootstrap\Html;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use yii\web\Application;
use yii\web\View;
use yii\widgets\ActiveForm;

$this->params['breadcrumbs'] = [
    ['label' => '营销推广', '#'],
    ['label' => '视频广告营销', '#'],
    ['label' => '夺宝奖品发布与管理', 'url' => '#']
];
?>


<nav>
    <ul>
        <li>
            <?= Html::a("产品及服务说明", Url::to(['marketingpromotion/info']), ['class' => 'btn-gray']) ?>
        </li>
        <li>
            <?= Html::a("夺奖产品发布/管理", Url::to(['marketingpromotion/prizegoodslist']), ['class' => ' btn-active']) ?>
        </li>
        <li>
            <?= Html::a("兑奖订单管理", Url::to(['marketingpromotion/orderList']), ['class' => ' btn-gray']) ?>
        </li>
    </ul>
</nav>

<div class="clearfix"></div>

<div class="release">
    <a href="<?= Url::to(['marketingpromotion/prizegoodslist']) ?>" class="gotolist"><< 返回活动列表</a>
    <div>

        <h4>发布活动/奖品信息:</h4>
    </div>
    <?php
    $form = ActiveForm::begin([
        'method' => 'post',
        'options' => ['class' => 'form-gray', 'id' => 'prizeGoods-release']
    ]);

    $inputTemplate = "{label}: {input}{error}";
    $inputParams = [
        'options' => ['class' => 'form-inline'],
        'template' => $inputTemplate
    ];
    ?>

    <?= $form->field($model, 'prize_type_id', $inputParams)
        ->dropDownList(ArrayHelper::map($model->prize_type_list, 'type_id', 'type_name'))
        ->label('1.' . $model->attributeLabels()['prize_type_id']) ?>


    <?= $form->field($model, 'prize_code', $inputParams)->textInput([
        'placeHolder' => $model->placeHolder['prize_code']
    ])->label('2.' . $model->attributeLabels()['prize_code']) ?>


    <div class="form-inline">
        <label>3.<?= $model->attributeLabels()['prize_name'] ?>:</label>

        <?= $form->field($model, 'prize_short_name', [
            'template' => "{input} {error}"
        ])->textInput(['placeHolder' => $model->placeHolder['prize_short_name']]) ?>
        <?= $form->field($model, 'prize_name', [
            'template' => "{input} {error}"
        ])->textInput([
            'placeHolder' => $model->placeHolder['prize_name']
        ])->label('2.' . $model->attributeLabels()['prize_name']) ?>
    </div>


    <div class="form-inline">
        <label>4.奖品(规格)选项:(请设置奖品(商品)的规格属性，以便给中奖人提供准确的奖品)</label>
    </div>

    <div class="prize_norms-wrap">

        <div class="form-inline">
            规格选项一:
            <input type="text" name="prize_norms_01[]" class="form-control" placeholder="属性值">
            <span class="btn"
                  onclick='$(this).before("<input type=\"text\" name=\"prize_norms_01[]\" class=\"form-control\" placeholder=\"属性值\"> ")'>+ 添加</span>

            <?= $form->field($model, 'prize_norms_01', [
                'options' => ['class' => 'test', 'style' => 'display:inline'],
                'template' => "{error}",
                'errorOptions' => ['id' => 'prize_norms_01_error', 'class' => 'help-block'],
            ])->textInput() ?>
        </div>
        <div class="form-inline">
            规格选项二:
            <input type="text" name="prize_norms_02[]" class="form-control" placeholder="属性值">
            <span class="btn"
                  onclick='$(this).before("<input type=\"text\" name=\"prize_norms_02[]\" class=\"form-control\" placeholder=\"属性值\"> ")'>+ 添加</span>
            <?= $form->field($model, 'prize_norms_02', [
                'options' => ['class' => 'test', 'style' => 'display:inline'],
                'template' => "{error}",
                'errorOptions' => ['id' => 'prize_norms_02_error', 'class' => 'help-block'],
            ])->textInput() ?>
        </div>
    </div>

    <?= $form->field($model, 'market_price', [
        'options' => ['class' => 'form-inline'],
        'template' => '{label}: {input} (务必请设置真实价格信息,市场价格是保证金冻结的依据;也是审核的研发标准之一) {error}'
    ])->textInput(['style' => 'width: 100px;'])->label('5.' . $model->attributeLabels()['market_price']) ?>

    <div class="form-inline   required ">
        <label>6.设置奖品（商品）相册</label>
        <div class="upload_pic_wrap">
            <div class="title">图片上传</div>
            <div class="content">

                <?php
                for ($i = 0; $i < 5; $i++) {

                    $uploadUrl = Url::to(['/common/file/upload'], true);
                    $loadSrc = '/images/icon_upload.png';
                    $delIcon = \kartik\icons\Icon::show("remove-circle", [], \kartik\icons\Icon::BSG);

                    $ajaxParamId = "goods_image_{$i}";
                    $dataId = "data_id_{$i}";
                    $fileDesc = I_Upload::FILE_DESC_PRIZE_GOODS_IMAGE;
                    $fileType = I_Upload::FILE_TYPE_IMAGE_01;
                    $str = <<<STD
                                            <input id="{$ajaxParamId}"
                                                    name="UploadForm[{$ajaxParamId}]"
                                                    point-class="UploadForm-{$ajaxParamId}" type="file"
                                                    point-img="img-UploadForm-{$ajaxParamId}"
                                                    point-valueId-class = "value-{$ajaxParamId}"
                                                    data-url="{$uploadUrl}"
                                                    data-id ="{$dataId}"
                                                    class="ajax_upload form-control"
                                                    />

                                            <input type='hidden' class="file_desc" value="{$fileDesc}" />

                                            <input type='hidden' name="UploadFormValuePic[]" value="" class="value-{$ajaxParamId}"  />
                                            <img src="{$loadSrc}" id="img-UploadForm-{$ajaxParamId}" class="none ajax_upload_img" point-file-input="{$ajaxParamId}" load-src="{$loadSrc}"/>
                                            <a class="del">{$delIcon}</a>
STD;
                    ?>

                    <div class="btn-wrap">
                                            <span class="btn">
                                                <?= $str ?>
                                            </span>
                    </div>
                    <?php
                }
                ?>
                <?= $form->field($model, 'prize_goods_pic', [
                    'options' => ['class' => 'test', 'style' => 'display:inline'],
                    'template' => "{error}",
                    'errorOptions' => ['id' => 'prize_goods_pic_error', 'class' => 'help-block'],
                ])->textInput() ?>

                <div class="note">
                    提示: <br/>
                    1.图片格式PNG或JPEG,建议尺幅500*500PX以内;大小不要超过500K;最多可上传5张图片....<br/>
                    2.首图务请抠除前景信息(留白),仅保留商品信息(审核的硬标准之一)
                </div>
            </div>
        </div>
    </div>

    <?= $form->field($model, 'prize_describe', [
        'options' => ['class' => 'form-inline'],
        'template' => $inputTemplate,
        'errorOptions' => ['id' => 'prize_describe_error', 'class' => 'help-block'],
    ])->widget(CKEditor::className(), [
        'editorOptions' => ['preset' => 'full']

    ])->label("7." . $model->attributeLabels()['prize_describe']); ?>

    <div class="form-inline video-wrapper required ">
        <label>8.设置0元夺宝活动视频广告:(品牌视频广告或商品介绍视频:大小在10M以内;宽高比16:9;时长限15秒)</label>

        <div class="form-inline">

            <a href="javascript: void(0)" class="video_flash_upload">本地上传</a>
            <input type="hidden" name="video[video_id]" value="">
            <input type="hidden" name="video[video_unique]" value="">

            <?= $form->field($model, 'video', [
                'options' => ['style' => 'display:inline'],
                'template' => "{error}",
                'errorOptions' => ['id' => 'video_error', 'class' => 'help-block'],
            ])->textInput() ?>
        </div>
    </div>

    <div class="form-inline field-prize_goods_create-prize_name required ">
        <label>9.设置商品相关外链:</label>
    </div>

    <div class="form-inline   ">
        <label>旗舰店销售地址:</label>

        <?= $form->field($model, 'shop_name', [
            'template' => '{input} {error}'
        ])->textInput(['placeHolder' => $model->placeHolder['shop_name'], 'style' => 'width: 145px']) ?>
        <?= $form->field($model, 'goods_link', [
            'template' => '{input} {error}'
        ])->textInput(['placeHolder' => $model->placeHolder['goods_link']]) ?>
    </div>


    <?= $form->field($model, 'offcial_website', $inputParams)->textInput([
        'placeHolder' => $model->placeHolder['offcial_website']
    ]) ?>

    <div class="form-inline field-prize_goods_create-prize_name required ">
        <label>微信公众号:</label>
        <div class="upload_wx_qr_code_wrap">

            <?php

            $uploadUrl = Url::to(['/common/file/upload'], true);
            $loadSrc = '/images/icon_upload_wxcode.png';
            $delIcon = \kartik\icons\Icon::show("remove-circle", [], \kartik\icons\Icon::BSG);

            $ajaxParamId = "wx_code_image";
            $dataId = "data_id_wx_code";
            $fileDesc = I_Upload::FILE_DESC_PRIZE_GOODS_WX_QRCODE;
            $fileType = I_Upload::FILE_TYPE_IMAGE_01;
            $str = <<<STD
                                            <input id="{$ajaxParamId}"
                                                    name="UploadForm[{$ajaxParamId}]"
                                                    point-class="UploadForm-{$ajaxParamId}" type="file"
                                                    point-img="img-UploadForm-{$ajaxParamId}"
                                                    point-valueId-class = "value-{$ajaxParamId}"
                                                    data-url="{$uploadUrl}"
                                                    data-id ="{$dataId}"
                                                    class="ajax_upload form-control"
                                                    />

                                            <input type='hidden' class="file_desc" value="{$fileDesc}" />

                                            <input type='hidden' name="UploadFormValueWxQrCode[]" value="" class="value-{$ajaxParamId}"  />
                                            <img src="{$loadSrc}" id="img-UploadForm-{$ajaxParamId}" class="none ajax_upload_img" point-file-input="{$ajaxParamId}" load-src="{$loadSrc}"/>
                                            <a class="del">{$delIcon}</a>
STD;
            ?>

            <div class="btn-wrap">
                                    <span class="btn">
                                        <?= $str ?>
                                    </span>
            </div>

        </div>

    </div>

    <div class="note">
        提醒:已发布的信息不能修改，请仔细核对...
    </div>

    <div class="text-left">

        <?= Html::submitButton("立即发布", ['class' => 'btn btn-success']) ?>

    </div>

    <?php
    ActiveForm::end();
    ?>
</div>


<script type="text/javascript">

    <?php
    echo AjaxFileUploadWidget::widget(['btnClass' => '.ajax_upload_img', 'inputClass' => '.ajax_upload']);
    ?>

    <?php

    $strCheckPrizeNorm = <<<STR
            function checkPrizeNorm(){

                var validPrizeNorms01 = validPrizeNorms02 =  false;
                $("input[name='prize_norms_01[]']").each(function(){
                    if($.trim($(this).val()).length>0){
                        validPrizeNorms01 = true;
                    }
                })
                $("input[name='prize_norms_02[]']").each(function(){
                    if($.trim($(this).val()).length>0){
                        validPrizeNorms02 = true;
                    }
                })


                if(validPrizeNorms01){
                    $('#prize_norms_01_error').html('');
                    $('#prize_norms_01_error').closest('.form-inline').addClass('has-success').removeClass('has-error');
                }else{
                    $('#prize_norms_01_error').html('规格属性一不能为空!');
                    $('#prize_norms_01_error').closest('.form-inline').addClass('has-error').removeClass('has-success');
                }

                if(validPrizeNorms02){
                    $('#prize_norms_02_error').html('');
                    $('#prize_norms_02_error').closest('.form-inline').addClass('has-success').removeClass('has-error');
                }else{
                    $('#prize_norms_02_error').html('规格属性二不能为空!');
                    $('#prize_norms_02_error').closest('.form-inline').addClass('has-error').removeClass('has-success');
                }

            }
STR;

    $prizeListUrl = Url::to(['marketingpromotion/prizegoodslist']);
    AjaxSubmitForm::widget(['formId' => 'prizeGoods-release', 'beforeValidEvent' => [
        'checkPrizeNorm' => $strCheckPrizeNorm,

        'checkPrizeGoodsPic' => 'function checkPrizeGoodsPic(){

                        validUploadFormValuePic = false;
                        $("input[name=\'UploadFormValuePic[]\']").each(function(){
                            if($.trim($(this).val()).length>0){
                                validUploadFormValuePic = true;
                            }
                        })
                        if(validUploadFormValuePic){
                            $(\'#prize_goods_pic_error\').html(\'\');
                            $(\'#prize_goods_pic_error\').closest(\'.form-inline\').addClass(\'has-success\').removeClass(\'has-error\');
                        }else{
                            $(\'#prize_goods_pic_error\').html(\'商品图片不能为空!\');
                            $(\'#prize_goods_pic_error\').closest(\'.form-inline\').addClass(\'has-error\').removeClass(\'has-success\');
                        }
                    }',
        'checkVideo' => 'function checkVideo(){

                        var validVideo = false;
                        var video_id = $("input[name=\'video[video_id]\']").val();
                        var video_unique = $("input[name=\'video[video_unique]\']").val();
                        if((video_id==false || video_unique==false ) && video_id !=="0")
                            validVideo = false;
                        else
                            validVideo = true;
                        if(validVideo){
                            $(\'#video_error\').html(\'\');
                            $(\'#video_error\').closest(\'.form-inline\').addClass(\'has-success\').removeClass(\'has-error\');
                        }else{
                            $(\'#video_error\').html(\'视频不能为空!\');
                            $(\'#video_error\').closest(\'.form-inline\').addClass(\'has-error\').removeClass(\'has-success\');
                        }
                    }'
    ],
        'afterValidEvent' => [
            'success' => '
                    $.say({type:\'success\',cont:json.message,callback:function(){
                        document.location.href=\'' . $prizeListUrl . '\'
                    }});
                ',
            'fail' => '
                    $.say({type:\'error\',cont:\'添加失败，请与管理员联系...\'});
                ',
            'error' => '
                '
        ]
    ]);
    ?>

    <?php

    Yii::$app->view->on(View::EVENT_END_PAGE, function () {
        $jsString = <<<STD

            <script type="text/javascript">
            $(function(){
                (function(){
                    $(".prize_norms-wrap input").blur(function(){
                        //检测规格是否为空
                        checkPrizeNorm();
                    })
                    $(document).on("mouseout mousemove","body",function(){
                        //检测图片是否为空
                        checkPrizeGoodsPic();
                        //检测视频是否为空
                        checkVideo();
                    })
                }())
            })
            </script>


STD;


        echo $jsString;
    })
    ?>


</script>


