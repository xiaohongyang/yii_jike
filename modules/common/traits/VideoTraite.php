<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/5
 * Time: 12:55
 */

namespace app\modules\common\traits;


use app\modules\jike\models\user\User_info;

trait VideoTraite
{

    private $_userCity = null;

    public static  function isAliVideo(){
        return \Yii::$app->params['video_service'] == 'ali_video';
    }

}