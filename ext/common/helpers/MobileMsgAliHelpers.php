<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/4
 * Time: 10:58
 */

namespace app\ext\common\helpers;


use yii\log\Logger;

class MobileMsgAliHelpers
{

    private $libFile;
    private $error;
    private static $_instance = null;

    private static $appkey = '23461617';
    private static $secret = 'a42aaffe17a03cf307d2faaff26bfc5a';


    const TEMPLATE_REGISTER_CHECK_CODE = 'SMS_15155177'; //注册验证码模板
    const TEMPLATE_FIND_PWD_CHECK_CODE = 'SMS_15155175'; //注册验证码模板
    const CONTENT_REGISTER_CHECK_CODE = "{code:'|code|',product:'|product|'}";
    const CONTENT_FIND_PWD_CHECK_CODE = "{code:'|code|',product:'|product|'}";
    const SIGN_NAME_JIKE365 = '集客365';

    public function __construct(){

        $libPath = \Yii::getAlias('@ext_path').'/msg_alidayu';
        $this->libFile = $libPath . '/' . 'TopSdk.php';
        if(file_exists($this->libFile))
            require_once ($this->libFile);
        else{
            $this->setError($this->libFile . '文件不存在 !');
        }
    }

    public static function getInstance(){
        if(is_null(self::$_instance)){
            self::$_instance = new MobileMsgAliHelpers();
        }
        return self::$_instance;
    }

    public function sendMsg($mobileArray=[], $template, $content= []){

        $result = false;
        if(is_array($mobileArray) && count($mobileArray)){
            try{
                $rs = $this->_sendMsg(self::SIGN_NAME_JIKE365, $template, $mobileArray, $content);
                print_r($rs);
            } catch (\Exception $e){
                $this->setError($e->getMessage());
            }
        } else {
            $this->setError("手机号错误!");
        }
        return $result;
    }


    private function _sendMsg($signName='集客365',$template = 'SMS_15155177', $mobile='15995716443', $content="{code:'321433',product:'abc'}"){

        $content = $this->_getContent($template, $content);

        $c = new \TopClient();
        $c ->appkey = self::$appkey;
        $c ->secretKey = self::$secret ;
        $req = new \AlibabaAliqinFcSmsNumSendRequest;
        $req ->setExtend( "123456" );
        $req ->setSmsType( "normal" );
        $req ->setSmsFreeSignName( $signName );
        $req ->setSmsParam( $content );
        $req ->setSmsTemplateCode(  $template );

        if(is_array($mobile) && count($mobile)){
            foreach($mobile as $mobileItem){
                $req ->setRecNum( $mobileItem );
                $resp = $c ->execute( $req );
            }
        }

        \Yii::getLogger()->log(get_object_vars($req), Logger::LEVEL_INFO, 'message_alidayu');
        return $resp;
    }

    private function _getContent($template,$content){
        switch($template){
            case self::TEMPLATE_REGISTER_CHECK_CODE:
                $contentTemp = "{code:'|code|',product:'|product|'}";
                foreach($content as $key=>$value){
                    $contentTemp = str_replace('|'.$key.'|', $value, $contentTemp);
                }
                return $contentTemp;
                break;
            case self::TEMPLATE_FIND_PWD_CHECK_CODE:
                $contentTemp = "{code:'|code|',product:'|product|'}";
                foreach($content as $key=>$value){
                    $contentTemp = str_replace('|'.$key.'|', $value, $contentTemp);
                }
                return $contentTemp;
                break;
            default:
                return null;
        }
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