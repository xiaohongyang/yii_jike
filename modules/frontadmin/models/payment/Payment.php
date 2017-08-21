<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 10:53
 */

namespace app\modules\frontadmin\models\payment;


use app\modules\frontadmin\models\BaseActiveRecord;

class Payment extends BaseActiveRecord
{

    const PAYMENT_ALIPAY = 'alipay';
    //支付方式
    const CON_PAY_ID_ALIPAY = 1;    //支付宝支付

}