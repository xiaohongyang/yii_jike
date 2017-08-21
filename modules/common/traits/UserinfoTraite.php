<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 12:55
 */

namespace app\modules\common\traits;


use app\modules\jike\models\user\User_info;

trait UserinfoTraite
{

    private $_userCity = null;

    public  function getLoginUserId(){

        $user = $this->getLoginUser();
        return (is_null($user))? null : $user->getId();
    }

    public  function getLoginUserName(){

        $user = $this->getLoginUser();
        return (is_null($user))? null : $user->user_name;
    }

    public function getLoginUser(){

        return \Yii::$app->jike_user->identity;
    }

    /**
     * 获取用户所在城市;
     * @return int|null
     */
    public function getUserCity(){
        if(is_null($this->_userCity)){

            $userId = $this->getLoginUserId();
            $userInfo = User_info::findOne(['user_id'=>$userId]);
            $this->_userCity = is_null($userInfo) ? null : $userInfo->city_id;
        }
        return $this->_userCity;
    }

}