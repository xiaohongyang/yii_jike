<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/16
 * Time: 14:10
 */

namespace app\modules\api\controllers;


use app\modules\jike\service\PrizeGoodsService;

class GoodsController extends BaseApiController
{

    public function actionList(){

        $list = ['list'=>[], 'pages'=>[]];
        $status = API_STATUS_FAILED;
        $message = "获取数据失败";

        try {
            $service = new PrizeGoodsService();
            $service->setFormat($service::$formatArray);
            $listData = $service->getList();

            $pages = $service->getApiPages();
            $list = [
                'list' => $listData,
                'pages' => $pages
            ];
            $message = "获取数据成功!";
            $status = API_STATUS_SUCCESS;
        } catch (Exception $e) {

            $message = $e->getMessage();
            $status = API_STATUS_ERROR;
        }

        returnJson($status, $message, $list);
    }

}