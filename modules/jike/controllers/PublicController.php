<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/2/22
 * Time: 20:53
 */

namespace app\modules\jike\controllers;



use app\ext\common\helpers\MobileMsgAliHelpers;
use app\ext\org\area\AreaTools;
use app\modules\common\models\Region;
use app\modules\jike\models\ThirdVideo;
use app\modules\jike\models\User;
use app\modules\jike\models\user\User_info;
use app\modules\jike\models\UserFindPassword;
use app\modules\jike\models\UserLogin;
use app\modules\jike\models\UserLogout;
use app\modules\jike\models\UserRegister;
use app\modules\jike\service\AliyunVideoService;
use yii\base\Exception;
use yii\base\Response;
use yii\captcha\CaptchaAction;
use yii\helpers\Url;
use yii\log\Logger;
use yii\web\ConflictHttpException;
use yii\web\Cookie;
use app\ext\org\net\IpLocation;

class PublicController extends BaseController
{
    public function actions()
    {
        return [
            'captcha' => [
                'class' => CaptchaAction::className(),
                'minLength' => 4,
                'maxLength' => 4,
            ],
            'captchaLogin' => [
                'class' => CaptchaAction::className(),
                'minLength' => 4,
                'maxLength' => 4
            ]
        ];
    }


    public function actionRegister(){

        try{

            $model = new UserRegister();

            if(\Yii::$app->request->isPost){
                $post = \Yii::$app->request->post();
                $model->scenario = $model::SCENARIO_REGISTER;
                if( $model->load($post) && $model->register($post) ){
                    return $this->redirect(Url::to(['public/login']));
                }
            }else{
            }
            return $this->render('register', ['model'=> $model]);
        }catch(Exception $e){
            throw new ConflictHttpException("404");
        }
    }

    public function actionLogin(){

        if(! \Yii::$app->jike_user->isGuest){
            return $this->redirect(['/']);
        }

        $model = $this->_loginHandle();

        return $this->render('login',['model'=> $model]);
    }
    private function _loginHandle(){

        $model = new UserLogin();
        if(\Yii::$app->request->isPost){
            $model->scenario = $model::SCENARIO_LOGIN;

            if($model->load(\Yii::$app->request->post()) && $model->login(\Yii::$app->request->post())){

                if($this->action->id == 'loginModal'){
                    //弹出层登录
                    $this->redirect(['public/loginModalSuccess']);
                }else
                    //非弹出层登录
                    $this->goHome();
            }else{
                if($model->getLoginFailTimes() === 3){
                    $model->trigger($model::EVENT_LOGIN_FAIL);
                    $this->refresh();
                }
                return $model;
            }
        }else{
            if($model->getUserCookies() !== false){

                //读取cookie中的手机号和密码
                $userCookies = $model->getUserCookies();
                $model = $model->findOne(['auth_key'=> $userCookies['cookie_auth_key']]);
                $model->user_password = $userCookies['cookie_user_password'];
                $model->remember_user = 1;
            }

            return $model;
        }
    }

    public function actionGetMobileCheckcode(){

        $mobile = \Yii::$app->request->get('user_mobile');

        $model = new UserRegister();
        $result = $model->getMobileCheckcode($mobile);
        if($result !== true)
            renderJson(0,$result);
        else{
            renderJson(1,"短信验证码已发送!");
        }
    }
    public function actionGetMobileFindPwdCheckcode(){

        $mobile = \Yii::$app->request->get('user_mobile');

        $model = new UserFindPassword();
        $result = $model->getMobileCheckcode($mobile);
        if($result !== true)
            renderJson(0,$result);
        else{
            renderJson(1, "短信验证码已发送!");
        }
    }

    public function actionLogout()
    {

        if (\Yii::$app->jike_user->isGuest) {
            jump_error('您没未登录, 无法退出!', '/');
        }
        $model = new UserLogout();

        if ($model->logout()) {
            $this->goHome();
        }

    }

    public function actionFindPassword(){

        try{

            $model = new UserFindPassword();

            if(\Yii::$app->request->isPost){
                $post = \Yii::$app->request->post();
                $model->scenario = $model::SCENARIO_REGISTER;
                if( $model->load($post) && $model->changePassword($post) ){
                    $this->goHome();
                }
            }

            return $this->render('findPassword', ['model'=> $model]);
        }catch(Exception $e){
            throw new ConflictHttpException("404");
        }
    }

    public function actionLoginModal(){

        $this->layout = 'mainlogin';

        $model = $this->_loginHandle();

        return $this->render('loginModal',['model'=>$model]);
    }
    public  function actionLoginModalSuccess(){
        $this->layout = 'mainlogin';
        return $this->render('loginModalSuccess');
    }

    public function actionUploadVideo(){

        $this->layout = 'main_empty';

        $videoType = \Yii::$app->request->get('type');
        if($videoType == 'youku'){

            try{
                set_time_limit(0);
                $thirdVideo = new ThirdVideo();
                if(\Yii::$app->request->isPost){
                    $uploadResult = $thirdVideo->upload();
                    \Yii::getLogger()->log($uploadResult, Logger::LEVEL_ERROR);

                }
                return $this->render('uploadvideo_youku.php', [
                    'model' => $thirdVideo
                ]);
            } catch (Exception $e){
                \Yii::getLogger()->log($e->getMessage().$e->getCode().$e->getLine().$e->getFile(), Logger::LEVEL_ERROR);
            }
        } else{

            return $this->render('uploadvideo.php', [
            ]);
        }
    }

    /**
     * 阿里云视频文件上传
     * @return string
     */
    public function actionGetVideo(){

        $service = new AliyunVideoService();
        $json = $service->getVideo();
        echo $json;
        return;
    }



    public  function actionTest(){

        $checkCode = '124387a';
        $mobile= '15995716443';
        $helper = MobileMsgAliHelpers::getInstance()->sendMsg([$mobile],MobileMsgAliHelpers::TEMPLATE_FIND_PWD_CHECK_CODE, ['code'=>$checkCode, 'product'=>'集客']);

        print_r($helper);

        echo date('Y-m-d H:i:s', time());
        echo 33;
        /*$userInfoModel = new User_info();
        $rs = $userInfoModel->create([
            'user_id' => '88'
        ]);

        var_dump($rs);*/

        //echo Region::findOne(['RegionName'=>'苏州'])->ID;
        //echo Region::findOne(['RegionName'=>'苏州'])->RegionName;

        //p(User::findAll(['>=','user_id', 11]));

        //$user = new User();

        /*$query = User::find();
        $query->where(['>=','user_id','0']);
        p($query->all());*/

        //p(User::find()->where(['>=','user_id',1])->select('user_id')->all());

        //p(User::find()->where(['!=','user_id',''])->all());
 
    }


}