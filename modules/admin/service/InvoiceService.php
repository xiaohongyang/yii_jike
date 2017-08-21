<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/23
 * Time: 8:24
 */

namespace app\modules\admin\service;



use app\modules\frontadmin\models\auth_assignment\Auth_assignment;
use app\modules\frontadmin\models\auth_item_child\Auth_item_child;
use app\modules\frontadmin\models\user\User;
use app\modules\frontadmin\models\user_mar_account_flow_invoice\User_mar_account_flow_invoice;
use yii\data\Pagination;

class InvoiceService extends BaseService
{

    public $model;
    public function __construct(User_mar_account_flow_invoice $model=null)
    {
        $this->model = $model;
    }

    public function getList(){
        {

            $status = \Yii::$app->request->get('status');

            $query = User_mar_account_flow_invoice::find();
            $query->from('jike_user_mar_account_flow_invoice invoice');


            if(is_null($status) || $status!=1){
                $query->where(['invoice.invoice_sn' => '']);
            } else {
                $query->where(['<>', 'invoice.invoice_sn', '']);
            }
            $query->leftJoin('jike_user_mar_account_flow flow', 'invoice.flow_id = flow.id');
            $query->leftJoin('jike_user user', 'user.user_id = flow.user_id');
            $query->select('invoice.*, flow.created_at');

            $title = \Yii::$app->request->get('title');
            $userName = \Yii::$app->request->get('user_name');
            if(!is_null($title) && strlen($title)>0)
                $query->andWhere(['like','invoice.title',$title]);
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

    public function setInvoiceSn(){

        $result = false;

        $request =\Yii::$app->request;
        $invoiceId = $request->post('invoice_id');
        $invoiceSn = $request->post('invoice_sn');

        $this->model = User_mar_account_flow_invoice::findOne(['invoice_id'=>$invoiceId]);
        if(is_null($this->model)){
            $this->message = "数据不存在!";
        } else {
            $this->model->invoice_sn = $invoiceSn;
            $rs = $this->model->save();
            !$rs && $this->message = $this->model->getFirstErrors2String();
        }
        return $rs;
    }

}