<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/12
 * Time: 8:48
 */

namespace app\modules\jike\service;


use app\modules\common\traits\UserinfoTraite;
use app\modules\jike\models\user\User_info;

class BaseService
{

    public $message;

    use UserinfoTraite;

    /* private $_userCity = null;

    public  function getLoginUserId(){

        $user = $this->getLoginUser();
        return (is_null($user))? null : $user->getId();
    }

    public function getLoginUser(){

        return \Yii::$app->jike_user->identity;
    }

    public function getUserCity(){
        if(is_null($this->_userCity)){

            $userId = $this->getLoginUserId();
            $this->_userCity = User_info::findOne(['user_id'=>$userId])->city_id;
        }
        return $this->_userCity;
    }*/





}