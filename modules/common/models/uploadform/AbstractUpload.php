<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/18
 * Time: 14:30
 */

namespace app\modules\common\models\uploadform;




abstract class AbstractUpload implements I_Upload
{

    public static function getExtensions($fileType)
    {
        $extention = null;
        switch($fileType){
            case self::FILE_TYPE_IMAGE_01:
                $extention = ['.gif','.jpg','.jpeg','.png'];
                break;
        }
        return $extention;
    }

    public static function getUploadFormConfig($fileDesc){
        switch($fileDesc){

            case self::FILE_DESC_PRIZE_GOODS_IMAGE:
                return new UploadformConfig(
                    self::TABLE_NAME_PRIZE_GOODS,
                    self::COLUMN_NAME_PRIZE_GOODS_ID,
                    null,
                    self::FILE_DIR_PRIZE_GOODS,
                    null,
                    self::FILE_TYPE_IMAGE_01,
                    $fileDesc
                );
                break;
            case self::FILE_DESC_PRIZE_GOODS_WX_QRCODE:
                return new UploadformConfig(
                    self::TABLE_NAME_PRIZE_GOODS,
                    self::COLUMN_NAME_PRIZE_GOODS_ID,
                    null,
                    self::FILE_DIR_PRIZE_GOODS,
                    null,
                    self::FILE_TYPE_IMAGE_01,
                    $fileDesc
                );
                break;
            case self::FILE_DESC_USER_HEADPIC:
                return new UploadformConfig(
                    self::TABLE_NAME_USER_INFO,
                    self::COLUMN_NAME_UI_HEAD_PIC,
                    null,
                    self::FILE_DIR_UI_HEAD_PIC,
                    null,
                    self::FILE_TYPE_IMAGE_01,
                    $fileDesc
                );
            case self::FILE_DESC_USER_WECHAR_EWM_PIC:
                return new UploadformConfig(
                    self::TABLE_NAME_USER_INFO,
                    self::COLUMN_NAME_UI_WECHAR_EWM_PIC,
                    null,
                    self::FILE_DIR_UI_WECHAR_EWM_PIC,
                    null,
                    self::FILE_TYPE_IMAGE_01,
                    $fileDesc
                );
            case self::FILE_DESC_ARTICLE_PIC:
                return new UploadformConfig(
                    self::TABLE_NAME_ARTICLE,
                    self::COLUMN_NAME_ARTICLE_PIC,
                    null,
                    self::FILE_DIR_ARTICLE_PIC,
                    null,
                    self::FILE_TYPE_IMAGE_01,
                    $fileDesc
                );
            default:
                echo 'error: desc 数据不存在!';
                exit();
                break;
        }
        return new UploadformConfig();
    }


    /**
     * check file type
     * @param $fileType
     * @param $extension
     * @return null|string  return string of error info if file type is not right else return null
     */
    public static function checkExtension($fileType, $extension){
        $extensions = self::getExtensions($fileType);
        if(is_null($extension))
            return "可上传文件类型不存在!";
        if(!in_array(strtolower($extension), $extensions))
            return "文件类型不合法!";
        return null;
    }
}