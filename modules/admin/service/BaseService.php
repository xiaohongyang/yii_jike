<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/11
 * Time: 8:47
 */

namespace app\modules\admin\service;


use app\modules\common\traits\AdminInfoTraite;
use app\modules\common\traits\PageTrait;

class BaseService
{

    use PageTrait;
    use AdminInfoTraite;

    public $message;


}