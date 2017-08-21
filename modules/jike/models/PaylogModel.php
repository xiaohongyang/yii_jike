<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/9
 * Time: 22:17
 */

namespace app\modules\jike\models;


class PaylogModel extends BaseActiveRecord
{

//`log_id` INT UNSIGNED NOT NULL AUTO_INCREMENT  COMMENT 'log主键',
//`trade_no` VARCHAR(50) NOT NULL default '' COMMENT '交易号',
//`pay_type` TINYINT UNSIGNED NOT NULL default 0 COMMENT '支付类别 1支付宝',
//`created_at` INT NOT NULL default 0 COMMENT '记录添加时间',
//`order_no` VARCHAR(50) NOT NULL default '' COMMENT '平台订单号',
//`desc` VARCHAR(255) NOT NULL default '' COMMENT

    public function rules()
    {
        return [

        ];
    }

}