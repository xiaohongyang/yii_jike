<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/3
 * Time: 6:18
 */

namespace app\modules\frontadmin\controllers;


use app\modules\frontadmin\models\user\User_info;
use app\modules\frontadmin\models\User_ad_video;
use app\modules\frontadmin\service\UserService;
use yii\web\Controller;

class TestController extends Controller
{

    public function actionTest(){

        $service = UserService::getUserinfoService();
        $rs = $service->edit([
            'ui_id' => 2,
            'head_pic' => '1223abcc'
        ]);

       /* $adVideoAddService = new AdVideoAddService();
        $re = $adVideoAddService->user_ad_video->findOne(['ad_id'=>2]);
        //p($re->video);

        $model = new User_ad_video_region();
        $rs = $model->batchCreate(2,['r1','a2','p3','c4','p3','p3','t6']);
var_dump($rs);
        $re = $adVideoAddService->user_ad_video->findOne(['ad_id'=>2]);
        //p($re->regions);
        $regionModel = new User_ad_video_region();

        $accountModel = new User_ad_video_account();
        $accountModel->createAccount(2);*/

        /*$user_ad_videoModel = new User_ad_video();
        $data = [
            'User_ad_video' => [
                'ad_title' => 'test肖01',
                'user_id' => '99',
                'link' => 'http://baidu.com',
            ],
            'regions' => [
                'r1',
                'a2',
                'c3'
            ],
            'video'=>[
                'video_id'=>1522,
                'video_unique' => '33322'
            ]
        ];
        $rs = $user_ad_videoModel->create($data);

        var_dump($rs);

        p($user_ad_videoModel->errors);*/


    }

}