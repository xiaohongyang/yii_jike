<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 21:15
 */

namespace app\modules\frontadmin\models\message_text;


use app\modules\frontadmin\models\BaseActiveRecord;
use yii\behaviors\TimestampBehavior;

class Message_text extends BaseActiveRecord
{

/*+------------+---------------------+------+-----+---------+----------------+
| id         | int(10) unsigned    | NO   | PRI | NULL    | auto_increment |
| msg    | text                | NO   |     | NULL    |                |
| created_at | int(10) unsigned    | NO   |     | 0       |                |
| type       | tinyint(3) unsigned | NO   |     | 0       |                |
| group_id   | tinyint(3) unsigned | NO   |     | 10      |                |
+------------+---------------------+------+-----+---------+----------------+*/

    const TYPE_10 = 10;  //系统发送的信息
    const TYPE_20 = 20; //用户发送的信息
    const MESSAGE_GROUP_10 = '10';  //系统信息

    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::className()
            ]
        ];
    }


    public function rules(){
        return [
            [['msg', 'type', 'group_id'], 'required', 'on' => self::SCENARIO_CREATE]
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_CREATE => [
                'msg', 'type', 'group_id'
            ]
        ];
    }

    public function create($data){

        if(is_array($data) && !key_exists($this::formName(), $data)){
            $data = [
                $this::formName() => $data
            ];
        }

        $this->scenario = self::SCENARIO_CREATE;
        if($this->load($data) && $this->validate()){
            $rs = $this->save();
            return $rs ? $this->getLastInsertId() : false;
        }
        else
            return false;
    }


    /**
     * 发送系统信息
     * @param $message
     * @return bool
     */
    public function sysSendMessage($message, $groupId = self::MESSAGE_GROUP_10){
        $data = [
            'msg' => $message,
            'type' => self::TYPE_10,
            'group_id' => $groupId,
        ];
        return $this->create($data);
    }

    public static function getGroupName($groupId){

        switch($groupId){
            case self::MESSAGE_GROUP_10:
                return '系统信息';
            default:
                return '';
        }
    }

}