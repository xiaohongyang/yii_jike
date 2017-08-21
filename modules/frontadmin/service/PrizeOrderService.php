<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/30
 * Time: 9:04
 */

namespace app\modules\frontadmin\service;


use app\modules\common\traits\PageTrait;
use app\modules\frontadmin\models\feedback\Feedback;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\models\transport\Transport;
use app\modules\jike\models\prize_codes\Prize_codes;
use yii\data\Pagination;

class PrizeOrderService extends BaseService
{

    use PageTrait;

    public function create($codeId ){

        $prizeOrderModel = new Prize_order();
        if($prizeOrderModel instanceof Prize_order){
            $rs = $prizeOrderModel->create($codeId);
            $this->message = $prizeOrderModel->message;
            return $rs;
        } else {
            $this->message = "数据不正确!";
            return false;
        }
    }


    public function getList(){

        $query = Prize_order::find();
        $query->from('jike_prize_order order');
        $query->leftJoin('jike_prize_codes as codes', 'order.code_id = codes.code_id');
        $query->where([
           '=', 'codes.user_id',$this->getLoginUserId()
        ]);

        $shippingStatus = \Yii::$app->request->get('shipping_status');
        $time = \Yii::$app->request->get('time');
        if($shippingStatus){
            $query->andWhere(['=', 'order.shipping_status', $shippingStatus]);
        }
        switch($time){
            case 1:
                $time = time()-3600*24* 30;
                $query->andWhere(['>=', 'order.created_at', $time]);
                break;
            case 2:
                $time = time()-3600*24* 90;
                $query->andWhere(['>=', 'order.created_at', $time]);
                break;
            case 3:
                $time = time()-3600*24* 180;
                $query->andWhere(['>=', 'order.created_at', $time]);
                break;
        }


        $query->orderBy('order.created_at desc ');

        $countQuery = clone $query;
        $pages = new Pagination([
            'totalCount' => $countQuery->count()
        ]);
        $this->setPages($pages);


        $models = $query->offset($pages->offset)
            ->limit($pages->limit)
            ->all();

        return $models;
    }

    /**
     * 创建订单
     */
    public function createOrder(){
        $model = new Prize_order();
        $rs = $model->createOrder(223,14,197,0,"新区长江路25号,",'15995716443', ['颜色'=>'白色','大小'=>"XL","系统"=>"IOS"]);
    }

    public function getTransportList(){
        $model = new Transport();

        $list = $model->find()->where(['>','transport_id',0])->all();
        return $list;
    }

    /**
     * 发货
     * @param $orderId
     * @param $transportId
     * @param $transportSn
     * @return bool
     */
    public function sender($orderId, $transportId, $transportSn){

        $model = new Prize_order();
        $rs = $model->sender($orderId,$transportId, $transportSn);
        !$rs && $this->message = $model->message ? : "发货失败!";
        return $rs;
    }

    //投诉
    public function feedback($orderId, $msgContent){

        $model = new Feedback();
        $rs = $model->feedBack([
            'user_id'=>$this->getLoginUserId(),
            'user_name'=> $this->getLoginUserName(),
            'msg_content' => $msgContent,
            'order_id' => $orderId,
            'msg_type' => Feedback::C_MSG_TYPE_COMPLAIN
        ]);

        !$rs && $this->message = $model->message?:"投诉失败!";

    return $rs;
    }

}