<?php
/**
 * 站内信 api
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/7
 * Time: 6:09
 */

namespace app\modules\api\controllers;


use app\modules\frontadmin\service\MessageService;

class MsgController extends BaseApiController
{

    /**
     * 删除站内信
     */
    public function actionRemove(){

        $ids = \Yii::$app->getRequest()->post('ids');
        $msgService = new MessageService();
        $rs = $msgService->removeMessage($ids);
        if(!$rs){
            renderJson(0, $msgService->message ? $msgService->message : 'failed');
        } else {
            renderJson(1, '删除成功!');
        }
    }

    /**
     * 未读站内信数量
     */
    public function actionNotReadNumber(){

        $result = [0, '获取数据失败', 'result'=>0];
        try{
            $id = $this->getLoginUserId();
            $service = new MessageService();
            $notReadNumber = $service->getNotReadNumber($id);
            $data = [];
            $data['result'] = $notReadNumber;
            returnJson(1,'数据获取成功!', $data);
            return;
        }catch(\Exception $e){
            $result[1] = $e->getMessage();
        }
        renderJson($result);
    }

    public function actionReadMessage(){

        $result = [0, '获取数据失败'];
        try{

            $id = \Yii::$app->request->post('id');
            if($id){
                $service = new MessageService();
                $result = $service->readMessage($id);
            }
        }catch(\Exception $e){
            $result[1] = $e->getMessage();
        }
        returnJson($result);
    }
}