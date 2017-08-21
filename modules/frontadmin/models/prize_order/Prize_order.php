<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/30
 * Time: 9:03
 */

namespace app\modules\frontadmin\models\prize_order;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\feedback\Feedback;
use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\frontadmin\models\order_transport\Order_transport;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_account\User_account_log;
use app\modules\jike\models\prize_codes\Prize_codes;
use yii\base\Exception;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use yii\log\Logger;

class Prize_order extends BaseActiveRecord
{

    const C_ORDER_TYPE_ZERO = 1; //0元夺宝
    const C_ORDER_TYPE_ONE_MONEY = 2; //1元即开

    const C_SHIPPING_STATUS_SEND_NO = 1; //未发货
    const C_SHIPPING_STATUS_SEND_YES = 2; //已发货
    const C_SHIPPING_STATUS_RECEIVE = 3; //已收货
    const C_SHIPPING_STATUS_WEI_YUE = 4; //已违约
    const C_SHIPPING_STATUS_GIVE_UP = 5; //用户已放弃兑奖

    const C_SHIPPING_WAIT_DAY = 10; //发货等待时间

    const C_STATUS_CHECKED_CHECKED_OK = 2;

    /*jike_prize_order | CREATE TABLE `jike_prize_order` (
    `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键',
    `order_sn` varchar(50) NOT NULL DEFAULT '' COMMENT '订单号',
    `order_type` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '订单类型1为0元夺宝,   2为1元即开',
    `code_id` varchar(50) NOT NULL DEFAULT '' COMMENT '号码',
    `shipping_status` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '订单状态  0未发货； 1，已发货；2，已收货；3，已违约',
    `pay_status` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '支付状态；0，未付款；1，付款中；2，已付款',
    `consignee` varchar(50) NOT NULL DEFAULT comment '收件人姓名',
    `province` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '收货人的省份，用户页面填写，默认取值于表address ',
    `city` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '收货人的城市，用户页面填写，默认取值于表address',
    `district` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '收货人的地区，用户页面填写，默认取值于表address',
    `address` varchar(50) NOT NULL DEFAULT '' COMMENT '收货人的详细地址，用户页面填写，默认取值于address',
    `zipcode` varchar(10) NOT NULL DEFAULT '' COMMENT '收货人的邮编，用户页面填写，默认取值于表 address',
    `mobile` varchar(50) NOT NULL DEFAULT '' COMMENT '收货人的手机，用户页面填写，默认取值于表address',
    `send_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '发货时间',
    `send_sn` varchar(50) NOT NULL DEFAULT '' COMMENT '发货单号',
    `sender_name` varchar(50) NOT NULL DEFAULT '' COMMENT '快递名称',
    PRIMARY KEY (`order_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动订单表' |*/
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
            ['order_type', 'required', 'on'=>self::SCENARIO_CREATE]
        ];
    }

    public function scenarios()
    {
        return ArrayHelper::merge(parent::scenarios(), [
            self::SCENARIO_CREATE =>[
                'order_type',
                'city',
                'code_id'
            ]
        ]);
    }

    /**
     * 兑奖、下单
     * @param $codeId
     * @param int $orderType
     * @return bool
     */
    public function create($codeId){

        $result = false;
        $codeModel = Prize_codes::findOne(['code_id' => $codeId]);
        if($this->_beforeCreate($codeModel)) {

            $orderType = $codeModel->prize_type == Prize_codes::C_PRIZE_TYPE_ZERO ? self::C_ORDER_TYPE_ZERO : self::C_ORDER_TYPE_ONE_MONEY;
            $data = [self::formName() => ['order_type' => $orderType, 'code_id' => $codeId]];
            $this->beginTransaction();
            try {
                $this->scenario = self::SCENARIO_CREATE;
                if (!$this->load($data)) {
                    $result = false;
                } else {
                    $result = $this->save();
                }
                if ($result) $this->commit();
                else $this->rollback();
            } catch (Exception $e) {
                $this->message = $e->getMessage();
                $this->rollback();
            }
            $this->message = (!$this->message && $this->getFirstErrors()) ? $this->getFirstErrors()[0] : '';
        }
        return $result;
    }

    public function _beforeCreate($codeModel){

        $result = false;
        if( is_null($codeModel) ){
            //        1.判断code_id是否存在
            $this->message = "code不存在!";
        } else if($codeModel->prize_status != Prize_codes::C_PRIZE_STATUS_WIN_YES){
            //        2.判断code_id是否为中奖判断
            $this->message = "当前code未中奖,不能提交订单!";
        } else if($codeModel->user_id != $this->getLoingUserId() ){
            //        4.判断提交人是否为本人
            $this->message = "不是中奖人，没有权限提交订单!";
        } else if(time() - $codeModel->created_at > (3600*24*20)){
            //        5.判断时间是否已经过期
            $this->message = "已经过期不能再提交订单!";
        } else {
            //        6.判断code_id在order表中是否存在
            if (Prize_order::find()->where(['code_id' => $codeModel->code_id])->exists())
                $this->message = "订单已经提交过，不能重复提交!";
            else
                $result = true;
        }
        return $result;
    }

    public function beforeSave($insert)
    {
        if($insert)
            $this->order_sn = $this->_createOrderSn();
        return parent::beforeSave($insert); // TODO: Change the autogenerated stub
    }


    private function _createOrderSn(){

        return date('YmdHis',time()).rand(10000,99999);
    }

    /**
     * 设置收件地址
     * @param $province
     * @param $city
     * @param int $district
     * @param string $address
     * @return bool
     */
    public function setAddress($province, $city, $district=0, $address="", $mobile='',$consignee=""){

        $rs = false;
        $address = trim($address);
        if(!is_numeric($province) || !is_numeric($city))
            $this->message = "省分和城市不能为空!";
        else if(strlen($address) < 1)
            $this->message = "详细地址不能为空!";
        else if(strlen($mobile) != 11 )
            $this->message = "手机号不正确!";
        else if(strlen($consignee) < 1 )
            $this->message = "联系人不能为空!";
        else{
            $this->province = $province;
            $this->city = $city;
            $this->district = $district;
            $this->address = $address;
            $this->mobile = $mobile;
            $this->consignee = $consignee;
            $rs = $this->save();
        }
        return $rs;
    }

    /**
     * 设置商品备注  目前是商品的附加属性 e.g: ["XL","白色"]
     * @param array $desc
     * @return bool
     */
        public function setGoodsDesc($desc = ""){

        $result = true;
        if(is_string($desc) && strlen($desc) > 0){
            $this->goods_desc = $desc;
            $result = $this->save();
        }
        return $result;
    }

    /**
     * 创建订单并保存收件地址和商品备注
     * @param $codeId
     * @param $province
     * @param $city
     * @param int $district
     * @param $address
     * @param $goodsDesc
     * @return bool
     */
    public function createOrder($codeId,$consignee, $province, $city, $district=0, $address, $mobile, $goodsDesc){

        $rs = false;
        $this->beginTransaction();
        try{
            $rsCreate = $this->create($codeId);
            if($rsCreate){

                $order = self::findOne(['code_id' => $codeId]);
                $rsSetAddress = $order->setAddress($province, $city, $district, $address, $mobile, $consignee);
                if($rsSetAddress){

                    $rsSetGoodsDesc = $this->setGoodsDesc($goodsDesc);
                    if(!$rsSetGoodsDesc){

                        $this->message = $this->message ? : "保存商品备注时失败!";
                        $this->rollback();
                    } else {
                        $rs = true;
                        $this->commit();
                    }
                } else {
                    $this->message = $this->message ? : "保存地址时失败!";
                    $this->rollback();
                }
            } else {
                $this->message = $this->message ? : "创建订单失败!";
                $this->rollback();
            }
        } catch (\Exception $e){
            $this->message = $e->getMessage();
            $this->rollback();
        }

        return $rs;
    }

    public function getPrizeCode(){
        return $this->hasOne(Prize_codes::className(), ['code_id'=>'code_id']);
    }

    public function getOrderTransport(){
        return $this->hasOne(Order_transport::className(), ['order_id'=>'order_id']);
    }

    /**
     * 发货  1.添加订单发货数据  2.设置订单发货状态为已发货
     * @param $orderId
     * @param $transportId
     * @param $transportSn
     * @return bool
     */
    public function sender($orderId, $transportId, $transportSn){

        $rs = false;
        $this->beginTransaction();

        try {
            $orderTransport = new Order_transport();
            $rsTransport = $orderTransport->create(['order_id' => $orderId, 'transport_id' => $transportId, 'transport_sn' => $transportSn]);
            $order = self::findOne(['order_id'=>$orderId]);
            $order->shipping_status = self::C_SHIPPING_STATUS_SEND_YES;
            $order->send_at = time();
            $order->sender_name = $this->getLoingUserName();
            $rsUpdateShippingStatus = $order->save();
            if($rsTransport && $rsUpdateShippingStatus){

                $this->commit();
                $rs = true;
            }else {
                if(!$rsTransport)
                    $this->message = $orderTransport->message;
                else
                    $this->message = $this->getFirstErrors2String();
            }
        } catch (Exception $e) {
            $this->message = "出现异常，请重试或与管理员联系!";
            \Yii::getLogger()->log($e->getMessage().$e->getCode().$e->getFile(),Logger::LEVEL_ERROR);
        }

        return $rs;
    }

    public function setShippingStatus($orderId, $shippingStatus=self::C_SHIPPING_STATUS_WEI_YUE, $adminUserId=null){

        $rs = false;
        $order = self::findOne(['order_id'=>$orderId]);
        if(is_null($adminUserId))
            $this->message = "管理员id不能为空";
        else if(is_null($order)){
            $this->message = "订单不存在";
        } else {
            if($order->shipping_status == $shippingStatus)
                $this->message = "目标状态与当前状态一致，修改失败!";
            else if(in_array($shippingStatus, [self::C_SHIPPING_STATUS_SEND_NO, self::C_SHIPPING_STATUS_RECEIVE,self::C_SHIPPING_STATUS_WEI_YUE, self::C_SHIPPING_STATUS_GIVE_UP])){
                $this->beginTransaction();

                try {
                    switch ($shippingStatus) {
                        case self::C_SHIPPING_STATUS_RECEIVE:
                            //已收货
                            $order->shipping_status = $shippingStatus;
                            $rs = $order->save();
                            break;
                        case self::C_SHIPPING_STATUS_WEI_YUE:
                            //卖家已违约: 1.设置状态  2.将积分转入到中奖用户的积分账户中
                            $order->shipping_status = $shippingStatus;
                            $rsSaveStatus = $order->save();
                            if($rsSaveStatus){
                                //积分账户转换
                                $prizeGoods = $this->getPrizeGoods($orderId);
                                if(is_null($prizeGoods)){
                                    $this->message = '商品不存在或已被删除!';
                                    $rs = false;
                                } else{
                                    $money = $prizeGoods->market_price;
                                    $salerUserId = $prizeGoods->user_id;    //卖家用户id
                                    $saleAccountModel = User_account::findOne(['user_id'=>$salerUserId]);
                                    $prizeCode = $order->prizeCode;
                                    $prizeUserId = $prizeCode->user_id; //中奖用户id
                                    $prizeAccountModel = User_account::findOne(['user_id'=>$prizeUserId]);
                                    if(!$saleAccountModel || !$prizeAccountModel){
                                        $this->message = '账户不存在或已被删除!';
                                        $rs = false;
                                    }
                                    else if($saleAccountModel instanceof  User_account && $prizeAccountModel instanceof  User_account){
                                        //卖家保证金不够怎么处理?
                                        //卖家被扣除保证金
                                        $rsSale = $saleAccountModel->cash($money, User_account::C_ACCOUNT_FROZEN, "0元夺宝违规，扣除相应保证金!", User_account_log::C_CHANGE_TYPE_94_PRIZE_GOODS_WEI_GUI_SUB);
                                        if(!$rsSale){
                                            $this->message = $saleAccountModel->message?:$saleAccountModel->getFirstErrors2String();
                                        }
                                        //中奖者获取积分
                                        $rsPrizer = $prizeAccountModel->recharge($money, User_account::C_ACCOUNT_INTEGRATE, "0元夺宝卖家违规了，获取到相应积分!", User_account_log::C_CHANGE_TYPE_95_PRIZE_GOODS_WEI_GUI_Add);
                                        if(!$rsPrizer){
                                            $this->message = $prizeAccountModel->message?:$prizeAccountModel->getFirstErrors2String();
                                        }

                                        $rs = $rsSale && $rsPrizer;
                                    }
                                }
                            }
                            break;
                        case self::C_SHIPPING_STATUS_GIVE_UP:
                            //买家放弃兑奖
                            $order->shipping_status = $shippingStatus;
                            $rs = $order->save();
                            break;
                        case self::C_SHIPPING_STATUS_SEND_NO:
                            //未发货
                            $order->shipping_status = $shippingStatus;
                            $rs = $order->save();
                            break;
                        default:
                            break;
                    }
                    $rs ? $this->commit() : $this->rollback();
                } catch (Exception $e) {
                    $this->message = $e->getMessage().$e->getLine().$e->getCode();
                    $this->rollback();
                    $rs = false;
                }
            } else {
                $this->message = "状态值非法!";
            }
        }
        $this->message = $this->message?: (is_array($order->getFirstErrors()) && count($order->getFirstErrors())?implode('|',$order->getFirstErrors()):'');
        return $rs ? true : false;
    }


    /**
     * 获取订单的卖家id
     * @param $orderId
     * @return bool
     */
    public function getSalerUserId($orderId){

        $rs = false;
        $prizeGoods = $this->getPrizeGoods($orderId);
        if(is_null($prizeGoods))
            $rs = $prizeGoods->user_id;
        return $rs;
    }

    /**
     * 获取中奖用户id
     * @param $orderId
     * @return int
     */
    public function getPrizedUserId($orderId){
        $userId = 0;
        $order = self::findOne(['order_id'=>$orderId]);
        if(is_null($order))
            $this->message = "订单不存在";
        else{
            $prizeCode = $order->prizeCode;
            if(is_null($prizeCode))
                $this->message = 'prize code不存在!';
            else
                $userId = $prizeCode->user_id;
        }
        return $userId;
    }

    /**
     * 获取订单对应商品
     * @param $orderId
     * @return mixed|null
     */
    public function getPrizeGoods($orderId){

        $rs = null;
        $order = self::findOne(['order_id'=>$orderId]);
        if(is_null($order))
            $this->message = '订单不存在!';
        else {
            $prizeCode = $order->prizeCode;
            if($prizeCode instanceof Prize_codes){
                $goodsSku = $prizeCode->goodsSku;
                if($goodsSku instanceof Goods_sku){
                    $prizeGoods = $goodsSku->prizeGoods;
                    if(!is_null($prizeGoods))
                        $rs = $prizeGoods;
                }
            }
        }
        return $rs;
    }

    public function getFeedback(){
        return $this->hasOne(Feedback::className(), ['order_id' => 'order_id']);
    }

}