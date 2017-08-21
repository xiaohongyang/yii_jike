<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/2/23
 * Time: 22:17
 */

namespace app\modules\jike\controllers;


class CaptchaAction extends \yii\captcha\CaptchaAction
{

    public $autoRegenerate = true;

    public function run()
    {
        if ($this->autoRegenerate && Yii::$app->request->getQueryParam(self::REFRESH_GET_VAR) === null) {
            $this->setHttpHeaders();
            Yii::$app->response->format = Response::FORMAT_RAW;
            return $this->renderImage($this->getVerifyCode(true));
        }
        return parent::run();
    }

}