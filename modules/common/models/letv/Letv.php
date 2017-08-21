<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/21
 * Time: 21:39
 */

namespace app\modules\common\models\letv;


class Letv
{
    static $le = null;
    private static function le()
    {
        return !is_null(self::$le) ? self::$le : self::$le = new \LetvCloudV1();
    }
    /**
     * 上传初始化
     * @param  string $name [description]
     * @return [type]       [description]
     */
    static public function init($name = '视频名称')
    {
        return self::le()->videoUploadInit($name);
    }
    /**
     * 断点续传
     * @return [type] [description]
     */
    static public function resume($token)
    {
        return self::le()->videoUploadResume($token);
    }
    /**
     * 获取视频列表
     * @param  int $index 开始页索引，默认值为1
     * @param  int $size 分页大小，默认值为10，最大值为100
     * @param  const $status 视频状态：ALL表示全部；PLAY_OK表示可以正常播放；FAILED表示处理失败；WAIT表示正在处理过程中。默认值为ALL
     * @return [type]          [description]
     * Eg: \Home\Api\Letv::getList(1,30,'PLAY_OK'); // 获取可播放的视频列表
     */
    static public function getList($index=1,$size=30,$status='ALL')
    {
        if($status == 'ALL')
            return self::le()->videoList($index,$size,ALL); // 视频列表
        if($status == 'PLAY_OK')
            return self::le()->videoList($index,$size,PLAY_OK); // 视频列表
        if($status == 'FAILED')
            return self::le()->videoList($index,$size,FAILED); // 视频列表
        if($status == 'WAIT')
            return self::le()->videoList($index,$size,WAIT); // 视频列表
    }
    /**
     * web方式上传
     * @param  [type] $file [文件绝对路径]
     * @param  [type] $url  [初始化后得到的地址]
     * @return [type]       [description]
     */
    static public function upload($file, $url)
    {
        return self::le()->videoUpload($file, $url);
    }
    /**
     * 视频上传（Flash方式）
     * @param  string $video_name 视频名称
     * @param  string $js_callback Javascript回调函数，视频上传完毕后调用
     * @param  int $flash_width Flash宽度，默认值为600
     * @param  int $flash_height Flash高度，默认值为450
     * @param  string $client_ip 用户IP地址
     * @return string
     */
    static function videoUploadFlash($video_name,$js_callback='',$flash_width=600,$flash_height=450,$client_ip=''){
        return self::le()->videoUploadFlash($video_name,$js_callback,$flash_width,$flash_height,$client_ip);
    }
    /**
     * 获取视频播放接口
     * @param string $uu 用户唯一标识码，由乐视网统一分配并提供
     * @param string $vu 视频唯一标识码
     * @param string $type 接口类型：url表示播放URL地址；js表示JavaScript代码；flash表示视频地址；html表示HTML代码
     * @param string $pu 播放器唯一标识码
     * @param int $auto_play 是否自动播放：1表示自动播放；0表示不自动播放。默认值由双方事先约定
     * @param int $width 播放器宽度
     * @param int $height 播放器高度
     * @return [type]             [description]
     */
    static public function getPlay($vu = "",$type = 'url',$auto_play = 0,$width = 500,$height = 300)
    {
        $le = self::le();
        return $le->videoGetPlayinterface($le->user_unique,$vu,$type,'8f1910aa32',$auto_play,$width,$height);
    }
    /**
     * 获取单个视频信息
     * @param  integer $video_id [视频唯一id]
     * @return [type]            [description]
     */
    static public function getOne($video_id=0)
    {
        return self::le()->videoGet($video_id);
    }
    /**
     * 视频暂停
     * @return [type] [description]
     */
    static public function video_pause($video_id)
    {
        return self::le()->videoPause($video_id);
    }
    /**
     * 视频恢复
     * @return [type] [description]
     */
    static public function video_restore($video_id)
    {
        return self::le()->videoRestore($video_id);
    }
    /**
     * 删除视频
     * @param  [type] $video_id [description]
     * @return [type]           [description]
     */
    static public function video_del($video_id)
    {
        return self::le()->videoDel($video_id);
    }
}