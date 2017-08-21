<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/2
 * Time: 16:03
 */

namespace app\modules\frontadmin\models;


use app\modules\common\models\letv\Letv;
use app\modules\common\traits\VideoTraite;
use app\modules\frontadmin\models\user\User;
use app\modules\frontadmin\models\user_ad_video_account\User_ad_video_account;
use app\modules\frontadmin\models\video\video;
use yii\base\Exception;
use yii\behaviors\TimestampBehavior;

class User_ad_video extends BaseActiveRecord
{

    use VideoTraite;

    const C_DELETED_NO = 0;
    const C_DELETED_YES = 1;


    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::className(),
            ]
        ];
    }

    static $statusArray = [
        0 => '视频等待审核中..',
        1 => '余额不足,暂停中...',
        2 => '正在推广...'
    ];

    /**
     * 视频文件关联表
     * @return \yii\db\ActiveQuery
     */
    public function getRl_user_ad_video_video(){
        return $this->hasOne(Rl_user_ad_video_video::className(),['ad_id'=> 'ad_id']);
    }

    /**
     * 视频信息
     * @return $this
     */
    public function getVideo(){
        return $this->hasOne(video::className(),['v_id'=>'v_id'])->via('rl_user_ad_video_video');
    }

    /**
     * region信息
     * @return \yii\db\ActiveQuery
     */
    public function getRegions(){
        return $this->hasMany(User_ad_video_region::className(),['ad_id'=>'ad_id']);
    }


    /**
     * 获取账户
     * @return \yii\db\ActiveQuery
     */
    public function getAccount(){
        return $this->hasOne(User_ad_video_account::className(),['video_id'=>'ad_id']);
    }
    /**
     * 获取状态
     * @return mixed
     */
    public function getStatus(){

        $status = $this::isAliVideo() ? $this->_getStatusAliVideo() : $this->_getStatusLetvVideo();
        return self::$statusArray[$status];
    }

    private function  _getStatusLetvVideo(){

        $videoInfo = [];
        if($this->video && $this->video->video_id){
            $videoInfo = Letv::getOne($this->video->video_id);
            $videoInfo = json_decode($videoInfo);
        }
        if(!($videoInfo->data  && $videoInfo->data->status && $videoInfo->data->status==10) ){
            $status = 0;
        }else if($this->account->money<=0){
            $status = 1;
        }else{
            $status = 2;
        }
        return $status;
    }

    private function  _getStatusAliVideo(){

        if($this->account->money<=0){
            $status = 1;
        }else{
            $status = 2;
        }
        return $status;
    }

    public function getUser(){
        return $this->hasOne(User::className(), ['user_id'=>'user_id']);
    }

    /**
     * 虚拟账户充值
     * @param $money
     * @return mixed
     */
    public function recharge($money, $comment=""){

        $result = $this->account->recharge($this, $money, $comment);
        if(!$result)
            $this->message = $this->account->message;
        return $result;
    }

    public function cash($money, $comment=""){

        $result = $this->account->cash($this, $money, $comment);
        if(!$result)
            $this->message = $this->account->message;
        return $result;
    }

    public function remove(){

        $delHandle = true;

        //退还金额到营销账户
        $money = $this->account->money;
        if($money > 0){
            $delHandle = $this->cash($money, '删除账户,退还金额到营销账户!');
        }
        if(!$delHandle)
            return false;
        else{

            $transcation = \Yii::$app->db->beginTransaction();
            try{

                //物理删除
                self::deleteAll(['ad_id'=>$this->ad_id]);

                //逻辑删除
                /*$dataModel = self::findOne(['ad_id'=>$this->ad_id]);
                $dataModel->deleted = $this::C_DELETED_YES;
                $dataModel->save();*/

                //删除region信息
                $regionModel = new User_ad_video_region();
                $regionModel->removeAllByAdId($this->ad_id);

                //删除云视频
                $video_id = $this->video->video_id;
                $letv = new Letv();
                $letv->video_del($video_id);

                //删除视频关联信息
                $this->unlink('video', $this->video, true);

                //删除对应虚拟账户记录
                $accountModel = User_ad_video_account::findOne(['video_id'=>$this->ad_id]);
                $accountModel->remove($this->ad_id);

                $transcation->commit();
                return true;
            }catch(Exception $e){
                $this->message = "出现异常,请稍后再试!";
                $transcation->rollBack();
                return false;
            }

        }
    }


}