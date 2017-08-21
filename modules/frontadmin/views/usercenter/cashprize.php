<?php
use app\modules\common\models\uploadform\I_Upload;
use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\jike\models\prize_codes\Prize_codes;
use app\widgets\AjaxFileUploadWidget;
use app\widgets\AjaxUploadWidget;
use kartik\icons\Icon;
use kartik\rating\StarRating;
use Symfony\Component\Console\Helper\FormatterHelper;
use yii\helpers\Html;
use yii\helpers\StringHelper;
use yii\helpers\Url;
use yii\web\JsExpression;
use yii\web\View;
use yii\widgets\ActiveForm;
use yii\widgets\LinkPager;

?>


        <div class="wra-form">
            <div class="user_address">
                <h5> 奖品收件信息 </h5>
                <div class="info">
                </div>
                <div class="btns">
                    <?=Html::a("设置/修改","javascript:void(0)",[
                        'class'=>'warning btn_show_edit_address',
                        'onclick' => '$.fn.iframe_x_say({\'url\':\'/frontadmin/usercenter/editaddress\',size:[700,400],frameSize:[600,320],btn:[], time: 999999, callback:function(){$.fn.freshAddress()}})'
                    ])?>
                </div>
            </div>
        </div>
        <!--<div class="main-wrapper">
        </div>-->

        <div class="wrapper_list">


            <div class="nav mt-dl">
                <?=Html::a("180天内夺宝全部记录", Url::to(['/frontadmin/usercenter/cashPrize','prize_status'=>0]),[
                    'class'=> Yii::$app->request->get('prize_status')==0?'active':''
                ])?>

                <?=Html::a("已揭晓", Url::to(['/frontadmin/usercenter/cashPrize','prize_status'=>1]),[
                    'class'=> Yii::$app->request->get('prize_status')==1?'active':''
                ])?>

                <?=Html::a("进行中", Url::to(['/frontadmin/usercenter/cashPrize','prize_status'=>2]),[
                    'class'=> Yii::$app->request->get('prize_status')==2?'active':''
                ])?>

                <?=Html::a("已中奖", Url::to(['/frontadmin/usercenter/cashPrize','prize_status'=>3]),[
                    'class'=> Yii::$app->request->get('prize_status')==3?'active':''
                ])?>
            </div>

            <div class="content">
                <table class=" table table-bordered bordered">
                    <tr class="tr-gray">
                        <td  > 夺宝时间</td>
                        <td  > 活动奖品信息 </td>
                        <td  > 所获序列号 </td>
                        <td  > 活动状态/结果 </td>
                        <td  > 兑奖/追踪 </td>
                    </tr>

                    <?php
                    if(is_array($models) && count($models)) {

                        foreach ($models as $model) {
                            if ($model instanceof Prize_codes) {
                                $goodsSku = $model->goodsSku;
                                $prizeGoods = $goodsSku->prizeGoods;
                                $order = $model->order;

                                if($prizeGoods instanceof prize_goods && $goodsSku instanceof Goods_sku){

                                    //是否已结束
                                    $isActiveStop = $goodsSku->prize_status == $goodsSku::C_PRIZE_STATUS_WIN_YES ? true : false;
                                    //是否已中奖
                                    $isWin = $model->prize_status == $goodsSku::C_PRIZE_STATUS_WIN_YES ? true : false;;
                                    $totalTimes = 0;
                                    $leftTimes = 0;

                                    if($model->prize_type == $model::C_PRIZE_TYPE_ZERO) {

                                        $totalTimes = $prizeGoods->_getTotalPrizeTimes();
                                        $havePrizedTimes = $prizeGoods->getHavePrizedTimes($prizeGoods->prize_id);
                                        $leftTimes = $totalTimes-$havePrizedTimes;
                                        $serialPre = 'A';
                                    } else {
                                        $isActiveStop = true;
                                        $serialPre = 'B';
                                    }

                                    $prizeTitle = '<div  ><span class=\' \'>'.$prizeGoods->prize_code.' '.$prizeGoods->prize_name.'</span><br/>  活动期号: '.$serialPre.$goodsSku->sku_id.'</div>';
                    ?>
                            <tr id="tr-<?= $model->code_id ?>" class="tr_id" data-id="<?= $model->code_id ?>" data-order-id="<?=is_null($order)?0:$order->order_id?>"
                                data-prize_norms_01=''<?=$prizeGoods->prize_norms_01? json_encode(unserialize($prizeGoods->prize_norms_01) ):'' ?>'
                                data-prize_norms_02='<?=$prizeGoods->prize_norms_02 ? json_encode(unserialize($prizeGoods->prize_norms_02)  ) : '' ?>'>
                                <td>
                                    <div>
                                        <?=date('Y.m.d H:i',$model->created_at)?>
                                    </div>
                                </td>
                                <td><a href="<?=Url::to(['/jike/goods/detail', 'id'=>$prizeGoods->prize_id])?>"
                                      data-toggle="tooltip" data-placement="right" title="<?=$prizeTitle?> "  target="_blank">
                                        <?=$prizeGoods->prize_code?> <?=truncate_utf8_string($prizeGoods->prize_name,9,'... ')?>
                                    </a>
                                </td>
                                <td>
                                    <?php
                                        if($model->prize_type == $model::C_PRIZE_TYPE_ZERO){
                                    ?>
                                            <span class="code_sn"><?=$model->code_id?></span>
                                    <?php
                                        } else {
                                    ?>
                                            一元即开
                                    <?php
                                        }
                                    ?>

                                </td>
                                <td>
                                    <?php
                                    if($model->prize_type == $model::C_PRIZE_TYPE_ZERO) {
                                        if ($isActiveStop) {
                                    ?>
                                            已开奖，中奖序列号为 <span style="color:red;"><?=Prize_codes::findOne(['sku_id'=>$goodsSku->sku_id])['code'] ?></span>
                                    <?php
                                        } else {
                                    ?>
                                            进行中, 剩余次数 <span class="left_times" style="color:blue;"><?=$leftTimes?></span>
                                    <?php
                                        }
                                    } else {
                                    ?>
                                        即开即中
                                        <?php
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                        if($isActiveStop) {

                                            if($isWin){

                                                if(is_null($order)){
                                                    //未提交订单
                                                    if(time()-$goodsSku->updated_at < 3600*24*10){
                                                        //未超过指定时间
                                                        $str = "已中奖，请立刻提交兑奖信息!<span> "
                                                            .Html::a("兑奖", "javascript:void(0)", ['target' => '_blank', 'class' => 'warning btn_cash_prize'])." </span>";
                                                    } else {
                                                        //已超过指定时间
                                                        $str = "已中奖，但您已放弃兑奖... <a href='javascript:void(0)' class='blue' data-toggle='tooltip' data-placement='left'
                                                                title='中奖后，须在10天内完成兑奖信息提交...您未能及时提交兑奖信息，已主动放弃本次兑奖...'>详情</a>";
                                                    }
                                                } else if($order instanceof Prize_order) {
                                                    //已提交订单
                                                    if($order->shipping_status == $order::C_SHIPPING_STATUS_SEND_YES){
                                                        //已发货
                                                        $goodsDesc = $order->goods_desc ? '('.str_replace('|',',',$order->goods_desc).')':'';
                                                        $orderTransport = $order->orderTransport;
                                                        $zzTitle = "奖品:".$prizeGoods->prize_name.$goodsDesc.'一件 <br/>
                                                                    商家已发货 ,运单信息：'.
                                                                    $orderTransport->transport->transport_name. ' <br/> 单号：'.$orderTransport->transport_sn .'<br/>'.
                                                                    '发货时间：'.date('Y.m.d', $order->send_at).'<br/>'.
                                                                    '请及时查收，如未收到，30天内可投诉...';
                                                        $str = "商家已发货... <a href='javascript:void(0)' class='warning look_shipping'   msg-title='".$zzTitle."' >追踪</a>";
                                                    } else if($order->shipping_status == $order::C_SHIPPING_STATUS_SEND_NO){
                                                        //未发货
                                                        $str = "已提交兑奖信息，等待卖家发货... <a href='javascript:void(0)' class='blue' data-toggle='tooltip' data-placement='left'
                                                            title = '恭喜，您已中奖！商家将在开奖后10天内发货，请耐心等待收件...'>详情</a>";
                                                    } else if($order->shipping_status == $order::C_SHIPPING_STATUS_WEI_YUE){
                                                        //已违约
                                                        $str = "已中奖，已转换积分存入您的积分账户中... <a href='javascript:void(0)' class='blue' data-toggle='tooltip' data-placement='left'
                                                                title='抱歉，商家因为缺货等原因，奖品未能及时发出，客服已将奖品转换成等值的积分，存入您的积分账户，请及时查收 ...'>详情</a>";
                                                    }
                                                }

                                            }
                                            else
                                                $str = "未中奖...";

                                            echo $str;
                                        }else{
                                            echo "暂未开奖...";
                                        }
                                    ?>
                                </td>
                            </tr>
                    <?php
                                }
                            }
                        }
                    }
                    ?>

                </table>

               <?=LinkPager::widget([
                   'pagination' => $pages
               ])?>

            </div>
        </div>



