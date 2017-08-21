<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/21
 * Time: 20:46
 */

namespace app\modules\jike\models;


use yii\db\ActiveRecord;

class BaseActiveRecord extends ActiveRecord
{

    const SCENARIO_CREATE = 'create' ;
    const SCENARIO_EDIT = 'edit' ;
    const SCENARIO_UPDATE = 'update' ;
    const SCENARIO_REMOVE = 'remove' ;

    public $message;
    public $errorCode;


    public function getLastInsertId(){
        return \Yii::$app->getDb()->lastInsertID;
    }

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