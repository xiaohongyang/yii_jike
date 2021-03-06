<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/8
 * Time: 11:38
 */

namespace app\modules\frontadmin\models\user_ad_video;


use app\modules\common\traits\UserinfoTraite;
use app\modules\frontadmin\models\Rl_user_ad_video_video;
use app\modules\frontadmin\models\User_ad_video;
use app\modules\frontadmin\models\user_ad_video_account\User_ad_video_account;
use app\modules\frontadmin\models\User_ad_video_region;
use app\modules\frontadmin\models\video\video;
use yii\base\Exception;
use yii\log\Logger;

class User_ad_video_create extends User_ad_video
{

    public $formVideo;
    public $formRegions = null;
    use UserinfoTraite;

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub

        $this->on($this::EVENT_AFTER_INSERT, [$this, 'afterInseart']);

        $this->on($this::EVENT_AFTER_UPDATE, [$this, 'afterUpdate']);

        $this->on($this::EVENT_BEFORE_UPDATE, [$this, 'beforeUpdate']);
    }

    public function rules()
    {
        return [
            [['ad_title', 'user_id', 'formRegions'], 'required'],
            ['ad_id', 'safe'],
            ['link', 'safe'],
            ['link', 'safe', 'on' => $this::SCENARIO_UPDATE],
        ];
    }

    public function scenarios()
    {
        return [
            $this::SCENARIO_DEFAULT =>[
                'ad_title','user_id', 'formRegions' ,'ad_id', 'link'
            ],
            $this::SCENARIO_UPDATE =>[
                'ad_title','user_id', 'formRegions' ,'ad_id', 'link'
            ],
            $this::SCENARIO_REMOVE => [
                [['ad_id','deleted'],'required']
            ]
        ];
    }


    public static function tableName()
    {
        $model = new User_ad_video();
        return $model->tableName();
    }


    public function attributeLabels()
    {
        return [
            'ad_title' => '广告名称',
            'link' => '广告外链地址'
        ];
    }

    public function create($data)
    {

        if (is_array($data[$this->formName()]) && $data[$this->formName()]['ad_id']) {

            $model = $this->findOne(['ad_id' => $data[$this->formName()]['ad_id']]);
            return $model->edit($data);
        }

        $transaction = \Yii::$app->db->beginTransaction();
        try {

            \Yii::getLogger()->log('user_id', self::getLoingUserId(), Logger::LEVEL_INFO);
            $this->setAttribute('user_id', self::getLoingUserId());
            $this->formRegions = $data['regions'];
            if ($this->load($data) && $this->validate()) {

                if ( (empty($data['video']['video_id']) && $data['video']['video_id']!=0 ) || empty($data['video']['video_unique'])) {
                    $this->addError('video', "视频不能为空!");
                    return false;
                } else {

                    $this->formVideo = new video();
                    $this->formVideo->scenario = video::SCENARIO_CREATE;
                    $data['video']['user_id'] = self::getLoingUserId();
                    $this->formVideo->load($data);
                    $this->formVideo->scenario = video::SCENARIO_CREATE;
                    if (!$this->formVideo->validate()) {
                        $this->addError('formVideo', array_values($this->formVideo->getFirstErrors())[0]);
                        $this->message ="视频数据错误";
                        return false;
                    }
                }
                $rs = $this->save();
                $transaction->commit();
                return $rs;
            } else {
                $this->message = "验证失败!";
                return false;
            }
        } catch (\Exception $e) {
            $transaction->rollBack();
            $this->message = $e->getMessage();
            return false;
        }
    }

    public function edit($data)
    {

        $this->scenario = $this::SCENARIO_UPDATE;
        $transaction = \Yii::$app->db->beginTransaction();
        $this->setIsNewRecord(false);
        try {

            $this->setAttribute('user_id', self::getLoingUserId());
            $this->formRegions = $data['regions'];
            if ($this->load($data) && $this->validate()) {

                \Yii::getLogger()->log($data, Logger::LEVEL_ERROR);
                if ((empty($data['video']['video_id']) && "0"!==$data['video']['video_id']) || empty($data['video']['video_unique'])) {
                    $this->addError('video', "视频不能为空!");
                    return false;
                } else {

                    if(video::find()->where(['video_id' => $data['video']['video_id']])->count()>0){
                        $this->formVideo = video::findOne(['video_id' => $data['video']['video_id']]);
                        $this->formVideo->scenario = video::SCENARIO_UPDATE;
                    }else{
                        $this->formVideo = new video();
                        $this->formVideo->scenario = video::SCENARIO_CREATE;
                    }
                    $this->formVideo->load($data, 'video');
                    if (!$this->formVideo->validate()) {
                        $this->addError('formVideo', array_values($this->formVideo->getFirstErrors())[0]);
                        return false;
                    }
                }
                $rs = $this->save();

                $transaction->commit();
                return $rs;
            } else {
                return false;
            }
        } catch (\Exception $e) {
            $transaction->rollBack();
            return false;
        }
    }

    public function afterInseart($event)
    {

        $sender = $event->sender;

        //保存区域信息
        if (is_array($this->formRegions) && count($this->formRegions)) {
            $regionModel = new User_ad_video_region();
            $regionModel->batchCreate($sender->ad_id, $this->formRegions);
        }
        //保存视频关联信息
        if ($this->formVideo->validate() && $this->formVideo->save()) {

            $this->link('video', $this->formVideo);
        }

        //创建对应虚拟账户记录
        $accountModel = new User_ad_video_account();
        $accountModel->createAccount($sender->ad_id);
    }

    /**
     * 更新后置处理
     * @param $event
     */
    public function afterUpdate($event)
    {

        if( $this->scenario != $this::SCENARIO_UPDATE)
            return false;

        $sender = $event->sender;

        $regionModel = new User_ad_video_region();
        //1.删除区域信息
        $regionModel->removeAllByAdId($sender->ad_id);

        //2.取消原有的video关联,并删除云视频;  保存新的视频关联信息
        //
        $videoOld = Rl_user_ad_video_video::findOne(['ad_id' => $sender->ad_id]);
        if(!is_null($videoOld) && $videoOld->v_id != $this->formVideo->v_id){

            $this->unlink('video', $videoOld, true);
            video::findOne(['v_id'=>$videoOld->v_id])->remove();

            if ($this->formVideo->validate() && $this->formVideo->save()) {
                $this->link('video', $this->formVideo);
            }
        }else{
            if ($this->formVideo->validate() && $this->formVideo->save()) {
                $this->link('video', $this->formVideo);
            }
        }

        //3.保存区域信息
        if (is_array($this->formRegions) && count($this->formRegions)) {
            $regionModel->batchCreate($sender->ad_id, $this->formRegions);
        }

    }

    public function beforeUpdate($event)
    {

        $sender = $event->sender;
        $video = self::findOne(['ad_id' => $sender->ad_id]);
        //1.判断是否有修改视频的权限
        if (!$video || $video->user_id != $this->getLoingUserId()) {
            throw new Exception('这不是你的视频,禁止非法修改!');
        }
    }


}