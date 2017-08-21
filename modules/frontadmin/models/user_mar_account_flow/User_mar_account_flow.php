<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/9
 * Time: 20:56
 */

namespace app\modules\frontadmin\models\user_mar_account_flow;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\payment\Payment;
use app\modules\frontadmin\models\user\User;
use app\modules\frontadmin\models\user\User_account_interface;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_account\User_account_log;
use yii\base\Exception;
use yii\behaviors\TimestampBehavior;

class User_mar_account_flow extends BaseActiveRecord implements User_account_interface
{

    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::className(),
            ]
        ];
    }


    public function rules(){
        return [
            [
                ['user_id','amount','user_note','process_type','payment','is_paid'],
                'required',
                'on' => $this::SCENARIO_CREATE
            ],
            ['user_id', 'number', 'min' => 1, 'on' => $this::SCENARIO_CREATE],
            ['amount', 'number', 'min' => 1, 'on' => $this::SCENARIO_CREATE],
            ['process_type', 'in', 'range' => [$this::PROCESS_TYPE_CASH, $this::PROCESS_TYPE_RECHARGE], 'on' => $this::SCENARIO_CREATE],
            ['is_paid', 'in', 'range' => [$this::IS_PAYED_FALSE, $this::IS_PAYED_TRUE], 'on' => $this::SCENARIO_CREATE]
        ];
    }

    public function scenarios()
    {
        return [
            $this::SCENARIO_CREATE => [
                'user_id',
                'admin_user',
                'amount',
                'created_at',
                'updated_at',
                'admin_note',
                'user_note',
                'process_type',
                'payment',
                'is_paid'
            ],
            $this::SCENARIO_UPDATE => [
                'user_id',
                'admin_user',
                'amount',
                'created_at',
                'updated_at',
                'admin_note',
                'user_note',
                'process_type',
                'payment',
                'is_paid'
            ]
        ];
    }

    #region curd

    public function create($data){

        if(is_array($data) && key_exists($this->formName(), $data) == false)
            $data = [$this->formName() => $data];

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

    public function edit($data){

        if(is_array($data) && key_exists($this->formName(), $data) == false)
            $data = [$this->formName() => $data];

        return $this->_edit($data);
    }

    private function _edit($data){

        $this->scenario = $this::SCENARIO_UPDATE;
        if($this->load($data) && $this->validate()){
            return $this->save();
        } else{
            return false;
        }
    }

    #endregion

    //充值请求, 支付方式为未支付
    //'user_id', 'admin_user', 'amount', 'created_at', 'updated_at', 'admin_note', 'user_note', 'process_type', 'payment', 'is_paid'
    // ['user_id','amount','user_note','process_type','payment','is_paid'],
    /**
     * 账户充值请求，返回所请求记录id
     * @param $userId
     * @param int $amount
     * @param null $payment
     * @param null $userNote
     * @return bool|string
     */
    public function recharge($userId, $amount=0,$payment= null,$userNote=null){

        $data = [
            'user_id' => $userId,
            'amount' => $amount,
            'payment' => $payment,
            'user_note' => $userNote,
            'process_type' => self::PROCESS_TYPE_RECHARGE,
            'is_paid' => self::IS_PAYED_FALSE
        ];
        if($this->create($data)){
            return \Yii::$app->getDb()->lastInsertID;
        }else{
            return false;
        }
    }

    //充值成功, 支付方式为已支付
    public function rechargeOk($id, $adminUser='', $adminNote=''){

        $this->beginTransaction();
        try{
            $model = $this::findOne(['id' => $id]);
            $rs = $model->edit([
                'admin_user' => $adminUser,
                'admin_note' => $adminNote,
                'is_paid' => self::IS_PAYED_TRUE
            ]);
            if($rs){
                $accountModel = User_account::findOne(['user_id' => $this->user_id]);
                if($accountModel instanceof User_account)
                $rsRecharge = $accountModel->recharge($this->amount, User_account::C_ACCOUNT_MARKTING, '营销账户充值');
                if($rsRecharge){
                    $this->commit();
                    return true;
                }
            }
            $this->rollback();
            return false;
        }catch( Exception $e){
            $this->rollback();
            $this->message = $e->getMessage();
            return false;
        }

    }


    public function cash($userId, $amount=0, $payment=null, $userNote=null){

        $data = [
            'user_id' => $userId,
            'amount' => $amount,
            'payment' => $payment,
            'user_note' => $userNote,
            'process_type' => self::PROCESS_TYPE_CASH,
            'is_paid' => self::IS_PAYED_FALSE
        ];
        if($this->create($data)){
            return \Yii::$app->getDb()->lastInsertID;
        }else{
            return false;
        }
    }

    /**
     * 提现成功修改状态标志和管理员名称和管理员备注
     * @param $id
     * @param string $adminUser
     * @param string $adminNote
     * @return bool
     */
    public function cashOk($id, $adminUser='', $adminNote=''){

        $model = $this::findOne(['id' => $id]);
        return $model->edit([
            'admin_user' => $adminUser,
            'admin_note' => $adminNote,
            'is_paid' => self::IS_PAYED_TRUE
        ]);
    }

    public function getUser(){
        return $this->hasOne(User::className(), ['user_id'=>'user_id']);
    }
}