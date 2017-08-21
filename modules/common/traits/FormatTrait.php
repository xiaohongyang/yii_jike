<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/16
 * Time: 17:40
 */

namespace app\modules\common\traits;


trait FormatTrait
{

    static  $formatArray = 'array';

    private $_format;

    /**
     * @return mixed
     */
    public function getFormat()
    {
        return $this->_format;
    }

    /**
     * @param mixed $format
     */
    public function setFormat($format)
    {
        $this->_format = $format;
    }

    public function isFormatArray(){
        return $this->getFormat() == self::$formatArray;
    }



}