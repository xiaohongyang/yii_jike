<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2015/6/4
 * Time: 21:21
 */

namespace app\modules\admin\controllers;


use app\modules\admin\models\Adminuser;
use app\modules\admin\models\CustomerModel;
use app\modules\admin\models\Goods2;
use app\modules\admin\models\User;
use yii\captcha\Captcha;
use yii\captcha\CaptchaAction;
use yii\web\Controller;

class PublicController extends Controller{


    public function actions()
    {
        return [

            'captcha' => [
                'class' => CaptchaAction::className(),
                'minLength' => 7,
                'maxLength' => 7
            ]
        ];
    }


    public function actionIndex()
    {

        p(\Yii::$app->user);exit;

        if(\Yii::$app->user->isGuest)
            $this->redirect(['public/login']);
        else
            return $this->render('index.php',[
            ]);
    }

    public function test($event)
    {
        echo '<hr/>';
        echo $this->className();
        echo '<hr/>';

        p($event->data);
    }

    //登陆页面/处理登陆信息
    public function actionLogin(){


        $this->layout = "login";

        if(!\Yii::$app->user->isGuest)
            $this->redirect(['/admin/index/main']);

        $user = new User();

        if (\Yii::$app->request->isPost) {
            $result = $user->login(\Yii::$app->request->post());
            if (true===$result) {
                $this->redirect(['/admin/index/main']);
            } else {
                return $this->render('login', ['model' => $result]);
            }
        } else {
            return $this->render('login', ['model' => $user]);
        }
    }


    //用户登出
    public function actionLogout()
    {

        $user = new User();
        $user->logout();

        $this->goHome();
    }



}