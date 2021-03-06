<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/1/19
 * Time: 5:37
 */

namespace app\modules\adminshop\models;


use yii\data\ActiveDataProvider;
use yii\data\Pagination;
use yii\db\ActiveRecord;
use yii\helpers\ArrayHelper;

class Users extends BaseActiveRecord{


    //    user_id mediumint 会员资料自增id
    //    email varchar 会员邮箱
    //    user_name varchar 用户名
    //    password varchar 用户密码
    //    question varchar 安全问题答案
    //    answer varchar 安全问题
    //    sex tinyint 性别，0，保密；1，男；2，女
    //    birthday date 生日日期
    //    user_money decimal 用户现有资金
    //    frozen_money decimal 用户冻结资金
    //    pay_points int 消费积分
    //    rank_points int 会员等级积分
    //    address_id mediumint 收货信息id，取值表 ecs_user_address
    //    reg_time int 注册时间
    //    last_login int 最后一次登录时间
    //    last_time datetime 应该是最后一次修改信息时间，该表信息从其他表同步过来考虑
    //    last_ip varchar 最后一次登录ip
    //    visit_count smallint 登录次数
    //    user_rank tinyint 会员登记id，取值ecs_user_rank
    //    is_special tinyint
    //    salt varchar
    //    parent_id mediumint 推荐人会员id，
    //    flag tinyint
    //    alias varchar 昵称
    //    msn varchar msn
    //    qq varchar qq号
    //    office_phone varchar 办公电话
    //    home_phone varchar 家庭电话
    //    mobile_phone varchar 手机
    //    is_validated tinyint
    //    credit_line decimal 信用额度，目前2.6.0版好像没有作实现

    public function GetList($params=[]){

        $query = Users::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' =>  $params['page_size']>0 ? $params['page_size'] : 2
            ]
        ]);

        if(!$this->load($params) && $this->validate()){

            return $dataProvider;
        }

        return $dataProvider;
    }

    public function fields(){
        return [
            'user_id' ,
            'user_name',
            'email',
            'is_validated',
            'user_money',
            'frozen_money',
            'rank_points',
            'pay_points',
            'reg_time'
        ];
    }

    public function attributeLabels()
    {
        $labels = parent::attributeLabels(); // TODO: Change the autogenerated stub

        return ArrayHelper::merge($labels,[


            //    user_id mediumint 会员资料自增id
            //    email varchar 会员邮箱
            //    user_name varchar 用户名
            //    password varchar 用户密码
            //    question varchar 安全问题答案
            //    answer varchar 安全问题
            //    sex tinyint 性别，0，保密；1，男；2，女
            //    birthday date 生日日期
            //    user_money decimal 用户现有资金
            //    frozen_money decimal 用户冻结资金
            //    pay_points int 消费积分
            //    rank_points int 会员等级积分
            //    address_id mediumint 收货信息id，取值表 ecs_user_address
            //    reg_time int 注册时间
            //    last_login int 最后一次登录时间
            //    last_time datetime 应该是最后一次修改信息时间，该表信息从其他表同步过来考虑
            //    last_ip varchar 最后一次登录ip
            //    visit_count smallint 登录次数
            //    user_rank tinyint 会员登记id，取值ecs_user_rank
            //    is_special tinyint
            //    salt varchar
            //    parent_id mediumint 推荐人会员id，
            //    flag tinyint
            //    alias varchar 昵称
            //    msn varchar msn
            //    qq varchar qq号
            //    office_phone varchar 办公电话
            //    home_phone varchar 家庭电话
            //    mobile_phone varchar 手机
            //    is_validated tinyint
            //    credit_line decimal 信用额度，目前2.6.0版好像没有作实现

            'user_id' => \Yii::$app->params['lang']['user_id'] , //  mediumint 会员资料自增id
            'email' => \Yii::$app->params['lang']['email'] , //  varchar 会员邮箱
            'user_name' => \Yii::$app->params['lang']['user_name'] , //  varchar 用户名
            'password' => \Yii::$app->params['lang']['password'] , //  varchar 用户密码
            'question' => \Yii::$app->params['lang']['question'] , //  varchar 安全问题答案
            'answer' => \Yii::$app->params['lang']['answer'] , //  varchar 安全问题
            'sex' => \Yii::$app->params['lang']['sex'] , //  tinyint 性别，0，保密；1，男；2，女
            'birthday' => \Yii::$app->params['lang']['birthday'] , //  date 生日日期
            'user_money' => \Yii::$app->params['lang']['user_money'] , //  decimal 用户现有资金
            'frozen_money' => \Yii::$app->params['lang']['frozen_money'] , //  decimal 用户冻结资金
            'pay_points' => \Yii::$app->params['lang']['pay_points'] , //  int 消费积分
            'rank_points' => \Yii::$app->params['lang']['rank_points'] , //  int 会员等级积分
            'address_id' => \Yii::$app->params['lang']['address_id'] , //  mediumint 收货信息id，取值表 ecs_user_address
            'reg_time' => \Yii::$app->params['lang']['reg_time'] , //  int 注册时间
            'last_login' => \Yii::$app->params['lang']['last_login'] , //  int 最后一次登录时间
            'last_time' => \Yii::$app->params['lang']['last_time'] , //  datetime 应该是最后一次修改信息时间，该表信息从其他表同步过来考虑
            'last_ip' => \Yii::$app->params['lang']['last_ip'] , //  varchar 最后一次登录ip
            'visit_count' => \Yii::$app->params['lang']['visit_count'] , //  smallint 登录次数
            'user_rank' => \Yii::$app->params['lang']['user_rank'] , //  tinyint 会员登记id，取值ecs_user_rank
            'is_special' => \Yii::$app->params['lang']['is_special'] , //  tinyint
            'salt' => \Yii::$app->params['lang']['salt'] , //  varchar
            'parent_id' => \Yii::$app->params['lang']['parent_id'] , //  mediumint 推荐人会员id，
            'flag' => \Yii::$app->params['lang']['flag'] , //  tinyint
            'alias' => \Yii::$app->params['lang']['alias'] , //  varchar 昵称
            'msn' => \Yii::$app->params['lang']['msn'] , //  varchar msn
            'qq' => \Yii::$app->params['lang']['qq'] , //  varchar qq号
            'office_phone' => \Yii::$app->params['lang']['office_phone'] , //  varchar 办公电话
            'home_phone' => \Yii::$app->params['lang']['home_phone'] , //  varchar 家庭电话
            'mobile_phone' => \Yii::$app->params['lang']['mobile_phone'] , //  varchar 手机
            'is_validated' => \Yii::$app->params['lang']['is_validated'] , //  tinyint
            'credit_line' => \Yii::$app->params['lang']['credit_line'] , //  decimal 信用额度，目前2.6.0版好像没有作实现



        ]);
    }


}