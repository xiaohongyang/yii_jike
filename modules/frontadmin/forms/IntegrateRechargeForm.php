<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 13:16
 */

namespace app\modules\frontadmin\forms;



use app\modules\common\models\PayOrder;
use app\modules\frontadmin\models\BaseModel;
use app\modules\frontadmin\models\payment\Payment;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_int_account_flow\User_int_account_flow;

class IntegrateRechargeForm extends BaseModel
{

    public $amount=0;
    public $payWay;
    public $user_note;
    /**
     * 流水记录id
     * @var
     */
    private $flowId;

    public function rules()
    {
        return [
            ['amount', 'required'],
            [ 'amount', 'number', 'min'=>10],
            ['user_note', 'safe']
        ];
    }

    public function attributeLabels(){
        return [
            'amount' => '金额'
        ];
    }

    /**
     * 积分账户充值
     * @param $data
     */
    public function recharge($data){

        if($this->load($data) && $this->validate()){
            //充值
            $userId= $this->getLoginUserId();

            /*$userAccountActive = new User_account();
            return $userAccountActive->integrateAccountRecharge($userId, $this->amount, '积分账户充值!');*/

            $this->beginTransaction();
            try{

                //添加流水记录
                $model = new User_int_account_flow();
                $flowId = $model->recharge($userId, $this->amount, Payment::PAYMENT_ALIPAY, is_null($this->user_note)? '积分账户充值' : $this->user_note);
                if($flowId){

                    //生成订单
                    $payOrder = new PayOrder();
                    $rsPayOrder = $payOrder->create($flowId, Payment::CON_PAY_ID_ALIPAY, PayOrder::CON_PAY_STATUS_NOT_PAYED);
                    if($rsPayOrder){
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
    public function rechargeOk(User_int_account_flow $model, $flowId){

        $this->beginTransaction();
        try {
            $rechargeOk = $model->rechargeOk($flowId);
            if ($rechargeOk) {

                $payOrderModel = new PayOrder();
                $resultPayOrder = $payOrderModel->payOk($flowId, PayOrder::CON_ORDER_TYPE_INT_RECHARGE, Payment::CON_PAY_ID_ALIPAY, PayOrder::CON_PAY_STATUS_PAY_SUCCESS, time('YmdHis'));

                if($resultPayOrder){
                    $this->commit();
                    return true;
                }
                $this->rollback();
                return false;
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }


}