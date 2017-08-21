<?php
use app\modules\common\models\uploadform\I_Upload;
use app\modules\frontadmin\models\feedback\Feedback;
use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\frontadmin\models\user\User;
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

?>

<div class=" col-md-12 pL10">
    <div class="side-main">

        <!--<div class="main-wrapper">
        </div>-->

        <div class="wrapper_list">

            <form id="search" method="get" class="form-inline">

                <?=Html::a("全部订单", Url::to(['/admin/zeroprize/cashprize','all'=>1]), ['class'=>'btn btn-default btn-xs '.((Yii::$app->request->get('all')==1)?'active':'')])?>
                <?=Html::a("待发货", Url::to(['/admin/zeroprize/cashprize','shipping_status'=>Prize_order::C_SHIPPING_STATUS_SEND_NO]), ['class'=>'btn btn-default btn-xs '.((Yii::$app->request->get('shipping_status')==Prize_order::C_SHIPPING_STATUS_SEND_NO)?'active':'')])?>
                <?=Html::a("已发货", Url::to(['/admin/zeroprize/cashprize','shipping_status'=>Prize_order::C_SHIPPING_STATUS_SEND_YES]), ['class'=>'btn btn-default btn-xs '.((Yii::$app->request->get('shipping_status')==Prize_order::C_SHIPPING_STATUS_SEND_YES)?'active':'')])?>
                <?=Html::a("待处理投诉", Url::to(['/admin/zeroprize/cashprize','feedback'=>1]), ['class'=>'btn btn-default btn-xs '.((Yii::$app->request->get('feedback')==1)?'active':'')])?>
                <?=Html::a("已处理投诉", Url::to(['/admin/zeroprize/cashprize','feedback'=>2]), ['class'=>'btn btn-default btn-xs '.((Yii::$app->request->get('feedback')==2)?'active':'')])?>
                <?=Html::a("待管理兑奖", Url::to(['/admin/zeroprize/cashprize','cash'=>1]), ['class'=>'btn btn-default btn-xs '.((Yii::$app->request->get('cash')==1)?'active':'')])?>
                <?=Html::a("已管理兑奖", Url::to(['/admin/zeroprize/cashprize','cash'=>2]), ['class'=>'btn btn-default btn-xs '.((Yii::$app->request->get('cash')==2)?'active':'')])?>

                <?=Html::input('text','serial',Yii::$app->request->get('serial')?:null, ['class'=>'form-control input-sm', 'style'=>'height:22px;line-height: 22px', 'placeholder'=>'活动期号'])?>
                <?=Html::submitButton("查询", ['class'=>'btn btn-primary btn-xs'])?>
            </form>
            <div class="content mt-row">
                <table class=" table table-bordered bordered">
                    <tr>
                        <td  > 开奖时间</td>
                        <td  > 活动期号 </td>
                        <td  > 奖品(订单)信息 </td>
                        <td  > 活动商家账户</td>
                        <td  >兑奖提交日期</td>
                        <td  >中奖人/收件信息</td>
                        <td  >发货剩余时间</td>
                        <td  >发货状态/详情</td>
                        <td  >投诉状态/详情/回复</td>
                        <td  >兑奖管理</td>
                    </tr>

                    <?php
                    if(is_array($models) && count($models)) {

                        foreach ($models as $order) {
                            if ($order instanceof Prize_order) {

                                $prizeCode = $order->prizeCode;
                                $goodsSku = $prizeCode->goodsSku;
                                $prizeGoods = $goodsSku->prizeGoods;
                                $model = $prizeCode;

                                $supplyUser = User::findOne(['user_id'=>$prizeGoods->user_id]);

                                $province = \app\modules\common\models\Region::findOne(['ID'=>$order->province]);
                                $provinceName = is_null($province) ? "":$province->RegionName;
                                $city = \app\modules\common\models\Region::findOne(['ID'=>$order->city]);
                                $cityName = is_null($city) ? "":$city->RegionName;
                                $district = \app\modules\common\models\Region::findOne(['ID'=>$order->district]);
                                $districtName = is_null($district) ? "":$district->RegionName;

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
                                            <?=date('Y.m.d',$model->created_at)?>
                                        </div>
                                    </td>
                                    <td>
                                        <?=$serialPre?><?=$goodsSku->sku_id?>
                                    </td>
                                    <td>
                                        <div class="wrap_thumb">
                                                <span>
                                                    <?php
                                                    if(!is_null($prizeGoods->thumb)){

                                                        $picHtml = Html::img(
                                                            getImageHost().'/'.$prizeGoods->thumb->file_dir.'/'.$prizeGoods->thumb->getAttribute('file_name'),
                                                            ['class' => 'img-responsive']
                                                        );
                                                        echo $picHtml;
                                                    }
                                                    ?>
                                                </span>
                                        </div>
                                        <a href="<?=Url::to(['/jike/goods/detail', 'id'=>$prizeGoods->prize_id])?>"
                                           data-toggle="tooltip" data-placement="right" title="<?=$prizeTitle?> "  target="_blank">
                                            <?=truncate_utf8_string($prizeGoods->prize_name,16,'... ')?>
                                        </a>
                                        <br/>
                                        <?=$prizeGoods->prize_code?>
                                        <?php
                                        if($order->goods_desc != ""){
                                            $goodsDesc = explode('|', $order->goods_desc);
                                            foreach($goodsDesc as $desc){
                                                echo $desc.'&nbsp;';
                                            }
                                        }
                                        ?>
                                    </td>
                                    <td> <?= $supplyUser->user_mobile ?> </td>
                                    <td> <?=date('Y.m.d', $order->created_at)?> </td>

                                    <td>
                                        <?php
                                        $title = "  <div>
                                                                ".$order->consignee." <br/>
                                                                ".$provinceName.$cityName.$districtName." <br/>
                                                                ".$order->address." <br/>
                                                                ".$order->mobile."
                                                            </div>";
                                        echo Html::a($order->consignee,"javascript:void(0)", [
                                            'class' => 'ml-row',
                                            'data-toggle'=>'tooltip',
                                            'data-placement' => 'left',
                                            'title' =>  $title
                                        ]);
                                        ?>

                                        <?=Icon::show('user',['style'=>'color: lightgray'],Icon::BSG)?>
                                    </td>

                                    <td>
                                        <?php
                                            if($order->shipping_status == $order::C_SHIPPING_STATUS_SEND_NO){
                                                $days = (time()-$order->created_at)/(3600*24);
                                                $days = intval(10 - $days);
                                                echo $days>0 ? $days : 0;
                                                echo "天";
                                            } else {
                                                echo '0天';
                                            }
                                        ?>
                                    </td>

                                    <td>
                                        <?php
                                            switch($order->shipping_status){

                                                case $order::C_SHIPPING_STATUS_SEND_YES:
                                                    echo "已发货";
                                                    break;
                                                case $order::C_SHIPPING_STATUS_SEND_NO:
                                                    echo "未发货";
                                                    break;
                                                case $order::C_SHIPPING_STATUS_GIVE_UP:
                                                    echo "已放弃兑奖";
                                                    break;
                                                case $order::C_SHIPPING_STATUS_WEI_YUE:
                                                    echo "卖家已违约";
                                                    break;
                                                case $order::C_SHIPPING_STATUS_RECEIVE:
                                                    echo "已收货";
                                                    break;
                                            }
                                        ?>
                                    </td>


                                    <td>
                                        <?php
                                            $feedback = $order->feedback;

                                            if(!is_null($feedback) && $feedback instanceof Feedback) {

                                                $reply = $feedback->reply;
                                                echo $feedback->msg_content;
                                                if (is_null($reply))
                                                    echo ' <div class="text-right mt-row "> ' . Html::button("回复", ['class' => 'btn btn-primary btn-xs btn_reply', 'data-parent-id' => $feedback->msg_id]) . ' </div>';
                                                else {
                                                    echo ' <div class="text-right mt-row"> 已回复 </div>';
                                                }
                                            }

                                        ?>
                                    </td>

                                    <td>
                                        <?php
                                        switch($order->shipping_status){

                                            case $order::C_SHIPPING_STATUS_SEND_YES:
                                                echo Html::button("兑奖管理", [ 'class' => 'btn btn-primary btn-xs btn_cash_order']);
                                                break;
                                            case $order::C_SHIPPING_STATUS_SEND_NO:
                                                echo Html::button("兑奖管理", [ 'class' => 'btn btn-primary btn-xs btn_cash_order']);
                                                break;
                                            case $order::C_SHIPPING_STATUS_GIVE_UP:
                                                echo "已放弃兑奖";
                                                break;
                                            case $order::C_SHIPPING_STATUS_WEI_YUE:
                                                echo "卖家违规,罚没保证金";
                                                break;
                                            case $order::C_SHIPPING_STATUS_RECEIVE:
                                                echo "用户已经收货";
                                                break;
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

            </div>
        </div>

    </div>
</div>


<div class="wrap_cash_order" style="display: none">
    <?=Html::radioList("shipping_status", Prize_order::C_SHIPPING_STATUS_RECEIVE, [Prize_order::C_SHIPPING_STATUS_RECEIVE=>'奖品已交付成功...', Prize_order::C_SHIPPING_STATUS_WEI_YUE=>'判罚卖家违约', Prize_order::C_SHIPPING_STATUS_GIVE_UP=>'中奖人已放弃兑奖'])?>
</div>