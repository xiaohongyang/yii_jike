<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/6
 * Time: 10:37
 */

namespace app\modules\jike\controllers;


class UserController extends BaseController
{

    public function actionIndex(){
        return $this->render('developing');
    }
}