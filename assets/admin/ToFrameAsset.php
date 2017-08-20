<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2015/6/13
 * Time: 15:34
 */

namespace app\assets\admin;

use yii\web\AssetBundle;

class ToFrameAsset extends AssetBundle{

    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/site.css',
    ];
    public $js = [
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}