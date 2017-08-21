<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/15
 * Time: 23:54
 */

namespace app\assets\extend;


use yii\web\AssetBundle;

class XUeditorAsset extends AssetBundle
{

    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $js = [
        'js/ext/ueditor1_4_3_2-utf8-php/ueditor.config.js',
        'js/ext/ueditor1_4_3_2-utf8-php/ueditor.all.js'
    ];

}