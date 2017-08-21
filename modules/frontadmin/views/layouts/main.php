<?php

/* @var $this \yii\web\View */
/* @var $content string */

use kartik\icons\Icon;
use kartik\icons\OpenIconicAsset;
use xj\bootbox\BootboxAsset;
use yii\bootstrap\Modal;
use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\helpers\Url;
use yii\web\View;
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
    <title><?= Html::encode($this->title)?:'新一代优惠返利平台' ?></title>
    <meta name="description" content="免费抽奖，0元夺宝，分享有奖，红包达人，捡钱神器，环游世界，梦想人生…天天有优惠，天天有返利…">
    <meta name="Keywords" content="jike,jike365,集客, 集客365, 0元夺宝,优惠卷,抢红包,免费彩票,环游世界,免费旅游,免费抽奖, 0元购物,二维码,自媒体,互联网广告,有奖转发,企业之窗,梦想人生, 爱心传递,阿妹逛街,购物卷,食客准备">
    <?php $this->head() ?>

    <?=Html::cssFile("@web/css/jike/common.css") ?>
    <?=Html::cssFile("@web/css/jike/vendor.css") ?>
    <?php registerActionCssFile() ?>
</head>
<body class="fontadmin body-<?=implode('-',get_site_array())?>">
<?php $this->beginBody() ?>

<div class="wrap">

    <?php
    echo Yii::$app->view->render('top.php');
    ?>

    <div class="container">


        <div class="marketingpromotion-prizeRelease">
            <div class="row">
                <div class="col-md-2 left-wrap">
                    <?php
                    echo Yii::$app->view->render('left.php');
                    ?>
                </div>

                <div class=" col-md-10 pL30">
                    <div class="side-main">
                        <?= $content ?>
                    </div>
                </div>
            </div><!--//marketingpromotion-prizeRelease-->

        </div>
</div>

    <footer class="footer">
        <div class="row margin_lr_0">
            <div class="col-md-7 left">
                <div class="text-right">
                    <a href="<?=Url::to(['/jike/other/detail','id'=>3])?>" class="cl_default"> 关于集客 </a> <span class="line">|</span>
                    <a href="<?=Url::to(['/jike/other/detail','id'=>4])?>" class="cl_default"> 联系我们 </a> <span class="line">|</span>
                    <a href="<?=Url::to(['/jike/other/detail','id'=>5])?>" class="cl_default"> 招聘英才 </a> <span class="line">|</span>
                    <a href="<?=Url::to(['/jike/other/detail','id'=>6])?>" class="cl_default"> 商务合作 </a>
                    <br/>
                    <span class="cl_default fs_df"> 苏州优集客网络版权所有 &nbsp;&nbsp; 备案:苏ICP备16045534号   </span>
                </div>
            </div>
            <div class="col-md-5 right">

                <a href="" style="display: inline-block">
                    <?=Html::img(Yii::getAlias("@web/css/images/index/index/site_wx_pic.png"))?>
                </a>
                <div class="text" style="display: inline-block;">
                    扫描二维码 <br/>
                    下载集客客户端
                </div>


            </div>

        </div>

    </footer>

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
                    $(this).file_upload();
                    return false;
                });
            });
        });
        $.fn.file_upload = function(option){
            $.fn.ali_oss_file_upload(option);
        }
        $.fn.ali_oss_file_upload = function(option)
        {
            //弹出上传窗口
            //关闭窗口是回调获取上传的文件数据

//                        title:'上传视频广告', timeout:0, bg:1, btn:[],
//                        cont : re.data.flash_upload,
////                        size:{width:0, height: 225},
//                        callback:function(){
//                            ;
//                        }
//                    });
//                }else{
//                    $.say({type:'error',cont:'加载失败，请重试...'});
//                }
//            });

            var $t = $(this)

            $.fn.iframe_x_say({
                url : '/public/uploadVideo',
                time : 9999999999,
                iframeClass : 'uploadFileIframe',
                size : [500, 200],
                frameSize : [455, 80],
                contStyle : {
                    padding : '30px 20px 0px 20px '
                },
                btnOption : {
                    marginTop : '20px'
                }
                ,callback : function(ext){
                    var video_id = $('iframe.uploadFileIframe').contents().find('.video_id').val()
                    var video_unique = $('iframe.uploadFileIframe').contents().find('.video_unique').val()

                    $('[name="video[video_id]"]').val(video_id);
                    $('[name="video[video_unique]"]').val(video_unique);
                    $('#video_info').find('[type=submit]').removeAttr('disabled').removeClass('disabled');
//                        var size = size.toFixed(2);
                    var size = '33';
                    $t.removeClass('bggray').addClass('bggreen').text('视频上传成功，视频大小为 '+ size + ' M');
                }
            })

        }
        $.fn.video_flash_upload = function(option)
        {
            var oDate = new Date();
            var nowDate = oDate.toLocaleString();
            var $t = $(this),opt = $.extend({
                video_name : '集客365视频'+nowDate,
                video_width : 410,
                //video_height :150,
                video_height :225,
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
