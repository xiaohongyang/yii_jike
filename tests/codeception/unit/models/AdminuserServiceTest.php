<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/6
 * Time: 14:33
 */

namespace tests\codeception\unit\models;


use app\modules\admin\models\User;
use app\modules\frontadmin\service\AdminuserService;
use yii\codeception\TestCase;

class AdminuserServiceTest extends TestCase
{


    /**
     * 管理员登录
     */
    /*public function testAdminLogin(){

        $userModel = new User();
        $rs = $userModel->login(['user_name'=>'admin', 'user_password'=>'abcabc']);
        $error = $userModel->message ? : (is_array($userModel->getFirstErrors()) && count($userModel->getFirstErrors())
            ? implode('|', $userModel->getFirstErrors()) : "" ) ;

        $this->assertTrue($rs, $error);
    }*/

    /**
     * 创建管理员
     */
    /*public function testCreateAdminUser(){

        $this->testAdminLogin();

        $service = new AdminuserService();
        $rsAdd = $service->create(['user_name'=>'刘备','user_mobile'=>'13284847443',  'item_name'=>'内容审核员']);
        $this->assertTrue($rsAdd, $service->message);
    }*/

    /*public function testRemove(){

        $service = new AdminuserService();
        $userId = 39;
        $rs = $service->remove($userId);

        $this->assertTrue($rs, $service->message);
    }*/

    /*public function testChangeUserRole(){

        $service = new AdminuserService();
        $rs = $service->changeRole(39, "内容审核员");

        $this->assertTrue($rs, $service->message);
    }*/

    /*public function testGetTodayRegistNumber(){

        $service = new AdminuserService();
        $rs = $service->getTodayRegistNumber();

        $this->assertTrue(true);
    }

    public function testGetUserTotalNumber(){
        $service = new AdminuserService();
        $rs = $service->getUserTotalNumber();

        $this->assertTrue(true);
    }*/

}