<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2015/7/30
 * Time: 15:23
 */
use app\widgets\AjaxFileUploadWidget;
use yii\captcha\Captcha;
use yii\helpers\Html;
use yii\widgets\ActiveForm;


?>


<div class="input-group">

    <input type="file"
           id="shop_logo" name="UploadForm[shop_logo]"
           point-class="UploadForm-shop_logo"
           point-img="img-UploadForm-shop_logo"
           data-url="http://jike.com/frontadmin/marketingpromotion/test/"
           data-id="118" class="ajax_upload form-control">
    <input type="hidden" name="UploadForm[shop_logo]" class="UploadForm-shop_logo">
    <input type="hidden" name="value[118]" value="1454641240.png" class="UploadForm-shop_logo">
    <img src="http://yii.com/upload/shopconfig/1454641240.png" id="img-UploadForm-shop_logo" class="none" style="width:50px; height:50px;">
    <span class="shop_logoappend"></span>                </div>

<?php
AjaxFileUploadWidget::widget(['objClass'=>'.ajax_upload']);
?>
