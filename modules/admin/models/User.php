<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2015/6/11
 * Time: 16:32
 */

namespace app\modules\admin\models;


use app\modules\frontadmin\models\BaseActiveRecord;
use yii\base\Event;
use yii\base\Exception;
use yii\behaviors\TimestampBehavior;
use yii\captcha\CaptchaValidator;
use yii\db\ActiveRecord;
use yii\helpers\ArrayHelper;
use yii\web\IdentityInterface;

class User extends BaseActiveRecord implements IdentityInterface{

    const DELETE_EFFOR_INFO = 'delete_error_info';

    const EVENT_AFTER_LOGIN = 'after_login';

    public $old_password;
    public $new_password;
    public $repeat_password;

    public $captcha;

    public $item_name;

    const C_ADMIN_ROLE_NAME = '管理员';


    public function init()
    {
        parent::init();


        //绑定登录后事件
        $this->on(self::EVENT_AFTER_LOGIN, [$this, 'afterLogin']);
    }

    //定义规则
    public function rules()
    {
        return [
            [['user_name'], 'required' , 'on' => 'login'],
            [['user_password'], 'required' , 'on' => 'login'],
            [['captcha'], 'required', 'on' => 'login'],
            [['captcha'], 'captcha', 'on' => 'login'],

            [['old_password', 'new_password', 'repeat_password'], 'required', 'on'=>'changePwd'],
            ['old_password','findPassword','on'=>'changePwd'],
            ['repeat_password','compare','compareAttribute'=>'new_password','on'=>'changePwd'],

            [['user_name'], 'required', 'on' => 'update'],
            ['user_password', 'safe' , 'on' => 'update'],

            [['user_name', 'item_name' ], 'required' , 'on' => 'create'],
            ['user_name', 'findUsername', 'on' => 'create'],
            ['item_name', 'checkItemName', 'on' => 'create'],
        ];
    }

    public function scenarios()
    {
        return ArrayHelper::merge(parent::scenarios(),[
            //登录
            'login' => ['user_name', 'user_password', 'captcha'],
            //修改密码
            'changePwd' => ['old_password', 'new_password', 'repeat_password'],
            //更新用户
            'update' => ['user_name', 'user_password'],
            //创建用户
            'create' => ['user_name', 'user_password', 'item_name', 'user_mobile'],
        ]);
    }


    public function attributeLabels()
    {
        return [
            'user_name'  =>  '登录名',
            'user_password'  =>  '密码',
            'captcha' => '验证码',

            'old_password' =>  \Yii::t('app','old_password'),
            'new_password' =>  \Yii::t('app','new_password'),
            'repeat_password' => \Yii::t('app','repeat_password'),

        ];
    }

    /**
     * 设置事件 1>更新时间戳字段
     *
     * @return array
     */
    public function behaviors()
    {
        return [
          [
              'class' => TimestampBehavior::className(),
          ]
        ];
    }

    /**
     * 添加数据前,1>设置auth_key 2>加密密码
     *
     * @param bool $insert
     * @return bool
     */
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            if ($this->isNewRecord) {
                $this->auth_key = \yii::$app->getSecurity()->generateRandomString();
                $this->user_password = $this->_md5_password($this->user_password, $this->auth_key);
            } else {
                if ($this->user_password != $this->getOldAttribute('user_password')) {

                    if ( strlen($this->user_password) && strlen($this->auth_key)) {
                        $this->user_password = $this->_md5_password($this->user_password, $this->auth_key);
                    } else if ($this->user_password == "") {
                        $this->user_password = $this->getOldAttribute('user_password');
                    }
                }
            }

            return true;
        }
        return false;

    }


    /****** IdentityInterface function begin **********/
    /**
     * Finds an identity by the given ID.
     * @param string|integer $id the ID to be looked for
     * @return IdentityInterface the identity object that matches the given ID.
     * Null should be returned if such an identity cannot be found
     * or the identity is not in an active state (disabled, deleted, etc.)
     */
    public static function findIdentity($id)
    {
        // TODO: Implement findIdentity() method.

        return static::findOne($id);

    }

    /**
     * Finds an identity by the given token.
     * @param mixed $token the token to be looked for
     * @param mixed $type the type of the token. The value of this parameter depends on the implementation.
     * For example, [[\yii\filters\auth\HttpBearerAuth]] will set this parameter to be `yii\filters\auth\HttpBearerAuth`.
     * @return IdentityInterface the identity object that matches the given token.
     * Null should be returned if such an identity cannot be found
     * or the identity is not in an active state (disabled, deleted, etc.)
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        // TODO: Implement findIdentityByAccessToken() method.
        return static::findOne(['access_token' => $token]);
    }

    /**
     * Returns an ID that can uniquely identify a user identity.
     * @return string|integer an ID that uniquely identifies a user identity.
     */
    public function getId()
    {
        // TODO: Implement getId() method.
        return $this->user_id;
    }

    /**
     * Returns a key that can be used to check the validity of a given identity ID.
     *
     * The key should be unique for each individual user, and should be persistent
     * so that it can be used to check the validity of the user identity.
     *
     * The space of such keys should be big enough to defeat potential identity attacks.
     *
     * This is required if [[User::enableAutoLogin]] is enabled.
     * @return string a key that is used to check the validity of a given identity ID.
     * @see validateAuthKey()
     */
    public function getAuthKey()
    {
        // TODO: Implement getAuthKey() method.
        return $this->auth_key;
    }

    /**
     * Validates the given auth key.
     *
     * This is required if [[User::enableAutoLogin]] is enabled.
     * @param string $authKey the given auth key
     * @return boolean whether the given auth key is valid.
     * @see getAuthKey()
     */
    public function validateAuthKey($authKey)
    {
        // TODO: Implement validateAuthKey() method.
        return $this->getAuthKey() === $authKey;
    }
    /****** IdentityInterface function end  **********/



    /**
     * 通过用户名搜索用户
     *
     * @param $user_name
     * @return null|static
     */
    public static function findByUsername($user_name)
    {
        return static::findOne(['user_name'=>$user_name]);
    }

    /**
     * 验证密码
     *
     * @param $password
     * @return bool
     */
    public function validatePassword($password)
    {

        return $this->getAttribute('user_password') === $this->_md5_password($password, $this->getAttribute('auth_key'));
    }


    /**
     * 用户密码加密
     *
     * @param $password
     * @param $auth_key
     * @return string
     */
    protected function _md5_password($password,$auth_key)
    {
        return md5(md5($password).$auth_key);
    }

    /**
     * 表单登录
     *
     * @param $params
     * @return bool
     */
    public function login($params)
    {
        $this->setScenario('login');
        if(is_array($params) && !key_exists( self::formName(), $params))
            $params = [self::formName()=>$params];

        if ($this->load($params) && $this->validate()) {

            $user = $this->findByUsername($this->user_name);
            if ($user !== null) {

                if($user->status == \app\modules\frontadmin\models\user\User::C_STATUS_DELETED){
                    $this->message = "管理员不存在或者已经被删除";
                }else{

                    if ($user->validatePassword($this->user_password)) {
                        $user->trigger(self::EVENT_AFTER_LOGIN);
                        if(\Yii::$app->user->can(self::C_ADMIN_ROLE_NAME))
                            return true;
                        else{
                            $this->addErrors(['message'=>'您不是管理员!']);
                            $this->message = "您不是管理员不能登录后台!";
                            \Yii::$app->user->logout();
                            return false;
                        }
                    } else {
                        $this->addError('user_password', '用户或密码错误!');
                    }
                }
            } else {
                $this->addError('user_name','用户名密码不正确!');
            }
        }

        return $this;
    }

    /**
     * 登录后处理 1.记录session
     *
     * @param $event
     */
    public function afterLogin($event)
    {
        $user =  $event->sender;

        $identity = $this->findIdentity($user->getAttribute('user_id'));
        \Yii::$app->user->login($identity);

    }

    /**
     * 用户登出 1>删除用户session
     *
     * @return bool
     */
    public function logout()
    {

        \Yii::$app->user->logout();

    }


    /**
     * 验证密码是否正确(在rules规则定义中调用)
     *
     * @param $attribute
     * @param $params
     */
    public function findPassword($attribute, $params)
    {
        $user = \Yii::$app->user->getIdentity();
        if ($user['user_password'] != $this->_md5_password($this->old_password, $user['auth_key'])) {
            $this->addError($attribute, '旧密码错误!');
        }
    }


    public function findUsername($attribute, $params)
    {
        $data = User::findOne(['user_name'=>$this->user_name]);
        if ($data && $this->item_name != \app\modules\frontadmin\models\user\User::C_ROLE_CHECK_ADMIN) {
            $this->addError($attribute, '用户名已经存在!');
        }
    }

    public function checkItemName($attribute, $params)
    {

        $itemName = $this->$attribute;

        $auth = \Yii::$app->authManager;
        $items = $auth->getChildren(\app\modules\frontadmin\models\user\User::C_ROLE_SUPPER_ADMIN);
        $itemsArr = ArrayHelper::getColumn($items,'name');
        if (!is_array($items) || !count($items) || !in_array($itemName, $itemsArr)) {
            $this->addError($attribute, '请选择正确的管理员类型!');
        }
    }


    /**
     * 修改并保存登录用户新密码
     *
     * @param $params
     * @return bool
     */
    public function savePassword($params)
    {

        $model = $this->findOne(['user_id'=>\Yii::$app->user->user_id]);

        if ($params && $params[$this->formName()] && count($params[$this->formName()])) {

            $model->scenario = 'changePwd';
            if ($model->load($params) && $model->validate()) {

                $model->user_password = $model->new_password;
                $model->save();
            }
        }
        return $model;
    }


    /**
     * 更新一个用户的信息
     *
     * @param $id
     * @param $params
     * @return bool
     */
    public function updateOne($id, $params)
    {

        $model = User::findOne($id);
        $model->scenario = 'update';

        if ($model->load($params) && $model->validate()) {

            return $model->save();
        }
        return false;
    }


    /**
     * 删除一个用户
     *
     * @param $id
     * @return bool
     * @throws \Exception
     */
    public function deleteOne($id)
    {
        if (is_numeric($id) && $this->findOne($id)->delete()) {
            return true;
        } else {
            $this->addError(static::DELETE_EFFOR_INFO, '删除失败,参数有误!');
            return false;
        }
    }


    /**
     * 添加一个用户
     *
     * @param $data
     * @return bool
     */
    public function create($data)
    {
        //1.判断是否是超级管理员,不是则提交"对不起，您没有本栏目的操作权限"
        //2.新添加的管理员默认密码为000000,如果添加的是审核管理员,需要判断前台账户是否存在，且密码为原来的密码
        $this->scenario = 'create';
        if(is_array($data) && !key_exists(self::formName(), $data))
            $data = [self::formName()=> $data];
        if(!$this->_beforeCreate($data)){
            return false;
        }else {
            if ($this->load($data) && $this->validate()) {

                if(is_null($this->user_mobile) || strlen($this->user_mobile)==0){
                    $this->addError("user_mobile","手机号不能为空!");
                    return false;
                }
                return $this->_create();
            } else {
                return false;
            }
        }
    }

    private function _create(){

        $rs = false;
        if($this->item_name == \app\modules\frontadmin\models\user\User::C_ROLE_CHECK_ADMIN){
            //添加审核管理员
            $exit = self::find()->where([
                'and',
                ['user_name'=>$this->user_name],
                ['user_mobile'=>$this->user_mobile]
            ])->exists();
            if(!$exit){
                $this->message = "用户不存在,不能添加为".\app\modules\frontadmin\models\user\User::C_ROLE_CHECK_ADMIN;
            }else{
                $user = self::find()->where([
                    'and',
                    ['user_name'=>$this->user_name],
                    ['user_mobile'=>$this->user_mobile]
                ])->one();
                $auth = \Yii::$app->authManager;
                $role = $auth->getRole(\app\modules\frontadmin\models\user\User::C_ROLE_CHECK_ADMIN);
                if(is_null($role))
                    $this->message = "角色不存在!";
                else{
                    Auth_assignment::deleteAll(['user_id'=>$user->user_id]);
                    $rs = $auth->assign($role, $user->user_id) ? true : false;
                }
            }
        }else{
            $rs = $this->save();
        }
        return $rs;
    }

    public function afterSave($insert, $changedAttributes)
    {
        parent::afterSave($insert, $changedAttributes); // TODO: Change the autogenerated stub
        if($insert){
            $auth = \Yii::$app->authManager;
            $role = $auth->getRole($this->item_name);
            $auth->assign($role, $this->user_id);
        }
    }

    private function _beforeCreate($data){

        $result = false;
        $action = \app\modules\frontadmin\models\user\User::C_ROLE_SUPPER_ADMIN;
        if(! \Yii::$app->user->can($action)){
            $this->message = "对不起，您不是超级管理员,没有本栏目的操作权限!";
        } else {
            $result = true;
        }
        return $result;
    }

    public function  captcha()
    {

        $captcha = $this->captcha;
        $captchValidator = new CaptchaValidator();
        $captchValidator->captchaAction = '/admin/public/captcha';

        if (!$captchValidator->validate($captcha)) {
            $this->addError('captcha', '验证码错误!');
        }
    }

    //删除管理员
    public function remove($userId){

        $rs = false;
        $user = self::findOne(['user_id'=>$userId]);
        if(!is_null($user)){
            $user->status = \app\modules\frontadmin\models\user\User::C_STATUS_DELETED;
            if($rs = $user->save()){
                $rs = true;
            } else{
                $this->message = "删除失败!";
            }
        } else{
            $this->message = "用户不存在!";
        }
        return $rs;
    }


    //改变用户角色
    public function changeRole($userId, $roleName){

        $auth = \Yii::$app->authManager;
        $roles = $auth->getRolesByUser($userId);
        $result = false;

        $rolesArray = [];
        if(!is_null($roles) && is_array($roles) && count($roles)){
            $rolesArray = ArrayHelper::getColumn($roles,'name');
        }
        if(!\Yii::$app->user->can(\app\modules\frontadmin\models\user\User::C_ROLE_SUPPER_ADMIN) && count($rolesArray) && in_array(\app\modules\frontadmin\models\user\User::C_ROLE_SUPPER_ADMIN, $rolesArray)){
            $this->message = "您没有改变超级管理员角色的权限!";
        } else if(count($rolesArray) && in_array($roleName, $rolesArray)){
            $this->message = "角色没有改变，变更失败!";
        } else {

            Auth_assignment::deleteAll(['user_id'=>$userId]);
            $role = $auth->getRole($roleName);
            if(is_null($role)){
                $this->message = "角色不存在或已经被删除!";
            } else {
                $auth->assign($role, $userId);
                $result = true;
            }
        }
        return $result;
    }
}