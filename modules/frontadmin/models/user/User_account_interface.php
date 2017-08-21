<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/10
 * Time: 8:58
 */

namespace app\modules\frontadmin\models\user;


interface User_account_interface
{

    const C_ACCOUNT_INTEGRATE = 'integrate_account';
    const C_ACCOUNT_MARKTING = 'markting_account';
    const C_ACCOUNT_BAIL = 'bail_account';
    const C_ACCOUNT_FROZEN = 'frozen_account';

    //process_type 1，提取；0，预付费，其实就是充值
    const PROCESS_TYPE_CASH = 1;
    const PROCESS_TYPE_RECHARGE = 0;



    //０，未付；１，已付
    const IS_PAYED_FALSE = 0;
    const IS_PAYED_TRUE = 1;

    const ERROR_MONEY_NOT_ENOUGH = 'error_money_not_enough';    //金额不足
}