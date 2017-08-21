<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2015/6/4
 * Time: 14:36
 */

//namespace app\modules\admin\controlles;
namespace app\modules\admin\controllers;


use yii\base\Event;
use yii\web\Controller;
use yii\web\View;

class IndexController extends BaseController{


    public function init()
    {
        parent::init();
    }


    public function actionIndex()
    {

        $this->layout = 'frame';

        \Yii::$app->view->on(View::EVENT_BEGIN_BODY, function () {

        });

        return $this->render('index');

    }

    public function actionHead()
    {

        return $this->render('head');
    }

    public function actionIndex2(){
        $this->layout = 'main_2.php';
        return $this->render('index2');
    }

    public function actionLeft(){
        return $this->render('left.php');
    }

    public function actionTop(){
        return $this->render('top.php');
    }

    public function actionMain(){
        $this->layout = 'main_2.php';

        return $this->render('index.php');
    }

   public function actionCenter(){
       return $this->render('center.php');
   }
}