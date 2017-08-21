<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/2
 * Time: 16:04
 */

namespace app\modules\frontadmin\models;


class User_ad_video_region extends BaseActiveRecord
{

    public function rules()
    {
        return [
            ['ad_id','required']
        ];
    }

    /**
     * 添加地区
     * eg. create(3,'r1')
     * @param $adId
     * @param $regionStrOrArray
     * @return bool
     */
    public function create($adId, $regionStrOrArray){

        if(is_null($adId) || !is_numeric($adId))
            return false;
        if(is_null($regionStrOrArray))
            return false;
        else {

            //如果不是数组则通过自定义规则转化为数组
            if(!is_array($regionStrOrArray))
                $regionStrOrArray = $this->getDataFormat($adId,$regionStrOrArray);

            $model = new User_ad_video_region();
            $model->setAttributes($regionStrOrArray, false);
            if(!$model->validate()){
                return false;
            } else{
                return $model->save();
            }
        }
    }

    /**
     * 批量添加地区
     * eg. batchCreate(89,['r1','a2','p3','c4','p3','p3','t6'])
     * @param $adId
     * @param $regionValues
     * @return bool
     */
    public function batchCreate($adId, $regionValues){

        if(is_null($adId) || !is_numeric($adId))
            return false;
        if(!is_array($regionValues) || !count($regionValues)>0)
            return false;

        $regionValues = array_unique($regionValues);
        $result = true;
        foreach($regionValues as $region){
            if(!$this->create($adId, $region))
                $result = false;
        }
        return $result;
    }

    public function batchDelete($adId){
        return $this->deleteAll(['ad_id'=>$adId]);
    }

    /**
     * 删除指定视频的所有地区信息
     * @param $adId
     * @return int
     */
    public function removeAllByAdId($adId){
        return self::deleteAll(['ad_id'=>$adId]);
    }


    public function toFormatString(){

        if($this->state>0)
            return 'r'.$this->state;
        else if($this->area > 0)
            return 'a'.$this->area;
        else if($this->province > 0)
            return 'p'.$this->province;
        else if($this->city > 0)
            return 'c'.$this->city;
        else if($this->district > 0)
            return 't'.$this->district;
        else return '';
    }

    /**
     * 从格式化过的数据中获取数据
     * @param $adId
     * @param $regionValue
     * @return array|null
     */
    private function getDataFormat($adId,$regionValue){

        if(is_null(!$regionValue) || empty($regionValue))
            return null;

        $type = substr($regionValue,0,1);
        $regionValue = substr($regionValue,1);

        $data = null;
        switch($type){
            case 'r': $data = $this->dataFormat($regionValue); break;
            case 'a': $data = $this->dataFormat(0, $regionValue); break;
            case 'p': $data = $this->dataFormat(0, 0, $regionValue); break;
            case 'c': $data = $this->dataFormat(0, 0, 0, $regionValue); break;
            case 't': $data = $this->dataFormat(0, 0, 0, 0, $regionValue); break;
            default : break;
        }
        $data['ad_id'] = $adId;
        return $data;
    }
    private function dataFormat($state=0, $area = 0, $province = 0, $city = 0, $district = 0){
        return [
            'state' => $state,
            'area' => $area,
            'province' => $province,
            'city' => $city,
            'district' => $district
        ];
    }

}