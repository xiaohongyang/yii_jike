<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/22
 * Time: 13:20
 */

namespace app\modules\frontadmin\models;


use app\modules\common\traits\AdminInfoTraite;
use app\modules\common\traits\TransactionTrait;
use app\modules\frontadmin\service\BaseService;
use yii\db\ActiveRecord;
use yii\debug\models\search\Base;

class BaseActiveRecord extends \app\modules\jike\models\BaseActiveRecord
{

    private static $_baseService = null;


    public static function getLoingUserId(){

        if(is_null(self::$_baseService))
            self::$_baseService = new BaseService();
        return self::$_baseService->getLoginUserId();
    }

    public static function getLoingUserName(){

        if(is_null(self::$_baseService))
            self::$_baseService = new BaseService();
        return self::$_baseService->getLoginUserName();
    }



//    public function create();
//
//    public function edit(){}
//
//    public function remove(){}


    #region 事务

    use TransactionTrait;
    use AdminInfoTraite;

    /*private $transaction = null;
    public function beginTransaction(){
        $this->transaction = \Yii::$app->getDb()->beginTransaction();
    }
    public function commit(){
        if(!is_null($this->transaction))
            $this->transaction->commit();
    }
    public function rollback(){
        if(!is_null($this->transaction))
            $this->transaction->rollBack();
    }*/
    #endregion


    /**
     * 将错误信息转换为字符串
     * @return string
     */
    public function getFirstErrors2String(){
        if(is_array($this->getFirstErrors()) && count($this->getFirstErrors()))
            return implode(' ', $this->getFirstErrors());
        else
            return '';
    }

}