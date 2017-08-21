<?php

namespace app\modules\admin;

class AdminModule extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\admin\controllers';

    public function init()
    {

        parent::init();
        // custom initialization code goes here

        \yii::configure($this, require(__DIR__.'/config.php'));

        $this->params['maxPostCount'] = 50;

    }
}
