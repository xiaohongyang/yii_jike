<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/7
 * Time: 20:50
 */

namespace tests\codeception\unit\models;


use app\modules\frontadmin\models\feedback\Feedback;
use yii\codeception\TestCase;

class FeedbackTest extends TestCase
{

    public function testFeedback(){

        $logform = new LoginFormTest();
        $logform->testLoginXhy();

        $model = new Feedback();
        $rs = $model->feedBack([
            'user_id' => '1',
            'user_name' => 'jack',
            'msg_content' => '什么',
            'order_id' => 19,
            'msg_type' => Feedback::C_MSG_TYPE_COMPLAIN
        ]);

        $this->assertTrue($rs, $model->message);
    }

    public function testReply(){

        $logform = new LoginFormTest();
        $logform->testLoginXhy();

        $model = new Feedback();
        $rs = $model->reply([
            'user_id' => '30',
            'user_name' => 'jack',
            'msg_content' => '收到，卖家违规，已经将相应的积分转到您的账户中. ',
            'order_id' => 25,
            'msg_type' => Feedback::C_MSG_TYPE_COMPLAIN,
            'parent_id' => 3
        ]);

        $this->assertTrue($rs, iconv('utf-8','gb2312',$model->message));
    }

}