<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/20
 * Time: 22:29
 */

namespace app\modules\admin\controllers;


use app\modules\admin\service\CustomService;

class BusynessController extends BaseController
{

    public function actionCustom(){

        $service = new CustomService();
        return $this->render('custom', [
            'models' => $service->getList(),
            'pages' => $service->getPages()
        ]);
    }

}