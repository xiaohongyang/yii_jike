<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/11
 * Time: 17:12
 */

namespace app\modules\api\controllers;


use app\modules\common\lib\PermissionActionFilter;
use app\modules\frontadmin\models\publicvideo\Publicvideo;
use app\modules\frontadmin\models\User_ad_video;
use app\modules\frontadmin\models\video\video;
use app\modules\frontadmin\service\AdVideoService;
use app\modules\frontadmin\service\User_ad_video_luckyService;
use app\modules\jike\models\prize_codes\Prize_codes;
use app\modules\jike\service\PrizeGoodsService;
use app\modules\jike\service\ZeroPrizeService;

class VideoController extends BaseApiController
{
    public function behaviors()
    {
        return [
            [
                'class' => PermissionActionFilter::className(),
                'operation' => PermissionActionFilter::OPERATION_NOCHECKLOGIN,
                'only' => [
                    'luckydrawstep01','luckydrawstep02'
                ]
            ]
        ];
    }


    /**
     * 获取视频状态
     */
    public function actionStatus(){

        $id = \Yii::$app->request->get('id');
        if(!is_null($id) && is_numeric($id)){
            $model = User_ad_video::findOne(['ad_id'=>$id]);
            if($model)
                returnJson(1, $model->status);
            else
                returnJson(0, '数据不存在!');
        }else{
            returnJson(0,'id有误!');
        }
    }

    /**
     * 充值到视频虚拟账户
     */
    public function actionRecharge(){

        $id = \Yii::$app->request->post('id');
        $money = \Yii::$app->request->post('money');

        $service = new AdVideoService();
        $result = $service->recharge($id, $money);
        if(!$result){
            returnJson(0,$service->message);
        }else{
            returnJson(1,"充值成功!");
        }
    }

    /**
     * 积分视频抽奖第1步
     */
    public function actionLuckydrawstep01(){

        $service = new User_ad_video_luckyService();

        $result = $service->luckyDrawStep01();

//        renderJson($result['code'], $service->message);
//        return;

        if(is_null($result['video'])){
            renderJson($result['code'], $service->message);
        }else if($result['video'] instanceof User_ad_video){
            //抽奖视频广告
            renderJson($result['code'], null, [
                'vu' => $result['video']->video->video_unique,
                'title' => $result['video']->ad_title,
                'link' => $result['video']->link
            ]);
        }else if($result['video'] instanceof Publicvideo){
            //公益视频广告
            renderJson($result['code'], null, [
                'vu' => $result['video']->video->video_unique,
                'title' => $result['video']->pv_title,
                'link' => $result['video']->pv_link
            ]);
        }
    }

    /**
     * 积分抽奖第二步 获取积分给用户
     */
    public function actionLuckydrawstep02(){

        $service = new User_ad_video_luckyService();
        $result = $service->luckyDrawStep02();
        if($result == 1){
            renderJson($result, '鼓励奖！本次抽奖，您获得5点积分，已存入您的积分账户...请再接再厉，赢取环游世界大奖...');
        } else if($result == -1){
            renderJson($result, $service->message);
        } else {
            renderJson($result, '抱歉,您暂未登录，本次抽奖无效...请在登录后再次抽取，赢取环游世界大奖...谢谢!');
        }
    }



}