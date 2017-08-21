<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/10
 * Time: 17:07
 */

namespace app\modules\frontadmin\models\user;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_account\User_account_log;
use app\modules\frontadmin\models\user_address\User_address;

class User extends BaseActiveRecord
{

    const C_STATUS_DISABLE = 0;
    const C_STATUS_ENABLE = 1;
    const C_STATUS_DELETED = 2;

    const C_ROLE_SUPPER_ADMIN = "超级管理员";
    const C_ROLE_CHECK_ADMIN = "内容审核员";

    /**
     * 账户(包含营销账户、积分账户和保证金账户)
     * @return \yii\db\ActiveQuery
     */
    public function getUser_account(){
        return $this->hasOne(User_account::className(), ['user_id'=>'user_id']);
    }

     public function getUserInfo(){
         return $this->hasOne(User_info::className(), ['user_id'=>'user_id']);
     }

    public function getUserAddress(){
        return $this->hasOne(User_address::className(), ['user_id'=>'user_id']);
    }

    public function getThreeMonthMarktingPay(){

        $query = User_account_log::find();
        $query->where(['user_id'=>$this->user_id]);
        $query->andWhere([
            'in',
            'change_type',
            User_account_log::getCashTyppe()
        ]);
        $query->andWhere([
            '>',
            'markting_account',
            0
        ]);

        return $query->sum('markting_account');
    }

}