<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/13
 * Time: 6:18
 */

namespace tests\codeception\unit\models;


use yii\codeception\TestCase;

class BaseTestCase extends TestCase
{

    public $model;

    /**
     * 字符编辑转换
     * @param $string
     * @return string
     */
    public function convUtf82Gb2312($string){
        return iconv('utf-8', 'gb2312', $string);
    }

}