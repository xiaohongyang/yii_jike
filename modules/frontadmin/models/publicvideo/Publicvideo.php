<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/17
 * Time: 15:54
 */

namespace app\modules\frontadmin\models\publicvideo;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\user_ad_video\Rl_publicvideo_video;

class Publicvideo extends BaseActiveRecord
{

    public function getRl_publicvideo_video(){
        return $this->hasOne(Rl_publicvideo_video::className(), ['pv_id'=>'pv_id']);
    }

    public function getVideo(){
        return $this->hasOne(video::className(),['v_id'=>'v_id'])->via('rl_publicvideo_video');
    }

}