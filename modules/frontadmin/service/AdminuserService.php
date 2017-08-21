<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/5
 * Time: 22:03
 */

namespace app\modules\frontadmin\service;


use app\modules\admin\models\Auth_assignment;
use app\modules\common\traits\PageTrait;
use app\modules\frontadmin\models\auth_item_child\Auth_item_child;
use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\user\User;
use yii\data\Pagination;
use yii\helpers\ArrayHelper;

class AdminuserService extends BaseActiveRecord {

    use PageTrait;

    public function getList(){

        $query = User::find();

        $query->select('jike_user.*, jike_auth_assignment.item_name as item_name');
        $query->leftJoin('jike_auth_assignment','`jike_auth_assignment`.`user_id` = `jike_user`.`user_id`');
        $query->where([
            'in',
            'jike_user.user_id',
            $this->getAdminIdsQuery()
        ]);
        $query->andWhere([
            '<>',
            'jike_user.status',
            User::C_STATUS_DELETED
        ]);

        $userName = \Yii::$app->request->get('user_name');
        $itemName = \Yii::$app->request->get('item_name');
        if(!is_null($userName) && $userName!= '')
            $query->andWhere([
              'like','jike_user.user_name', $userName
            ]);
        if(!is_null($itemName) && strlen($itemName) > 1)
            $query->andWhere([
                'jike_auth_assignment.item_name' => $itemName
            ]);


        $countQuery = clone $query;
        $pagination = new Pagination([
           'totalCount' => $countQuery->count()
        ]);
        $this->setPages($pagination);
        $models = $query->offset($pagination->offset)
            ->limit($pagination->limit)
            ->asArray()->all();
        return $models;
    }


    public function create($data){

        /*$userName = $data['user_name'];
        $userMobile = $data['user_mobile'];
        $itemName = $data['item_name'];*/
        $user = new \app\modules\admin\models\User();
        $rs = $user->create($data);
        $this->message = $user->message
            ? : (is_array($user->getFirstErrors()) && count($user->getFirstErrors()) ? implode('|', $user->getFirstErrors()) : '');

        return $rs;
    }


    //会员总数
    public function getUserTotalNumber(){

        $query = User::find();
        $query->where([
            'and',
            ['status' => User::C_STATUS_ENABLE],
            ['not in','user_id', $this->getAdminIdsQuery()]
        ]);
        return $query->count();
    }

    //今日注册会员数
    public function getTodayRegistNumber(){

        $query = User::find();
        $query->where([
            'and',
            [
                '>=','created_at',strtotime(date('Y-m-d',strtotime('0 day')))
            ],
            ['status' => User::C_STATUS_ENABLE],
            ['not in','user_id', $this->getAdminIdsQuery()]
        ]);
        $todayTotal = $query->count();
        return $todayTotal;
    }

    //获取所有管理员user_id Query条件
    public function getAdminIdsQuery(){
        $query = Auth_assignment::find();
        $query->select('user_id');

        $itemNameSubQuery = Auth_item_child::find()
            ->select('parent')
            ->where([
                'or',
                ['child'=>'管理员'],
                ['parent'=>'超级管理员']
            ]);
        $query->where([
            'in',
            'item_name',
            $itemNameSubQuery
        ]);
        return $query;
    }

    //删除管理员
    public function remove($userId){

        $adminUser = new \app\modules\admin\models\User();
        $rs = $adminUser->remove($userId);
        !$rs && $this->message = $adminUser->message;
        return $rs;
    }

    //修改管理员角色
    public function changeRole($userId, $roleName){

        $adminModel = new \app\modules\admin\models\User();
        $rs = $adminModel->changeRole($userId, $roleName);
        !$rs && $this->message = $adminModel->message;
        return $rs;
    }

}