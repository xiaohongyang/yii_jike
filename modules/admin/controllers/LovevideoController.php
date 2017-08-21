<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/18
 * Time: 21:15
 */

namespace app\modules\admin\controllers;


use app\modules\frontadmin\models\love_video\Love_video;
use app\modules\frontadmin\service\LoveVideoService;

class LovevideoController extends BaseController
{

    public function actionList(){

        $service = new LoveVideoService(new Love_video());

        return $this->render('list', [
            'model' => $service->model,
            'models' => $service->getList(),
            'pages' => $service->getPages()
        ]);
    }

    public function actionCreate(){

        $service = new LoveVideoService(new Love_video());

        $request = \Yii::$app->request;
        if($request->isGet){
            $this->setLayoutEmpty();
            return $this->render('create', ['model' => $service->model]);

        }else if($request->isAjax){

            if($service->create($request->post())){
                returnJson("1",$service->message?:"添加成功!",[]);
            }else{
                returnJson("0",$service->message?:"添加失败!",$service->model->errors);
            }
            return;
        }
    }

    public function actionEdit()
    {

        $this->layout = 'main_simple';

        $id = \Yii::$app->request->get('id');

        if(is_null($id) || !is_numeric($id))
            return false;

        $service = new LoveVideoService(Love_video::findOne(['love_id'=>$id]));
        if(\Yii::$app->request->isPost){

            if($service->edit(\Yii::$app->request->post())){
                returnJson("1",$service->message?:"修改成功!",[]);
            }else{
                returnJson("0",$service->message?:"修改失败!",$service->model->errors);
            }
            return;
        }


        return $this->render('edit', ['model' => $service->model ] );
    }

    public function actionRemove()
    {

        $id = \Yii::$app->request->get('id');

        $service = new LoveVideoService(Love_video::findOne(['love_id'=>$id]));
        if(\Yii::$app->request->isPost){

            if($service->remove()){
                returnJson("1",$service->message?:"删除成功!",[]);
            }else{
                returnJson("0",$service->model->message?:$service->model->getFirstErrors2String() );
            }
        } else {
            returnJson('-1','非法访问!');
        }

    }




}