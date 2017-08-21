<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 21:44
 */

namespace app\modules\frontadmin\service;


use app\modules\frontadmin\models\message\Message;
use app\modules\frontadmin\models\message_text\Message_text;
use app\modules\frontadmin\models\user\User_info;
use app\modules\jike\models\User;
use yii\data\ActiveDataProvider;

class MessageService extends BaseService
{

    private $model;
    private $messageTextModel;

    public function __construct()
    {
        $this->model = new Message();
    }


    public function welcomeRegister(User $user){

        $message = "欢迎注册成为集客会员!";
        $this->model->sysSendMessage($message, $user->user_id);
    }

    /**
     * 列表
     * @param $userId
     * @return ActiveDataProvider
     */
    public function getUserMessageProvider($userId){

        $request = \Yii::$app->getRequest()->get('status');


        $query = $this->model->find();
        $query->where([
           'rec_id' => $this->getLoginUserId()
        ]);

        $query->andWhere([
           '!=',
           'status',
            Message::STATUS_DELETED
        ]);

        if(!is_null($request))
            $query->andWhere([
                'status' => 0
            ]);

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => 10
            ]
        ]);

        return $dataProvider;
    }

    /**
     * 获取站内信组名称
     * @param $groupId
     * @return string
     */
    public static function getGroupName($groupId){
        return Message_text::getGroupName($groupId);
    }

    public function removeMessage($ids=[]){

        $updateRows = $this->model->removeAll($ids);
        if(!$updateRows){
            $this->message = $this->model->message ? $this->model->message : $this->model->getFirstErrors()[0];
        }
        return $updateRows;
    }

    /**
     * 获取未读短信数
     * @param $userId
     * @return int|string
     */
    public function getNotReadNumber($userId){

        return $this->model->find()->where(['rec_id'=>$userId, 'status'=>0])->count();
    }

    /**
     * 读取站内信
     * @param $id
     * @return bool
     */
    public function readMessage($id){

        $result = false;
        $msg = Message::findOne($id);
        if($msg && $msg->id){
            $result = Message::updateAll(['status'=>1], ['id'=>$id]);
        }
        return $result;
    }
}