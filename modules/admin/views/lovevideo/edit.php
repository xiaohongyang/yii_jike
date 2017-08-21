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
    'method' => 'post',
    'options' => ['class' => 'form-gray', 'id'=>'createForm']
]);
?>

<?=$form->field($model,'love_id',['template'=>"{input}",'options'=>['style'=>'height:0;']])->hiddenInput()?>



<?=$form->field($model, 'love_name', [
    'options' => ['class'=>'form-inline'],
    'template'=>"{label}: {input}{error}"
])->textInput()->label("一.广告名称")?>


<?=$form->field($model, 'love_title', [
    'options' => ['class'=>'form-inline'],
    'template'=>"{label}: {input}{error}"
])->textInput()->label("二.广告宣传口号及标题")?>



<div class="form-inline video-wrapper required ">
    <label>三.上传/更新广告视频：[大小(10M以内);宽高比(16:9);时长(15秒)]</label>

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
            if(video_id==false || video_unique==false)
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
                    $.x_alert({
                        cont: json.message,
                        time: 2000,
                        callback : function(){
                            window.parent.location.href=window.parent.location.href
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
