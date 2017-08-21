<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/5
 * Time: 23:00
 */

namespace app\modules\api\controllers;


use app\modules\frontadmin\service\AdminuserService;

class AdminuserController extends BaseApiController
{

    //删除管理员
    public function actionRemove(){

        $id = \Yii::$app->request->post('id');

        $service = new AdminuserService();
        $rs = $service->remove($id);
        if($rs){
            returnJson(1, "删除成功!");
        } else{
            returnJson(0, $service->message ? :"删除失败!");
        }

    }


    //编辑管理员权限
    public function actionEditRights(){
        $id = \Yii::$app->request->post('id');
        $itemName = \Yii::$app->request->post('item_name');
        //更新表jike_auth_assignment中的item_name值
    }

    //添加管理员
    public function actionCreate(){

        $service = new AdminuserService();
        $result = $service->create(\Yii::$app->request->post());
        if($result){
            returnJson(1, "添加成功!");
        } else {
            returnJson(0,  $service->message);
        }
    }

    public function actionChangeUserRole(){

        $id = \Yii::$app->request->post('id');
        $itemName = \Yii::$app->request->post('item_name');
        $service = new AdminuserService();
        $result = $service->changeRole($id, $itemName);
        if($result){
            returnJson(1, "修改成功!!");
        } else {
            returnJson(0,  $service->message ? : '修改失败!');
        }
    }


}