<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/2/22
 * Time: 21:08
 */

namespace app\modules\jike\models;


use app\modules\common\models\uploadform\AbstractUpload;
use app\modules\common\models\uploadform\Uploadform;
use app\modules\frontadmin\models\user\User_info;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use yii\web\IdentityInterface;

class User extends \app\modules\jike\models\BaseActiveRecord implements IdentityInterface
{

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
    }

    public function formName()
    {
        return \Yii::$app->getDb()->tablePrefix.'user';
    }

    /**
     * column attributeLabels
     * @return array
     */
    public function attributeLabels()
    {
        return ArrayHelper::merge(
            parent::attributeLabels(),
            [
                'user_name' => '用户名称',
                'user_mobile' => '已注册手机号',
                'mobile_check_code' => '手机验证',
                'captcha' => '验证码',
                'user_password' => '登录密码',
                'repeat_password' => '重复密码',

            ]
        );
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
        return static ::findOne($id);
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

        }
        return parent::beforeSave($insert); // TODO: Change the autogenerated stub
    }

    /**
     * 设置事件 1>更新时间戳字段
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
     * @param $ec_salt
     * @return string
     */
    protected function _md5_password($password,$auth_key)
    {
        return md5(md5($password).$auth_key);
    }

    /**
     * 通过用户名搜索用户
     *
     * @param $user_name
     * @return null|static
     */
    public static function findByuser_name($user_name)
    {
        return static::findOne(['user_name'=>$user_name]);
    }

    public function getHeadPicModel(){
        return Uploadform::getItem(AbstractUpload::TABLE_NAME_USER_INFO, AbstractUpload::COLUMN_NAME_UI_HEAD_PIC, $this->getId());
    }

    public function getHeadPic(){
        $userInfoModel = $this->userInfoModel;
        $headPicModel = $userInfoModel->headPicModel;
        $loadSrc= is_null($headPicModel) ? '/images/default-headpic.png': '/'.$headPicModel->file_dir .'/'. $headPicModel->getAttribute('file_name');
        return $loadSrc;
    }

    public function getUserInfoModel(){
        return $this->hasOne(User_info::className(), ['user_id'=>'user_id']);
    }


}