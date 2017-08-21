<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/2/22
 * Time: 18:02
 */

namespace app\modules\jike\controllers;

use app\modules\frontadmin\service\PrizegoodsService;
use app\modules\jike\service\ArticleService;
use yii\log\Logger;

class IndexController extends BaseController
{

    public  function actionIndex(){

        $model = new PrizegoodsService();
        $articleService = new ArticleService();

        \Yii::$app->params['show_index_header'] = true;

        return $this->render('test_index',[
            'prizegoodsTypeList'=>$model->getTypelist(),
            'goodsList'=>$model->getIndexList(),
            'activity' => $articleService->getActivity()
        ]);;
    }

    public function actionGoodsList(){
        $model = new PrizegoodsService();
        return $this->renderPartial('goodsList',[
            'goodsList'=> $model->getIndexList(),
            'pages' => $model->getPages()
        ]);
    }

    /**
     * 显示视频
     * @return string
     */
    public function actionLuckydraw(){

        $request = \Yii::$app->request;

        $this->setLayoutEmpty();
        $letvCloudV1 = new \LetvCloudV1();

        $vu = $request->get('vu');

        return $this->renderPartial('luckydraw_ali.php',[
            'uu' => $letvCloudV1->user_unique,
            'key' => $letvCloudV1->secret_key,
            'vu' => $vu
        ]);
    }

    public function actionTime(){
        return $this->render('time',['time'=>date("h:i:s")]);
    }
}