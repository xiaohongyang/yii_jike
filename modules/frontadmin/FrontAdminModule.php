<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/12
 * Time: 20:46
 */

namespace app\modules\frontadmin;


use yii\base\Module;

class FrontAdminModule extends Module
{

    public $controllerNamespace = 'app\modules\frontadmin\controllers';

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub

        \Yii::configure($this,[]);
    }


}