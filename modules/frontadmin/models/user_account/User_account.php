<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/10
 * Time: 8:24
 */

namespace app\modules\frontadmin\models\user_account;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\CurdTrait;
use app\modules\frontadmin\models\user\User_account_interface;
use yii\base\Exception;

class User_account extends BaseActiveRecord implements User_account_interface
{

    /*account_id        |
    user_id           |
    integrate_account |
    markting_account  |
    frozen_account    |*/

    public function rules(){
        return [
            ['user_id','required', 'on' => $this::SCENARIO_CREATE.",".$this::SCENARIO_UPDATE]
        ];
    }

    public function scenarios(){
        return array_merge(parent::scenarios(), [
            $this::SCENARIO_CREATE=>[
                'user_id'
            ],
            $this::SCENARIO_UPDATE => [
                'user_id',
                'integrate_account',
                'markting_account',
                'bail_account',
                'frozen_account',
            ]
        ]);
    }

    /**
     * 创建用户账户
     * @param $data
     * @return bool
     */
    public function create($data){

        $this->scenario = $this::SCENARIO_CREATE;
        if(!key_exists($this->formName(), $data))
            $data = [$this->formName() => $data];
        if($this->load($data) && $this->validate()){
            return $this->save();
        }else{
            return false;
        }
    }

    /**
     * 指定账户充值
     * @param $money
     * @param $accountType
     * @return bool
     */
    public function recharge($money, $accountType, $changeDesc=null, $logChangeType=User_account_log::C_CHANGE_TYPE_1_RECHARGE){

        $this->beginTransaction();
        try{
            $accountArray = [
                $this::C_ACCOUNT_BAIL, $this::C_ACCOUNT_FROZEN, $this::C_ACCOUNT_INTEGRATE, $this::C_ACCOUNT_MARKTING
            ];
            if(!in_array($accountType, $accountArray)){
                $this->message = '账户类型不存在!';
                return false;
            } else {

                $logModel = new User_account_log();
                $rs = $logModel->recharge($money, $accountType, $this->user_id, $changeDesc, $logChangeType);
                if($rs){

                    $this->$accountType += $money;
                    $rs = $this->save();
                    if($rs){
                        $this->commit();
                        return $rs;
                    }
                }
            }
            $this->rollback();
            return false;
        } catch(Exception $e){
            $this->message = $e->getMessage();
            $this->rollback();
            return false;
        }
    }

    /**
     * 账户提现
     * @param $money
     * @param $accountType
     * @return bool
     */
    public function cash($money, $accountType, $changeDesc=null, $logChangeType=User_account_log::C_CHANGE_TYPE_2_CASH){

        $accountArray = [
            $this::C_ACCOUNT_BAIL, $this::C_ACCOUNT_FROZEN, $this::C_ACCOUNT_INTEGRATE, $this::C_ACCOUNT_MARKTING
        ];

        $result = false;
        if(!in_array($accountType, $accountArray)){
            $this->message = '账户类型不存在!';
        } else if($this->$accountType - $money < 0){
            $this->errorCode = self::ERROR_MONEY_NOT_ENOUGH;
            $this->message = '金额不足!';
        } else {

            $this->beginTransaction();
            try{
                $logModel = new User_account_log();
                $rs = $logModel->cash($money, $accountType, $this->user_id, $changeDesc, $logChangeType);
                if($rs){
                    $this->$accountType -= $money;
                    if($this->$accountType < 0){

                        $this->message = "余额不足!";
                    } else {
                        $rs = $this->save();
                        if($rs){
                            $this->commit();
                            $result = true;
                        }
                    }
                }
            }catch(Exception $e){
                $this->message = $e->getMessage();
                $this->rollback();
            }
        }
        return $result;
    }

    /**
     * 账户变量记录
     * @return \yii\db\ActiveQuery
     */
    public function getUser_account_logs(){

        return $this->hasMany(User_account_log::className(), ['account_id' => 'account_id']);
    }



    public function integrateAccountRecharge($userId, $amount, $desc=null){

        $userAccountModel = $this::findOne(['user_id'=>$userId]);
        $userAccountModel->beginTransaction();
        try{

            $rs = $userAccountModel->recharge($amount, self::C_ACCOUNT_INTEGRATE);
            if($rs){
                $accountLogModel = new User_account_log();
                $rsLog = $accountLogModel->createOneLog(User_account_log::C_ACTION_INTEGRATE_RECHARGE, $userId, $amount, '积分账户充值!');
                if($rsLog){
                    $userAccountModel->commit();
                    return true;
                } else{
                    $this->message = '写入log日志失败!';
                }
            }else{
                $this->message = '账户充值失败!';
            }
            $userAccountModel->rollback();
            return false;
        }catch(Exception $e){
            $userAccountModel->rollback();
            $this->message = $e->getMessage();
            return false;
        }
    }



}