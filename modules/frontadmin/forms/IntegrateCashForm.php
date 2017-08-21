<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 14:55
 */

namespace app\modules\frontadmin\forms;


use app\modules\frontadmin\models\BaseModel;
use app\modules\frontadmin\models\payment\Payment;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_int_account_flow\User_int_account_flow;
use app\modules\frontadmin\models\user_int_account_flow_cashuser\User_int_account_flow_cashuser;
use yii\base\Exception;

class IntegrateCashForm extends BaseModel
{

    const UNIT = 50;

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

        if(! ($this->load($data) && $this->validate()) )
            return false;

        $this->amount = $this->getCashAmount();
        if($this->amount <= 0){
            $this->message = '余额不足，提现失败!';
            return false;
        }

        $this->beginTransaction();
        try{

            $flowModel = new User_int_account_flow();
            //1.流水记录
            $flowId = $flowModel->cash($this->getLoginUserId(), $this->amount, Payment::PAYMENT_ALIPAY, '积分提现');
            if($flowId){
                //2.流水记录对应收款账户信息
                $cashUserModel = new User_int_account_flow_cashuser();
                $resultCashUser = $cashUserModel->createCustomized($flowId, $this->account, $this->user);
                //3.减去积分账户金额
                $userAccountModel = User_account::findOne(['user_id'=>$this->getLoginUserId()]);
                $resultAccount = $userAccountModel->cash($this->amount, User_account::C_ACCOUNT_INTEGRATE);
                if($resultCashUser && $resultAccount){
                    $this->commit();
                    $userAccount = new User_account();
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
    private function getIntegrateAccount(){

        $account = User_account::findOne(['user_id' => $this->getLoginUserId()]);
        $accountType = User_account::C_ACCOUNT_INTEGRATE;
        $integrateAccount = $account->$accountType;
        return $integrateAccount;
    }

    private function getCashAmount(){

        $integrateAccount = $this->getIntegrateAccount();
        return self::UNIT * bcdiv ($integrateAccount, self::UNIT, 0);
    }

}