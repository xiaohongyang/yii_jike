<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/2/28
 * Time: 22:13
 */

namespace app\modules\jike\models;


class UserLogout extends User
{
    public function logout(){
        return \Yii::$app->jike_user->logout();
    }
}