<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/10
 * Time: 21:12
 */

namespace app\modules\frontadmin\models\user_mar_account_flow_invoice;


use app\modules\common\models\Region;
use app\modules\frontadmin\models\BaseActiveRecord;
use app\modules\frontadmin\models\user_mar_account_flow\User_mar_account_flow;

class User_mar_account_flow_invoice extends BaseActiveRecord
{

/*`invoice_id` int(10) unsigned
`invoice_type` tinyint(3) uns
`province` mediumint(8) unsig
`city` mediumint(8) unsigned
`address` varchar(255) NOT NULL
`contacts` varchar(50) NOT NU
`tel` varbinary(50) NOT NULL
`title` varchar(100) NOT NULL
`flow_id` int(10) unsigned NO
PRIMARY KEY (`invoice_id`)*/

    const C_INVOICE_TYPE_1_PERSON = 1;  //个人发票
    const C_INVOICE_TYPE_2_COMPANY = 2;  //公司发票

    public function rules(){
        return [
            [['invoice_type', 'province', 'city', 'address', 'contacts', 'tel', 'flow_id'],
                'required', 'on' => self::SCENARIO_CREATE
            ],
            ['flow_id', 'number', 'on' => self::SCENARIO_CREATE],
            ['title', 'validateTitle', 'on' => self::SCENARIO_CREATE]
        ];
    }

    public function validateTitle($attribute, $params){

        if($this->invoice_type == self::C_INVOICE_TYPE_2_COMPANY && (is_null($this->title) || empty($this->title))){
            $this->addError($this->$attribute, '发票类型不能为空!');
        }
    }

    public function create($data, $flowId=null){

        if(is_array($data) && !key_exists($this->formName(), $data))
            $data = [$this->formName() => $data];

        $this->scenario = self::SCENARIO_CREATE;
        $this->setAttribute('flow_id', $flowId);

        if($this->load($data) && $this->validate()){

            return $this->save();
        } else {
            return false;
        }
    }

    public function getFlow(){
        return $this->hasOne(User_mar_account_flow::className(), ['id'=>'flow_id']);
    }

    public function getProvinceModel(){
        return $this->hasOne(Region::className(), ['ID'=>'province']);
    }
    public function getCityModel(){
        return $this->hasOne(Region::className(), ['ID'=>'city']);
    }
    public function getDistrictModel(){
        return $this->hasOne(Region::className(), ['ID'=>'district']);
    }


}