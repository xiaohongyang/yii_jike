<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/18
 * Time: 9:32
 */

namespace app\modules\frontadmin\service;


use app\modules\frontadmin\models\user_account\User_account_log;

class User_account_logService extends BaseService
{
    private $model = null;

    public function __construct()
    {
        $this->model = new User_account_log();
    }

    public function create($data, $action){
        return $this->getModel()->create($data, $action);
    }

    public function getModel(){
        return $this->model;
    }

}