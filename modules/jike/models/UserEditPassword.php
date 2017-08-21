<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/1
 * Time: 6:32
 */

namespace app\modules\jike\models;


class UserEditPassword extends User
{

    const SCENARIO_EDIT_PASSWORD = 'edit_password';

    public $password;
    public $repeat_password;
    public $old_password;

    public static function tableName()
    {
        $model = new User();
        return $model::tableName();
    }


    public function rules()
    {
        return [
            [
                ['password','repeat_password', 'old_password'], 'required'
            ],
            [
                'repeat_password', 'compare', 'compareAttribute' => 'password', 'on'=> $this::SCENARIO_EDIT_PASSWORD, 'message'=>'密码不一致'
            ]
        ];
    }

    public function attributeLabels()
    {

//        public $password;
//        public $repeat_password;
//        public $old_password;

        return [
            'password' => '新密码',
            'old_password' => '旧密码',
            'repeat_password' => '重复密码'
        ];
    }


    public function scenarios()
    {
        return [
            $this::SCENARIO_EDIT_PASSWORD =>[
                'password','repeat_password', 'old_password'
            ]
        ];
    }

    public function editPassword($data){

        $this->scenario = $this::SCENARIO_EDIT_PASSWORD;
        if(!key_exists($this::formName(),$data))
            $data == [$this::formName() => $data];

        if($this->load($data) && $this->validate()){

            $this->setAttribute('user_password', $this->password);
            $oldPassword = $this->_md5_password($this->old_password, $this->auth_key);
            if($oldPassword != $this->getOldAttribute('user_password')){
                $this->addError('old_password', '旧密码不正确!');
                return false;
            }
            return $this->save();
        }else{
            return false;
        }
    }

}