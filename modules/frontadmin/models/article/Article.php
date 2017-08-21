<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/14
 * Time: 19:48
 */

namespace app\modules\frontadmin\models\article;


use app\modules\common\models\uploadform\I_Upload;
use app\modules\common\models\uploadform\Uploadform;
use app\modules\frontadmin\models\article_type\Article_type;
use app\modules\frontadmin\models\BaseActiveRecord;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;

class Article extends BaseActiveRecord
{

/*| id         | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| title      | varchar(50)      | NO   |     |         |                |
| info       | varchar(50)      | NO   |     |         |                |
| created_at | int(10) unsigned | NO   |     | 0       |                |
| updated_at | int(10) unsigned | NO   |     | 0       |                |
| type_id    | int(10) unsigned | NO   |     | 0       |                |
+------------+------------------+------+-----+---------+----------------+*/
    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::className()
            ]
        ];
    }


    public function rules(){

        return [
            [['title', 'type_id'], 'required', 'on' => self::SCENARIO_CREATE],
            [
                'type_id', function($attribute){

                    $typeId = $this->$attribute;
                    if(empty($typeId) || !is_numeric($typeId))
                        $this->addError($attribute, $this->getAttributeLabel($attribute."错误!"));
                    else if(!Article_type::find()->where(['type_id'=>$typeId])->exists())
                        $this->addError($attribute, $this->getAttributeLabel($attribute."类别不存在!"));
                }
            ]
        ];
    }

    public function scenarios()
    {
        return ArrayHelper::merge(
            parent::scenarios(),
            [
                self::SCENARIO_CREATE => [
                    'title', 'type_id', 'info'
                ]
            ]
        );
    }


    public function create($params = ['title'=>'','type_id'=>'','info'=>0]){

        $rs = false;
        if(is_array($params) && !key_exists(self::formName(), $params))
            $params = [self::formName() => $params];

        $this->scenario = self::SCENARIO_CREATE;
        if($this->load($params) && $this->validate()){
            $rs = $this->save();
            if($rs && \Yii::$app->request->post(I_Upload::C_FORM_NAME)){
                $uploadValues = \Yii::$app->request->post(I_Upload::C_FORM_NAME);
                Uploadform::updateAndClear(I_Upload::TABLE_NAME_ARTICLE, $this->id, $uploadValues);
            }
        }
        !$rs && $this->message = $this->getFirstErrors2String();
        return $rs;
    }


    public function getPics(){
        return $this->hasMany(Uploadform::className(), [
            'column_value' => 'id'
        ])->where(['table_name' => I_Upload::TABLE_NAME_ARTICLE]);
    }

}