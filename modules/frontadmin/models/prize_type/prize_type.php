<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/17
 * Time: 6:00
 */

namespace app\modules\frontadmin\models\prize_type;


use yii\db\ActiveRecord;

class prize_type extends ActiveRecord
{

    public function getList(){
        $query = self::find();
        $query->where(['>','type_id',0]);

        $query->orderBy(' sort asc ');

        return $query;
    }

}