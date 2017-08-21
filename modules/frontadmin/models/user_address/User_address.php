<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/2
 * Time: 14:58
 */

namespace app\modules\frontadmin\models\user_address;


use app\modules\common\models\Region;
use app\modules\frontadmin\models\BaseActiveRecord;

class User_address extends BaseActiveRecord
{

    public $citySelect;

    public function rules()
    {
        return [
            [['consignee','address', 'mobile'], 'required', 'on'=>self::SCENARIO_CREATE],
            [
                ['province','city','distinct'], 'validateCitySelect', 'on' => self::SCENARIO_CREATE
            ],
            ['mobile', function($attribute){
                if(!is_numeric($this->$attribute) || strlen($this->$attribute) != 11)
                    $this->addError($attribute, "手机号必须为11位数字!");
            }]
        ];
    }

    function validateCitySelect($attribute, $param) {
        if(!$this->province || !$this->city)
            $this->addError('citySelect', '请选择所在地区');
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_CREATE => [
                'consignee','address', 'mobile', 'province','city','district','user_id', 'citySelect'
            ]
        ];
    }

    public function attributeLabels()
    {
        return [
            'consignee' => '收件人',
            'address' => '收件地址',
            'mobile' => '手机号码'
        ];
    }


    public function editAddress($data){

        $this->scenario = $this::SCENARIO_CREATE;
        if(!key_exists($this::formName(),$data))
            $data == [$this::formName() => $data];

        $data[$this->formName()]['user_id'] = $data[$this->formName()]['user_id']? :$this->getLoingUserId();
        if($this->load($data) && $this->validate()){
            return $this->save();
        }else{
            return false;
        }
    }

    public function getProvinceModel(){
        return $this->hasOne(Region::className(), ['ID' => 'province']);
    }

    public function getCityModel(){
        return $this->hasOne(Region::className(), ['ID' => 'city']);
    }
}