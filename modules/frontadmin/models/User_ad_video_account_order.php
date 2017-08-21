<?php
/**
 * 视频虚拟账户表
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/2
 * Time: 16:04
 */

namespace app\modules\frontadmin\models;


use app\modules\frontadmin\models\user_ad_video_account\User_ad_video_account;
use yii\behaviors\TimestampBehavior;

class User_ad_video_account_order extends BaseActiveRecord
{

    //process_type  tinyint(4) NOT NULL操作类型0为充值,1为提现
    //is_paid   tinyint(4) NOT NULL支付状态 0:未付, 1:已付
    const IS_PAID_NO = 0;
    const IS_PAID_YES = 1;
    const PROCESS_TYPE_RECHARGE = 0;
    const PROCESS_TYPE_CASH = 1;

    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::className()
            ]
        ];
    }


    public function rules(){
        return [
            [['user_id','amount','account_id','process_type','is_paid'],'required','on'=>$this::SCENARIO_CREATE],
            [
                'amount', function($attribute, $params){
                    if(!is_numeric($this->$attribute)){
                        $this->addError($attribute, $attribute.'必须为数值类型!');
                    }
                }, 'on' => $this::SCENARIO_CREATE
            ],
            [
                'account_id', function($attribute, $params){
                    if(! User_ad_video_account::find(['account_id'=>$this->$attribute])->exists())
                        $this->addError($attribute, '账户不存在!');
                }, 'on' => $this::SCENARIO_CREATE
            ],
            [
                'process_type','in','range' => [0,1], 'on'=>$this::SCENARIO_CREATE
            ],
            [
                'is_paid','in','range' => [0,1], 'on'=>$this::SCENARIO_CREATE
            ],
            ['comment','safe','on'=>$this::SCENARIO_CREATE],
            ['city_id','safe','on'=>$this::SCENARIO_CREATE]
        ];
    }


    /*public function scenarios()
    {
        $scenarios = [
            $this::SCENARIO_CREATE => [
                'user_id','amount','account_id','process_type','is_paid','comment','city_id'
            ]
        ];
        return array_merge(
            parent::scenarios(),
            $scenarios
        );
    }*/

    /**
     * 添加账户变更记录
     * @param $data
     * @return bool
     */
    public function create($data)
    {

        $this->scenario = $this::SCENARIO_CREATE;
        if($this->load($data, '') && $this->validate()){
            return $this->save();
        }else{
            return false;
        }
    }

    public function remove($account_id){

        return $this->deleteAll(['account_id'=>$account_id]);
    }

}