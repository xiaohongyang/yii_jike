<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/1/12
 * Time: 22:16
 */

namespace app\modules\adminshop\models;


use yii\db\ActiveRecord;

class User_rank extends ActiveRecord{

    public function rules()
    {
        return [
            ['rank_name', 'safe']
        ];
    }

    public function fields()
    {
        return [
            'rank_id',
            'rank_name',
            'min_points',
            'max_points',
            'discount',
            'show_price',
            'special_rank',
        ];
    }

    public function attributeLabels()
    {
        return [
            'rank_id' => \Yii::$app->params['lang']['rank_id'] , //  tinyint 会员等级编号，其中0是非会员
            'rank_name' => \Yii::$app->params['lang']['rank_name'] , //  varchar 会员等级名称
            'min_points' => \Yii::$app->params['lang']['min_points'] , //  int 该等级的最低积分
            'max_points' => \Yii::$app->params['lang']['max_points'] , //  int 该等级的最高积分
            'discount' => \Yii::$app->params['lang']['discount'] , //  tinyint 该会员等级的商品折扣
            'show_price' => \Yii::$app->params['lang']['show_price'] , //  tinyint 是否在不是该等级会员购买页面显示该会员等级的折扣价格.1,显示;0,不显示
            'special_rank' => \Yii::$app->params['lang']['special_rank'] , //  tinyint 是否事特殊会员等级组.0,不是;1,是
        ];
    }


    /**
     * 取得用户等级数组,按用户级别排序
     * @param   bool      $is_special      是否只显示特殊会员组
     * @return  array     rank_id=>rank_name
     */
    public static function get_rank_list($is_special = false)
    {

        $query = User_rank::find();
        if($is_special)
            $query->andWhere('special_rank = 1');
        $query->orderBy('min_points');

        return $query->all();

//        $rank_list = array();
//        $sql = 'SELECT rank_id, rank_name, min_points FROM ' . $GLOBALS['ecs']->table('user_rank');
//        if ($is_special)
//        {
//            $sql .= ' WHERE special_rank = 1';
//        }
//        $sql .= ' ORDER BY min_points';
//
//        $res = $GLOBALS['db']->query($sql);
//
//        while ($row = $GLOBALS['db']->fetchRow($res))
//        {
//            $rank_list[$row['rank_id']] = $row['rank_name'];
//        }

//        return $rank_list;
    }

}