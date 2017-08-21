<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/3
 * Time: 20:11
 */

namespace app\modules\frontadmin\models\goods_sku;


use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\jike\models\prize_codes\Prize_codes;
use yii\base\Exception;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;

class Goods_sku extends BaseActiveRecord
{

    const C_PRIZE_STATUS_WIN_YES = 2;
    const C_PRIZE_STATUS_WIN_NO = 1;

    const C_PRIZE_TYPE_ZERO = 1;
    const C_PRIZE_TYPE_ONE_MONEY = 2;

    public function behaviors()
    {
        return [
          [
              'class' => TimestampBehavior::className()
          ]
        ];
    }


    public function rules()
    {
        return [
            [['prize_id'], 'required', 'on'=>self::SCENARIO_CREATE]
        ];
    }

    public function scenarios()
    {
        return ArrayHelper::merge(parent::scenarios(), [
            self::SCENARIO_CREATE => [
                'prize_id', 'prize_status', 'prize_type'
            ]
        ]);
    }


    /**
     * 获取正在进行0元夺宝的sku , 如果没有则返回false
     * @param $prizeId
     * @return array|null|\yii\db\ActiveRecord
     */
    public function getZeroingSku($prizeId){

        $result = self::find()->where([
            'and',
            ['prize_id' => $prizeId],
            ['prize_status' => self::C_PRIZE_STATUS_WIN_NO],
            ['prize_type' => self::C_PRIZE_TYPE_ZERO]
        ])->one();

        return is_null($result) ? false : $result;
    }

    /**
     * 创建0元夺宝sku 并返回sku id。创建失败则返回false
     * @param $prizeId
     * @return bool|mixed
     */
    public function createZeroSku($prizeId){

        $result = false;
        $data = [
            self::formName() => [
                'prize_id' => $prizeId,
                'prize_status' => self::C_PRIZE_STATUS_WIN_NO,
                'prize_type' => self::C_PRIZE_TYPE_ZERO
            ]
        ];
        $this->scenario = self::SCENARIO_CREATE;
        if($this->load($data) && $this->validate() && $this->save())
            $result = $this;
        else
            $this->message = $this->getFirstErrors()[0];
        return $result;
    }

    /**
     * 获取对应商品
     * @return \yii\db\ActiveQuery
     */
    public function getPrizeGoods(){

        return $this->hasOne(prize_goods::className(), [
            'prize_id' => 'prize_id'
        ]);
    }

    /**
     * 添加1元即开 sku
     * @param $prizeId
     * @param int $code 抽奖编码
     * @param int $prizeStatus 是否抽奖成功
     * @return Goods_sku|bool
     */
    public function createOneMoneySku($prizeId, $code=0, $prizeStatus=self::C_PRIZE_STATUS_WIN_NO){

        $result = false;

        $this->beginTransaction();
        try{
            $data = [
                self::formName() => [
                    'prize_id' => $prizeId,
                    'prize_status' => $prizeStatus,
                    'prize_type' => self::C_PRIZE_TYPE_ONE_MONEY
                ]
            ];
            $this->scenario = self::SCENARIO_CREATE;
            if($this->load($data) && $this->validate() && $this->save()){
                $result = $this;
                $prizeCodesModel = new Prize_codes();
                $resultPrizeCodes = $prizeCodesModel->oneMoneyPrize([
                    'sku_id' => $this->sku_id,
                    'code' => $code,
                    'user_id' => $this->getLoingUserId(),
                    'prize_status' => $prizeStatus
                ]);
                if($result = $resultPrizeCodes){
                    $this->commit();
                }
                else{
                    $this->message = $this->message ? : $prizeCodesModel->message;
                    $this->rollback();
                }
            }else{
                $this->message = $this->getFirstErrors()[0];
                $this->rollback();
            }
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $result;
    }

}