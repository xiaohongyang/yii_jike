<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/14
 * Time: 19:56
 */

namespace app\modules\frontadmin\models\article_type;


use app\modules\frontadmin\models\BaseActiveRecord;
use yii\helpers\ArrayHelper;

class Article_type extends BaseActiveRecord
{

    const C_TYPE_ACTIVITY = 1;  //集客活动类别id
    const C_TYPE_CHANNEL = 2;   //附属信息类别父类id


    public function scenarios()
    {
        return ArrayHelper::merge(parent::scenarios(),[
            self::SCENARIO_EDIT => [
                'type_id','type_name','type_content','parent_id'
            ]
        ]);
    }


    public function edit($params){

        $rs = false;
        if(is_array($params) && !key_exists(self::formName(), $params))
            $params = [self::formName()=>$params];

        $this->scenario = self::SCENARIO_EDIT;
        if($this->load($params) && $this->validate()){
            $rs = self::updateAll(['type_content'=>$this->type_content],['type_id'=>$this->type_id]);
        }
        return $rs;
    }


}