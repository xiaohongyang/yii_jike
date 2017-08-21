<?php
    use yii\helpers\Url;
    use yii\widgets\ActiveForm;
    use yii\helpers\Html;
?>
<?php
    \app\assets\extend\AliyunVideoUploadAsset::register($this);
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



<div id="ossfile">你的浏览器不支持flash,Silverlight或者HTML5！</div>

<div id="container_xx">
    <a id="selectfiles" href="javascript:void(0);" class='btn btn-sm btn-xs'>选择文件</a>
    <a id="postfiles" href="javascript:void(0);" class='btn btn-sm btn-xs'>开始上传</a>
</div>
<!--<pre id="console"></pre>
<p>&nbsp;</p>-->