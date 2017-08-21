<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/14
 * Time: 20:13
 */

namespace app\modules\admin\forms;


use app\modules\frontadmin\models\article\Article;
use app\modules\frontadmin\models\article_type\Article_type;
use app\modules\frontadmin\models\BaseModel;
use yii\helpers\ArrayHelper;

class ActivityReleaseForm extends BaseModel
{

    public $title;
    public $info;
    public $type_id;
    public $id;
    public $article_pic;
    public $pics;

    public function rules()
    {
        return [
            [['title','info','type_id'], 'required' ],
            ['id','number']
        ];
    }


    public function attributeLabels()
    {
        return [
            'id' => '活动id',
            'title' => '活动标题',
            'info' => '活动地点',
            'type_id' => '文章类别'
        ];
    }

    /**
     * 创建或编辑活动
     * @param $params
     * @return bool
     */
    public function create($params){

        $rs = false;
        $this->type_id = Article_type::C_TYPE_ACTIVITY;

        if($this->load($params) && $this->validate()){
            if(!is_null($this->id) && $this->id>0){
                $model = Article::findOne(['id'=>$this->id]);
            } else {
                $model = new Article();
            }

            $array = ArrayHelper::toArray($this);

            $rs = $model->create($array);
            $this->message = $model->message;
        } else {
            $this->message = is_array($this->getFirstErrors()) && count($this->getFirstErrors()) ? implode(',', $this->getFirstErrors()) :'';
        }
        return $rs;
    }

}