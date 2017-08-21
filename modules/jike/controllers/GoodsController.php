<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/13
 * Time: 21:40
 */

namespace app\modules\jike\controllers;


use app\modules\jike\service\PrizeGoodsService;

class GoodsController extends BaseController
{

    public function actionDetail(){

        $id = \Yii::$app->request->get('id');

        if(is_null($id) || !is_numeric($id)){

            jump_error("id错误!");
            return;
        }

        $goodsService = new PrizeGoodsService();

        return $this->render('detail', [

            'model' => $goodsService->getGoodsDetail($id)

        ]);
    }

}