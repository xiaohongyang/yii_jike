<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/1
 * Time: 21:14
 */

namespace app\modules\frontadmin\service;


use app\modules\common\traits\PageTrait;
use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\jike\models\prize_codes\Prize_codes;
use yii\data\Pagination;

class PrizeCodesService extends BaseService
{

    use PageTrait;

    public function getPrizedCodesList(){

        $query = Prize_codes::find();
        $query->from('jike_prize_codes codes');
        $query->leftJoin('jike_goods_sku sku', 'codes.sku_id = sku.sku_id');
        $query->where([
                'codes.user_id' => $this->getLoginUserId()
        ]);

        $prizeStatus = \Yii::$app->request->get('prize_status');
        switch($prizeStatus){
            case 1:
                //已揭晓
                $query->andWhere(['sku.prize_status' => Goods_sku::C_PRIZE_STATUS_WIN_YES]);
                break;
            case 2:
                //进行中
                $query->andWhere(['sku.prize_status' => Goods_sku::C_PRIZE_STATUS_WIN_NO]);
                break;
            case 3:
                //已中奖
                $query->andWhere(['codes.prize_status' => Prize_codes::C_PRIZE_STATUS_WIN_YES]);
                break;
        }

        $queryCount = clone $query;

        $pages = new Pagination([
            'totalCount' => $queryCount->count()
        ]);
        $this->setPages($pages);

        $models = $query->offset($pages->offset)
            ->limit($pages->limit)
            ->all();

        return $models;
    }

}