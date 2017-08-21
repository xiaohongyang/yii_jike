<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/10
 * Time: 10:15
 */

namespace app\modules\frontadmin\models\order_transport;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\models\transport\Transport;
use app\modules\jike\models\prize_codes\Prize_codes;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;

class Order_transport extends BaseActiveRecord
{
/*
| id           | int(11)          | NO   | PRI | NULL    | auto_increment |
| transport_id | int(10) unsigned | NO   |     | 0       |                |
| transport_sn | varchar(50)      | NO   |     |         |                |
| order_id     | int(10) unsigned | NO   |     | 0       |                |
| created_at   | int(10) unsigned | NO   |     | 0       |                |
| updated_at   | int(10) unsigned | NO   |     | 0       |                |
+--------------+------------------+------+-----+---------+----------------+*/
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
            [['transport_id', 'transport_sn', 'order_id'], 'required', 'on' => self::SCENARIO_CREATE],

            ['transport_id',function($attribute){
                if($this->$attribute==0)
                    $this->addError($attribute, $this->getAttributeLabel($attribute).'不能为空!');
            },'on'=>self::SCENARIO_CREATE],

            ['order_id', function($attribute){

                if(self::find()->where(['order_id'=>$this->$attribute])->exists())
                    $this->addError($attribute, '此订单发货信息已经存在，不能重复添加');
                else{

                    $order = Prize_order::findOne(['order_id'=>$this->$attribute]);
                    if(is_null($order))
                        //订单是否存在
                        $this->addError($attribute, '订单不存在');
                    else if($order instanceof Prize_order){
                        //判断订单商品是否属于当前用户
                        $prizeCode = $order->prizeCode;
                        if($prizeCode instanceof Prize_codes){
                            $sku = $prizeCode->goodsSku;
                            if($sku instanceof Goods_sku){
                                $prize = $sku->prizeGoods;
                                if($prize->user_id != $this->getLoingUserId())
                                    $this->addError($attribute, "您没有权限操作此订单!");
                            }
                        }
                    }
                }
            }, 'on' => self::SCENARIO_CREATE]
        ];
    }

    public function attributeLabels()
    {
        return [
            'transport_id' => '快递商家',
            'transport_sn' => '运单号',
            'order_id' => '订单号'
        ];
    }


    public function scenarios()
    {
        return ArrayHelper::merge(parent::scenarios(), [
           self::SCENARIO_CREATE => [
               'transport_id',
               'transport_sn',
               'order_id'
           ]
        ]);
    }

    public function getTransport(){
        return $this->hasOne(Transport::className(), ['transport_id'=>'transport_id']);
    }

    public function create($data=['transport_id'=>0,'transport_sn'=>'','order_id'=>0]){

        $rs = false;
        if(is_array($data) && !key_exists(self::formName(), $data))
            $data = [self::formName() => $data];

        $this->scenario = self::SCENARIO_CREATE;

        if($this->load($data) && $this->validate()){
            $rs = $this->save();
        }
        $this->message = $this->getFirstErrors2String();

        return $rs;
    }


}