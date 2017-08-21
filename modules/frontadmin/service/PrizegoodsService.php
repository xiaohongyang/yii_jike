<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/24
 * Time: 20:50
 */

namespace app\modules\frontadmin\service;


use app\modules\common\models\uploadform\AbstractUpload;
use app\modules\common\models\uploadform\Uploadform;
use app\modules\common\traits\PageTrait;
use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\models\prize_type\prize_type;
use app\modules\frontadmin\models\user_account\User_account;
use app\modules\jike\models\BaseActiveRecord;
use app\modules\jike\models\prize_codes\Prize_codes;
use app\modules\jike\service\BaseService;
use yii\data\Pagination;

class PrizegoodsService extends BaseService
{
    use PageTrait;
    public $prizegoods;
    public $prizegoodsType;
    private $prizeId;



    public function __construct()
    {
        $this->prizegoods = new prize_goods();
        $this->prizegoodsType = new prize_type();
    }

    public function getDetail($prizeId){
        return $this->prizegoods->find()->where(['prize_id'=>$prizeId])->one();
    }

    public function getList(){

        $model = $this->prizegoods;
        $query = $model->find();
        $query->where([
            'user_id' => $this->getLoginUserId()
        ]);
        $query->andWhere([
            '!=',
            'status',
            4
        ]);
        $query->orderBy(' created_at desc ');

        $countQuery = clone $query;
        $pages = new Pagination([
                'totalCount' => $countQuery->count()
            ]);
        $this->setPages($pages);


        $models = $query->offset($pages->offset)
            ->limit($pages->limit)
            ->all();

        /*$dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => 10
            ]
        ]);*/

        return $models;
    }

    public function getIndexList(){
        $model = $this->prizegoods;
        $query = $model->find()->where([
            'in','prize_id',Uploadform::find()
                ->where(['=','table_name',AbstractUpload::TABLE_NAME_PRIZE_GOODS])
                ->andWhere(['=','file_desc',AbstractUpload::FILE_DESC_PRIZE_GOODS_IMAGE])
                ->andWhere(['=', 'status' , prize_goods::C_STATUS_CHECKED_OK])
                ->select('column_value')
                ->orderBy('prize_id desc')
            ])->orderBy('prize_id desc' );

        $typeId = \Yii::$app->request->get('type_id');
        if(!is_null($typeId) && $typeId!=0)
            $query->andWhere(['prize_type_id'=>$typeId]);

        $queryCount = clone $query;
        $pagination = new Pagination([
            'totalCount' => $queryCount->count(),
            'pageSize' => 48
        ]);

        $result = $query->offset($pagination->offset)
                    ->limit($pagination->limit)
                    ->all();

        $this->setPages($pagination);
        return $result;
    }

    public function getTypelist(){
        $model = $this->prizegoodsType;
        $list = $model->find()->all();
        return $list;
    }


    /**
     * 设置库存数量
     * @param null $number
     * @return bool
     */
    public function setGoodsNumber($number=null){

        $result = false;
        if(is_null($this->prizeId) || !is_numeric($this->prizeId)){
            $this->message = "id错误, 获取数据失败!";
        } else if(is_null($number) || !is_numeric($number) ){
            $this->message = "商品数量必需是>=0的整数!";
        }else{
            //投入多少份活动就要冻结多少份保证金
            // 1.获取当前数量
            // 2.abs(当前库存量-设置数据)=要变量的数量 如果等于0则数量不需要变化
            // 3.当前库存量-设置数据 > 0 ? 撤销保证金 : 冻结保证金
            $currentGoodsNumber = Prize_goods::find()->where(['prize_id' => $this->prizeId])->select('goods_number')->one()->getAttribute('goods_number');
            $amount = $currentGoodsNumber - $number;
            if($amount == 0)
                $this->message = "库存数量没有改变!";
            else if($amount > 0){
                $result = $this->subGoodsNumber(abs($amount));
            }else{
                $result = $this->addGoodsNumber(abs($amount));
            }
        }
        return $result;
    }

    /**
     * 增加库存 (1.设置goods_number 2.冻结保证金)
     * @param $amount 要增加的数量
     * @return bool
     */
    public function addGoodsNumber($amount=0){

        $result = false;
        //增加库存量
        $goodsModel = prize_goods::findOne(['prize_id' => $this->getPrizeId()]);
        if(is_null($goodsModel))
            $this->message = "数据不存在,或者已经被删除!";
        else if($goodsModel->user_id != $this->getLoginUserId()){
            $this->message = "没有权限,这不是您的商品!";
        }else{

            $result = $goodsModel->addGoodsNumber($amount);
            $total = $goodsModel->market_price*$amount;
            if($result){
                $this->message = "设置成功，已冻结活动保证金=奖品市场价值*增加数量={$goodsModel->market_price}*{$amount}={$total}活动结束，奖品发货完成，返回保证金...";
            }else{
                if($goodsModel->errorCode == User_account::ERROR_MONEY_NOT_ENOUGH)
                    $this->message = "保证金余额不足，设置失败...活动须冻结保证金=奖品市场价值*增加数量={$goodsModel->market_price}*{$amount}={$total}奖品发货完成，返回保证金...请先前往充值.";
                else
                    $this->message = $goodsModel->message;
            }
        }
        return $result;
    }

    /**
     * 撤销库存
     * @param $amount 要撤销的数量
     * @return bool
     */
    public function subGoodsNumber($amount=0){

        $result = false;
        if(is_null($amount) || !is_int($amount) || $amount==0)
            $this->message = "数量必需是>0的整数!";
        $goodsModel = prize_goods::findOne(['prize_id' => $this->getPrizeId()]);
        if(is_null($goodsModel))
            $this->message = "数据不存在,或者已经被删除!";
        if($goodsModel->user_id != $this->getLoginUserId()){
            $this->message = "没有权限,这不是您的商品!";
        }else{
            //减少库存量
            $result = $goodsModel->subGoodsNumber($amount);
            if($result){
                $total = $goodsModel->market_price*$amount;
                $this->message = "设置成功，已退还保证金...退还额=奖品市场价值*减少数量={$goodsModel->market_price}*{$amount}={$total}元，请及时查收...";
            }else{
                $this->message = $goodsModel->message;
            }
        }
        return $result;
    }


    /**
     * 开启一元即开活动  (冻结市场等额保证金)
     * @return  bool
     */
    public function enableOneMoneyBuy(){
        $result = false;
        if(is_null($this->prizeId) || !is_numeric($this->prizeId)){
            $this->message = "id错误, 获取数据失败!";
        }else{

            //冻结保证金
            $goodsModel = Prize_goods::findOne(['prize_id' => $this->prizeId]);
            if(is_null($goodsModel)){
                $this->message = "数据不存在或已经被删除";
            }else if($goodsModel->one_money_status == Prize_goods::C_ONE_MONEY_STATUS_ENABLE){
                $this->message = "目前已经处于开启状态,无需重复开启";
            }else {
                $result = $goodsModel->enableOneMoneyBuy();
                $this->message = $goodsModel->message;
            }
        }
        return $result;
    }


    /**
     * 设置一元即开状态
     * @param int $status 开启状态
     * @return bool
     */
    public function disableOneMoneyBuy(){
        $result = false;
        if(is_null($this->prizeId) || !is_numeric($this->prizeId)){
            $this->message = "id错误, 获取数据失败!";
        }else{
            //冻结保证金
            $goodsModel = Prize_goods::findOne(['prize_id' => $this->prizeId]);
            if(is_null($goodsModel)){
                $this->message = "数据不存在或已经被删除";
            }else if($goodsModel->one_money_status == Prize_goods::C_ONE_MONEY_STATUS_DISABLE){
                $this->message = "目前已经处理关闭状态,无需重复关闭";
            }else{

                $result = $goodsModel->disableOneMoneyBuy();
                $this->message = $goodsModel->message;
            }
        }
        return $result;
    }


    public function remove(){
        $result = false;
        if(is_null($this->prizeId) || !is_numeric($this->prizeId)){
            $this->message = "id错误, 获取数据失败!";
        }else{
            //冻结保证金
            $goodsModel = Prize_goods::findOne(['prize_id' => $this->prizeId]);
            if(is_null($goodsModel)){
                $this->message = "数据不存在或已经被删除";
            }else if($goodsModel->status == prize_goods::C_STATUS_DELETED){
                $this->message = "删除成功!";
                $result = true;
            }else{
                $result = $goodsModel->remove();
                $this->message = $goodsModel->message;
            }
        }
        return $result;
    }

    public function cashPrize($codeId){

        $order = new Prize_order();
        $result = $order->create($codeId);
        $this->message = $this->message ? : $order->message;
        return $result;
    }









    /**
     * @return mixed
     */
    public function getPrizeId()
    {
        return $this->prizeId;
    }

    /**
     * @param mixed $prizeId
     */
    public function setPrizeId($prizeId)
    {
        $this->prizeId = $prizeId;
    }


}