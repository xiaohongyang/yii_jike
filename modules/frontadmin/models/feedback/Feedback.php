<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/7
 * Time: 20:30
 */

namespace app\modules\frontadmin\models\feedback;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\message\Message;
use app\modules\frontadmin\models\message_text\Message_text;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\models\user\User;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;

class Feedback extends BaseActiveRecord
{

    const C_MSG_TYPE_COMPLAIN = 1;  //投诉

    const SCENARIO_REPLY = 'reply'; //回复

/*`msg_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键id',
`parent_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '父节点，取自该表msg_id；反馈该值为0；回复反馈为节点id',
`user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '反馈的用户的id',
`user_name` varchar(50) NOT NULL DEFAULT '' COMMENT '反馈的用户名称',
`msg_content` text NOT NULL COMMENT '反馈内容',
`order_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '反馈的订单id',
`created_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
`updated_at` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
`msg_type` tinyin  反馈的类型，0，留言；1，投诉；2 ，询问；3，售后；4，求购*/

    public function behaviors()
    {
        return [
            [ 'class' => TimestampBehavior::className() ]
        ];
    }


    public function rules()
    {
        return [
            [['user_id','user_name','msg_content','order_id','msg_type'], 'required', 'on'=>self::SCENARIO_CREATE],
            [['user_id','user_name','order_id','msg_type', 'parent_id'], 'required', 'on'=>self::SCENARIO_REPLY],
            ['msg_content','required', 'on'=>self::SCENARIO_REPLY, 'message'=>'回复内容不能为空...'],

            ['order_id', function($attribute){

                $isOrderExit = Prize_order::find()->where(['order_id'=>$this->$attribute])->exists();
                if(!$isOrderExit)
                    //1.判断订单是否存在
                    $this->addError('order_id', '订单不存在!');
                else if(self::find()->where(['order_id'=>$this->$attribute])->exists())
                    //2.判断订单是否已被投诉
                    $this->addError('order_id', '此订单已经提交过投诉，请不要重复提交!');
                else {

                    $order = Prize_order::findOne([ 'order_id' => $this->order_id ]);
                    $coder = $order->prizeCode;
                    if(is_null($coder)){
                        //3.判断订单对应code_id是否存在(找到code_id才能找到用户user_id)
                        $this->addError('order_id', '订单对应code不存在!');
                    } else{
                        if($coder && $coder->user_id != $this->user_id)
                            $this->addError('user_id', '此订单不是你的，没有投诉此订单的权限!');
                    }
                }
            }, 'on'=>self::SCENARIO_CREATE],
            ['user_id', function($attribute){

                $isUserExit = User::find()->where(['user_id'=>$this->$attribute])->exists();
                if(!$isUserExit)
                    //1.用户是否存在
                    $this->addError('user_id', '管理员不存在!');
            }, 'on'=>self::SCENARIO_CREATE],

            ['order_id', function($attribute){

                $isOrderExit = Prize_order::find()->where(['order_id'=>$this->$attribute])->exists();
                if(!$isOrderExit)
                    //1.判断订单是否存在
                    $this->addError('order_id', '订单不存在!');
            }, 'on'=>self::SCENARIO_REPLY],
            ['parent_id', function($attribute){

                $isParentExit = self::find()->where(['msg_id'=>$this->$attribute])->exists();
                if(!$isParentExit)
                    //1.父id是否存在
                    $this->addError('parent_id', '所要回复的投诉不存在，或已被删除!');
            }, 'on'=>self::SCENARIO_REPLY],
            ['user_id', function($attribute){

                $isUserExit = User::find()->where(['user_id'=>$this->$attribute])->exists();
                if(!$isUserExit)
                    //1.用户是否存在
                    $this->addError('user_id', '管理员不存在!');
            }, 'on'=>self::SCENARIO_REPLY],
        ];
    }

    public function scenarios()
    {
        return ArrayHelper::merge( parent::scenarios(),[
            self::SCENARIO_CREATE => [
                'user_id','user_name','msg_content','order_id','msg_type'
            ],
            self::SCENARIO_REPLY => [
                'user_id','user_name','msg_content','order_id','msg_type','parent_id'
            ]
        ]);
    }

    public function attributeLabels()
    {
        return [
            'user_id' => '用户id',
            'user_name' => '用户名',
            'msg_content' => '反馈内容',
            'order_id' => '订单id',
            'msg_type' => '内容类别',
            'parent_id' => '父id'
        ];
    }


    /**
     * 添加投诉
     * @param array $data
     * @return bool
     */
    public function feedBack($data = [
        'user_id' => 0,
        'user_name' => '',
        'msg_content' => '',
        'order_id' => 0,
        'msg_type' => self::C_MSG_TYPE_COMPLAIN
    ]){

        if(is_array($data) && !key_exists(self::formName(), $data)){
            $data = [self::formName()=>$data];
        }

        $rs = false;
        $this->scenario = self::SCENARIO_CREATE;
        if($this->load($data) && $this->validate()){
            $rs = $this->save();
            !$rs && $this->message = "保存失败!";
        }else{
            $this->message = is_array($this->getFirstErrors()) && count($this->getFirstErrors()) ? implode('|', $this->getFirstErrors()) : '验证失败!';
        }
        return $rs;
    }


    /**
     * 回复
     * @param array $data
     * @return bool
     */
    public function reply($data = [
        'user_id' => 0,
        'user_name' => '',
        'msg_content' => '',
        'order_id' => 0,
        'msg_type' => self::C_MSG_TYPE_COMPLAIN,
        'parent_id' => 0
    ]){

        if(is_array($data) && !key_exists(self::formName(), $data)){
            $data = [self::formName()=>$data];
        }

        $rs = false;
        $this->beginTransaction();
        try {
            $this->scenario = self::SCENARIO_REPLY;
            if ($this->load($data) && $this->validate()) {
                $rs = $this->save();
                !$rs && $this->message = "回复失败!";
            } else {
                $this->message = is_array($this->getFirstErrors()) && count($this->getFirstErrors()) ? implode('|', $this->getFirstErrors()) : '验证失败!';
            }

            if ($rs) {
                //发送站内信
                $messageModel = new Message();
                $order = new Prize_order();
                $prizeGoods = $order->getPrizeGoods($this->order_id);

                $this->msg_content .= "&nbsp;&nbsp; 商品：<a href='".Url::to(['/jike/goods/detail','id'=>$prizeGoods->prize_id])."' target='_blank'>".$prizeGoods->prize_name."</a>";
                $rs = $messageModel->sysSendMessage($this->msg_content, $prizeGoods->user_id,  Message_text::MESSAGE_GROUP_10);
            }
            $rs ? $this->commit() : $this->rollback();
        } catch (Exception $e) {
            $rs = false;
            $this->rollback();
            $this->message = $e->getMessage();
        }
        return $rs?true:false;
    }

    public function getReply(){
        return $this->hasOne(Feedback::className(), ['parent_id'=>'msg_id']);
    }

}