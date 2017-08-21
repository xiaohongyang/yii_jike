<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/4/19
 * Time: 6:22
 */

namespace app\modules\frontadmin\controllers;

use app\modules\common\interfaces\I_controller_curd;
use app\modules\common\models\Region;
use app\modules\frontadmin\models\User_ad_video;
use app\modules\frontadmin\models\User_ad_video_account_order;
use app\modules\frontadmin\service\AdVideoService;

class AdvideoController extends BaseController implements I_controller_curd
{

    private static $adVideoService = null;

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
    }

    private static function getAdvideoService(){

        return is_null(self::$adVideoService) ? new AdVideoService() : self::$adVideoService;
    }


    /**
     * 视频管理
     * @return string
     */
    public function actionIndex(){

        if(!$this->getLoginUserId())
            return $this->redirect('/public/login');

        $viewBag = [
            'adVideoModel' => $this->getAdvideoService()->getCreateModel(),
            'dataProvider' => $this->getAdvideoService()->getList()
        ];
        return $this->render('index',$viewBag);
    }


    /**
     * 创建抽奖视频
     */
    public function actionCreate(){

        $service = $this->getAdvideoService();

        $request = \Yii::$app->request;
        if($request->isGet){
            $this->setLayoutEmpty();
            return $this->render('create', ['model' => $service->getCreateModel()]);

        }else if($request->isAjax){

            if($service->create($request->post())){
                returnJson("1",$service->message,[]);
            }else{
                returnJson("0",$service->message,$service->user_ad_video->errors);
            }
            exit;
        }

    }

    /**
     * 编辑/更新
     */
    public function actionEdit()
    {

        $this->layout = 'main_simple';

        $id = \Yii::$app->request->get('id');

        if(is_null($id) || !is_numeric($id))
            return false;

        $model = $this->getAdvideoService()->getCreateModel();
        $model = $model->findOne(['ad_id'=>$id]);
        return $this->render('edit', ['model' => $model ] );
    }

    /**
     * 删除
     */
    public function actionRemove()
    {

        $request = \Yii::$app->request;
        $adId = $request->get('id');

        $service = $this->getAdvideoService();
        $result = $service->remove($adId);
        if($result){
            \Yii::$app->session->setFlash('info_success','删除成功!');
        }else{
            //\Yii::$app->session->addFlash('infoFail',$this->getAdvideoService()->message);
            \Yii::$app->session->setFlash('info_success', $service->message);

        }

        $this->redirect(\Yii::$app->request->referrer);
    }

    /**
     * 充值
     */
    public function actionRecharge(){

        $request = \Yii::$app->request;
        $adId = $request->get('id');
        $money = $request->get('money');

        $service = new AdVideoService();
        $request = $service->recharge($adId, $money);
        if(!$request)
            echo $service->message;
        else
            echo '充值成功';

    }

    public function actionInfo(){
        return $this->render('info');
    }

    /**
     * 下载
     */
    public function actionDownAccountLog(){

        $id = \Yii::$app->request->get('id');
        if(is_null($id)){
            return jump_error('id不能为空', \Yii::$app->request->referrer);
        }

        $adVideoService = new AdVideoService();

        $video = $adVideoService->adVideo->findOne($id);
        $logs = $adVideoService->getAccountLogs($id);

        /*

        p($video->ad_title);
        p($video);
        p($logs);

        exit;*/

        $objPHPExcel = new \PHPExcel();
        $objPHPExcel->setActiveSheetIndex();
        $objPHPExcel->getActiveSheet()->mergeCells("A1:E1");
        $objPHPExcel->getActiveSheet()->setCellValue("A1","90天广告子账户营销对账单");
        $objPHPExcel->getActiveSheet()->getStyle("A1")->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->mergeCells("A2:E2");
        $objPHPExcel->getActiveSheet()->setCellValue('A2', $video->ad_title);
        $objPHPExcel->getActiveSheet()->mergeCells("A3:E3");
        $objPHPExcel->getActiveSheet()->setCellValue('A3', '备注1. 用户非登录状态下操作，访问人帐号信息为空属于正常；');
        $objPHPExcel->getActiveSheet()->mergeCells("A4:E4");
        $objPHPExcel->getActiveSheet()->setCellValue('A4', '备注2. 少量浏览无法读取访问人的IP 信息，IP地址信息为空属于正常；');

        $objPHPExcel->getActiveSheet()->mergeCells("A5:A6");
        $objPHPExcel->getActiveSheet()->setCellValue('A5', '活动时间');

        $objPHPExcel->getActiveSheet()->setCellValue('B5', '广告子账户充值（流入）');

        $objPHPExcel->getActiveSheet()->mergeCells("C5:E5");
        $objPHPExcel->getActiveSheet()->setCellValue('C5', '推广支出（视频抽奖广告，流出）');

        $objPHPExcel->getActiveSheet()->setCellValue('B6', '营销账户支出');

        //$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(750);
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(27);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(27);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(27);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(27);

        $objPHPExcel->getActiveSheet()->setCellValue('C6', '访问人帐号');
        $objPHPExcel->getActiveSheet()->setCellValue('D6', '访问人区域');
        $objPHPExcel->getActiveSheet()->setCellValue('E6', '支出金额');


        $i = 6;
        if( is_array($logs) && count($logs) ){
            foreach($logs as $log){

                $i++;
                $objPHPExcel->getActiveSheet()->setCellValue("A".$i, date('Y-m-d',$log->created_at));

                if( $log->city_id != 0 ){
                    $region = Region::find()->where(['ID'=>$log->city_id])->one();
                    if(!is_null( $region )){

                        $objPHPExcel->getActiveSheet()->getCell('D'.$i)->setValue($region->RegionName);
                    }
                }

                if($log->process_type == User_ad_video_account_order::PROCESS_TYPE_RECHARGE){

                    $objPHPExcel->getActiveSheet()->setCellValue("B".$i, $log->amount);
                    $objPHPExcel->getActiveSheet()->getStyle("B".$i)->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
                }
                else{
                    $objPHPExcel->getActiveSheet()->setCellValue("E".$i, $log->amount);
                    $objPHPExcel->getActiveSheet()->getStyle("E".$i)->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
                }
                $objPHPExcel->getActiveSheet()->setCellValue("C".$i, $video->user->user_name);
                $objPHPExcel->getActiveSheet()->getStyle("C".$i)->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
            }
        }



        ob_end_clean();
        ob_start();
        header('Content-Type : application/vnd.ms-excel');
        header('Content-Disposition:attachment;filename="'.$video->ad_title.'账户营销记录-'.date("Y年m月j日").'.xls"');

        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save('php://output');
    }
}