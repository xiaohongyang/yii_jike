<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/18
 * Time: 9:28
 */

namespace app\modules\api\controllers;


use app\modules\common\models\letv\Letv;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\models\user_account\User_account_log;
use app\modules\frontadmin\service\PrizegoodsService;
use app\modules\frontadmin\service\PrizeOrderService;
use app\modules\frontadmin\service\User_account_logService;

class TestController extends \app\modules\frontadmin\controllers\BaseController
{
    public function actionTest(){

        /*$objPHPExcel = new \PHPExcel();
        $objPHPExcel->setActiveSheetIndex();
        $objPHPExcel->getActiveSheet()->mergeCells("A1:E1");
        $objPHPExcel->getActiveSheet()->setCellValue("A1","90天广告子账户营销对账单");
        $objPHPExcel->getActiveSheet()->getStyle("A1")->getFont()->setBold(true);

        ob_end_clean();
        ob_start();
        header('Content-Type : application/vnd.ms-excel');
        header('Content-Disposition:attachment;filename="'.'产品信息表-'.date("Y年m月j日").'.xls"');

        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save('php://output');*/

        $service = new PrizegoodsService();
        $service->setPrizeId(107);
        $result = $service->enableOneMoneyBuy(2);
        p($result);

    }

    public function actionTest2(){


        $service = new PrizeOrderService();
        $rs = $service->create(58);
        p($rs);
        p($service->message);
    }

    public function actionGetVideo(){

        //
        $uid = \Yii::$app->request->get('uid');
        $service = new Letv();
        $video = $service->getOne($uid);
        p($video);
        exit;

    }
}