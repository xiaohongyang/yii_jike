<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/18
 * Time: 20:37
 */

namespace tests\codeception\unit\models;


use app\modules\frontadmin\models\love_video\Love_video;
use app\modules\frontadmin\models\video\video;
use app\modules\frontadmin\service\LoveVideoService;
use yii\codeception\TestCase;

class LoveVideoTest extends TestCase
{

    public function testCreate(){

        $adminUserServiceTest = new AdminuserServiceTest();
        $adminUserServiceTest->testAdminLogin();

        $service = new LoveVideoService(new Love_video());

        $video = new video();

        $data = [
            $service->model->formName()=>[
                'love_title'=> 'title测试',
                'love_name'=> 'name测试',
            ],
            $video->formName() => ['video_id'=>'11','video_unique'=>'11']
        ];
        $rs = $service->create($data);

        $message = $service->model->getFirstErrors2String() ? : ($service->model->message ? :"失败");
        $message = iconv('utf-8','gb2312', $message);
        $this->assertTrue($rs, $message);
    }

}