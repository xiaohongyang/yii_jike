<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/11
 * Time: 8:41
 */

namespace app\modules\admin\controllers;


use app\modules\admin\forms\ActivityReleaseForm;
use app\modules\admin\service\PrizeOrderService;
use app\modules\frontadmin\models\article\Article;
use app\modules\frontadmin\models\prize_type\prize_type;
use app\modules\frontadmin\service\PrizegoodsService;
use yii\helpers\ArrayHelper;

class ActivityController extends BaseController
{

    public function actionRelease(){

        $formModel = new ActivityReleaseForm();

        if(\Yii::$app->request->isPost){
            $rs = $formModel->create(\Yii::$app->request->post());
            if($rs)
                \Yii::$app->getSession()->setFlash("result", "活动设置成功!");
            else
                \Yii::$app->getSession()->setFlash("result", $formModel->message?:"活动设置失败!");

            $this->redirect('/admin/activity/release');
        } else {
            $data = Article::find()->where(['>', 'id', 0])->one();
            if(!is_null($data)){

                $formModel->setAttributes(ArrayHelper::toArray($data));
                $formModel->id = $data->id;
                $formModel->pics = $data->pics;
            }
        }
        return $this->render('release', [
            'model' => $formModel
        ]);
    }

}