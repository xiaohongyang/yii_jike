<?php
use app\modules\api\models\Region;
use app\modules\common\models\uploadform\I_Upload;
use app\modules\frontadmin\models\goods_sku\Goods_sku;
use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\frontadmin\models\prize_order\Prize_order;
use app\modules\jike\models\prize_codes\Prize_codes;
use kartik\icons\Icon;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Url;

?>


<nav>
    <ul>
        <li>
            <?= Html::a("产品及服务说明", Url::to(['marketingpromotion/info']), ['class' => 'btn-gray']) ?>
        </li>
        <li>
            <?= Html::a("夺奖产品发布/管理", Url::to(['marketingpromotion/prizegoodslist']), ['class' => ' btn-gray']) ?>
        </li>
        <li>
            <?= Html::a("兑奖订单管理", Url::to('#'), ['class' => ' btn-active']) ?>
        </li>
    </ul>
</nav>

<div class="clearfix"></div>


<div class="wrapper_list">

    <form id="search" method="get">
        <div class="header form-inline">
            <span class="bolder">订单状态：</span>
            <?= Html::dropDownList("shipping_status", Yii::$app->request->get('shipping_status') ?: 0, [
                0 => '全部',
                Prize_order::C_SHIPPING_STATUS_SEND_NO => '未发货',
                Prize_order::C_SHIPPING_STATUS_SEND_YES => '已发货'
            ], ['class' => 'form-control', 'onchange' => "$(this).closest('form').trigger('submit')"]) ?>
            &nbsp;&nbsp;
            <?= Html::dropDownList("time", Yii::$app->request->get('time') ?: 1, [
                1 => '1个月内',
                2 => '3个月内',
                3 => '6个月内'
            ], ['class' => 'form-control', 'onchange' => "$(this).closest('form').trigger('submit')"]) ?>
        </div>
    </form>

    <div class="content">
        <table class=" table table-bordered bordered text-center">
            <thead>
            <tr>
                <th> 活动开奖时间</th>
                <th> 奖品(订单)信息</th>
                <th> 中奖人收件信息</th>
                <th> 奖品对应活动详情</th>
                <th> 订单状态 / 发货管理</th>
            </tr>
            </thead>


            <tbody>
            <?php
            if (is_array($list) && count($list)) {

                foreach ($list as $order) {
                    if ($order instanceof Prize_order) {
                        $prizeCode = $order->prizeCode;
                        $goodsSku = $prizeCode->goodsSku;
                        $prizeGoods = $goodsSku->prizeGoods;
                        $order = $prizeCode->order;

                        if ($order instanceof app\modules\frontadmin\models\prize_order\Prize_order && $prizeGoods instanceof prize_goods && $goodsSku instanceof Goods_sku) {

                            $province = \app\modules\common\models\Region::findOne(['ID' => $order->province]);
                            $provinceName = is_null($province) ? "" : $province->RegionName;
                            $city = \app\modules\common\models\Region::findOne(['ID' => $order->city]);
                            $cityName = is_null($city) ? "" : $city->RegionName;
                            $district = \app\modules\common\models\Region::findOne(['ID' => $order->district]);
                            $districtName = is_null($district) ? "" : $district->RegionName;

                            //是否已结束
                            $isActiveStop = $goodsSku->prize_status == $goodsSku::C_PRIZE_STATUS_WIN_YES ? true : false;
                            //是否已中奖
                            $isWin = $prizeCode->prize_status == $goodsSku::C_PRIZE_STATUS_WIN_YES ? true : false;;
                            $totalTimes = 0;
                            $leftTimes = 0;

                            if ($prizeCode->prize_type == $prizeCode::C_PRIZE_TYPE_ZERO) {

                                $totalTimes = $prizeGoods->_getTotalPrizeTimes();
                                $havePrizedTimes = $prizeGoods->getHavePrizedTimes($prizeGoods->prize_id);
                                $leftTimes = $totalTimes - $havePrizedTimes;
                                $serialPre = 'A';
                            } else {
                                $isActiveStop = true;
                                $serialPre = 'B';
                            }

                            $prizeTitle = '<div  ><span class=\' \'>' . $prizeGoods->prize_code . ' ' . $prizeGoods->prize_name . '</span><br/>  活动期号: ' . $serialPre . $goodsSku->sku_id . '</div>';
                            ?>


                            <tr id="tr-<?= $prizeCode->code_id ?>" class="tr_id text-left"
                                data-id="<?= $order->order_id ?>">
                                <td>
                                    <div>
                                        <?= date('Y.m.d H:i', $prizeCode->created_at) ?>
                                    </div>
                                </td>
                                <td>
                                    <div class="wrap_thumb">
                                                <span>
                                                    <?php
                                                    if (!is_null($prizeGoods->thumb)) {

                                                        $picHtml = Html::img(
                                                            getImageHost() . '/' . $prizeGoods->thumb->file_dir . '/' . $prizeGoods->thumb->getAttribute('file_name'),
                                                            ['class' => 'img-responsive']
                                                        );
                                                        echo $picHtml;
                                                    }
                                                    ?>
                                                </span>
                                    </div>


                                    <a href="<?= Url::to(['/jike/goods/detail', 'id' => $prizeGoods->prize_id]) ?>"
                                       class='goods_name' data-toggle="tooltip" data-placement="right"
                                       title="<?= $prizeTitle ?> " target="_blank">
                                        <?= truncate_utf8_string($prizeGoods->prize_name, 16, '... ') ?>
                                    </a>
                                    <br/>
                                    <?= $prizeGoods->prize_code ?>
                                    <?php
                                    if ($order->goods_desc != "") {
                                        $goodsDesc = explode('|', $order->goods_desc);
                                        echo $desc . '&nbsp;&nbsp;&nbsp;';
                                        foreach ($goodsDesc as $desc) {
                                            echo $desc . '&nbsp;&nbsp;&nbsp;';
                                        }
                                    }
                                    ?>
                                </td>
                                <td>

                                    <?php
                                    $title = "  <div>
                                                                " . $order->consignee . " <br/>
                                                                " . $provinceName . $cityName . $districtName . " <br/>
                                                                " . $order->address . " <br/>
                                                                " . $order->mobile . "
                                                            </div>";
                                    echo Html::a($order->consignee, "javascript:void(0)", [
                                        'class' => 'ml-row',
                                        'data-toggle' => 'tooltip',
                                        'data-placement' => 'left',
                                        'title' => $title
                                    ]);
                                    ?>

                                    <?= Icon::show('user', ['style' => 'color: lightgray'], Icon::BSG) ?>

                                </td>
                                <td>
                                    活动类型：
                                    <?php
                                    if ($order->order_type == $order::C_ORDER_TYPE_ZERO)
                                        echo "<span class='warning'>0元夺宝</span>";
                                    else
                                        echo "<span class='warning'>1元即开</span>";
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    switch ($order->shipping_status) {
                                        case $order::C_SHIPPING_STATUS_SEND_NO:
                                            echo "待发货";
                                            echo Html::button("立刻发货", ["class" => "btn btn-warning btn-xs ml-row btn_send_now"]);
                                            break;
                                        case Prize_order::C_SHIPPING_STATUS_SEND_YES:
                                            echo "已发货";

                                            $orderTransport = $order->orderTransport;
                                            $desc = $order->goods_desc ? "(" . str_replace('|', ',', $order->goods_desc) . ")" : '';


                                            $title = "  <div>运单号：" . $orderTransport->transport->transport_name . "  " . $orderTransport->transport_sn . " <br/>
                                                                        发货时间：" . date('Y.m.d ', $order->send_at) . "&nbsp;&nbsp;&nbsp;" . date('H:i', $order->send_at) . "<br/>
                                                                        奖品：" . $prizeGoods->prize_name . $desc . "一件 <br/>
                                                                        收件人信息：<br/>
                                                                        " . $order->consignee . " <br/>
                                                                        " . $provinceName . $cityName . $districtName . " <br/>
                                                                        " . $order->address . " <br/>
                                                                        " . $order->mobile . "
                                                                    </div>";
                                            echo Html::a("详情", "javascript:void(0)", [
                                                'class' => 'ml-row',
                                                'data-toggle' => 'tooltip',
                                                'data-placement' => 'left',
                                                'title' => $title
                                            ]);
                                            break;
                                        case Prize_order::C_SHIPPING_STATUS_WEI_YUE:
                                            echo "已违约";
                                            break;
                                        case Prize_order::C_SHIPPING_STATUS_RECEIVE:
                                            echo "已收货";
                                            break;
                                        case Prize_order::C_SHIPPING_STATUS_GIVE_UP:
                                            echo "用户已放弃兑奖";
                                            break;
                                        default:
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

            </tbody>

        </table>

    </div>
</div>


<div class="wrap_transport_list " style="height: 0px; display: none;">

    <div class="form-inline text-left">
        <div class="h5"> 设置运单信息</div>
        <div class="content mt-dl">
            <?= Html::dropDownList("transport_id", null, ArrayHelper::merge([0 => '选择快递'], ArrayHelper::map($transportList, 'transport_id', 'transport_name')), [
                'class' => 'form-control'
            ]) ?>
            <?= Html::input('text', 'transport_sn', null, [
                'placeHolder' => '输入运单号',
                'class' => 'form-control'
            ]) ?>
        </div>

    </div>

</div>