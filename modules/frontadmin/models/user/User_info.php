<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/26
 * Time: 5:19
 */

namespace app\modules\frontadmin\models\user;


use app\modules\common\models\Region;
use app\modules\common\models\uploadform\AbstractUpload;
use app\modules\common\models\uploadform\Uploadform;
use app\modules\frontadmin\models\BaseActiveRecord;
use yii\base\Exception;

class User_info extends BaseActiveRecord
{

    /**
    +--------------------+
    | ui_id              |
    | user_id            |
    | city_id            |
    | head_pic           |
    | qq_space_address   |
    | sina_space_address |
    | wechat_address     |
    | wechar_ewm_pic     |
    | alipay_account     |
    | ALIPAY_USERNAME    |
    | love_points        |
    +--------------------+
     */

    public $user_name;
    public $head_pic_model;
    public $wechar_ewm_pic_model;

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
        $this->on(self::EVENT_BEFORE_UPDATE, [$this, 'afterUpdate']);
    }


    public function rules(){
        return [
        ];
    }

    public function attributeLabels()
    {
        return [
            'user_name' => '用户名',
            'head_pic' => '头像',
            'qq_space_address' => 'qq空间',
            'sina_space_address' => '新浪微博',
            'wechat_address' => '微信账号',
            'wechar_ewm_pic' => '微信二维码',
            'alipay_account' => '支付宝账号',
            'alipay_username' => '支付宝用户名',
            'love_points' => '爱心积分'
        ];
    }

    public function scenarios(){
        return [
            $this::SCENARIO_UPDATE => [
                'head_pic',
                'qq_space_address',
                'sina_space_address',
                'wechat_address',
                'wechar_ewm_pic',
                'alipay_account',
                'alipay_username',
                'love_points',
                'user_name'
            ]
        ];
    }

    /**
     * 用户信息编辑
     * @param $data
     * @return bool
     */
    public function edit($data){

        if(!key_exists($this::formName(), $data))
            $data = array($this::formName()=>$data);

        $this->scenario = $this::SCENARIO_UPDATE;

        $this->beginTransaction();
        try{
            if($this->load($data) && $this->validate()){

                $rsSaveUserinfo = $this->save();
                !$rsSaveUserinfo && $this->message = '保存失败!';

                $this->user->user_name = $this->user_name;
                $rsSaveUserTable = $this->user->save();

                //保存缓存表
                $uploadValues = $data['UploadForm'];
                Uploadform::updateColumnValue($this->ui_id, ['in', 'upload_id', $uploadValues]);
                //清除旧的columnValue
                Uploadform::clearColumnValue([
                    'and',
                    ['=','column_value',$this->ui_id],
                    ['=', 'table_name', AbstractUpload::TABLE_NAME_USER_INFO],
                    ['not in', 'upload_id', $uploadValues]
                ]);


                $this->commit();
                return $rsSaveUserinfo;
            }else{
                return false;
            }
        }catch(Exception $e){
            $this->rollback();
            return false;
        }

    }

    public function afterFind()
    {
        parent::afterFind(); // TODO: Change the autogenerated stub

        $this->head_pic_model = $this->getHeadPicModel();
        $this->wechar_ewm_pic_model = Uploadform::getItem(AbstractUpload::TABLE_NAME_USER_INFO, AbstractUpload::COLUMN_NAME_UI_WECHAR_EWM_PIC, $this->ui_id);
    }


    public function getUser(){
        return $this->hasOne(User::className(), ['user_id'=>'user_id']);
    }


    public function afterUpdate($event){

    }

    public function getLovePointsLevel(){

        $love_points = $this->love_points;
        if( is_null($love_points) || !is_numeric($love_points) )
            return false;

        if($love_points <=0 ){
            return 0;
        } else if($love_points <100){
            return 1;
        } else if($love_points >= 1000 && $love_points<10000){
            return 2;
        } else if( $love_points < 100000){
            return 3;
        } else if( $love_points < 1000000){
            return 4;
        } else{
            return 5;
        }
    }


    public function getCity(){
        if(!is_null($this->city_id) && $this->city_id>0){
            return Region::findOne(['ID'=>$this->city_id]);
        } else {
            return null;
        }
    }

    public function getHeadPicModel(){
        $headPicModel = Uploadform::getItem(AbstractUpload::TABLE_NAME_USER_INFO, AbstractUpload::COLUMN_NAME_UI_HEAD_PIC, $this->ui_id);
        return $headPicModel;
    }

}