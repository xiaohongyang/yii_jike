<?php
namespace tests\codeception\unit\models;


use app\models\LoginForm;
use app\modules\jike\models\prize_codes\Prize_codes;
use app\modules\jike\models\UserLogin;
use app\modules\jike\service\ZeroPrizeService;
use yii;

use yii\codeception\TestCase;
//use Codeception\Specify;
use Codeception\Specify;

class ExampleValidationTest extends TestCase
{

    use Specify;
    /**
     * @var \UnitTester
     */
    protected $tester;
    protected $zeroServer;
    protected $prizeId ;
    protected $prizeCodesModel;

    protected function _before()
    {
        $this->prizeId = 12;
        $this->prizeCodesModel = new Prize_codes();
        $this->zeroServer = new ZeroPrizeService($this->prizeId, $this->prizeCodesModel);
    }

    protected function _after()
    {
    }


    public function testValidation(){

        $model = new UserLogin();

        $data = [$model->formName()=>[
            'user_mobile' => '15050163929',
            'user_password' => 'abcabc'
        ]];
        $model->login($data);

        $zeroServer = $this->zeroServer;
        $result = $zeroServer->prize();

        $this->tester->assertTrue($result, Yii::$app->charset. ':抽奖失败!'. implode('|', $zeroServer->codeModel->getFirstErrors()));

        $this->prizeCodesModel->delete();

    }
}