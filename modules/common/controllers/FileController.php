<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/3/17
 * Time: 9:31
 */

namespace app\modules\common\controllers;


use app\modules\common\models\uploadform\I_Upload;
use app\modules\common\models\uploadform\Uploadform;
use yii\web\Controller;
use yii\web\UploadedFile;

class FileController extends Controller
{

    public function actionUpload()
    {


        $params = \Yii::$app->request->post();

        $name = $params['name'];
        $fileDesc = $params['fileDesc'];

        if (\Yii::$app->request->isPost) {

            $config = [
                'file_dir' => I_Upload::FILE_DIR_PRIZE_GOODS,
                'column_name' => I_Upload::COLUMN_NAME_PRIZE_GOODS_ID,
                'table_name' => I_Upload::TABLE_NAME_PRIZE_GOODS,
                'file_desc' => I_Upload::FILE_DESC_PRIZE_GOODS_IMAGE,
                'file_type' => I_Upload::FILE_TYPE_IMAGE_01
            ];
            $model =  new Uploadform();

            $result = $model->uploadFile($name, $fileDesc);

            return $result;
        }

        returnJson(0, '失败,请选择要上传的文件!');
    }


}