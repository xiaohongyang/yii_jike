<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/3
 * Time: 8:34
 */

namespace app\modules\frontadmin\models;


use app\modules\common\traits\TransactionTrait;
use app\modules\common\traits\UserinfoTraite;
use yii\base\Model;

class BaseModel extends Model
{

    public $message;
    use TransactionTrait;
    use UserinfoTraite;


}