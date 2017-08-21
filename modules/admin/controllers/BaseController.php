<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2015/6/5
 * Time: 17:41
 */

namespace app\modules\admin\controllers;


use yii\base\InlineAction;
use yii\web\Controller;

class BaseController extends Controller{

    public $layout = 'main';

    public function init()
    {

        if (\Yii::$app->user->isGuest) {

            \Yii::$app->getResponse()->redirect(['admin/public/login']);

        }
    }


    public function setLayoutEmpty(){
        $this->layout = 'main_simple';
    }

    public function createAction($id)
    {
        if ($id === '') {
            $id = $this->defaultAction;
        }

        $actionMap = $this->actions();
        if (isset($actionMap[$id])) {
            return \Yii::createObject($actionMap[$id], [$id, $this]);
        } elseif (preg_match('/^[a-zA-Z0-9\\-_]+$/', $id) && strpos($id, '--') === false && trim($id, '-') === $id) {
            $methodName = 'action' . str_replace(' ', '', ucwords(implode(' ', explode('-', $id))));
            if (method_exists($this, $methodName)) {
                $method = new \ReflectionMethod($this, $methodName);
                if ($method->isPublic() && $method->getName() === $methodName) {
                    return new InlineAction($id, $this, $methodName);
                }
            }
        }

        return null;
    }
}