<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/17
 * Time: 18:14
 */

namespace app\modules\frontadmin\service;

use app\modules\common\models\Region;
use app\modules\common\traits\VideoTraite;
use app\modules\frontadmin\models\publicvideo\Publicvideo;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\frontadmin\models\user_account\User_account_log;
use app\modules\frontadmin\models\User_ad_video;
use app\modules\frontadmin\models\user_ad_video_account\User_ad_video_account;
use app\modules\frontadmin\models\User_ad_video_region;
use app\modules\jike\service\BaseService;
use yii\base\Exception;

class User_ad_video_luckyService extends BaseService
{

    use VideoTraite;

    private $_adVideoModel = null;
    private $_service = null;
    private $_publicVideoModel = null;
    const INTEGRATE_LUCKY_VALUE = 5;    //抽奖获赠积分值
    const C_CASH_VIDEO_ACCOUNT = 5;     //视频对应虚拟账户要扣除的金额


    public function __construct()
    {
        $this->_adVideoModel = new User_ad_video();
        $this->_service = new BaseService();
        $this->_publicVideoModel = new Publicvideo();
    }

    //抽奖第一步 1.抽取视频广告 2.扣除广告费
    public function luckyDrawStep01(){

        $result = [
            'code' => 0,
            'video' => null
        ];

        $video = $this->getVideo();
        if(!is_null($video)){

            //抽奖视频广告
            $result['code'] = 1;
            $result['video'] = $video;
            //扣除推广金额
            if($video instanceof User_ad_video){
                $account = $video->account;
                if($account instanceof User_ad_video_account)
                    $account->cash($video, $this::C_CASH_VIDEO_ACCOUNT, '视频抽奖，推广费用扣除', $this->getUserCity());
            }
        }else{
            //公益视频广告
            $count = $this->_publicVideoModel->find()->count();
            if($count > 0){
                $limit = rand(0,$count).' , 1';
                $video = $this->_publicVideoModel->find()->limit($limit);
                $result['code'] = 2;
                $result['video'] = $video;
            }else{
                $this->message = "当前暂无视频";
            }
        }
        return $result;
    }


    /**
     * 抽奖第二步
     * 1.如果用户未登录,提示尚未登录，抽奖无效
     * 2.如果用户已经登录，给会员积分账户充值0.05元
     */
    public function luckyDrawStep02(){
        if(is_null($this->_service->getLoginUserId()))
            return 0;
        else{

            $times = User_account_log::find()->where([
                'user_id' => $this::getLoginUserId()
                ])->andWhere([
                    'and',
                    ['<', 'created_at', strtotime(date('Y-m-d', strtotime('+1 days')))],
                    ['>', 'created_at', strtotime(date('Y-m-d', strtotime('+0 days')))]
                ])->count();
            if($times >= 3){
                $this->message = "抽奖失败,您今天抽奖超过三次,请一天后再抽奖,谢谢！";
                return -1;
            }

            //给用户积分账户充值0.05元
            $accountModel = User_account::findOne(['user_id'=>$this::getLoginUserId()]);
            $transation = \Yii::$app->getDb()->beginTransaction();
            try{

                if($accountModel instanceof User_account){

                    //积分账户充值
                    $accountModel->recharge($this::INTEGRATE_LUCKY_VALUE, User_account::C_ACCOUNT_INTEGRATE);
                }

                //添加账户变量记录
                $opAccount = $accountLogModel = new User_account_log();
                $opLog = $accountLogModel->create([
                    'integrate_account' => $this::INTEGRATE_LUCKY_VALUE,
                    'change_type' => User_account_log::C_CHANGE_TYPE_98
                ], User_account_log::C_ACTION_JIFENCHOUJIANG);

                if($opAccount && $opLog)
                    $transation->commit();
                else{
                    $this->message = '操作失败!';
                    return -1;
                }
            }catch(Exception $e){
                $transation->rollBack();
                $this->message = "积分充值失败,请稍后再试!";
                return -1;
            }
            return 1;
        }
    }

    /**
     * 抽取视频广告
     */
    public function getVideo(){

        $model = new User_ad_video_region();

        //获取省id
        $sql=Region::find()->where(['ID'=>$this->_service->getUserCity()]);
        $province = $sql->select('ParentId')->column();
        //获取地区id
        $sqlArea=Region::find()->where(['ID'=> $province]);
        $areaId = $sqlArea->select('ParentId')->column();

        if(is_array($province) && count($province)) {
            $provinceId = $province[0];
        } else {
            $provinceId = 1;
        }


        $query = $this->_adVideoModel->find()
            ->where([
                'and',
                ['>', 'account.money', 0],
                ['video.deleted' => 0]
            ]);

        $userCity = $this->_service->getUserCity();
        if(!is_null($province) && $province && !is_null($userCity) && $userCity){
            $query->andWhere([
                'OR',
                ['region.area' => $areaId],
                ['region.province' => $province],
                ['region.city' => $this->_service->getUserCity()],
                ['state' => 1]  //全中国
            ]);



        }

        //不抽自己发布的视频
        /*if($this->getLoginUserId()){
            $query->andWhere([
                '!=',
                'video.user_id',
                $this->getLoginUserId()
            ]);
        }*/

        $query->from('jike_user_ad_video_region as region')
            ->leftJoin('jike_user_ad_video_account as account', 'account.video_id=region.ad_id')
            ->leftJoin('jike_user_ad_video as video', 'video.ad_id=region.ad_id')
            ->innerJoin('jike_rl_user_ad_video_video as video_rl', 'video_rl.ad_id=video.ad_id');

        if($this::isAliVideo()){
          $query->innerJoin('jike_video as video_content', 'video_content.v_id=video_rl.v_id and video_content.video_id=0');
        }


        $queryTotal = clone $query;

        $sql = $queryTotal->createCommand()->rawSql;

        $count = $queryTotal->count();
        if(!$count > 0){
            $this->message = '暂无需要的视频';
            return null;
        } else {
            $position = rand(0, $count-1);
            $query->offset($position);
            $query->limit(1);
            $idResult = $query->one();
            $sql = $query->createCommand()->rawSql;

            $video = $this->_adVideoModel->findOne(['ad_id'=>$idResult['ad_id']]);
            return $video;
        }
    }

    /**
     * 获取可抽奖的视频总数
     * @param $model
     * @param $province
     * @return mixed
     */
    private function getAdvideoTotalNumber($province){

        $userCity = $this->_service->getUserCity();

        $query = $this->_adVideoModel->find();

        $query->from('jike_user_ad_video video');
        $query->leftJoin('jike_user_ad_video_region as region', 'video.ad_id=region.ad_id')
        ->leftJoin('jike_user_ad_video_account as account','video.ad_id=account.video_id');
        $query->where([
            '>', 'account.money', 0
        ]);

        if(!is_null($userCity) && $userCity && is_null($province) && $province){
            $query->andWhere([
                'OR',
                ['region.province' => $province],
                ['region.city' => $this->_service->getUserCity()],
            ]);
        }

        $query->orWhere([
                'region.state' => 1
            ]);

        $count = $query->count();
        return $count;
    }
}