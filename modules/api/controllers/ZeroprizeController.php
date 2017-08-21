<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/25
 * Time: 9:50
 */

namespace app\modules\api\controllers;


use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\jike\models\prize_codes\Prize_codes;
use app\modules\jike\service\PrizeGoodsService;
use app\modules\jike\service\ZeroPrizeService;

class ZeroprizeController extends BaseApiController
{

    /**
     * 0元夺宝第一步 播放视频
     */
    public function actionZeroPrizeStep01(){

        $goodsId = \Yii::$app->request->post('id');

        $service = new PrizeGoodsService();
        $goodsDetail = $service->getGoodsDetail($goodsId);

        if($goodsDetail->goods_number > 0){
            $vedio = $service->getGoodsVideo($goodsId);
            if(!is_null($vedio)){
                renderJson(1, null, [
                    'vu' => $vedio->video_unique,
                    'title' => "0元夺宝",
                    'link' => $goodsDetail->goods_link,
                    'prize_id' => \Yii::$app->request->post('id')
                ]);
            } else {
                renderJson(0, $service->message ? : '视频不存在!');
            }
        } else {
            renderJson(0, $service->message ? : '0元夺宝尚未开启,或已经结束!');
        }
    }

    /**
     * 0元抽奖第2步 获取抽奖号码
     */
    public function actionZeroPrizeStemp02(){

        $goodsId = \Yii::$app->request->post('id');
        if(!$this->getLoginUserId()){

            renderJson(-1, "请先登录!");
        } else if(!is_numeric($goodsId) || !$goodsId){
            renderJson(-1, "商品不存在或已经下架!");
        } else {

            $prizeCodes = new Prize_codes();
            $prizeService = new ZeroPrizeService($goodsId, $prizeCodes);
            $rs = $prizeService->prize();
            if( $rs ){
                renderJson(1, "抽奖成功，你的抽奖号码为:{$prizeCodes->code}", ['prize_id' => $goodsId]);
            } else {
                if(is_array($prizeCodes->getFirstErrors()) && count($prizeCodes->getFirstErrors()))
                    $message = $prizeCodes->getFirstErrors()[0];
                else
                    $message = $prizeService->message ? : "抽奖失败!";
                renderJson(0, $message);
            }
        }
    }

    /**
     * 已参与人次
     */
    public function actionPrizeTimes(){

        $prizeId = \Yii::$app->request->post('id');
        $prizeService = new ZeroPrizeService($prizeId, new Prize_codes());
        $times = $prizeService->getPrizeTimes();
        if($times === false){
            renderJson(0, $prizeService->message);
        } else {
            renderJson(1, "获取数据成功!", ['times' => $times]);
        }
    }

    public function actionPrizeLeftTimes(){

        $prizeId = \Yii::$app->request->post('id');
        $prizeService = new ZeroPrizeService($prizeId, new Prize_codes());
        $times = $prizeService->getPrizeLeftTimes();
        if($times === false){
            renderJson(0, $prizeService->message);
        } else {
            renderJson(1, "获取数据成功!", ['times' => $times]);
        }
    }

    public function actionGetGoodsNumber(){

        $prizeId = \Yii::$app->request->post('id');
        $prizeService = new ZeroPrizeService($prizeId, new Prize_codes());
        $goodsNumber = $prizeService->getGoodsNumber();
        if($goodsNumber === false){
            renderJson(0, $prizeService->message);
        } else {
            renderJson(1, "获取数据成功!", ['goodsNumber' => $goodsNumber]);
        }
    }

    public function actionSetGoodsNumber(){

        $prizeId = \Yii::$app->request->post('id');
        $goodsNumber = \Yii::$app->request->post('goods_number');

        $service = new \app\modules\frontadmin\service\PrizegoodsService();
        $service->setPrizeId($prizeId);
        $result = $service->setGoodsNumber($goodsNumber);
        if($result === false){
            renderJson(0, $service->message);
        } else {
            renderJson(1, $service->message?:"操作成功!");
        }
    }

    /**
     * 开启一元即开活动
     */
    public function actionEnableOneMoneyBuy(){

        $prizeId = \Yii::$app->request->post('id');

        $service = new \app\modules\frontadmin\service\PrizegoodsService();
        $service->setPrizeId($prizeId);
        $result = $service->enableOneMoneyBuy();
        if($result === false){
            renderJson(0, $service->message);
        } else {
            renderJson(1, $service->message?:"操作成功!");
        }
    }

    public function actionDisableOneMoneyBuy(){

        $prizeId = \Yii::$app->request->post('id');

        $service = new \app\modules\frontadmin\service\PrizegoodsService();
        $service->setPrizeId($prizeId);
        $result = $service->disableOneMoneyBuy();
        if($result === false){
            renderJson(0, $service->message);
        } else {
            renderJson(1, $service->message?:"操作成功!");
        }
    }

    /**
     * 删除活动
     */
    public function actionDelete(){

        $prizeId = \Yii::$app->request->post('id');

        $service = new \app\modules\frontadmin\service\PrizegoodsService();
        $service->setPrizeId($prizeId);
        $result = $service->remove();
        if($result === false){
            renderJson(0, $service->message);
        } else {
            renderJson(1, $service->message?:"操作成功!");
        }
    }

    /**
     * 兑奖,提交订单
     */
    public function actionCashPrize(){

        $codeId = \Yii::$app->request->post('code_id');

        $service = new \app\modules\frontadmin\service\PrizegoodsService();
        $result = $service->cashPrize($codeId);
        if($result === false){

            renderJson(0, $service->message);
        } else {
            renderJson(1, $service->message?:"操作成功!");
        }
    }

    /**
     * 审核
     */
    public function actionVerify(){


        $prizeId = \Yii::$app->request->post('prize_id');
        $status = \Yii::$app->request->post('status');

        $model = new prize_goods();

        $result = $model->verifyGoods($prizeId, $status);
        if($result == false){
            renderJson(0, $model->message);
        } else {
            renderJson(1, $model->message?:"操作成功!");
        }
    }
}