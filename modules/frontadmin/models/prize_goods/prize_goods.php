<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/15
 * Time: 21:29
 */

namespace app\modules\frontadmin\models\prize_goods;


use app\modules\common\models\uploadform\AbstractUpload;
use app\modules\common\models\uploadform\Uploadform;
use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\frontadmin\models\prize_type\prize_type;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\video\video;
use app\modules\frontadmin\models\junction\pg_video;
use app\modules\jike\models\prize_codes\Prize_codes;
use yii\base\Exception;


class prize_goods extends BaseActiveRecord
{

    const C_ONE_MONEY_STATUS_DISABLE = 1; //关闭一元即购
    const C_ONE_MONEY_STATUS_ENABLE = 2; //开启一元即购
    /*const C_STATUS_1 = 1;   //审核中
    const C_STATUS_2 = 2;   //审核通过
    const C_STATUS_3 = 3;   //审核失败*/

    const C_STATUS_CHECKING = 1;    //审核中
    const C_STATUS_CHECKED_OK = 2;  //审核通过
    //const C_STATUS_CHECKED_NO = 3;  //审核失败
    const C_STATUS_DELETED = 4;     //已删除(审核失败)



    public function rules()
    {
        return [
            [
                ['prize_name','prize_code','prize_type_id','market_price'],'required'
            ]
        ];
    }

    public function attributeLabels()
    {
        return [
            'prize_name' => '商品名称'
        ];
    }

    public function getPgVideos(){
        return $this->hasOne(pg_video::className(), [ 'pg_id' => 'prize_id' ]);
    }

    public function getVideos(){
        return $this->hasOne(video::className(), ['v_id'=>'v_id'])
            ->via('pgVideos');
    }

    public function getPics(){
        return $this->hasMany(Uploadform::className(), ['column_value'=>'prize_id'])
            ->andWhere(['table_name'=>AbstractUpload::TABLE_NAME_PRIZE_GOODS])
            ->andWhere(['file_desc'=>AbstractUpload::FILE_DESC_PRIZE_GOODS_IMAGE]);
    }


    public function getThumb(){

        return Uploadform::find()->where(['=','column_value',$this->prize_id])
            ->andWhere(['=','table_name',AbstractUpload::TABLE_NAME_PRIZE_GOODS])
            ->andWhere(['=','file_desc',AbstractUpload::FILE_DESC_PRIZE_GOODS_IMAGE])
            ->one();
    }


    /**
     * 增加库存 (1.设置goods_number 2.冻结保证金)
     * @param $amount 要增加的数量
     * @return bool
     */
    public function addGoodsNumber($amount=0){

        $result = false;
        if(is_null($amount) || !is_int($amount) || $amount==0)
            $this->message = "数量必需是>0的整数!";
        else{
            $this->beginTransaction();
            try{
                //增加库存量
                $this->goods_number += $amount;
                if (!$this->save(false)){
                    $this->message = "保存失败!";
                } else {

                    //冻结保证金
                    $userAccount = User_account::findOne(['user_id' => $this->getLoingUserId()]);
                    $moneyAount = $this->market_price * $amount;
                    $result = $userAccount->cash($moneyAount, User_account::C_ACCOUNT_FROZEN, "0元夺宝活动,扣除保证金!");
                    if($result)
                        $this->commit();
                    else{
                        $this->message = $userAccount->message;
                        $this->errorCode = $userAccount->errorCode;
                        $this->rollback();
                    }
                }
            }catch(Exception $e){
                $this->rollback();
                $this->message = "出现异常,请与管理员联系";
            }

        }
        return $result;
    }

    /**
     * 减少库存 (1.设置goods_number 2.返回保证金)
     * @param $amount 要减少的数量
     * @return bool
     */
    public function subGoodsNumber($amount=0){

        $result = false;
        if(is_null($amount) || !is_int($amount) || $amount==0)
            $this->message = "数量必需是>0的整数!";
        else{
            $this->beginTransaction();
            try{
                //减少库存量
                $this->goods_number -= $amount;
                if (!$this->save(false)){
                    $this->message = "保存失败!";
                } else {

                    //开启1元即购返还保证金
                    $userAccount = User_account::findOne(['user_id' => $this->getLoingUserId()]);
                    $moneyAount = $this->market_price * $amount;
                    $result = $userAccount->recharge($moneyAount, User_account::C_ACCOUNT_FROZEN, "开启1元即购返还保证金!");
                    if($result)
                        $this->commit();
                    else{
                        $this->message = $userAccount->message;
                        $this->rollback();
                    }
                }
            }catch(Exception $e){
                $this->rollback();
                $this->message = "出现异常,请与管理员联系";
            }

        }
        return $result;
    }

    /**
     * 开启一元即购 (1.设置开启状态 2.冻结保证金)
     */
    public function enableOneMoneyBuy(){
        $result = false;
        if(is_null($this->prize_id))
            $this->message = "数据获取失败!";
        else if($this->one_money_status == self::C_ONE_MONEY_STATUS_ENABLE){
            $this->message = "目前已经处于开启状态,不需要重复开启!";
        }else{
            $this->beginTransaction();
            try{
                //增加库存量
                $this->one_money_status = self::C_ONE_MONEY_STATUS_ENABLE;
                if (!$this->save(false)){
                    $this->message = CONST_OPTIONAL_FAILED;
                } else {

                    //冻结保证金
                    $userAccount = User_account::findOne(['user_id' => $this->getLoingUserId()]);
                    $account = User_account::C_ACCOUNT_FROZEN;
                    if($userAccount->$account < $this->market_price){
                        $this->message = "开启一元即开，当前活动须冻结保证金{$this->market_price}，您的保证金账户余额不足，加入失败...";
                    } else{

                        $result = $userAccount->cash($this->market_price, User_account::C_ACCOUNT_FROZEN, "0元夺宝活动,扣除保证金!");
                        if($result){
                            $this->commit();
                            $this->message = "您已开启一元即开营销活动；保证金冻结金额为{$this->market_price},退出时返还...";
                        }
                        else{
                            $this->message = $userAccount->message;
                            $this->errorCode = $userAccount->errorCode;
                            $this->rollback();
                        }
                    }
                }
            }catch(Exception $e){
                $this->rollback();
                $this->message = "出现异常,请与管理员联系";
            }

        }
        return $result;
    }

    /**
     * 关闭一元即购 (1.设置开启状态 2.返还保证金)
     */
    public function disableOneMoneyBuy(){
        $result = false;
        if(is_null($this->prize_id))
            $this->message = "数据获取失败!";
        else if($this->one_money_status == self::C_ONE_MONEY_STATUS_DISABLE){
            $this->message = "目前已经处于关闭状态,不需要重复关闭!";
        }else{
            $this->beginTransaction();
            try{

                $this->one_money_status = self::C_ONE_MONEY_STATUS_DISABLE;
                if (!$this->save(false)){
                    $this->message = CONST_OPTIONAL_FAILED;
                } else {

                    //关闭1元即购返还保证金
                    $userAccount = User_account::findOne(['user_id' => $this->getLoingUserId()]);
                    $result = $userAccount->recharge($this->market_price, User_account::C_ACCOUNT_FROZEN, "关闭1元即购返还保证金!");
                    if($result){
                        $this->commit();
                        $this->message = "您已退出一元即开营销活动...所有一元即开待交付的奖品订单交付完毕后，剩余保证金将退还到您的账户，请查收...";
                    }
                    else{
                        $this->message = $userAccount->message;
                        $this->errorCode = $userAccount->errorCode;
                        $this->rollback();
                    }
                }
            }catch(Exception $e){
                $this->rollback();
                $this->message = "出现异常,请与管理员联系";
            }

        }
        return $result;
    }

    /***
     * 删除抽奖商品
     * @return bool
     */
    public function remove(){

        $result = false;
        if(is_null($this->prize_id))
            $this->message = "数据获取失败!";
        else if($this->status == self::C_STATUS_DELETED){
            $this->message = "当前活动已经被删除!";
        } else if($this->goods_number > 0) {
            $this->message = "当前有0元夺宝正在开启中，暂不能删除，请先关闭...";
        } else if($this->one_money_status == self::C_ONE_MONEY_STATUS_ENABLE){
            $this->message = "当前商品有未关闭的活动，暂不能删除，请先退出活动...";
        } else {
            $this->beginTransaction();
            try{

                $this->status = self::C_STATUS_DELETED;
                if (!$this->save(false)){
                    $this->message = CONST_OPTIONAL_FAILED;
                } else {
                    $result = true;
                    $this->commit();
                }
            }catch(Exception $e){
                $this->rollback();
                $this->message = "出现异常,请与管理员联系";
            }

        }
        return $result;
    }

    /**
     * 获取0元夺宝sku, 如果排队数=0返回false,如果sku不存在而排队数>0,则创建并返回sku
     * @return array|bool|mixed|null|\yii\db\ActiveRecord
     */
    public function getZeroingSku(){

        $result = false;
        if($this->goods_number <= 0)
            $this->message = "此商品当前0元夺宝已经结束";
        else {
            $skuModel = new Goods_sku();
            $sku = $skuModel->getZeroingSku($this->prize_id);
            if(!$sku)
                $sku = $skuModel->createZeroSku($this->prize_id);

            $result = $sku;
        }
        return $result;
    }

    /**
     * 获取商品总抽奖次数
     * @param $prizeId
     * @return bool|mixed
     */
    public function getTotalPrizeTimes($prizeId){

        if(self::find()->where(['prize_id'=>$prizeId])->exists()){

            $result = self::find()->where(['prize_id'=>$prizeId])->select('market_price')->one();
            return $result->_getTotalPrizeTimes();
        }else{
            $this->message = '商品不存在!';
            return false;
        }
    }

    public function _getTotalPrizeTimes(){
        return $this->market_price * 10;
    }

    public function getHavePrizedTimes($prizeId){

        $model = self::findOne(['prize_id' => $prizeId]);
        $sku = $model->getZeroingSku();
        if($sku && $skuId = $sku->sku_id){
            return Prize_codes::find()->where(['sku_id'=>$skuId])->count();
        } else {
            return 0;
        }
    }

    /**
     * 审核商品
     * @param $prizeId
     * @param int $status 通过或者不通过
     * @return bool
     */
    public function verifyGoods($prizeId, $status= self::C_STATUS_CHECKED_OK){

        $rs = false;
        $goods = self::findOne(['prize_id'=>$prizeId]);
        if( is_null($goods) )
            $this->message = "活动商品不存在或已被删除!";
        else if( $goods->status == self::C_STATUS_DELETED )
            $this->message = "活动商品不存在或已被删除!";
        else if($goods->status == $status)
            $this->message = "当前状态一致，不需要重复设置!";
        else if($status != self::C_STATUS_CHECKED_OK && $status != self::C_STATUS_DELETED)
            $this->message = "状态值错误!";
        else {
            $goods->status = $status;
            $rs = $goods->save();
            !$rs && $this->message = $goods->getFirstErrors() ? implode('|', $goods->getFirstErrors()) : "审核失败!";
        }
        return $rs;
    }

    public function getPrizeType(){
        return $this->hasOne( prize_type::className(), ['type_id'=> 'prize_type_id'] );
    }


    public function getKaijiangNumber(){
        $query = $this->find()
            ->from('jike_prize_goods goods')
            ->leftJoin('jike_goods_sku sku','goods.prize_id = sku.prize_id')
            ->where('goods.prize_id='.$this->prize_id)
            ->andWhere('sku.prize_status = 2');
        $count = $query->count();
        return $count;
    }

    public function getDuijiangNumber(){
        $query = $this->find()
            ->from('jike_prize_goods goods')
            ->leftJoin('jike_goods_sku sku','goods.prize_id = sku.prize_id')
            ->leftJoin('jike_prize_codes codes','codes.sku_id = sku.sku_id')
            ->leftJoin('jike_prize_order order','codes.code_id = order.code_id')
            ->where('goods.prize_id='.$this->prize_id)
            ->andWhere('sku.prize_status = 2')
            ->andWhere('order.shipping_status = 2');
        $count = $query->count();
        return $count;
    }
}