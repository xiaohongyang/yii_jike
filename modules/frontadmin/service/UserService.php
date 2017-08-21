<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/26
 * Time: 6:02
 */

namespace app\modules\frontadmin\service;


use app\modules\frontadmin\models\user\User_info;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_address\User_address;
use app\modules\jike\models\User;
use app\modules\jike\models\UserEditPassword;
use yii\helpers\ArrayHelper;

class UserService extends BaseService
{

    public function __construct()
    {
    }

    public static function getUserinfoService(){
        return new User_infoService();
    }

    public function getUserEditPasswordModel(){
        return  UserEditPassword::findOne($this->getLoginUserId());
    }

    public function getUserAccountModel(){
        return User_account::findOne(['user_id'=>$this->getLoginUserId()]);
    }

    public function getUserAddressModel(){

        if(User_address::find()->where(['user_id' => $this->getLoginUserId()])->exists())
            return User_address::findOne(['user_id' => $this->getLoginUserId()]);
        else
            return new User_address();
    }


    /**
     * 所有月份注册人数list
     * @return array|\yii\db\ActiveRecord[]
     */
    public function getRegisterChartListByMonth(){

        $year = date("Y",time());
        $months = range(1,12);
        $model = new User();
        $query = $model->find();
        $query->select(["FROM_UNIXTIME(created_at, '%Y') as year", "FROM_UNIXTIME(created_at, '%m') as month", "count(*) as count"]);
        $query->groupBy("month");
        $query->where([">", "created_at", 0]);
        $query->having(['=', "year", $year]);
        $query->asArray();
        $list = $query->orderBy("month")->all();

        foreach($months as $month){


            if(is_array($list) && count($list) ){
                $monthExist = false;
                foreach($list as $row){
                    if($row['month'] == $month){
                        $monthExist = true;
                        break;
                    }
                }
                if(!$monthExist)
                    $list[$month] = ['year'=> $year, 'month'=>strlen($month)>1?$month : '0'.$month, 'count'=>0];
            }
        }
        ArrayHelper::multisort($list, 'month');
        return $list;
    }

}