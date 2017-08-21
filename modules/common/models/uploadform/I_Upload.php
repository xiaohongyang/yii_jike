<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/17
 * Time: 10:51
 */

namespace app\modules\common\models\uploadform;


Interface I_Upload
{

    const C_FORM_NAME = 'UploadForm';

    //表名称
    const TABLE_NAME_PRIZE_GOODS = 1; //商品详情表
    const TABLE_NAME_USER_INFO = 2; //用户表
    const TABLE_NAME_ARTICLE = 3;   //文章表


    //文件类别后缀
    const FILE_TYPE_IMAGE_01 =1;


    //表列名称
    const COLUMN_NAME_PRIZE_GOODS_ID = 'prize_id';
    const COLUMN_NAME_UI_HEAD_PIC = 'head_pic';
    const COLUMN_NAME_UI_WECHAR_EWM_PIC = 'wechar_ewm_pic';
    const COLUMN_NAME_ARTICLE_PIC = 'article_pic';


    //文件保存目录
    const FILE_DIR_PRIZE_GOODS = 'upload/prize_goods';
    const FILE_DIR_UI_HEAD_PIC = 'upload/head_pic';
    const FILE_DIR_UI_WECHAR_EWM_PIC = 'upload/wechar_ewm_pic';
    const FILE_DIR_ARTICLE_PIC = 'upload/article_pic';  //文章图片目录


    //文件说明
    const FILE_DESC_PRIZE_GOODS_IMAGE = 1;  //0元购奖品图片
    const FILE_DESC_PRIZE_GOODS_WX_QRCODE = 2;  //微信二维码
    const FILE_DESC_USER_HEADPIC = 30;  //用户头像
    const FILE_DESC_USER_WECHAR_EWM_PIC = 31;  //用户头像
    const FILE_DESC_ARTICLE_PIC = 40;  //文章图片

    public static function getExtensions($fileType);


    //上传文件
    public function upload();

    //检测文件类型是否合法
    public function checkFileType();

    //设置保存目录
    public function setSaveDir();

    //生成文件名
    public function createFIleName();

}