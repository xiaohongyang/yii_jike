<?php
/**
 * 保证金管理
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/23
 * Time: 8:24
 */

namespace app\modules\admin\service;



use app\modules\frontadmin\models\auth_assignment\Auth_assignment;
use app\modules\frontadmin\models\auth_item_child\Auth_item_child;
use app\modules\frontadmin\models\user\User;
use app\modules\frontadmin\models\user_fro_account_flow\User_fro_account_flow;
use app\modules\frontadmin\models\user_int_account_flow\User_int_account_flow;
use app\modules\frontadmin\models\user_int_account_flow_cashuser\User_int_account_flow_cashuser;
use app\modules\frontadmin\models\user_mar_account_flow_invoice\User_mar_account_flow_invoice;
use yii\data\Pagination;

class FrozenService extends BaseService
{

    public $model;
    public function __construct(User_fro_account_flow $model=null)
    {
        $this->model = $model;
    }

    public function getList(){
        {

            $status = \Yii::$app->request->get('status');

            $query = User_fro_account_flow::find();
            $query->from('jike_user_fro_account_flow flow');

            if(is_null($status) || $status!=1){
                $query->where(['flow.is_paid' => User_fro_account_flow::IS_PAYED_FALSE]);
            } else {
                $query->where(['flow.is_paid' => User_fro_account_flow::IS_PAYED_TRUE]);
            }
            $query->leftJoin('jike_user_fro_account_flow_cashuser cashuser', 'flow.id = cashuser.flow_id');
            $query->leftJoin('jike_user user', 'user.user_id = flow.user_id');
            $query->select('flow.*, cashuser.account, cashuser.user');

            $createdAt = \Yii::$app->request->get('created_at');
            $userName = \Yii::$app->request->get('user_name');

            $createdAt = strtotime($createdAt);
            if(!is_null($createdAt) && $createdAt>0){
                $query->andWhere([
                    'and',
                    [
                        '>=', 'flow.created_at', $createdAt
                    ],
                    [
                        '<', 'flow.created_at', $createdAt + 3600*24
                    ]
                ]);
            }
            if(!is_null($userName) && strlen($userName))
                $query->andWhere(['like', 'user.user_name', $userName]);

            $countQuery = clone $query;
            $pagination = new Pagination([
                'totalCount' => $countQuery->count(),
                'pageSize' => 5
            ]);

            $models = $query->offset($pagination->offset)
                ->limit($pagination->limit)
                ->orderBy(' flow.created_at desc ')
                ->all();
            $this->setPages($pagination);

            return $models;
        }
    }



}