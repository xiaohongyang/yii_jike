<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/18
 * Time: 8:43
 */

namespace app\modules\frontadmin\models\user_account;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\user\User_account_interface;

class User_account_log extends BaseActiveRecord implements User_account_interface
{

    /*| log_id
    | user_id
    | frozen_account
    | integrate_account
    | markting_account
    | bail_account
    | change_desc
    | change_type
    | created_at
    1为提现，2为管理员调节，98为积分抽奖，99为其他类型
    */

    const C_CHANGE_TYPE_1_RECHARGE = 1;
    const C_CHANGE_TYPE_2_CASH = 2;
    const C_CHAGE_TYPE_93_FROZEN_CASH = 93;    //用户申请并提交保证金提取
    const C_CHANGE_TYPE_94_PRIZE_GOODS_WEI_GUI_SUB = 94;    //0元夺宝卖家违规，扣除保证金
    const C_CHANGE_TYPE_95_PRIZE_GOODS_WEI_GUI_Add = 95;    //0元夺宝卖家违规，获取到相应积分
    const C_CHANGE_TYPE_96_ONE_MONEY_PRIZE_SUB = 96;    //1元即开扣除积分
    const C_CHANGE_TYPE_97_ONE_MONEY_PRIZE_ADD = 97;    //1元即开获取积分
    const C_CHANGE_TYPE_98 = 98;    //积分抽奖获取积分
    const C_CHANGE_TYPE_99_OTHER = 99;


    public static function getCashTyppe(){
        return [
            self::C_CHANGE_TYPE_1_RECHARGE,
            self::C_CHANGE_TYPE_2_CASH,
            self::C_CHANGE_TYPE_94_PRIZE_GOODS_WEI_GUI_SUB,
            self::C_CHANGE_TYPE_96_ONE_MONEY_PRIZE_SUB
        ];
    }

    const C_ACTION_JIFENCHOUJIANG = 'jifengchoujiang';  //积分抽奖充值
    const C_ACTION_INTEGRATE_RECHARGE = 'C_ACTION_INTEGRATE_RECHARGE'; //积分充值

    public $action = null;

    public function rules(){
        return [
            [   'user_id', 'required', 'on'=>$this::SCENARIO_CREATE],
            [   'change_type', 'in',
                'range' =>[
                        self::C_CHANGE_TYPE_1_RECHARGE,
                        self::C_CHANGE_TYPE_2_CASH,
                        self::C_CHAGE_TYPE_93_FROZEN_CASH,
                        self::C_CHANGE_TYPE_94_PRIZE_GOODS_WEI_GUI_SUB,
                        self::C_CHANGE_TYPE_95_PRIZE_GOODS_WEI_GUI_Add,
                        self::C_CHANGE_TYPE_96_ONE_MONEY_PRIZE_SUB,
                        self::C_CHANGE_TYPE_97_ONE_MONEY_PRIZE_ADD,
                        self::C_CHANGE_TYPE_98,
                        self::C_CHANGE_TYPE_99_OTHER],
                'on' => $this::SCENARIO_CREATE
            ],
            [
                'integrate_account', 'safe', 'on' => $this::SCENARIO_CREATE
            ]
        ];
    }

    public function scenarios()
    {

        return [
            $this::SCENARIO_CREATE => [
                'user_id',
                'frozen_account',
                'integrate_account',
                'markting_account',
                'bail_account',
                'change_desc',
                'created_at',
                'change_type'
            ]
        ];
    }

    public function createOneLog($action, $user_id, $amount, $change_desc=null){

        $data = null;
        switch($action){
            case $this::C_ACTION_INTEGRATE_RECHARGE:
                $data = [
                    'integrate_account' => $amount,
                    'user_id' => $user_id,
                    'change_type' => $this::C_CHANGE_TYPE_1_RECHARGE,
                    'change_desc' => !is_null($change_desc) ? $change_desc : '积分充值!'
                ];
                break;
        }
        if(!is_null($data))
            return $this->create($data, $action);
        else{
            $this->message = '数据不完整!';
            return false;
        }
    }

    /**
     * 添加log记录
     * @param $data
     * @param $action
     * @return bool
     */
    public function create($data, $action){

        if(is_array($data) && key_exists($this->formName(), $data) == false)
            $data = [$this->formName() => $data];

        $this->action = $action;
        //积分充值
        return $this->_create($data);
    }

    private function _create($data){

        $this->scenario = $this::SCENARIO_CREATE;
        if($this->load($data) && $this->validate()){
            return $this->save();
        } else{
            return false;
        }
    }

    public function beforeSave($insert)
    {

        if( !$this->created_at )
            $this->created_at = time();

        return parent::beforeSave($insert); // TODO: Change the autogenerated stub
    }

    public function beforeValidate()
    {

        $this->_dataHandle();
        return parent::beforeValidate(); // TODO: Change the autogenerated stub
    }

    /**
     * 指定账户充值
     * @param $money
     * @param $accountType
     * @return bool
     */
    public function recharge($amount, $accountType , $userId, $change_desc=null, $logChangeType=self::C_CHANGE_TYPE_2_CASH){

        $accountArray = [
            $this::C_ACCOUNT_BAIL, $this::C_ACCOUNT_FROZEN, $this::C_ACCOUNT_INTEGRATE, $this::C_ACCOUNT_MARKTING
        ];
        if(!in_array($accountType, $accountArray)){
            $this->message = '账户类型不存在!';
            return false;
        } else {
            $data = [
                $accountType => $amount,
                'user_id' => $userId,
                'change_type' => $logChangeType,
                'change_desc' => !is_null($change_desc) ? $change_desc : ''
            ];

            $this->scenario = self::SCENARIO_CREATE;

            if(is_array($data) && !key_exists($this::formName(), $data))
                $data = [$this::formName() => $data];

            if($this->load($data) && $this->validate()){
                return $this->save();
            } else {
                return false;
            }
        }
    }

    /**
     * 指定账户提取金额
     * @param $money
     * @param $accountType
     * @return bool
     */
    public function cash($amount, $accountType , $userId, $change_desc=null, $logChangeType=self::C_CHANGE_TYPE_2_CASH ){

        $accountArray = [
            $this::C_ACCOUNT_BAIL, $this::C_ACCOUNT_FROZEN, $this::C_ACCOUNT_INTEGRATE, $this::C_ACCOUNT_MARKTING
        ];
        if(!in_array($accountType, $accountArray)){
            $this->message = '账户类型不存在!';
            return false;
        } else {
            $data = [
                $accountType => $amount,
                'user_id' => $userId,
                'change_type' => $logChangeType,
                'change_desc' => !is_null($change_desc) ? $change_desc : ''
            ];

            $this->scenario = self::SCENARIO_CREATE;

            if(is_array($data) && !key_exists($this::formName(), $data))
                $data = [$this::formName() => $data];

            if($this->load($data) && $this->validate()){
                return $this->save();
            } else {
                return false;
            }
        }
    }

    private function _dataHandle(){
        if($this->integrate_account > 0){
            $this->_handleJifen();
        }

        if($this->created_at <= 0)
            $this->created_at = time();

    }
    private function _handleJifen(){

        if(is_null($this->user_id) || $this->user_id==0)
            $this->user_id = $this::getLoingUserId();

        if(!is_numeric($this->integrate_account) || $this->integrate_account <= 0)
            $this->addError('integrate_account', $this->getAttributeLabel('integrate_account').'数据有误!');

        switch($this->action){

            case $this::C_ACTION_JIFENCHOUJIANG:
                //积分抽奖
                if($this->change_type != $this::C_CHANGE_TYPE_98)
                    $this->addError('change_type', $this->getAttributeLabel('integrate_account').'有误!');
                break;
        }
    }

}