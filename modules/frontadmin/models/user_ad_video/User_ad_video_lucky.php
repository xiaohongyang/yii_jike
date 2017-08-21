<?php
///**
// * Created by PhpStorm.
// * User: xiaohongyang
// * Date: 2016/5/16
// * Time: 22:31
// */
//
//namespace app\modules\frontadmin\models\user_ad_video;
//
//
//use app\modules\common\models\Region;
//use app\modules\frontadmin\models\publicvideo\Publicvideo;
//use app\modules\frontadmin\models\User_ad_video;
//use app\modules\frontadmin\models\User_ad_video_region;
//use app\modules\jike\service\BaseService;
//
//class User_ad_video_lucky
//{
//
//    private $_adVideoModel = null;
//    private $_service = null;
//    private $_publicVideoModel = null;
//
//
//    public function __construct()
//    {
//        $this->_adVideoModel = new User_ad_video();
//        $this->_service = new BaseService();
//        $this->_publicVideoModel = new Publicvideo();
//    }
//
//    //抽奖第一步 1.抽取视频广告 2.扣除广告费
//    public function luckyDrawStep01(){
//
//        $result = [
//            'code' => 0,
//            'video' => null
//        ];
//
//        $video = $this->getVideo();
//        if(!is_null($video)){
//            //抽奖视频广告
//            $result['code'] = 1;
//            $result['video'] = $video;
//        }else{
//            //公益视频广告
//            $count = $this->_publicVideoModel->find()->count();
//            if($count > 0){
//                $limit = rand(0,$count).' , 1';
//                $video = $this->_publicVideoModel->find()->limit($limit);
//                $result['code'] = 2;
//                $result['video'] = $video;
//            }else{
//                $this->message = "当前暂无视频";
//            }
//        }
//        return $result;
//    }
//
//    /**
//     * 抽取视频广告
//     */
//    public function getVideo(){
//
//        $model = new User_ad_video_region();
//
//        //获取省id
//        $sql=Region::find()->where(['ID'=>$this->_service->getUserCity()]);
//        $province = $sql->select('ParentId')->column();
//
//        $count = $this->getAdvideoTotalNumber($province[0]);
//        if(!$count > 0){
//            $this->message = '暂无需要的视频';
//            return null;
//        }
//        $idResult = $this->_adVideoModel->find()
//            ->where([ '>', 'account.money', 0 ])
//            ->andWhere([
//                'OR',
//                ['region.province' => $province],
//                ['region.city' => $this->_service->getUserCity()],
//                ['region.state' => 1]
//            ])
//            ->from('jike_user_ad_video_region as region')
//            ->leftJoin('jike_user_ad_video_account as account', 'account.video_id=region.ad_id')
//            ->limit(rand(1, $count) . ', 1')
//            ->one();
//
//        $video = $this->_adVideoModel->findOne(['ad_id'=>$idResult['ad_id']]);
//        return $video;
//    }
//
//    /**
//     * 获取可抽奖的视频总数
//     * @param $model
//     * @param $province
//     * @return mixed
//     */
//    private function getAdvideoTotalNumber($province){
//
//        $count = $this->_adVideoModel->find()->where([
//            '>', 'account.money', 0
//        ])
//        ->andWhere([
//            'OR',
//            ['region.province' => $province],
//            ['region.city' => $this->_service->getUserCity()],
//            ['region.state' => 1]
//        ])
//        ->from('jike_user_ad_video_region as region')
//        ->leftJoin('jike_user_ad_video_account as account','account.video_id=region.ad_id')
//        ->count();
//        return $count;
//    }
//
//}