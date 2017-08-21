<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/21
 * Time: 22:40
 */

namespace app\modules\common\controllers;


use app\modules\common\models\letv\Letv;

class LetvController extends BaseController
{

    function actionGet_video_flash()
    {

        $request = \Yii::$app->request;
        $video_name = $request->post('video_name');
        $flash_width = $request->post('video_width',410);           //,410,'intval');
        $flash_height = $request->post('video_height',150);         //I('video_height',150,'intval');
        $js_callback = $request->post('js_callback');               // I('js_callback') ;
        $client_ip = \Yii::$app->request->userIP;
        $re = Letv::videoUploadFlash($video_name,$js_callback,$flash_width,$flash_height);
        die($re);
    }

    function actionGet_video_info(){

        $request = \Yii::$app->request;
        $video_id = $request->post('video_id', 0);
        $re = Letv::getOne($video_id);
        die($re);
    }

    function actionVideo_del($video_id)
    {
        $video_id = \Yii::$app->request->post('video_id',0);
        if(Letv::video_del($video_id)){
            returnJson(1);
        }else{
            returnJson(0);
        }
    }

}