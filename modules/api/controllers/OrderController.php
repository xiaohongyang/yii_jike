<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/9
 * Time: 15:23
 */

namespace app\modules\api\controllers;


use app\modules\frontadmin\models\feedback\Feedback;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\service\PrizeOrderService;

class OrderController extends BaseApiController
{

    public function actionCreate(){

       /* renderJson(1,  "操作成功!");
        return;*/

        $model = new Prize_order();
        $codeId = \Yii::$app->request->post('code_id');
        $province = \Yii::$app->request->post('province');
        $city = \Yii::$app->request->post('city');
        $district = \Yii::$app->request->post('district',0);
        $address = \Yii::$app->request->post('address');
        $mobile = \Yii::$app->request->post('mobile');
        $goodsDesc = \Yii::$app->request->post('goods_desc');
        $consignee = \Yii::$app->request->post('consignee');
        $result = $model->createOrder($codeId, $consignee, $province, $city, $district, $address, $mobile, $goodsDesc);

        if($result == false){
            renderJson(0, $model->message);
        } else {
            renderJson(1, "兑奖订单已提交!");
        }
    }

    //发货
    public function actionSender(){

        $orderId = \Yii::$app->request->post('order_id');
        $transportId = \Yii::$app->request->post('transport_id');
        $transportSn = \Yii::$app->request->post('transport_sn');
        $orderService = new PrizeOrderService();
        $rs = $orderService->sender($orderId, $transportId, $transportSn);
        if($rs)
            renderJson(1, "发货成功!");
        else
            renderJson(0, $orderService->message);
    }

    //反馈
    public function actionFeedback(){

        $orderId = \Yii::$app->request->post('order_id');
        $msgContent = \Yii::$app->request->post('msg_content');
        $orderService = new PrizeOrderService();
        $rs = $orderService->feedback($orderId, $msgContent);
        if($rs)
            renderJson(1, "感谢您的监督，客服将在3个工作日内，通过站内信息给您回复...<br/>如有需要，客服将通过电话与您取得联系...");
        else
            renderJson(0, $orderService->message);
    }

    //管理员设置订单状态  违约|已收货|用户已放弃兑奖
    public function actionSetShippingStatus(){

        $orderId = \Yii::$app->request->post('order_id');
        $shippingStatus = \Yii::$app->request->post('shipping_status');
        $service = new \app\modules\admin\service\PrizeOrderService();
        $rs = $service->setOrderState($orderId, $shippingStatus);
        if($rs){
            returnJson(1, $service->message?:"操作成功!");
        } else {
            returnJson(0, $service->message?:"操作成功!");
        }
    }

    //投诉回复
    public function actionFeedbackReply(){

        $parentId = \Yii::$app->request->post('parent_id');
        $orderId = \Yii::$app->request->post('order_id');
        $msgContent = \Yii::$app->request->post('msg_content');

        $service = new \app\modules\admin\service\PrizeOrderService();
        $rs = $service->feedbackReply($parentId, $msgContent, $orderId);

        if($rs)
            returnJson(1, $service->message ? : '回复成功!');
        else
            returnJson(0, $service->message);
    }

}