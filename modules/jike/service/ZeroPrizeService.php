<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/21
 * Time: 11:27
 */

namespace app\modules\jike\service;


use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\jike\models\prize_codes\Prize_codes;
use app\modules\jike\models\prize_goods\Prize_goods;

class ZeroPrizeService extends BaseService
{

    private $prizeId;

    public $codeModel;

    public function __construct($prizeId, Prize_codes $prizeCodes)
    {
        $this->prizeId = $prizeId;
        $this->codeModel = $prizeCodes;
    }


    //抽奖第一步 1.抽取视频广告 2.保存抽奖号码

    public function getVideo(){
        $arr = range(1,10000,1);
        print_r($arr);
    }


    public function prize(){

        $result = false;
        $codeModel = $this->codeModel;
        $prizeId = $this->prizeId;
        $prizeModel = \app\modules\frontadmin\models\prize_goods\prize_goods::findOne(['prize_id'=>$prizeId]);
        $sku = $prizeModel->getZeroingSku();
        if($sku){
            $skuId = $sku->sku_id;
            $code = $codeModel->getLastCode($skuId);
            $code = $code == 0 ? 1E+9 : $code;
            $code += rand(1,10);
            $data = [
                'sku_id' => $skuId,
                'code' => $code,
                'user_id' => $this->getLoginUserId()
            ];
            $result = $codeModel->prize($data);
            if(!$result){
                $this->message = $codeModel->message;
            }
        } else {
            $this->message = $prizeModel->message;
        }

        return $result ? true : false;

    }

    /**
     * 抽奖已经参与人次
     * @return bool|int|string
     */
    public function getPrizeTimes(){

        $resulte = false;
        if(is_null($this->prizeId) || !is_numeric($this->prizeId)){
            $this->message = "id错误, 获取数据失败!";
        }
        else{
            if(Prize_goods::find()->where(['prize_id'=>$this->prizeId])->exists()){

                $goods = \app\modules\frontadmin\models\prize_goods\prize_goods::findOne(['prize_id'=>$this->prizeId]);
                $sku = $goods->getZeroingSku();
                if($sku){

                    $resulte = $this->codeModel->getAllUserPrizedTotalTimes($sku->sku_id, $this->getLoginUserId());
                } else {
                    $resulte = 0;
                }
            }else{
                $this->message = '数据不存在!';
            }
        }
        return $resulte;
    }

    public function getPrizeLeftTimes(){

        $resulte = false;
        if(is_null($this->prizeId) || !is_numeric($this->prizeId)){
            $this->message = "id错误, 获取数据失败!";
        }
        else{

            $prizeGoodsModel = new \app\modules\frontadmin\models\prize_goods\prize_goods();
            $totalTimes = $prizeGoodsModel->getTotalPrizeTimes($this->prizeId);
            if($totalTimes !== false){

                $times = $prizeGoodsModel->getHavePrizedTimes($this->prizeId);
                $resulte = $totalTimes - $times;
            }else{
                $this->message = '数据不存在!';
            }
        }
        return $resulte;
    }

    public function getUserTodayPrizeTimes(){

        if(is_null($this->prizeId) || !is_numeric($this->prizeId)){
            $this->message = "id错误, 获取数据失败!";
            $result = false;
        }
        else{
            $model = new Prize_codes();
            if(Prize_goods::find()->where(['prize_id'=>$this->prizeId])->exists()){

                $prizeGoods = \app\modules\frontadmin\models\prize_goods\prize_goods::findOne(['prize_id'=>$this->prizeId]);
                $sku = $prizeGoods->getZeroingSku();
                if($sku){

                    $result = $model->find()->where(['sku_id'=>$sku->sku_id])
                        ->andWhere(['user_id' => $this->getLoginUserId()])
                        ->andWhere([
                            'and',
                            ['>=', 'created_at', strtotime(date('Y-m-d',strtotime('0 day')))],
                            ['<', 'created_at', strtotime(date('Y-m-d', strtotime('+1 day')))],
                        ])->count();
                }
            }else{
                $this->message = '数据不存在!';
                $result = false;
            }
        }

        return $result;
    }

    /**
     * 获取商品数量
     * @return bool|mixed
     */
    public function getGoodsNumber(){

        $result = false;
        if(is_null($this->prizeId) || !is_numeric($this->prizeId)){
            $this->message = "id错误, 获取数据失败!";
        }
        else{
            $model = Prize_goods::find()->where(['prize_id' => $this->prizeId])->select('goods_number')->one();
            if(is_null($model) || !is_object($model) ||property_exists($model, 'goods_number')){
                $this->message = "数据不存在!";
            }else {
                $result = $model->goods_number;
            }
        }
        return $result;
    }



}