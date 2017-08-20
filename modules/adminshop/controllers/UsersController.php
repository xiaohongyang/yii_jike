<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/1/12
 * Time: 22:18
 */

namespace app\modules\adminshop\controllers;


use app\modules\adminshop\models\User_rank;
use app\modules\adminshop\models\Users;
use app\modules\adminshop\models\UsersCreate;
use app\modules\adminshop\models\UsersSearch;
use yii\data\ActiveDataProvider;
use yii\filters\VerbFilter;
use yii\helpers\ArrayHelper;
use yii\web\User;

class UsersController extends BaseController{
    public function actions()
    {
        return [
            'upload' => [
                'class' => 'kucha\ueditor\UEditorAction',
                'config' => [
                    "imageUrlPrefix"  => \Yii::$app->params['host']['img_host'],//图片访问路径前缀
                    "imagePathFormat" => "/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}" //上传保存路径
                ],
            ]
        ];
    }

    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'deletemultiple' => ['post']
                ]
            ]
        ];
    }


    public function actionList(){

        $usersModel = new UsersSearch();
        $params = \Yii::$app->request->get();
        $dataProvider = $usersModel->Search( $params );

        return $this->render('list', [
                'model'=> $usersModel,
                'dataProvider'=>$dataProvider,
                'rankList' => $this->getRankList()
            ]
        );
    }

    public function actionSearch(){

        $userList = array();
        $userList['rankList'] = $this->getRankList();

        $searchModel = new UsersSearch();
        $dataProvider =$searchModel->search(\Yii::$app->request->get());

        return $this->render('list', [
            'model' => $searchModel,
            'dataProvider' => $dataProvider,
            'rankList' => $this->getRankList()
        ]);
    }

    private function  getRankList(){
        return User_rank::find()->orderBy('min_points asc')->all();
    }

    public function actionEdit(){
        echo 34443;
    }

    public function actionDeletemultiple(){

        $pk = \Yii::$app->request->post('pk');

        if(!pk){
            return;
        }
        if( Users::deleteAll(['user_id' => $pk]) ){
        }
    }

    public function actionCreate(){
        $model = new UsersCreate();

        if(\Yii::$app->request->isPost){
            $model->scenario = $model::SCENARIO_CREATE;
            if( $model->load(\Yii::$app->request->post()) && $model->validate()){


                p(\Yii::$app->request->post());
                $model->create();
                echo '验证成功';
            }else{
                echo '验证失败';
            }
        }

        $rankList = User_rank::get_rank_list(true);


        return $this->render("create", ['model'=> $model,'rank_list'=>$rankList]);
    }


}