<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/7/23
 * Time: 8:07
 */

namespace app\modules\admin\controllers;


use app\modules\admin\service\FrozenService;
use app\modules\admin\service\IntegrateService;
use app\modules\admin\service\InvoiceService;

class FinanceController extends BaseController
{

    public function actionInvoice(){

        $service = new InvoiceService();

        $template = 'invoice';
        $status = \Yii::$app->request->get('status');
        !is_null($status) && $template = 'invoice_ok';

        return $this->render( $template , [
            'models' => $service->getList(),
            'pages' => $service->getPages()
        ]);
    }


    public function actionSetInvoiceSn(){

        $service = new InvoiceService();
        $rs = $service->setInvoiceSn();
        if($rs) {
            returnJson(1, "发票编号设置成功!");
        } else {
            returnJson(0, "发票编号设置失败!");
        }
    }

    public function actionIntegrate(){

        $service = new IntegrateService();

        $template = 'integrate';
        $status = \Yii::$app->request->get('status');
        !is_null($status) && $template = 'integrate_ok';

        return $this->render( $template , [
            'models' => $service->getList(),
            'pages' => $service->getPages()
        ]);
    }

    public function actionFrozen(){

        $service = new FrozenService();

        $template = 'frozen';
        $status = \Yii::$app->request->get('status');
        !is_null($status) && $template = 'frozen_ok';

        return $this->render( $template , [
            'models' => $service->getList(),
            'pages' => $service->getPages()
        ]);
    }



}