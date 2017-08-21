<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/21
 * Time: 20:46
 */

namespace app\modules\jike\models\user;


use app\modules\jike\models\BaseActiveRecord;

class User_info extends BaseActiveRecord
{
    public function rules()
    {
        return [
            ['user_id', 'required', 'on' => $this::SCENARIO_CREATE],
            ['city_id', 'safe', 'on' => $this::SCENARIO_CREATE]
        ];
    }


    public function create($data){

        $this->scenario = $this::SCENARIO_CREATE;
        if(!key_exists($this->formName(), $data))
            $data = [$this->formName() => $data];

        if($this->load($data) && $this->validate()){
            return $this->save();
        }else{
            $errors = $this->getFirstErrors();
            $this->message = $errors[0];
            return false;
        }
    }

}