<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/6/10
 * Time: 21:12
 */

namespace app\modules\frontadmin\forms\usercenter;


use app\modules\frontadmin\models\BaseModel;

class MarAccountFlowInvoiceForm extends BaseModel
{

    public $invoiceTypeList;
    public $where;
    public $province;
    public $city;
    public $address;
    public $contacts;
    public $tel;
    public $title;

    public function attributeLabels()
    {
        return [
                'title' => '发票抬头',
                'contacts' => '联系人',
                'address' => '发票邮递地址',
                'province' => '省',
                'tel' => '联系电话',
        ];
    }

    public function rules()
    {
        return [
            [['contacts','address','province','city','tel'], 'required'],
            ['city', 'required', 'message' => '请选择所在地区']
        ];
    }


}