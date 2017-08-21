<?php
/**
 * 阿里云文件上传静态资源
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/16
 * Time: 6:01
 */
namespace app\assets\extend;


use yii\web\AssetBundle;



class YoukuVideoUploadAsset extends AssetBundle
{

    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
    ];
    public $js = [
        'js/ext/plupload-2.1.2/js/plupload.full.min.js',
        'js/ext/plupload-2.1.2/youku_upload.js'
    ];
    public $depends = [
    ];
}