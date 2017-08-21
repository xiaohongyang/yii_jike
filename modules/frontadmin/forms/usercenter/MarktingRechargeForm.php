<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/9
 * Time: 21:04
 */

namespace app\modules\frontadmin\forms\usercenter;


use app\modules\frontadmin\models\BaseModel;
use app\modules\frontadmin\models\payment\Payment;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_mar_account_flow\User_mar_account_flow;
use app\modules\frontadmin\models\user_mar_account_flow_invoice\User_mar_account_flow_invoice;


class MarktingRechargeForm extends BaseModel
{

    public $amount=0;
    public $payWay;
    public $invoiceType;

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

    public function scenarios()
    {
        return [
            self::SCENARIO_DEFAULT => [
                'amount','invoiceType'
            ]
        ];
    }


    /**
     * 营销账户充值
     * @param $data
     * @return bool
     */
    public function recharge($data){

        if($this->load($data) && $this->validate()){
            //充值
            $userId= $this->getLoginUserId();

            $this->beginTransaction();
            try{

                //添加流水记录
                $model = new User_mar_account_flow();
                $flowId = $model->recharge($userId, $this->amount, Payment::PAYMENT_ALIPAY, '营销账户充值');
                if($flowId){

                    //发票记录
                    if($this->invoiceType != -1){

                        $invoiceModel = new User_mar_account_flow_invoice();
                        $invoiceForm = new MarAccountFlowInvoiceForm();
                        $rsInvoice = $invoiceModel->create($data[$invoiceForm->formName()], $flowId);
                    } else {
                        $rsInvoice = true;
                    }

                    //回调标记支付状态，账户表充值，目前没有支付宝,暂时自动回调了,
                    $reschargeResult = $this->rechargeOk($model, $flowId);
                    if($reschargeResult && $rsInvoice){

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
     * @param User_mar_account_flow $model
     * @param $flowId
     * @return bool
     */
    public function rechargeOk(User_mar_account_flow $model, $flowId){

        $rechargeOk = $model->rechargeOk($flowId);

        return $rechargeOk;
    }

}