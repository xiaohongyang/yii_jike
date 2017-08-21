<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/15
 * Time: 23:54
 */

namespace app\assets\extend;


use yii\web\AssetBundle;

class EchartAsset extends AssetBundle
{

    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $js = [
        //,'js/ext/echarts.js',,
        "http://echarts.baidu.com/gallery/vendors/echarts/echarts-all-3.js",
        'http://echarts.baidu.com/gallery/vendors/echarts/extension/dataTool.min.js',
        "http://echarts.baidu.com/gallery/vendors/echarts/map/js/china.js",
        "http://echarts.baidu.com/gallery/vendors/echarts/map/js/world.js",
        "http://api.map.baidu.com/api?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM",
    ];

}