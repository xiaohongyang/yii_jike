<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/2/18
 * Time: 21:35
 */

namespace app\modules\adminshop\models;


use yii\helpers\ArrayHelper;

class UsersCreate extends Users
{

    const SCENARIO_CREATE = 'create';


    public $repeat_password;

    public $post;

    public static function tableName()
    {
        $users = new Users();
        return $users->tableName();
    }

    public function rules(){
        return [
            ['user_name','required','on'=>self::SCENARIO_CREATE],
            ['email','email','on'=>self::SCENARIO_CREATE],
            ['password','compare','compareAttribute'=>'repeat_password','on'=>self::SCENARIO_CREATE,'message'=>'密码不一致'],
            ['repeat_password','compare','compareAttribute'=>'password','on'=>self::SCENARIO_CREATE,'message'=>'密码不一致']
        ];
    }

    public function create(){
        p($this->post);
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_DEFAULT => [
                ... //字段列表
                'post' //不是数据表中的字段
            ]
        ];
    }

    public function attributeLabels()
    {
        return ArrayHelper::merge(parent::attributeLabels(),[
            'repeat_password' => '确认密码'
        ]);
    }




}