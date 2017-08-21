<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/4
 * Time: 14:00
 */

namespace app\modules\frontadmin\service;


use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\frontadmin\models\prize_goods\prize_goods;
use yii\base\Exception;

class OneMoneyPrizeService extends BaseService
{

    private $prizeGoodsModel;

    public function __construct(prize_goods $goodsModel)
    {
        if(is_null($goodsModel) || !$goodsModel->prize_id)
            throw new Exception("prize goods数据错误!");
        else{
            $this->prizeGoodsModel = $goodsModel;
        };
    }


    /**
     * 一元即开抽资
     * @return Goods_sku|bool
     */
    public function prize(){

        $result = false;

        //中奖率为 1/money
        $chance = $this->prizeGoodsModel->market_price;
        if($this->isCanPrize()){
            $rand01 = rand(1, $chance);
            $rand02 = rand(1, $chance);

            $goodsSkuModel = new Goods_sku();
            //如果两次随机数一致，则抽奖成功
            if($rand01 == $rand02){
                $result = $goodsSkuModel->createOneMoneySku($this->prizeGoodsModel->prize_id, $rand01, Goods_sku::C_PRIZE_STATUS_WIN_YES);
            } else {
                $result = $goodsSkuModel->createOneMoneySku($this->prizeGoodsModel->prize_id, $rand01, Goods_sku::C_PRIZE_STATUS_WIN_NO);
            }
            $this->message = $this->message ? : $goodsSkuModel->message;
        }
        return $result;
    }

    public function isCanPrize(){

        if($this->prizeGoodsModel->one_money_status == prize_goods::C_ONE_MONEY_STATUS_ENABLE)
            return true;
        else{
            $this->message = "当前活动未开启1元即开!";
            return false;
        }
    }

}