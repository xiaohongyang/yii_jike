<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/4
 * Time: 15:12
 */

namespace app\modules\api\controllers;


use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\frontadmin\service\OneMoneyPrizeService;

class OneprizeController extends BaseApiController
{

    /**
     * 一元即开抽资
     */
    public function actionPrize(){

        if(!$this->getLoginUserId()){
            returnJson(0, '您尚未登录,请先登录!');
            return;
        }

        $id = \Yii::$app->request->post('prize_id');
        $model = prize_goods::findOne(['prize_id' => $id]);
        if(is_null($model)){
            returnJson(0, '商品不存在或已经被删除!');
        }else {

            $service = new OneMoneyPrizeService($model);
            if($service->prize()){
                renderJson(1, $service->message ? : '1元即开成功!!');
            } else {
                renderJson(1, $service->message ? : '1元即开失败!');
            }
        }
    }

}