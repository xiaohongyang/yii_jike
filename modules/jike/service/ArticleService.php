<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/15
 * Time: 13:32
 */

namespace app\modules\jike\service;


use app\modules\frontadmin\models\article\Article;
use app\modules\frontadmin\models\article_type\Article_type;

class ArticleService extends BaseService
{

    //获取活动数据
    public function getActivity(){

        $query = Article::find();
        $query->where([
            'type_id' => Article_type::C_TYPE_ACTIVITY
        ]);

        return $query->one();
    }

}