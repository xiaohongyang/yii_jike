<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 12:55
 */

namespace app\modules\common\traits;



trait AdminInfoTraite
{

    private $_userCity = null;

    public  function getLoginAdminId(){

        $user = $this->getLoginAdmin();
        return (is_null($user))? null : $user->getId();
    }

    public  function getLoginAdminName(){

        $user = $this->getLoginAdmin();
        return (is_null($user))? null : $user->user_name;
    }

    public function getLoginAdmin(){

        return \Yii::$app->user->identity;
    }


}