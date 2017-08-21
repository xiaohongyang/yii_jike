<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/7
 * Time: 21:52
 */

namespace app\modules\frontadmin\models\user_ad_video;

use app\modules\frontadmin\models\User_ad_video;

class User_ad_video_list extends User_ad_video
{

    public $accountAdd;
    public $advertiserState;
    public $edit;
    public $del;
    public $down;



    public static function tableName()
    {
        $model = new User_ad_video();
        return $model->tableName();
    }

    public function attributeLabels()
    {
        return [
            'ad_id' => '广告标题',
            'ad_title' => '广告名称',
            'created_at' => '创建时间',
            'updated_at' => '更新时间',
            'link' => '广告外链地址',
            'account.money' => '广告账户余额',
            'accountAdd' => '广告账户充值',
            'advertiserState' => '广告营销状态',
            'edit' => '信息修改',
            'del' => '删除',
            'down' => '营销记录'

        ];
    }




}