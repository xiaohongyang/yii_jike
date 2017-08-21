<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/18
 * Time: 14:14
 */

namespace app\modules\frontadmin\service;


use app\modules\common\traits\PageTrait;
use app\modules\frontadmin\models\love_video\Love_video;
use yii\data\Pagination;

class LoveVideoService extends BaseService
{

    use PageTrait;

    public $model;

    public function __construct(Love_video $model)
    {
        $this->model = $model;
    }

    public function create( $params=[] ){

        $rs = $this->model->create($params);
        !$rs && $this->message = $this->model->getFirstErrors2String() ? : ($this->model->message ? : '添加失败!');
        return $rs;
    }

    public function edit( $params=[] ){

        $rs = $this->model->edit($params);
        return $rs;
    }

    public function remove(  ){

        $rs = $this->model->remove();
        return $rs;
    }

    public function getList(){

        $query = $this->model->find();


        $query->where(['deleted' => Love_video::C_DELETED_NO]);

        $countQuery = clone $query;

        $pagination = new Pagination([
            'totalCount' => $countQuery->count(),
            'pageSize' => 4
        ]);

        $models = $query->offset($pagination->offset)
                    ->limit($pagination->limit)
                    ->orderBy(' created_at desc ')
                    ->all();

        $this->setPages($pagination);
        return $models;
    }


}