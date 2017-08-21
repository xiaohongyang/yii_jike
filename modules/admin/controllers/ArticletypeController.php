<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/15
 * Time: 17:35
 */

namespace app\modules\admin\controllers;


use app\modules\jike\service\ArticleTypeService;
use kucha\ueditor\UEditorAction;

class ArticletypeController extends BaseController
{
    public function actions()
    {
        return [
            'upload' => [
                'class' => UEditorAction::className(),
                'config' => [
                    "imageUrlPrefix"  => "http://www.baidu.com",//图片访问路径前缀
                    "imagePathFormat" => "/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}" //上传保存路径
                ],
            ]
        ];
    }


    public function actionChannel(){

        $service = new ArticleTypeService();
        if(\Yii::$app->request->isPost){
            $rs = $service->edit(\Yii::$app->request->post());
            if($rs)
                \Yii::$app->getSession()->setFlash("result", "更新成功!");
            else
                \Yii::$app->getSession()->setFlash("result", "更新失败!");
        }

        $models = $service->getChannelList();

        $typeId = \Yii::$app->request->get('type_id') ? : $models[0]->type_id;

        foreach($models as $modelItem){
            if($typeId == $modelItem->type_id)
                $model = $modelItem;
        }

        return $this->render('channel', [
            'models' => $models,
            'typeId' => $typeId,
            'model' => $model
        ]);
    }


}