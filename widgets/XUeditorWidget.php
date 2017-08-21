<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/15
 * Time: 23:48
 */

namespace app\widgets;


use app\assets\extend\XUeditorAsset;
use kartik\helpers\Html;
use yii\helpers\ArrayHelper;
use yii\web\View;
use yii\widgets\InputWidget;

class XUeditorWidget extends InputWidget
{

    public $clientOption = [];
    private $_option = [
        'initialFrameWidth' => '900',
        'initialFrameHeight' => '200'
    ];

    public function init()
    {
        $this->_option = ArrayHelper::merge($this->_option, $this->clientOption);
    }

    public function run()
    {
        $this->registerJs();

//        return '<script id="editor" type="text/plain" style="width:1024px;height:500px;"></script>';
        if($this->hasModel()){
            $strHtml = Html::activeTextarea($this->model, $this->attribute, ['id'=>$this->id ,'style'=>'display:none;']);
            return $strHtml;
        } else {
            return Html::textarea($this->id, $this->value, ['id'=>$this->id, 'style'=>'display:none;']);
        }
    }

    public function registerJs(){
        XUeditorAsset::register($this->view);

        $clientOption = json_encode($this->_option);

        $jsString = "

            $(function(){

              var ue = UE.getEditor('{$this->id}', {$clientOption});
              setTimeout(function(){
                  $('#{$this->id}').show();
              },100)
            })
        ";

        $this->view->registerJs($jsString, View::POS_END);
    }

}