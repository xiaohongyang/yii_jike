<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/13
 * Time: 5:33
 */

namespace app\modules\frontadmin\forms\usercenter;


use app\modules\frontadmin\models\BaseModel;
use app\modules\frontadmin\models\payment\Payment;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_account\User_account_log;
use app\modules\frontadmin\models\user_fro_account_flow\User_fro_account_flow;
use app\modules\frontadmin\models\user_fro_account_flow_cashuser\User_fro_account_flow_cashuser;

class FrozenCashForm extends BaseModel
{

    public $account;
    public $user;
    public $amount;

    public function rules()
    {
        return [
            [
                ['account', 'user'], 'required'
            ]
        ];
    }

    public function attributeLabels(){
        return
            [
                'account' => '支付宝账户',
                'user' => '支付宝认证实名'
            ];
    }

    public function cash($data){

        if(is_array($data) && !key_exists($this::formName(), $data))
            $data = [$this::formName() => $data ];
        if(! ($this->load($data) && $this->validate()) )
            return false;

        $this->amount = $this->getCashAmount();
        if($this->amount <= 0){
            $this->message = '余额不足，提现失败!';
            return false;
        }

        $this->beginTransaction();
        try{

            $flowModel = new User_fro_account_flow();
            //1.流水记录
            $flowId = $flowModel->cash($this->getLoginUserId(), $this->amount, Payment::PAYMENT_ALIPAY, '保证金提取');
            if($flowId){
                //2.流水记录对应收款账户信息
                $cashUserModel = new User_fro_account_flow_cashuser();
                $resultCashUser = $cashUserModel->createCustomized($flowId, $this->account, $this->user);
                //3.减去积分账户金额
                $userAccountModel = User_account::findOne(['user_id'=>$this->getLoginUserId()]);
                $resultAccount = $userAccountModel->cash($this->amount, User_account::C_ACCOUNT_FROZEN, '保证金提取', User_account_log::C_CHAGE_TYPE_93_FROZEN_CASH);
                if($resultCashUser && $resultAccount){
                    $this->commit();
                    return true;
                }
            }
            $this->message = '提现申请失败!';
            return false;
        }catch(Exception $e){
            $this->message = $e->getMessage();
            return false;
        }
    }

    /**
     * 获取积分账户余额
     * @return mixed
     */
    private function getFrozenAccount(){

        $account = User_account::findOne(['user_id' => $this->getLoginUserId()]);
        $accountType = User_account::C_ACCOUNT_FROZEN;
        $frozenAccount = $account->$accountType;
        return $frozenAccount;
    }

    private function getCashAmount(){

        $frozenAccount = $this->getFrozenAccount();
        return  $frozenAccount;
    }

}