<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/11
 * Time: 8:48
 */

namespace app\modules\admin\service;


use app\modules\frontadmin\models\feedback\Feedback;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\jike\models\prize_codes\Prize_codes;
use yii\data\Pagination;

class PrizeOrderService extends BaseService
{

    //1.卖家违约	2.奖品已交付  3.用户已放弃兑奖

    public function setOrderState($orderId, $shippingStatus){

        $model = new Prize_order();
        $rs = $model->setShippingStatus($orderId, $shippingStatus, $this->getLoginAdminId());
        !$rs && $this->message = $model->message?:$model->getFirstErrors2String();
        return $rs;
    }


    public function getList(){

        $query = Prize_order::find();
        $query->where(['>','order_id',0]);

        $serial = \Yii::$app->request->get('serial');

        //活动期号
        $serial = str_replace(['A','B','a','b'],[''],$serial);
        if(!is_null($serial)){
            $query->andWhere(['in','code_id', Prize_codes::find()->select('code_id')->where(['like','sku_id', $serial])->asArray()] ) ;
        }
        //shipping_status 发货状态
        $shippingStatus = \Yii::$app->request->get('shipping_status');
        if(!is_null($shippingStatus))
            $query->andWhere(['=','shipping_status', $shippingStatus]);

        //feedback 投诉处理
        $feedback = \Yii::$app->request->get('feedback');
        if(!is_null($feedback)){
            //未处理投诉
            if($feedback==1)
                $query->andWhere([
                    'and',
                    [
                        'in',
                        'order_id',
                        Feedback::find()->select('order_id')->where([
                            '=','parent_id',0
                        ])->asArray()
                    ],[
                        'not in',
                        'order_id',
                        Feedback::find()->select('order_id')->where([
                            '<>','parent_id',0
                        ])->asArray()
                    ]
                ]);
            else{
                //已处理投诉
                $query->andWhere([
                        'in',
                        'order_id',
                        Feedback::find()->select('order_id')->where([
                            '<>','parent_id',0
                        ])->asArray()
                ]);
            }
        }

        $countQuery = clone $query;
        $pagination = new Pagination([
            'totalCount' => $countQuery->count()
        ]);
        $models = $query->offset($pagination->offset)
                        ->limit($pagination->limit)
                        ->all();

        $this->setPages( $pagination);
        return $models;
    }


    public function feedbackReply($parentId, $msgContent, $orderId){

        $model = new Feedback();
        $rs = $model->reply([
            'user_id' => $this->getLoginAdminId(),
            'user_name' => $this->getLoginAdminName(),
            'msg_content' => $msgContent,
            'order_id' => $orderId,
            'msg_type' => Feedback::C_MSG_TYPE_COMPLAIN,
            'parent_id' => $parentId
        ]);

        !$rs && $this->message = $model->message ? : $model->getFirstErrors2String();

        return $rs;
    }

}