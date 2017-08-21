<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/20
 * Time: 22:32
 */

namespace app\modules\admin\service;



use app\modules\common\traits\PageTrait;
use app\modules\frontadmin\models\auth_assignment\Auth_assignment;
use app\modules\frontadmin\models\auth_item_child\Auth_item_child;
use app\modules\frontadmin\models\user\User;
use yii\data\Pagination;

class CustomService extends BaseService
{


    /**
     * 客户信息列表
     */
    public function getList(){

        $supperUser = User::C_ROLE_SUPPER_ADMIN;
        $adminChildRoles = Auth_item_child::find()->where([
            'and',
            ['parent'=>$supperUser],
            ['<>','child',User::C_ROLE_CHECK_ADMIN]
        ])->select('child');

        $adminUserId = Auth_assignment::find()->where([
            'or',
            [
                'in',
                'item_name',
                $adminChildRoles
            ],
            [
                '=',
                'item_name',
                $supperUser
            ]
        ])->select('user_id');

        $query = User::find();
        $query->from('jike_user user');
        $query->where(['status'=>User::C_STATUS_ENABLE]);
        $query->andWhere([
            'not in',
            'user.user_id',
            $adminUserId
        ]);


        $query->leftJoin('jike_user_address address',' user.user_id = address.user_id ');


        $userName = \Yii::$app->request->get('user_name');
        $province = \Yii::$app->request->get('province');
        $city = \Yii::$app->request->get('city');
        $money = \Yii::$app->request->get('money');
        if(!is_null($userName) && strlen($userName)>0)
            $query->andWhere(['like','user_name', $userName]);
        if(!is_null($province) && is_numeric($province) && $province>0){
            $query->andWhere(['=','address.province', $province]);
        }
        if(!is_null($city) && is_numeric($city) && $city>0){
            $query->andWhere(['=','address.city', $city]);
        }

        $query->select(' user.*, SUM(log.markting_account) as markting_account');
        $query->leftJoin('jike_user_account_log log','user.user_id = log.user_id');
        $query->groupBy('user.user_id');
        if(!is_null($money) && $money>0){
            $query->having(['>','markting_account',$money]);
        }

        $countQuery = clone $query;
        $pagination = new Pagination([
            'totalCount' => $countQuery->count(),
            'pageSize' => 5
        ]);

        $models = $query->offset($pagination->offset)
                        ->limit($pagination->limit)
                        ->all();
        $this->setPages($pagination);

        return $models;
    }

}