<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 20:55
 */

namespace app\modules\frontadmin\models\message;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\message_text\Message_text;
use yii\helpers\ArrayHelper;

class Message extends BaseActiveRecord
{

    //0 未读  1 已读  2删除
    const STATUS_NOT_READ = 0;
    const STATUS_NOT_READ_OK = 1;
    const STATUS_DELETED = 2;

/*+-----------+---------------------+------+-----+---------+----------------+
| id        | int(10) unsigned    | NO   | PRI | NULL    | auto_increment |
| send_id   | int(10) unsigned    | NO   |     | 0       |                |
| rec_id    | int(10) unsigned    | NO   |     | 0       |                |
| mt_id     | int(10) unsigned    | NO   |     | 0       |                |
| read_at    | int() unsigned | NO   |     | 0       |                |
| parent_id | int(10) unsigned    | NO   |     | 0       |                |
+-----------+---------------------+------+-----+---------+----------------+*/

    public function rules(){
        return [
            [['send_id', 'mt_id'],'required', 'on'=> self::SCENARIO_CREATE],
            [['send_id', 'mt_id'], 'number', 'on'=> self::SCENARIO_CREATE]
        ];
    }

    public function scenarios()
    {

        return array_merge(parent::scenarios(),[self::SCENARIO_CREATE =>['send_id', 'mt_id', 'rec_id', 'parent_id', 'read_at', 'status']]);
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
        } else {
            return false;
        }
    }

    /**
     * 指更新
     * @param array $ids
     * @return int
     */
    public function removeAll($ids = []){

        $updateRows = 0;

        if(is_null($ids) || !is_array($ids) || count($ids)<1){
            $this->message = '请选择要删除的记录!';
        } else {

            $updateRows = $this->updateAll(
                ['status'=> self::STATUS_DELETED],
                'id in (:ids)',
                [':ids'=>$ids]
            );
        }

        return $updateRows;
    }

    public function sysSendMessage($message, $recId=0, $groupId=Message_text::MESSAGE_GROUP_10){

        $textModel = new Message_text();
        $mtId = $textModel->sysSendMessage($message, $groupId);
        if($mtId){
            $data = [
                'send_id' => 0,
                'rec_id' => $recId,
                'mt_id' => $mtId,
                'parent_id' => 0,
                'read_at' => 0,
                'group_id' => $groupId
            ];

            return $this->create($data);
        } else {
            return false;
        }
    }

    public function getMessage_text(){
        return $this->hasOne(Message_text::className(), ['id' => 'mt_id']);
    }


}