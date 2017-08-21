<?php
use app\modules\adminshop\models\Admin_user;


require_once("../ext/common/function.php");
require_once("../ext/thirdapi/LetvCloudV1.php");


$params = require(__DIR__ . '/params.php');


$config = [

    'language' => 'zh-CN',
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'aemOZeq_FVLT8CgjKv9EkHWw3bK1105lzzzzzz',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
            'enableCookieValidation' => false,
            'enableCsrfValidation' => false,
        ],
        'urlManager'=>[
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [

                ['class' => 'yii\rest\UrlRule', 'controller' => 'user'],

                "<controller:\w+>/<action:\w+>/<id:\d+>"=>"<controller>/<action>",
                "<module:\w+>/<controller:\w+>/<action:\w+>"=>"<module>/<controller>/<action>",

                /*"<controller:\w+>/<action:\w+>"=>"jike/<controller>/<action>",*/
                "<controller:((?!adminrbac).+)>/<action:\w+>"=>"jike/<controller>/<action>",

                "<controller:\w+>/<action:\w+>"=>"<controller>/<action>",

            ],
        ],
        'authManager' => [
            'class' => 'yii\rbac\DbManager',
//            'class' => 'yii\rbac\PhpManager',
        ],


        //定义国际语言source包
        'i18n' => [
            'translations' => [
                'app*' => [
                    'class' => 'yii\i18n\PhpMessageSource',   //使用php文件保存信息
                    'basePath' => '@app/messages',  //php文件保存位置
                    //'sourceLanguage' => 'en',
                    'fileMap' => [
                        'app' => 'app.php',
                        'app/error' => 'error.php',
                    ],
                ],'web*' => [
                    'class' => 'yii\i18n\PhpMessageSource',   //使用php文件保存信息
                    'basePath' => '@app/messages',  //php文件保存位置
                    //'sourceLanguage' => 'en',
                    'fileMap' => [
                        'webinfo' => 'webinfo.php',
                        'users' => 'users.php',
                    ],
                ],'user*' => [
                    'class' => 'yii\i18n\PhpMessageSource',   //使用php文件保存信息
                    'basePath' => '@app/messages',  //php文件保存位置
                ],
            ],
        ],

        /*//从tp移植过来的跳转功能
        'jump'=>array(
            'class'=>'ext.jumpage.jumpage',
            'successWait'=>5,//成功提示等待跳转时间，可以不指定，默认是2秒
            'errorWait'=>6 //错误信息等待跳转时间，同上，默认3秒
        ),*/

        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],


        'user' => [
            'identityClass' => 'app\modules\admin\models\User',   //'app\models\User',
            'enableAutoLogin' => true,
        ],
        //商城用户
        'shop_user' => [
            'class'             => '\yii\web\User',
            'identityClass' => 'app\modules\shop\models\Users',
            'idParam'           => '_shopUserId',
            'identityCookie'    => ['name'=>'_shop_user','httpOnly' => true],
        ],
        //商城管理员
        'shop_admin_user' => [
            'class'             => '\yii\web\User',
            'identityClass' => 'app\modules\adminshop\models\Admin_user',
            'idParam'           => '_shopAdminId',
            'identityCookie'    => ['name'=>'_shop_admin','httpOnly' => true],
        ],
        //商城管理员
        'jike_user' => [
            'class'             => '\yii\web\User',
            'identityClass' => 'app\modules\jike\models\User',
            'idParam'           => '_jikeAdminId',
            'identityCookie'    => ['name'=>'_jike_admin','httpOnly' => true],
        ],


        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),

    ],

    'controllerMap' => [
        // 用类名申明 "account" 控制器
        'account' => 'app\modules\admin\controllers\DefaultController',

        // 用配置数组申明 "article" 控制器
        'article' => [
            'class' => 'app\controllers\PostController',
            'enableCsrfValidation' => false,
        ],


    ],

    'params' => $params,

    'bootstrap' => ['log'],
    'modules' => [
        'debug' => 'yii\debug\Module',
        'allowedIPs' => ['1.2.3.4', '127.0.0.1', '::1'],


        'adminrbac' => array(
            'class' => 'mdm\admin\Module',
            'layout' => 'left-menu',
            'controllerMap' => [
                'assignment' => [
                    'class' => 'mdm\admin\controllers\AssignmentController',
                    'usernameField' => 'user_name'
                ]
            ]
        ),
        'admin' => array(
            'class' => 'app\modules\admin\AdminModule',
        ),

        'adminshop' => array(
            'class' => 'app\modules\adminshop\AdminshopModule'
        ),

        'jike' => array(
            'class' => 'app\modules\jike\JikeModule'
        ),
        'common' => [
            'class' => 'app\modules\common\CommonModule'
        ],
        'frontadmin' => [
            'class' => 'app\modules\frontadmin\FrontAdminModule'
        ],

        'shop' => [
            'class' => 'app\modules\shop\ShopModule'
        ],
        'api' => [
            'class' => 'app\modules\api\ApiModule'
        ],

        'gridview' =>  [
            'class' => '\kartik\grid\Module',
            // enter optional module parameters below - only if you need to
            // use your own export download action or custom translation
            // message source
            //'downloadAction' => 'gridview/export/download',
            // 'i18n' => []
        ]
    ],


    'as access' => [
        'class' => 'mdm\admin\components\AccessControl',
        'allowActions' => [
            'jike/*',
            'api/*',
            'frontadmin/*',
            'admin/*',
            'adminrbac/*',
            'common/*',
            'some-controller/some-action',
            // The actions listed here will be allowed to everyone including guests.
            // So, 'admin/*' should not appear here in the production, of course.
            // But in the earlier stages of your development, you may probably want to
            // add a lot of actions here until you finally completed setting up rbac,
            // otherwise you may not even take a first step.
        ]
    ],

    //定义别名
    'aliases'   =>  [
        '@admin_path'   =>  '/modules/admin',
        '@mdm/admin' => '@app/extensions/mdm/yii2-admin-2.0.0',
        '@ext_path' => '@app/ext'
    ],

    'defaultRoute' => 'jike/index',
];

if (YII_ENV_DEV) {


//    $config['bootstrap'][] = 'debug';
//    $config['modules']['debug'] = 'yii\debug\Module';
//
//    $config['bootstrap'][] = 'gii';
//    $config['modules']['gii'] = 'yii\gii\Module';
}

return $config;
