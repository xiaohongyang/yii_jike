<?php
/**
 * 用户管理
 * User: xiaohongyang
 * Date: 2015/6/11
 * Time: 21:05
 */

namespace app\modules\admin\controllers;


use app\modules\admin\models\Test;
use app\modules\admin\models\Test2;
use app\modules\admin\models\User;
use app\modules\admin\models\UserAdver;
use app\modules\admin\models\Usermodify;

use app\modules\frontadmin\models\auth_item_child\Auth_item_child;
use app\modules\frontadmin\service\AdminuserService;
use app\modules\frontadmin\service\UserService;
use app\modules\jike\models\UserEditPassword;
use yii\data\ActiveDataProvider;
use yii\db\Query;
use yii\web\UrlManager;
use yii\widgets\ListView;

class UserController extends BaseController{

    public $username;
    public $group;

    public function init()
    {

    }



    public function actionUpdate()
    {


        if (\Yii::$app->request->isGet) {

            $model = User::findOne(\Yii::$app->request->get('id'));
            if (!$model) {
                jump_error('数据不存在!', '/');
            }

        } else if (\Yii::$app->request->isPost) {

            $model = new User();
            $post = \Yii::$app->request->post();

            if ($model->updateOne($post[$model->formName()]['id'], $post)) {
                jump_success('修改成功!');
            } else {
                jump_error('修改失败!');
            }
        }


        return $this->render('update', ['model' => $model]);
    }

    /**
     * 用户列表
     *
     * @return string
     */
    public function actionList()
    {

        $service = new AdminuserService();
        $models = $service->getList();

        return $this->render('list', [
            'models' => $models,
            'pages' => $service->getPages()
        ]);

    }

    /**
     * 修改密码
     *
     * @return string
     */
    public function actionChangepassword()
    {


        $this->setLayoutEmpty();

        $model = UserEditPassword::findOne(\Yii::$app->user->identity->getId());


        if(\Yii::$app->request->isPost && $model instanceof UserEditPassword){
            $result = $model->editPassword(\Yii::$app->request->post());
            if($result){
                \Yii::$app->getSession()->setFlash('success','修改密码成功!');
            } else {
                \Yii::$app->getSession()->setFlash('fail','修改密码失败!');
            }
        }

        return $this->render('editpassword', [
            'model' => $model
        ]);
    }


    public function actionDelete()
    {
        $id = \Yii::$app->request->get('id');

        $user = new User();
        if ($user->deleteOne($id)) {
            jump_success('删除成功!');
        } else {
            jump_error($user->getFirstError(User::DELETE_EFFOR_INFO));
        }
    }

    //数据统计
    public function actionCount(){

        $service = new AdminuserService();
        $todayRegister = $service->getTodayRegistNumber();
        $totalRegister = $service->getUserTotalNumber();
        return $this->render('count.php', ['todayRegister' => $todayRegister, 'totalRegister'=>$totalRegister]) ;
    }

}