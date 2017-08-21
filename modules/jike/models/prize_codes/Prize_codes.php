<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/21
 * Time: 16:30
 */

namespace app\modules\jike\models\prize_codes;


use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_account\User_account_log;
use app\modules\jike\models\BaseActiveRecord;
use yii\base\Exception;
use yii\behaviors\TimestampBehavior;
use yii\debug\models\search\Log;
use yii\helpers\ArrayHelper;
use yii\log\Logger;

class Prize_codes extends \app\modules\frontadmin\models\BaseActiveRecord
{

    const C_PRIZE_TYPE_ZERO = 1;
    const C_PRIZE_TYPE_ONE_MONEY = 2;

    //是否中奖  1中奖,  0未中奖
    const C_PRIZE_STATUS_WIN_YES = 2;
    const C_PRIZE_STATUS_WIN_NO = 1;

    //
    const DAY_PRIZE_LIMIT_TIMES = 31;

    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::className()
            ]
        ];
    }


    public function rules()
    {
        return [
            [['sku_id' ,'code', 'user_id' ],'required', 'on' => self::SCENARIO_CREATE],
            ['sku_id', 'number', 'min' =>1, 'on' => self::SCENARIO_CREATE],
        ];
    }

    public function scenarios()
    {
        return ArrayHelper::merge(parent::scenarios(), [
            self::SCENARIO_CREATE => [
                'sku_id' ,'code', 'user_id', 'prize_status', 'prize_type'
            ]
        ]);
    }

    /**
     * 抽奖
     * @param $data ['sku_id' ,'code', 'user_id' ]
     * @return bool
     */
    public function prize($data=['sku_id'=>0, 'code'=>0, 'user_id'=>0]){

       /* $this->addError('user_id', $this->code.$this->sku_id.'55555'.$this::formName());
        return false;*/

        $result = false;
        if(!key_exists($this->formName(), $data))
            $data = [$this->formName() => $data];
        $this->scenario = self::SCENARIO_CREATE;
        if($this->load($data) && $this->validate()){
            if($this->_isCanZeroPrize()){

                $result = $this->save();
                if($result)
                    $this->zeroPrizeOk($this->sku_id);
            }
        } else {
            $this->message = $this->getFirstErrors()?$this->getFirstErrors()[0]:null;
        }
        return $result;
    }

    /**
     * 1元即开抽奖
     * @param array $data
     * @return bool
     */
    public function oneMoneyPrize($data=['sku_id'=>0, 'code'=>0, 'user_id'=>0, 'prize_status'=>self::C_PRIZE_STATUS_WIN_NO]){

        $result = false;
        if(!key_exists($this->formName(), $data))
            $data = [$this->formName() => $data];
        $this->scenario = self::SCENARIO_CREATE;
        if($this->load($data) && $this->validate()){

            $this->beginTransaction();
            try{
                $this->prize_type = self::C_PRIZE_TYPE_ONE_MONEY;
                $result = $this->save();
                if($result && $result = $this->_afterOneMoneyPrize()){
                    $this->commit();
                }
                else
                    $this->rollback();
            }catch(Exception $e){
                $this->message = $e->getMessage();
            }
        } else {
            $this->message = $this->getFirstErrors()?$this->getFirstErrors()[0]:null;
        }
        return $result;
    }

    private function _afterOneMoneyPrize(){

        $agentUserId = $this->user_id;
        $prizeGoods = $this->goodsSku->prizeGoods;
        $storeUserId = $prizeGoods->user_id;
        //将用户100积分账户转到商家账户
        $accountOptionResult = $this->_integrateToStoreUser(100, $agentUserId, $storeUserId);
        return $accountOptionResult;
    }

    private function _integrateToStoreUser($money,$agentUserId, $storeUserId){

        $result  = false;
        $agentAccountModel = User_account::findOne(['user_id'=>$agentUserId]);

        $account = User_account::C_ACCOUNT_INTEGRATE;
        if($agentAccountModel->$account < $money)
            $this->message = "账户余额不足,参加一元活动失败!";
        else{

            $this->beginTransaction();

            try{
                $rechargeResult = $cashResult = false;
                if($agentAccountModel instanceof User_account){

                    $cashResult = $agentAccountModel->cash($money, User_account::C_ACCOUNT_INTEGRATE, '参加一元即开活动', User_account_log::C_CHANGE_TYPE_96_ONE_MONEY_PRIZE_SUB);
                    if( $cashResult ){
                        $storeAccountModel = User_account::findOne(['user_id'=>$storeUserId]);
                        if($storeAccountModel instanceof User_account)
                            $rechargeResult = $storeAccountModel->recharge($money, User_account::C_ACCOUNT_INTEGRATE, '一元即开活动获取用户积分!', User_account_log::C_CHANGE_TYPE_97_ONE_MONEY_PRIZE_ADD);
                    }
                }
                if($cashResult && $rechargeResult){
                    $this->commit();
                    $result = true;
                } else {
                    $this->rollback();
                }
            }catch(Exception $e){
                $this->rollBack();
                $this->message = $e->getMessage();
            }
        }
        return $result;
    }


    /**
     * 是否能够进行0元夺宝
     * @return bool
     */
    private function _isCanZeroPrize(){

        $result = false;
        $goodsSku = $this->goodsSku;
        $prizeGoods = $goodsSku->prizeGoods;

        $totalTimes = $prizeGoods->_getTotalPrizeTimes();
        if($totalTimes == 0){
            $this->message = "此商品的抽奖总次数错误!";
        } else {
            $count = $this->find()->where(['sku_id'=>$this->sku_id])->count();
            if($totalTimes > $count)
                $result = true;
            else{
                $this->message = "抽奖次数已经满!";
            }
        }
        return $result;
    }


    public function zeroPrizeOk($skuId){

        //获取sku状态查看抽奖是否已经结束
        //获取总记录数
        //获取随机数
        //limit (随机数-1),1

        $result = false;
        $count = $this->find()->where([
            'sku_id' => $skuId
        ])->count();
        $goodsSku = Goods_sku::findOne(['sku_id'=>$skuId]);
        if(is_null($goodsSku)){
            $this->message = "对应商品不在!";
        } else if($goodsSku->prize_status == Goods_sku::C_PRIZE_STATUS_WIN_YES){
            $this->message = "抽奖已经结束!";
        } else {
            $prizeGoods = $goodsSku->prizeGoods;
            $totalPrizeTimes = $prizeGoods->_getTotalPrizeTimes();
            if($totalPrizeTimes <= 0){
                $this->message = "抽奖次数不能为0";
            } else if( $totalPrizeTimes > $count ){
                $this->message = "抽奖次数未达到,不能开将!";
            } else if($totalPrizeTimes < $count) {
                $this->message = "抽奖次数错误!";
            } else {

                $this->beginTransaction();

                try{
                    $winNumber = rand(1, $count);
                    $winer = $this->find()->where(['sku_id'=>$skuId])->offset($winNumber-1)->limit(1)->one();
                    $winer->prize_status = self::C_PRIZE_STATUS_WIN_YES;
                    $result = $winer->save();
                    if(!$result)
                        $this->message = $this->getFirstErrors()[0];
                    else{
                        if($result = $winer->_afterZeroPrizeOk()){
                            $this->commit();
                        } else {
                            $this->rollback();
                        }
                    }
                } catch (Exception $e){
                    $this->message = $e->getMessage();
                    \Yii::getLogger()->log($e->getMessage().$e->getLine().$e->getCode(),Logger::LEVEL_ERROR, '0元开奖');
                    $this->rollback();
                }
            }
        }
        return $result;
    }

    private function _afterZeroPrizeOk(){
        //1 将goods_sku表中的prize_status设置为抽奖成功标志
        $goodsSku = $this->goodsSku;
        $goodsSku->prize_status = Goods_sku::C_PRIZE_STATUS_WIN_YES;
        $rsSaveSku = $goodsSku->save();
        //2.将prize_goods表中的goods_number减少1
        $prizeGoods = $goodsSku->prizeGoods;
        $prizeGoods->goods_number = $prizeGoods->goods_number-1;
        $rsSaveGoods = $prizeGoods->save();
        return $rsSaveSku && $rsSaveGoods;
    }

    /**
     * 获取sku_id对就的最后添加的code值，如果没有则返回0
     * @param $skuId
     * @return int|mixed
     */
    public function getLastCode($skuId){

        $data = self::find()->where(['sku_id' => $skuId])->orderBy('code desc')->select('code')->limit(1)->one();
        return is_null($data) ? 0 : $data['code'];
    }

    public function getGoodsSku(){
        return $this->hasOne(Goods_sku::className(), [
            'sku_id' => 'sku_id'
        ]);
    }

    /**
     * 获取用户对指定sku已经抽奖次数
     * @param $skuId
     * @param $userId
     * @return int|string
     */
    public function getMyPrizedTimes($skuId, $userId){

        return self::find()->where([
            'and',
            ['sku_id' => $skuId],
            ['user_id' => $userId]
        ])->count();
    }

    /**
     * 获取所有用户对指定sku已经抽奖次数
     * @param $skuId
     * @param $userId
     * @return int|string
     */
    public function getAllUserPrizedTotalTimes($skuId, $userId){

        return self::find()->where([
            'and',
            ['sku_id' => $skuId]
        ])->count();
    }

    public function getOrder(){
        return $this->hasOne(Prize_order::className(), [
           'code_id' => 'code_id'
        ]);
    }

}