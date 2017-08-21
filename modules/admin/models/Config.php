<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/9/24
 * Time: 22:39
 */

namespace app\modules\admin\models;


use app\modules\jike\models\BaseActiveRecord;

class Config extends BaseActiveRecord
{


    public function rules()
    {
        return [
            [['name', 'value'], 'required', 'on'=> self::SCENARIO_CREATE],
            ['name', 'unique', 'on' => self::SCENARIO_CREATE],

            [['config_id','value'], 'required', 'on'=> self::SCENARIO_EDIT],
            ['name', 'unique', 'on' => self::SCENARIO_EDIT],
            ['value', 'safe']
        ];
    }

    public function attributeLabels()
    {
        return [
            'name' =>  '配置项名称',
            'value' =>  '配置项值',
        ];

    }


    public function create($params){

        $params = is_array($params) ? $params : [];

        if(is_array($params) && !key_exists(self::formName(), $params))
            $params = [self::formName() => $params];
        $this->scenario = key_exists('config_id', $params[self::formName()]) && $params[self::formName()]['config_id'] ?
            self::SCENARIO_EDIT : self::SCENARIO_CREATE;

        if($this->scenario == self::SCENARIO_EDIT){
            //编辑
            $modal = $this->findOne($params[self::formName()]['config_id']);
            if( $modal->load($params) && $modal->validate() ){

                $rs = $modal->save();
                $this->message = $rs ? '编辑成功!' : '';
                return $rs;
            }
        }else if( $this->load($params) && $this->validate() ){

            $rs = $this->save();
            $this->message = $rs ? '添加成功!' : '';
            return $rs;
        }
        return false;
    }

    public function remove($params){

        if(is_array($params) && key_exists('id', $params) && $id=$params['id']){

            $model = Config::find()->where(['config_id' => $id])->one();
            return $model->delete();
        }else {
            $this->message = '参数错误!';
            return false;
        }
    }

}