<?php
use app\modules\common\lib\GridView;
use app\widgets\AjaxSubmitForm;
use app\widgets\AreaPickerWidget;
use kartik\grid\SerialColumn;
use yii\bootstrap\Html;
use yii\bootstrap\Modal;
use yii\helpers\Url;
use yii\web\View;
use yii\widgets\ActiveForm;
?>



    <?php
    $form = ActiveForm::begin([
        'action' => Url::to(['advideo/create']),
        'method' => 'post',
        'options' => ['class' => 'form-gray', 'id'=>'createForm']
    ]);
    ?>
    <?=$form->field($model,'ad_id',['template'=>"{input}",'options'=>['style'=>'height:0;']])->hiddenInput()?>
    <?=$form->field($model, 'ad_title', [
        'options' => ['class'=>'form-inline'],
        'template'=>"1.{label}: {input}{error}"
    ])->textInput()?>

    <div class="form-inline  required ">
        <label>2.设置广告播出区域定位：选择区域(可多选)</label>

        <?=$form->field($model,'regions',[
            'options' => [ 'style'=>'display:inline'],
            'template' => "{error}",
            'errorOptions' => ['id'=>'regions_error', 'class'=>'help-block'],
        ])->textInput()?>

        <?=AreaPickerWidget::widget(['regions'=>$model->regions])?> <br/>
    </div>


    <div class="form-inline video-wrapper required ">
        <label>3.上传/更新广告视频：[大小(10M以内);宽高比(16:9);时长(15秒)]</label>

        <div class="form-inline">

            <a href="javascript: void(0)" class="video_flash_upload">本地上传</a>
            <input type="hidden" name="video[video_id]" value="<?=$model->video->video_id?>">
            <input type="hidden" name="video[video_unique]" value="<?=$model->video->video_unique?>">

            <?=$form->field($model,'video',[
                'options' => [ 'style'=>'display:inline'],
                'template' => "{error}",
                'errorOptions' => ['id'=>'video_error', 'class'=>'help-block'],
            ])->textInput()?>
        </div>
    </div>

    <?=$form->field($model,'link',[
        'template' => '1.{label}：{input}{error}',
        'options' => ['class'=>'form-inline']
    ])->textInput()?>

    <?=Html::submitButton("发布/更新",['class'=>'btn btn-success'])?>

    <?php
    $form->end();
    ?>



    <?php
    AjaxSubmitForm::widget([
        'formId' => 'createForm',
        'formName' => $model->formName(),
        'beforeValidEvent' => [
            'validRegions' => <<<STD
                function validRegions(){

                    var validResult = false;
                    if($("input[name='regions[]']").length > 0)
                        validResult = true;
                    if(validResult){
                        $('#regions_error').html('');
                        $('#regions_error').closest('.form-inline').addClass('has-success').removeClass('has-error');
                    }else{
                        $('#regions_error').html('地区不能为空!');
                        $('#regions_error').closest('.form-inline').addClass('has-error').removeClass('has-success');
                    }
                }
STD
            ,'checkVideo' => 'function checkVideo(){

                var validVideo = false;
                var video_id = $("input[name=\'video[video_id]\']").val();
                var video_unique = $("input[name=\'video[video_unique]\']").val();
                if((video_id==false && video_id != 0) || video_unique==false){
                    validVideo = false;
                }
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
                        $.x_alert({
                            cont: json.message,
                            time: 2000,
                            callback : function(){
                                var str = window.top.location.href.indexOf(\'?\')==-1 ? \'?\' : \'\';
                                window.top.location.href=window.top.location.href+str+\'&r=\'+Math.random()
                            }
                        })
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
    Yii::$app->view->on(View::EVENT_END_PAGE, function(){
        $jsReady = <<<STD
    <script type="text/javascript">
        $(function(){
        
            setTimeout(function(){
            },300)
            $(document).on("mouseout mousemove","body",function(){
             
                validRegions();
                //检测视频是否为空
                checkVideo();
            })
        })
    </script>
STD;
        echo $jsReady;

    })
    ?>

