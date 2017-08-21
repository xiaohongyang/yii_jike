<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/12
 * Time: 20:37
 */

namespace app\modules\admin\service;


use app\modules\frontadmin\models\prize_goods\prize_goods;
use yii\data\Pagination;

class PrizeGoodsService extends BaseService
{

    public function getPrizeGoodsList(){

        $query = prize_goods::find();
        $query->where([
            '=',
            'status',
            prize_goods::C_STATUS_CHECKING
        ]);

        $typeId = \Yii::$app->request->get('prize_type_id');
        if(!is_null($typeId)){
            $query->andWhere([
               'prize_type_id' => $typeId
            ]);
        }

        $queryCount= clone $query;
        $pagination = new Pagination(['totalCount'=>$queryCount->count()]);

        $query->orderBy('created_at desc');
        $models = $query->offset($pagination->offset)
                    ->limit($pagination->limit)
                    ->all();
        $this->setPages($pagination);
        return $models;
    }

}