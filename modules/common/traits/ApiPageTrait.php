<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/16
 * Time: 14:35
 */

namespace app\modules\common\traits;


use yii\db\Query;

trait ApiPageTrait
{

    public $apiPages;

    public function setApiPages($totalNumber, $pageSize=10, $pageNumber= 1){

        $apiPage = new ApiPage($totalNumber, $pageNumber, $pageSize);
        $this->apiPages = $apiPage;
    }

    public function getApiPages(){
        return $this->apiPages;
    }

}