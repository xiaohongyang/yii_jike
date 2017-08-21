<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/21
 * Time: 15:37
 */

namespace app\modules\frontadmin\models\prize_goods;


class prize_goods_service
{

    public $prizeGoods;

    public function __construct(prize_goods $prizeGoods){
        $this->prizeGoods = $prizeGoods;
    }

    public function getDetail($prizeId){
        return $this->prizeGoods->find()->where(['prize_id'=>$prizeId])->one();
    }

}