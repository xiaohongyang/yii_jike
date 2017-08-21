<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/10
 * Time: 20:38
 */

namespace app\modules\frontadmin\models\user_ad_video_account;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\user\User;
use app\modules\frontadmin\models\User_ad_video;
use app\modules\frontadmin\models\User_ad_video_account_order;
use yii\base\Exception;

class User_ad_video_account extends BaseActiveRecord
{

    public function rules(){
        return [
            ['video_id','required', 'on'=>$this::SCENARIO_CREATE]
        ];
    }

    public function scenarios()
    {
        $scenarios = [
            $this::SCENARIO_CREATE => [
                'video_id'
            ]
        ];
        return array_merge(parent::scenarios(), $scenarios);
    }

    /**
     * 创建账户
     * @param $videoId
     * @return bool
     */
    public function createAccount($videoId){

        //账户是否已经存在
        if(self::findOne(['video_id'=>$videoId]))
            return false;

        $this->scenario = $this::SCENARIO_CREATE;
        $this->setAttributes(['video_id'=>$videoId]);
        if(!$this->validate())
            return false;
        else
            return $this->save();
    }

    /**
     * 删除账户
     * @param $videoId
     */
    public function remove($videoId){

        $order = new User_ad_video_account_order();
        $order->remove($this->account_id);

        $this->deleteAll(['video_id' => $videoId]);
    }

    /**
     * 充值
     * @param User_ad_video $video
     * @param $money
     * @param string $comment
     * @return bool
     * @throws \yii\db\Exception
     */
    public function recharge(User_ad_video $video, $money, $comment='充值'){

        if(!is_numeric($money) || $money <= 0){
            $this->message = "充值金额必须大于0";
            return false;
        }

        //判断营销账户余额是否足够
        $userAccount = $video->user->user_account;
        $videoAccount = $video->account;

        if($userAccount->markting_account < $money){
            $this->message = '营销账户余额不足!';
            return false;
        }else{

            $transaction = \Yii::$app->db->beginTransaction();
            try{

                //1.营销账户减去充值金额
                $userAccount->markting_account -= $money;
                $userAccount->save();
                //2.虚拟账户增加金额
                $videoAccount->money += $money;
                $videoAccount->save();
                //3.虚拟账户充值记录
                $accountOrder = new User_ad_video_account_order();
                $orderData = [
                    'amount' => $money,
                    'user_id' => $video->user->user_id,
                    'account_id' => $videoAccount->account_id,
                    'process_type' => $accountOrder::PROCESS_TYPE_RECHARGE,
                    'is_paid' => $accountOrder::IS_PAID_YES,
                    'comment' => $comment
                ];
                $accountOrder->create($orderData);

                $transaction->commit();
                return  true;
            }catch(Exception $e){
                $this->message = $e->getMessage();
                $transaction->rollBack();
                return false;
            }
        }
    }

    /**
     * 提现
     * @param User_ad_video $video
     * @param $money
     * @param string $comment
     * @return bool
     * @throws \yii\db\Exception
     */
    public function cash(User_ad_video $video, $money, $comment='提现', $city=0){

        if(!is_numeric($money) || $money <= 0){
            $this->message = "提现金额必须大于0";
            return false;
        }

        //用户账户
        $userAccount = $video->user->user_account;
        $videoAccount = $video->account;

        //判断要提现的金额是否足够
        if($videoAccount->money < $money){
            $this->message = '提现金额不能大于现有虚拟账户余额!';
            return false;
        }else{

            $transaction = \Yii::$app->db->beginTransaction();
            try{

                //1.营销账户加上提现金额
                $userAccount->markting_account += $money;
                $userAccount->save();
                //2.虚拟账户减去提现金额
                $videoAccount->money -= $money;
                $videoAccount->save();
                //3.虚拟账户充值记录
                $accountOrder = new User_ad_video_account_order();
                $orderData = [
                    'amount' => $money,
                    'user_id' => $video->user->user_id,
                    'account_id' => $videoAccount->account_id,
                    'process_type' => User_ad_video_account_order::PROCESS_TYPE_CASH,
                    'is_paid' => User_ad_video_account_order::IS_PAID_YES,
                    'comment' => $comment,
                    'city_id' => $city
                ];
                $accountOrder->create($orderData);

                $transaction->commit();
                return  true;
            }catch(Exception $e){
                $this->message = "出现异常,请稍后再试!"; //$e->getMessage();
                $transaction->rollBack();
                return false;
            }
        }
    }

    /**
     * 获取账户的订单历史记录
     * @return \yii\db\ActiveQuery
     */
    public function getUser_ad_video_account_order(){
        return $this->hasMany(User_ad_video_account_order::className(),[
            'account_id' => 'account_id'
        ]);
    }
}