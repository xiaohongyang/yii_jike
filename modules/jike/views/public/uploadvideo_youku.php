<?php
    use yii\helpers\Url;
    use yii\widgets\ActiveForm;
    use yii\helpers\Html;
?>

<style type="text/css">

    .btn{
        color: #fff;
        background-color: #337ab7;
        border-color: #2e6da4;
        display: inline-block;
        padding: 6px 12px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        text-decoration: none;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 4px;
    }
    a.btn:hover{
        background-color: #3366b7;
    }
    .progress{
        margin-top:2px;
        width: 200px;
        height: 14px;
        margin-bottom: 10px;
        overflow: hidden;
        background-color: #f5f5f5;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
        box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
    }
    .progress-bar{
        background-color: rgb(92, 184, 92);
        background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.14902) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.14902) 50%, rgba(255, 255, 255, 0.14902) 75%, transparent 75%, transparent);
        background-size: 40px 40px;
        box-shadow: rgba(0, 0, 0, 0.14902) 0px -1px 0px 0px inset;
        box-sizing: border-box;
        color: rgb(255, 255, 255);
        display: block;
        float: left;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        transition-delay: 0s;
        transition-duration: 0.6s;
        transition-property: width;
        transition-timing-function: ease;
        width: 266.188px;
    }
    #container_xx .btn{
        color: #fff;
    }
</style>

<?php
    if($model->videoId) {
?>
    <div id="video_content" style="height: 0;  ">
        <iframe frameborder="0" height="498" src="http://player.youku.com/embed/<?=$model->videoId?>" width="510"></iframe>
    </div>
<?php
}
?>


<?php
$display = $model->videoId ? 'none' : 'block';
$activeForm = ActiveForm::begin([
    'options' => [
        'enctype' =>  'multipart/form-data',
        'style' => 'padding: 20px; display: '.$display.';'
    ]
]);
?>
<?=$activeForm->field($model, 'videoFile')->fileInput()->label('<img src="/images/icon_upload.png" style="width:50px; height:50px;" />
    <span id="fileName" class="hide" style="margin-left: 30px;"></span> 
    <span id="loading" class="hide" style="margin-left: 30px;"><img src="/images/loading.gif"  style="width: 50px; height: 50px;" />正在上传中... </span>')?>

<?=Html::submitButton("提交", ['class'=>'btn btn-sx btn-success'])?>
<?php
$activeForm::end();
?>


<?php

$jsString = <<<STD
    $(function(){
        setTimeout(function(){
             $('.btn-success').trigger('click');
        },200);
        
        $('#thirdvideo-videofile').change(function(){
            $('#fileName').html($('#thirdvideo-videofile').val()) .removeClass('hide')
        })
        
        $('.btn-success').click(function(){
            if($('#thirdvideo-videofile').val()){
                $('#loading').removeClass('hide');
            }
        })
    })
STD;

Yii::$app->view->registerJs($jsString, \yii\web\View::POS_END);
?>
