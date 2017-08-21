<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/18
 * Time: 9:32
 */

namespace app\modules\frontadmin\service;



use app\modules\frontadmin\forms\IntegrateCashForm;
use app\modules\frontadmin\forms\usercenter\FrozenCashForm;
use app\modules\frontadmin\forms\usercenter\FrozenRechargeForm;
use app\modules\frontadmin\forms\usercenter\MarAccountFlowInvoiceForm;
use app\modules\frontadmin\forms\usercenter\MarktingRechargeForm;
use app\modules\frontadmin\models\user_account\IntegrateRechargeForm;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_account\User_account_log;
use yii\base\Exception;

class User_accountService extends BaseService
{

    public function getModel(){
        return User_account::findOne(['user_id' => $this->getLoginUserId()]);
    }

    public function integrateAccountRecharge($money){

        $userAccountModel = User_account::findOne(['user_id'=>$this->getLoginUserId()]);

        $transaction = \Yii::$app->getDb()->beginTransaction();

        try{
            if($userAccountModel instanceof User_account){

                $rechargeResult = $userAccountModel->recharge($money, User_account::C_ACCOUNT_INTEGRATE);
                if($rechargeResult){

                    $accountLogModel = new User_accounst_log();
                    $accountLogModel->createOneLog(User_account_log::C_ACTION_INTEGRATE_RECHARGE, $this->getLoginUserId(), $money, '积分账户充值!');
                    $transaction->commit();
                }
            }
        }catch(Exception $e){
            $transaction->rollBack();
            $this->message = $e->getMessage();
            return false;
        }
    }


    public function getInteGrateRechargeForm(){
        return new \app\modules\frontadmin\forms\IntegrateRechargeForm();
    }

    public function getIntegrateCashForm(){
        return new IntegrateCashForm();
    }

    public function getMarktingRechargeForm(){
        return new MarktingRechargeForm();
    }

    public function getMarAccountInvoiceForm(){
        return new MarAccountFlowInvoiceForm();
    }

    public function getFrozenRechargeForm(){
        return new FrozenRechargeForm();
    }

    public function getFrozenCashForm(){
        return new FrozenCashForm();
    }


}