<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/13
 * Time: 16:54
 */

namespace app\modules\jike\service;


use app\modules\common\traits\ApiPageTrait;
use app\modules\common\traits\FormatTrait;
use app\modules\common\traits\PageTrait;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\jike\models\prize_codes\Prize_codes;
use app\modules\jike\models\prize_goods\Prize_goods;
use yii\data\Pagination;

class PrizeGoodsService extends BaseService
{

    use PageTrait;
    use ApiPageTrait;
    use FormatTrait;


    public function getGoodsDetail($goodsId){

        if(is_null($goodsId) || !is_numeric($goodsId) || $goodsId<1){
            $this->message = '商品id错误!';
            return false;
        }

        return Prize_goods::findOne(['prize_id'=>$goodsId]);
    }

    /**
     * @param $goodsId
     * @return mixed|null
     */
    public function getGoodsVideo($goodsId){

        $detail = $this->getGoodsDetail($goodsId);

        $model = new Prize_codes();
        $codeService = new ZeroPrizeService($goodsId, $model);
        $todayTimes = $codeService->getUserTodayPrizeTimes();

        $result = null;
        if(!$this->getLoginUserId()){
            //判断用户是否登录
            $this->message = "您尚未登录，请先登录!";
        }else if(!is_null($detail)){
            //1商品是否存在 2.活动是否已经结束
            $video = $detail->videos;
            if(is_null($video)){
                $this->message = '视频不存在!';
            }else{
                $prizeCodeModel = new Prize_codes();
                $zeroService = new ZeroPrizeService($goodsId, $prizeCodeModel);
                $times = $zeroService->getPrizeLeftTimes();
                if(!$times){
                    $this->message = "活动已经结束，请选择其它活动!";
                } else if(is_numeric($todayTimes) && $todayTimes>= Prize_codes::DAY_PRIZE_LIMIT_TIMES){
                    //抽奖次数是否用完
                    $this->message = "您今天0元夺取本商品的机会已用完!";
                } else{
                    $result = $video;
                }
            }
        } else {
            $this->message = '商品不存在';
        }
        return $result;
    }


    public function getList(){

        $model = new Prize_goods();
        $query = $model->find();
        $query->where([
            'status' => Prize_order::C_STATUS_CHECKED_CHECKED_OK
        ]);

        $request = \Yii::$app->request;
        if($request->get('type_id')){
            $query->andWhere(['prize_type_id'=>$request->get('type_id')]);
        }

        $query->orderBy(' created_at desc ');

        $countQuery = clone $query;
        $pages = new Pagination([
            'totalCount' => $countQuery->count()
        ]);

        $this->setPages($pages);

        $this->setApiPages($countQuery->count(), \Yii::$app->request->get('per-page'), \Yii::$app->request->get('page'));

        $query->offset($pages->offset)
            ->limit($pages->limit);

        if($this->isFormatArray())
            $query->asArray();
        $models = $query->all();
        return $models;
    }

}