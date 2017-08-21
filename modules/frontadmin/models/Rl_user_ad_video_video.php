<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/2
 * Time: 23:04
 */

namespace app\modules\frontadmin\models;


class Rl_user_ad_video_video extends BaseActiveRecord
{
    public function fields()
    {
        return [
            'ad_id',
            'v_id'
        ];
    }


}