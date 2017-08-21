<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/24
 * Time: 22:43
 */

namespace app\modules\admin\controllers;


use app\modules\admin\models\Config;
use yii\helpers\Url;

class ConfigController extends BaseController
{

    public function actionIndex(){

        $model = new Config();
        $list = $model->find()->all();

        return $this->render('index', [
            'list' => $list
        ]);
    }

    public function actionCreate(){

        $model = new Config();
        if(\Yii::$app->request->isPost){

            $postData = \Yii::$app->request->post();
            if($model->create($postData)){
                \Yii::$app->session->setFlash("info", $model->message?:"创建成功!");
                $this->redirect(Url::to(['/admin/config/index']));
                return;
            }
        } else if(\Yii::$app->request->isGet && \Yii::$app->request->get('id')) {

            $model = $model->findOne(\Yii::$app->request->get('id'));
        }

        return $this->render("create", ['model' => $model]);
    }

    public function actionRemove(){

        $model = new Config();
        if(\Yii::$app->request->isGet && $model->remove(\Yii::$app->request->get())){
            \Yii::$app->session->setFlash('info', '删除成功!');
            $this->redirect(Url::to(['/admin/config/index']));
        } else {
            \Yii::$app->session->setFlash('info', $model->message ? : '删除失败!');
            $this->redirect(Url::to(['/admin/config/index']));
        }
    }

}