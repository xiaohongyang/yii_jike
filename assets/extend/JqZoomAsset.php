<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/16
 * Time: 6:01
 */
namespace app\assets\extend;


use yii\web\AssetBundle;



class JqZoomAsset extends AssetBundle
{

    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
    ];
    public $js = [
        'js/ext/jqzoom/jquery.imagezoom.min.js'
    ];
    public $depends = [
    ];
}