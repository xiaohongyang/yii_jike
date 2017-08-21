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

class FrozenRechargeForm extends BaseModel
{

    public $amount=0;
    public $payWay;

    public function rules()
    {
        return [
            ['amount', 'required'],
            [ 'amount', 'number', 'min'=>10],

        ];
    }

    public function attributeLabels(){
        return [
            'amount' => '金额'
        ];
    }

    public function recharge($data){

        if($this->load($data) && $this->validate()){
            //充值
            $userId= $this->getLoginUserId();

            $this->beginTransaction();
            try{

                //添加流水记录
                $model = new User_fro_account_flow();
                $flowId = $model->recharge($userId, $this->amount, Payment::PAYMENT_ALIPAY, '保证金账户充值');
                if($flowId){
                    //回调,标记支付状态，账户表充值
                    $reschargeResult = $this->rechargeOk($model, $flowId);
                    if($reschargeResult){

                        $this->commit();
                        return true;
                    }
                }
                $this->message = '操作失败';
                $this->rollback();
            } catch (Exception $e){

                $this->message = $e->getMessage();
            }
            return false;
        }
    }

    /**
     * 回调,标记支付状态，账户表充值
     * @param User_int_account_flow $model
     * @param $flowId
     * @return bool
     */
    public function rechargeOk(User_fro_account_flow $model, $flowId){
        $rechargeOk = $model->rechargeOk($flowId);
        if($rechargeOk){
            return true;
        }
        return false;
    }

}