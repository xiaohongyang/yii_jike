<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/30
 * Time: 18:59
 */

namespace tests\codeception\unit\models;


use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\service\PrizeOrderService;
use yii\codeception\TestCase;

class PrizeOrderServiceTest extends TestCase
{

    public function testCreate(){

        $service = new PrizeOrderService();
        $model = new Prize_order();
        $service->setPrizeOrderModel($model);
        $rs = $service->create(3);

        $error = $service->message ? : "失败!";
        $this->assertTrue($error, iconv("utf-8","gb2312", $error));
    }

}