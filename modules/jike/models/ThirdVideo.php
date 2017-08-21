<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/10/5
 * Time: 9:05
 */

namespace app\modules\jike\models;


use yii\base\Model;
use yii\log\Logger;

class ThirdVideo extends Model
{

    private $libFile;

    public $videoFile;

    private $error;

    public $videoId;

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @param mixed $error
     */
    public function setError($error)
    {
        $this->error = $error;
    }

    public function rules()
    {
        return [
            ['videoFile', 'required', 'message' => '视频文件不能为空!']
        ];
    }


    public function attributeLabels()
    {
        return [
            'videoFile' => '选择视频文件'
        ];
    }

    public function upload(){

        $libPath = \Yii::getAlias('@ext_path').'/youkuuploadsdk';
        $this->libFile = $libPath . '/' . 'sample.php';

        if(!file_exists($this->libFile)) {
            $this->setError($this->libFile . '文件不存在 !');
            return false;
        } else {
            require_once ($this->libFile);
            if($this->load(\Yii::$app->request->post())){

                \Yii::getLogger()->log(\Yii::$app->request->post(), Logger::LEVEL_ERROR);
                $uploadSdk = new \YouKuUploadSdk();
                $result = $uploadSdk->upload($_FILES[$this->formName()]['tmp_name']['videoFile']);
                \Yii::getLogger()->log($result, Logger::LEVEL_ERROR);
                $this->videoId = $result['videoid'];
                return $result;
            }  else {
                return ['status'=>-1, 'info'=>'验证失败!'];
            }
        }
    }

}