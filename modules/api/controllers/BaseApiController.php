<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/4/19
 * Time: 22:01
 */

namespace app\modules\api\controllers;


use app\modules\common\traits\UserinfoTraite;
use app\modules\frontadmin\controllers\BaseController;
use yii\web\Controller;

class BaseApiController extends BaseController
{
    public function init()
    {

        ini_set('always_populate_raw_post_data', -1);

        parent::init(); // TODO: Change the autogenerated stub
    }


}