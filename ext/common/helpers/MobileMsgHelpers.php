<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/4
 * Time: 10:58
 */

namespace app\ext\common\helpers;


class MobileMsgHelpers
{

    private $libFile;
    private $error;
    private static $_instance = null;

    public function __construct(){

        $libPath = \Yii::getAlias('@ext_path').'/msg';
        $this->libFile = $libPath . '/' . 'msg.class.php';
        if(file_exists($this->libFile))
            require_once ($this->libFile);
        else{
            $this->setError($this->libFile . '文件不存在 !');
        }
    }

    public static function getInstance(){
        if(is_null(self::$_instance)){
            self::$_instance = new MobileMsgHelpers();
        }
        return self::$_instance;
    }

    public function sendMsg($mobileArray=[], $content=''){

        $result = false;
        if(is_array($mobileArray) && count($mobileArray)){
            try{
                $rs = sendSMS($mobileArray, $content);
                $result = (int)$rs === 0 && $rs !==false ? true : false;
            } catch (\Exception $e){
                $this->setError($e->getMessage());
            }
        } else {
            $this->setError("手机号错误!");
        }
        return $result;
    }

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @param mixed $error
     */
    public function setError($error)
    {
        $this->error = $error;
    }
}