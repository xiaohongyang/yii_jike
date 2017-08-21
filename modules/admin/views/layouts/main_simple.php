<?php

/* @var $this \yii\web\View */
/* @var $content string */

use kartik\icons\Icon;
use kartik\icons\OpenIconicAsset;
use xj\bootbox\BootboxAsset;
use yii\helpers\Html;
use app\assets\AppAsset;

AppAsset::register($this);


BootboxAsset::register($this);
BootboxAsset::registerWithOverride($this);
OpenIconicAsset::register($this);
Icon::map($this);

?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>

    <?=Html::cssFile("@web/css/jike/vendor.css") ?>
    <?=Html::cssFile("@web/css/jike/common.css") ?>
    <?php registerActionCssFile(); ?>
    <?php
        registerActionJsFile();
    ?>
</head>
<body class="admin body-<?=implode('-',get_site_array())?>">
<?php $this->beginBody() ?>

<div class="wrap">

    <div class=" ">
        <!--        <div class="marketingpromotion-prizeRelease">-->
        <div class="fontadmin">
            <div class="row">

                <?= $content ?>
            </div><!--//marketingpromotion-prizeRelease-->

        </div>
    </div>



    <?php $this->endBody() ?>

    <?php
    $this->registerJsFile("/js/common_xhy.js");
    registerActionJsFile();
    ?>
    <script src="/js/ext/ajaxFileUpload.js"></script>



    <script type="text/javascript">
        /**
         * 乐视视频上传 2015-04-27 17:09:08
         * 自动检测文件大小，默认不超过10m
         * 所遇问题，1，如何检测文件大小，2，没有上传文件的检测 3，删除不规范视频
         * @return {[type]} [description]
         */
        !(function(){
            $(function(){
                $('.video_flash_upload').each(function(){
                    $(this).click(function(event) {
                        $(this).video_flash_upload();
                        return false;
                    });
                });
            });
            $.fn.video_flash_upload = function(option)
            {
                var oDate = new Date();
                var nowDate = oDate.toLocaleString();
                var $t = $(this),opt = $.extend({
                    video_name : '集客365视频'+nowDate,
                    video_width : 410,
                    video_height :150,
                    js_callback : '$(function(){ $(".ldf_say_close").trigger("click"); })',

                }, option);
                var url = '/common/letv/get_video_flash';

                $.post(url,opt, function(re){
                    if(re){
                        re = $.parseJSON(re);
                        var video_id = re.data.video_id;
                        var video_unique = re.data.video_unique;
                        $.say({
                            title:'上传视频广告', timeout:0, bg:1, btn:[],
                            cont : re.data.flash_upload,
//                        size:{width:0, height: 225},
                            callback:function(){
                                setTimeout(function(){ // 延迟1秒检测视频是否上传
                                    $.post('/common/letv/get_video_info',{video_id:video_id}, function(res){
                                        // console.log(res);
                                        if(res.code >0 ){
                                            $.say({type:'error',cont:'请上传视频'});
                                        }else{ //视频上传成功
                                            var size = res.data.initial_size;
                                            size = size / 1024;//kb
                                            size = size / 1024;//mb
                                            if(size>10){ // 检测上传视频大小
                                                $.getJSON('/common/letv/video_del',{video_id:video_id}); //删除乐视视频
                                                $.say({type:'error',cont:'视频超出大小，请重新上传'});
                                            }else{
                                                // console.log(size);
                                                $.say({type:'success',cont:'视频上传成功，请等待审核！'});
                                                $('[name="video[video_id]"]').val(video_id);
                                                $('[name="video[video_unique]"]').val(video_unique);
                                                $('#video_info').find('[type=submit]').removeAttr('disabled').removeClass('disabled');
                                                $t.removeClass('bggray').addClass('bggreen').text('视频上传成功，视频大小为 '+ size.toFixed(2) + ' M');
                                            }
                                        }
                                    },'json');
                                },1000);
                            }
                        });
                    }else{
                        $.say({type:'error',cont:'加载失败，请重试...'});
                    }
                });
            }
        })();
    </script>

    <input type="hidden" id="csrf_xhy"   value="<?=Yii::$app->request->getCsrfToken()?>" />
</body>
</html>
<?php $this->endPage() ?>
