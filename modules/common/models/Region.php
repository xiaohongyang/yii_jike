<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/4/20
 * Time: 6:15
 */

namespace app\modules\common\models;


use app\modules\frontadmin\models\BaseActiveRecord;
use yii\db\ActiveRecord;

class Region extends BaseActiveRecord
{

    public function getName($id){

        $result = "";
        if(is_null($id) || !is_numeric($id)){
            $this->message = "id错误";
        } else {

            $data = self::find()->where(['ID'=>$id])->select('RegionName')->one();
            if(!is_null($data))
                $result = $data->RegionName;
        }

        return $result;
    }


    public function getParent(){
        return $this->findOne(['ID'=>$this->ParentId]);
    }
}