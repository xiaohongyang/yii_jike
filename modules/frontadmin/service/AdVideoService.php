<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/7
 * Time: 21:24
 */

namespace app\modules\frontadmin\service;


use app\modules\frontadmin\models\User_ad_video;
use app\modules\frontadmin\models\user_ad_video\User_ad_video_create;
use app\modules\frontadmin\models\user_ad_video\User_ad_video_list;
use app\modules\frontadmin\models\user_ad_video_account\User_ad_video_account;
use yii\data\ActiveDataProvider;
use yii\log\Logger;

class AdVideoService extends BaseService
{

    public $adVideo=null;
    private static $createModel = null;

    public function __construct()
    {
        $this->adVideo = new User_ad_video();
    }

    public function getList(){

        $query = User_ad_video_list::find();
        $query->where(['deleted'=>User_ad_video::C_DELETED_NO]);
        $query->andWhere(['user_id' => $this->getLoginUserId()]);

        $provider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => 10
            ]
        ]);

        $query->orderBy(' updated_at desc ');

        return $provider;
    }

    public function getCreateModel(){

        if( is_null(self::$createModel))
            self::$createModel = new User_ad_video_create();
        return self::$createModel;
    }

    public function create($data){

        $model = $this->getCreateModel();

        $id = $data[$model->formName()]['ad_id'];
        if($id)
            return $this->edit($data);

        $result = $model->create($data);
        if(!$result)
            $this->message = $model->message?:'发布失败!';
        else
            $this->message = '发布成功!';

        \Yii::getLogger()->log(['data'=>$data, 'error'=>$model->getFirstErrors(), 'message'=>$this->message], Logger::LEVEL_ERROR, 'video');

        return $result;
    }

    private function edit($data){

        $id = $data[$this->getCreateModel()->formName()]['ad_id'];

        $model = User_ad_video_create::findOne(['ad_id'=> $id]);
        $result = $model->edit($data);
        if(!$result)
            $this->message = $model->getFirstErrors2String()? $model->getFirstErrors2String() :'更新失败!3344';
        else
            $this->message = '更新成功!';

        return $result;
    }


    /**
     * 删除视频
     * @param $adId
     * @return bool
     */
    public function remove($adId){

        $model = User_ad_video::findOne(['ad_id'=>$adId]);
        $result = $model->remove();

        if(!$result)
            $this->message = $model->message;
        return $result;
    }

    /**
     * 虚拟账户充值
     * @param $adId
     * @param $money
     * @return mixed
     */
    public function recharge($adId, $money, $comment="充值"){

        if(is_null($adId) || !is_numeric($adId) || is_null($money) ||!is_numeric($money)){
            $this->message = "数据不正确!";
            return false;
        }

        $video = User_ad_video::findOne(['ad_id'=>$adId]);
        $result = $video->recharge($money, $comment);
        if(!$result)
            $this->message = $video->message;
        return $result;
    }

    /**
     * 提现
     * @param $adId
     * @param $money
     * @param string $comment
     * @return bool
     */
    public function cash($adId, $money, $comment='提现'){

        if(is_null($adId) || !is_numeric($adId) || is_null($money) ||!is_numeric($money)){
            $this->message = "数据不正确!";
            return false;
        }

        $video = User_ad_video::findOne(['ad_id'=>$adId]);
        $result = $video->cash($money, $comment);
        if(!$result)
            $this->message = $video->message;
        return $result;
    }

    public function getAccountLogs($adId=null){

        if(is_null($adId) || empty($adId) || !is_numeric($adId)){
            $this->message = '账户id错误!';
        }

        $orders = $this->adVideo->findOne(['ad_id'=>$adId])->account->user_ad_video_account_order;
        return $orders;
    }
}