<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/13
 * Time: 16:58
 */

namespace app\modules\jike\models\prize_goods;


use app\modules\common\models\uploadform\AbstractUpload;
use app\modules\common\models\uploadform\Uploadform;
use app\modules\frontadmin\models\junction\pg_video;
use app\modules\frontadmin\models\video\video;
use app\modules\jike\models\BaseActiveRecord;

class Prize_goods extends BaseActiveRecord
{

    public function getPgVideos(){
        return $this->hasOne(pg_video::className(), [ 'pg_id' => 'prize_id' ]);
    }

    public function getVideos(){
        return $this->hasOne(video::className(), ['v_id'=>'v_id'])
            ->via('pgVideos');
    }

    public function getPics(){
        return $this->hasMany(Uploadform::className(), ['column_value'=>'prize_id'])
            ->andWhere(['table_name'=>AbstractUpload::TABLE_NAME_PRIZE_GOODS])
            ->andWhere(['file_desc'=>AbstractUpload::FILE_DESC_PRIZE_GOODS_IMAGE]);
    }


    public function getThumb(){

        return Uploadform::find()->where(['=','column_value',$this->prize_id])
            ->andWhere(['=','table_name',AbstractUpload::TABLE_NAME_PRIZE_GOODS])
            ->andWhere(['=','file_desc',AbstractUpload::FILE_DESC_PRIZE_GOODS_IMAGE])
            ->one();
    }

    public function getWxQrcode(){

        $file = Uploadform::getFile(AbstractUpload::TABLE_NAME_PRIZE_GOODS, AbstractUpload::FILE_DESC_PRIZE_GOODS_WX_QRCODE, $this->prize_id, false);
        return $file;
    }






}