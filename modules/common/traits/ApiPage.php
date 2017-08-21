<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/16
 * Time: 14:37
 */

namespace app\modules\common\traits;


class ApiPage
{
    public function __construct($totalNumber, $pageNumber, $pageSize)
    {

        $this->totalNumber = $totalNumber;
        $this->pageNumber = $pageNumber;
        $this->pageSize = $pageSize;

        $this->setTotalPage();
        $this->setPageNumber();
        $this->setPrevPageNumber();
        $this->setNextPageNumber();
    }


    /**
     * 当前页码
     * @var
     */
    public $pageNumber;



    /**
     * 每页记录数
     * @var
     */
    public $pageSize;

    /**
     * 记录总数
     * @var
     */
    public $totalNumber;

    /**
     * 总页数
     * @var
     */
    public $totalPage;


    /**
     * 下一页码码
     * @var
     */
    public $nextPageNumber;


    /**
     * 上一页页码
     * @var
     */
    public $prevPageNumber;


    /**
     * @return mixed
     */
    public function getNextPageNumber()
    {
        return $this->nextPageNumber;
    }

    /**
     * @param mixed $nextPageNumber
     */
    public function setNextPageNumber()
    {
        $totalPageNumber = ceil($this->totalNumber / $this->pageSize);
        if($this->pageNumber < $totalPageNumber)
            $this->nextPageNumber = $this->pageNumber+1;
        else
            $this->nextPageNumber = $this->pageNumber;
    }

    /**
     * @return mixed
     */
    public function getPrevPageNumber()
    {
        return $this->prevPageNumber;
    }

    /**
     * @param mixed $prevPageNumber
     */
    public function setPrevPageNumber()
    {
        if($this->pageNumber <= $this->totalPage)
            $this->prevPageNumber = $this->pageNumber - 1;
        else
            $this->prevPageNumber = $this->pageNumber;

        $this->prevPageNumber = $this->prevPageNumber < 1 ? 1 : $this->prevPageNumber;
    }

    /**
     * @return mixed
     */
    public function getPageNumber()
    {
        return $this->pageNumber;
    }

    /**
     * @param mixed $pageNumber
     */
    public function setPageNumber()
    {
        $this->pageNumber = $this->pageNumber < 1 ? 1 :$this->pageNumber;
        $totalPageNumber = $this->totalPage;
        if($this->pageNumber > $totalPageNumber)
            $this->pageNumber = $totalPageNumber;
    }

    public function setTotalPage(){
        $this->totalPage = ceil($this->totalNumber / $this->pageSize);;
    }
}