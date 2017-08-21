<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 12:37
 */

namespace app\modules\common\traits;


trait TransactionTrait
{

    #region 事务
    private $transaction = null;
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
    }
    #endregion

}