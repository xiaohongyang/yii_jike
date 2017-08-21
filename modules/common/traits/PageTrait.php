<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/25
 * Time: 22:05
 */

namespace app\modules\common\traits;


use yii\data\Pagination;

trait PageTrait
{

    public $pages;
    public $apiPage;

    /**
     * @return mixed
     */
    public function getPages()
    {
        return $this->pages;
    }

    /**
     * @param mixed $pages
     */
    public function setPages($pages)
    {
        $this->pages = $pages;
    }

    public function setPageByTotalCount($totalCount){
        $page = new Pagination([
            'totalCount' => $totalCount
        ]);
        $this->setPages($page);
    }



}