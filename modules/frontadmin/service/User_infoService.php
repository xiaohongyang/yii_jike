<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/26
 * Time: 6:04
 */

namespace app\modules\frontadmin\service;


use app\modules\frontadmin\models\user\User_info;

class User_infoService extends BaseService
{

    protected $model = null;

    public function __construct()
    {
        $this->model = User_info::findOne(['user_id'=> $this->getLoginUserId()]);
        if(!is_null($this->model))
            $this->model->user_name = $this->model->user->user_name;
    }

    public function edit($data){

        $rs = $this->model->edit($data);
        !$rs && $this->message = $this->model->message;
        return $rs;
    }

    public function getModel(){

        return $this->model;
    }
    public function setModel($model){
        $this->model = $model;
    }

}