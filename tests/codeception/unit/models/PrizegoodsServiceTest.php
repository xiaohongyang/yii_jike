<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/27
 * Time: 16:53
 */

namespace tests\codeception\unit\models;


use app\modules\frontadmin\service\PrizegoodsService;
use yii\codeception\TestCase;

class PrizegoodsServiceTest extends TestCase
{

    private $error;

    /*public function testPrizeTimes(){

        $service = new PrizegoodsService();
        $service->setPrizeId(108);

        $error = $service->message ? : '失败';
        $this->assertTrue($service->addGoodsNumber(2), iconv('utf-8','gb2312', $error) );
    }*/

    public function testEnableOneMoneyBuy(){

        $service = new PrizegoodsService();
        $service->setPrizeId(107);
        $rs = $service->enableOneMoneyBuy();
        $this->error = $service->message;
        $this->assertTrue($rs, iconv('utf-8','gb2312', $this->error ? $this->error : "失败"));
    }

}