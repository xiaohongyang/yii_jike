<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/30
 * Time: 21:04
 */

namespace app\modules\api\controllers;


use app\modules\common\models\Region;
use app\modules\frontadmin\models\user_address\User_address;
use app\modules\frontadmin\service\AdminuserService;
use app\modules\frontadmin\service\UserService;
use kartik\rating\StarRating;
use yii\web\JsExpression;

class UserController extends BaseApiController
{

    public function actionLovePointsLevel(){

        $service = UserService::getUserinfoService();
        $points = $service->getModel()->love_points;

        $start = StarRating::widget(['name' => 'rating_19',
            'pluginOptions' => [
                'stars' => 6,
                'min' => 0,
                'max' => 6,
                'step' => 0.1,
                'filledStar' => '<i class="glyphicon glyphicon-heart"></i>',
                'emptyStar' => '<i class="glyphicon glyphicon-heart-empty"></i>',
                'defaultCaption' => '{rating} hearts',
                'starCaptions' => new JsExpression("function(val){return val == 1 ? 'One heart' : val + ' hearts';}")
            ]
        ]);

        echo $start;

    }

    /**
     * 获取视频状态
     */
    public function actionAddress(){

        $service = new UserService();
        $addressModel = $service->getUserAddressModel();

        if(is_null($addressModel) || !$addressModel->user_id){
            returnJson(0, '数据不存在!');
        }else{
            if($addressModel instanceof User_address)
                $data = $addressModel->toArray();

            $regionModel = new Region();
            $data['province_name'] = $regionModel->getName($data['province']);
            $data['city_name'] = $regionModel->getName($data['city']);
            $data['district_name'] = $regionModel->getName($data['district']);

            returnJson(1,'数据获取成功!', $data);
        }
    }

    //用户总数
    public function actionGetUserTotalNumber(){

        $service = new AdminuserService();

        $total = $service->getUserTotalNumber();
        if($total)
            returnJson(1, '用户总数', ['number'=> $total]);
        else
            returnJson(0, '获取数据失败!');
    }

    //获取今日注册数
    public function actionGetTodayRegistNumber(){

        $service = new AdminuserService();

        $total = $service->getTodayRegistNumber();
        if($total)
            returnJson(1, '用户总数', ['number'=> $total]);
        else
            returnJson(0, '获取数据失败!');
    }

    //获取当前保证金账户余额
    public function actionGetBailAmount(){

        $service = new UserService();
        $model = $service->getUserAccountModel();
        if(is_null($model))
            returnJson(0, $model->message ? : '获取数据失败!');
        else
            returnJson(1, '获取余额成功!', ['frozen_account'=>$model->frozen_account]);
    }


    public function actionRegisterChartList(){

        $service = new UserService();


            $list = $service->getRegisterChartListByMonth();
            returnJson(1, '获取数据成功', $list);


    }
}