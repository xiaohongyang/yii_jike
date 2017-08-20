<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2015/7/31
 * Time: 13:40
 */

namespace app\modules\adminshop\controllers;


use yii\helpers\Url;
use yii\web\Controller;

class BaseController extends InitController {

    public $checkLogin = true;
    public $layout  = 'main';

    public $_lang;
    public $_cfg;

    public function init()
    {

        parent::init();

        //将全局变量封闭成私有变量
        GLOBAL $_LANG;
        GLOBAL $_CFG;
        $this->_lang = $_LANG;
        $this->_cfg = $_CFG;

    }

    public function beforeAction($action)
    {

        //1.检查用户是否已经登录
        if ($this->checkLogin && \Yii::$app->shop_admin_user->isGuest) {
            $this->redirect(\yii\helpers\Url::to(['public/login']));
        }


        //2.导入控制器语言文件
        Global $_CFG;
        Global $_LANG;
        $controller = $action->controller->id;

        if (file_exists(EC_PATH . "/languages/" . $_CFG['lang'] . "/admin/" . $controller . ".php")) {
            require_once( EC_PATH . "/languages/" . $_CFG['lang'] . "/admin/" . $controller . ".php" );
        }

        $this->_lang = $_LANG;

        //是否要升级
        $this->upgrade();

        //配置变量初始化赋值
        $this->init_assign($action);

        return parent::beforeAction($action); // TODO: Change the autogenerated stub
    }


    /**
     * 检查版本升级
     */
    public function upgrade()
    {

        Global $_CFG;

        /* 如果有新版本，升级 */
        if (!isset($_CFG['ecs_version']))
        {
            $_CFG['ecs_version'] = 'v1.0.0';
        }

        if (preg_replace('/(?:\.|\s+)[a-z]*$/i', '', $_CFG['ecs_version']) != preg_replace('/(?:\.|\s+)[a-z]*$/i', '', VERSION)
            && file_exists('../upgrade/index.php'))
        {
            // 转到升级文件
            ecs_header("Location: ../upgrade/index.php\n");

            exit;
        }
    }


    /**
     * 配置变量初始化赋值
     * @param null $action
     */
    public function init_assign($action=null)
    {

        Global $_LANG, $_CFG;

        \Yii::$app->params['lang'] = $_LANG;
        \Yii::$app->params['help_open'] = $_CFG['help_open'];

        if(isset($_CFG['enable_order_check']))  // 为了从旧版本顺利升级到2.5.0
            \Yii::$app->params['enable_order_check'] = $_CFG['enable_order_check'] ;
        else
            \Yii::$app->params['enable_order_check'] = 0;

    }

}