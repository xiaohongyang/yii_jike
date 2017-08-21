<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/16
 * Time: 10:23
 */

namespace app\modules\jike\controllers;


use app\modules\frontadmin\models\article_type\Article_type;
use app\modules\jike\service\ArticleTypeService;

class OtherController extends BaseController
{

    public function actionDetail(){

        $id = \Yii::$app->request->get('id');
        $model = Article_type::findOne(['type_id' => $id]);

        $service = new ArticleTypeService();
        $models = $service->getChannelList();

        return $this->render('detail', [
            'model' => $model,
            'models' => $models
        ]);
    }

}