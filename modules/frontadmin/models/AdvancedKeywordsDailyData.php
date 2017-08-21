<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/17
 * Time: 17:34
 */

namespace app\modules\frontadmin\models;


use yii\db\ActiveRecord;

class AdvancedKeywordsDailyData extends ActiveRecord
{

    public static function getDb()
    {
        $connection = new \yii\db\Connection([
            'dsn' => 'sqlsrv:Server=localhost;Database=OneDesk', // MS SQL Server, sqlsrv driver public ip
            'username' => 'sa',
            'password' => 'sa',
            'charset' => 'utf8',
        ]);
        $connection->open();

        return $connection;
    }

    public static function tableName()
    {
        return "OneDesk.dbo.Account";
    }


}