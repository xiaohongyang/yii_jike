<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/20
 * Time: 17:29
 */

namespace app\ext\org\area;


use app\ext\org\net\IpLocation;
use app\modules\api\models\Region;
use yii\base\ErrorException;

class AreaTools
{

    /**
     * 获取当前城市地址
     * @return [json]
     * {"ret":1,"start":"58.208.0.0","end":"58.211.255.255","country":"\u4e2d\u56fd","province":"\u6c5f\u82cf","city":"\u82cf\u5dde","district":"","isp":"\u7535\u4fe1","type":"","desc":""}
     */
    public static function getCurrentCity(){

        try{

//            return null;
            $data = file_get_contents('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip='.get_client_ip());
            $data = (array)json_decode($data);

            if (!$data['city']) {
                $myip = get_client_ip(0);
                $Ip = new IpLocation('UTFWry.dat');
                $location = $Ip->getlocation($myip);
                //地址
                $area = iconv('gb2312','utf-8',$location['area']);
                //省份和城市
                $country = $location['country'];
                $arrCountry = preg_split('[省]',$country);
                $data['city'] = count($arrCountry)>1?$arrCountry[1]:$arrCountry[0];
            }
        }catch(ErrorException $e){
            $data['city'] = null;
        }

        return $data['city']!='本机地址'? :null;
    }

    public static function getCurrentCityId(){

        $city = self::getCurrentCity();
        $cityId = 0;
        if(!is_null($city)){

            $regionData = $cityId = Region::find()->select('ID')->where(['RegionName'=>$city])->one();
            if(!is_null($regionData)){
                $cityId = $regionData->ID;
            }
        }

        $cityId = 221;
        return $cityId;
    }

}