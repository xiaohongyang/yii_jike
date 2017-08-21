<?php
/**
 * 保证金账户提取目标账户信息表
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/23
 * Time: 20:51
 */

namespace app\modules\frontadmin\models\user_fro_account_flow_cashuser;


use app\modules\frontadmin\models\BaseActiveRecord;

class User_fro_account_flow_cashuser extends BaseActiveRecord
{

    public function rules(){

        return [
            [['flow_id', 'account', 'user'], 'required', 'on' => self::SCENARIO_CREATE],
        ];
    }

    public function scenarios()
    {
        return[
            self::SCENARIO_CREATE => [
                'flow_id', 'account', 'user'
            ]
        ];
    }


    /**
     * 创建
     * @param $data
     * @return bool
     */
    public function create($data){

        if(is_array($data) && key_exists($this->formName(), $data) == false)
            $data = [$this->formName() => $data];

        return $this->_create($data);
    }

    /**
     * 定制化创建
     * @param $flowId
     * @param $account
     * @param $user
     * @return bool
     */
    public function createCustomized($flowId, $account, $user){

        $data = [
            'flow_id' => $flowId,
            'account' => $account,
            'user' => $user
        ];
        return $this->create($data);
    }

    private function _create($data){

        $this->scenario = self::SCENARIO_CREATE;
        if($this->load($data) && $this->validate()){

            return $this->save();
        } else {
            return false;
        }
    }

}