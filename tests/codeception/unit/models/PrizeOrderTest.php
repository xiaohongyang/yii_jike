<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/7
 * Time: 17:07
 */

namespace tests\codeception\unit\models;


use app\modules\admin\models\User;
use app\modules\admin\service\PrizeOrderService;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\jike\models\UserLogin;
use yii\codeception\TestCase;

class PrizeOrderTest extends TestCase
{

    public function testLoginXhy(){
        $model = new UserLogin();
        $model->user_mobile = '13284847443';
        $model->user_password = 'abcabc';
        $data = [$model->formName()=>[
            'user_mobile' => '13284847443',
            'user_password' => 'abcabc'
        ]];
        $this->assertTrue($model->login($data), implode('|',$model->getFirstErrors()));
    }

    public function testCreateOrder(){

        $this->testLoginXhy();

        $model = new Prize_order();
        $rs = $model->createOrder(223,14,197,0,"新区长江路25号,",'15995716443', ['颜色'=>'白色','大小'=>"XL","系统"=>"IOS"]);
        $this->assertTrue($rs, $model->message);
    }

    public function testAdminLogin(){

        $model = new User();

        $params = [
            'user_name' => 'admin',
            'user_password' => 'abcabc',
        ] ;
        $rs = $model->login($params);

        $this->assertTrue($rs, implode('|', $model->getFirstErrors()));
    }

    public function testSetShippingStatus(){

        $service = new Prize_order();;
        $rs = $service->setShippingStatus(25,Prize_order::C_SHIPPING_STATUS_SEND_NO,1);
        $this->assertTrue($rs, iconv('utf-8','gb2312',$service->message) );
    }
}