<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/15
 * Time: 17:43
 */

namespace app\modules\jike\service;


use app\modules\frontadmin\models\article_type\Article_type;

class ArticleTypeService extends BaseService
{

    private $model;



    public function getChannelList(){

        $query = Article_type::find();
        $query->where([
            'parent_id' => Article_type::C_TYPE_CHANNEL
        ]);

        $result = $query->all();
        return $result;
    }

    public function edit($params){

        $model = new Article_type();
        $rs = $model->edit($params);
        $this->setModel($model);
        return $rs;
    }

    /**
     * @return mixed
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param mixed $model
     */
    public function setModel($model)
    {
        $this->model = $model;
    }


}