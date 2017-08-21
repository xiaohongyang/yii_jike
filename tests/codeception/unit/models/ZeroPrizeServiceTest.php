<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/25
 * Time: 10:15
 */

namespace tests\codeception\unit\models;


use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\jike\models\prize_codes\Prize_codes;
use app\modules\jike\service\ZeroPrizeService;
use yii\codeception\TestCase;

class ZeroPrizeServiceTest extends TestCase
{

    public function testPrizeTimes(){

        $model = new Prize_codes();
        $service = new ZeroPrizeService(108, $model);
        $times = $service->getPrizeTimes();

        $error = $service->message?: '失败';
        $this->assertGreaterThan(0, $times, iconv('utf-8','gb2312', $error) );
    }

    public function testSetGoodsNumber(){

    }
    public function testAddGoodsNumber(){

    }
    public function testSubGoodsNumber(){

    }

    public function testVerify(){

        $model = new prize_goods();
        $rs = $model->verifyGoods(3, prize_goods::C_STATUS_DELETED);
        $this->assertTrue($rs, $model->message);
    }

}