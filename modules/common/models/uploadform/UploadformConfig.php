<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/17
 * Time: 9:47
 */

namespace app\modules\common\models\Uploadform;


class UploadformConfig
{
    public $table_name;
    public $column_name;
    public $column_value;
    public $file_dir;
    public $file_name;
    public $file_type;
    public $file_desc;

    public function __construct(
        $table_name=null,$column_name=null, $column_value=null, $file_dir=null, $file_name=null, $file_type=null, $file_desc=null)
    {
        $this->table_name = $table_name;
        $this->column_name = $column_name;
        $this->column_value = $column_value;
        $this->file_dir = $file_dir;
        $this->file_name = $file_name;
        $this->file_type = $file_type;
        $this->file_desc = $file_desc;
    }
}