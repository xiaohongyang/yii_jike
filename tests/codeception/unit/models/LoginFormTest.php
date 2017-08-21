<?php

namespace tests\codeception\unit\models;

use app\modules\jike\models\UserLogin;
use Yii;
use yii\codeception\TestCase;
use app\models\LoginForm;
use Codeception\Specify;

class LoginFormTest extends BaseTestCase
{
    use Specify;

    protected function tearDown()
    {
        Yii::$app->user->logout();
        parent::tearDown();
    }

    public function testLoginNoUser()
    {
        $model = new LoginForm([
            'username' => 'not_existing_username',
            'password' => 'not_existing_password',
        ]);

        $this->specify('user should not be able to login, when there is no identity', function () use ($model) {
            expect('model should not login user', $model->login())->false();
            expect('user should not be logged in', Yii::$app->user->isGuest)->true();
        });
    }



    public function testLoginXhy(){
        $model = new UserLogin();
        $model->user_mobile = '15995716443';
        $model->user_password = '321321';
        $data = [$model->formName()=>[
            'user_mobile' => '15995716443',
            'user_password' => '321321'
        ]];
        $this->assertTrue($model->login($data), $this->convUtf82Gb2312( implode('|',$model->getFirstErrors()) ) );
    }

    public function testUserId(){
        $model = new UserLogin();
        $model->user_mobile = '15995716443';
        $model->user_password = 'abcabc';
        $data = [$model->formName()=>[
            'user_mobile' => '15995716443',
            'user_password' => 'abcabc'
        ]];
        $rs = $model->login($data);

        $model->user_id;
        //$this->assertEquals($model->user_id,'15','id 不对!'.$model->user_id);
        $this->assertTrue($rs,  $model->user_id.'vvvv');
    }

}
