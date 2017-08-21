<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/11
 * Time: 8:41
 */

namespace app\modules\admin\controllers;


use app\modules\admin\service\PrizeOrderService;
use app\modules\frontadmin\models\prize_type\prize_type;
use app\modules\frontadmin\service\PrizegoodsService;
use yii\helpers\ArrayHelper;

class ZeroprizeController extends BaseController
{

    //0元夺宝 兑奖管理
    public function actionCashprize(){

        $service = new PrizeOrderService();

        $models = $service->getList();
        return $this->render('cashprize', [
            'models' => $models,
            'pages' => $service->getPages()
        ]);
    }

    // 夺宝商品审核
    public function actionVerify(){

        $service = new \app\modules\admin\service\PrizeGoodsService();

        $prizeTypeModel = new prize_type() ;
        $prizeTypeList = ArrayHelper::merge([0=>'选择类型'], ArrayHelper::map($prizeTypeModel->getList()->asArray()->all(),'type_id','type_name'));

        $models = $service->getPrizeGoodsList();
        return $this->render('verify', [
            'models' => $models,
            'pages' => $service->getPages(),
            'prizeTypeList' => $prizeTypeList
        ]);
    }

}