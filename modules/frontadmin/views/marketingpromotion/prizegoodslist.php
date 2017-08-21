<?php
use app\modules\frontadmin\models\prize_goods\prize_goods;
use app\modules\jike\models\prize_codes\Prize_codes;
use kartik\grid\GridView;
use kartik\helpers\Html;
use kartik\icons\Icon;
use rmrevin\yii\fontawesome\FA;
use yii\helpers\Url;
use yii\data\ActiveDataProvider;
use yii\widgets\LinkPager;

?>

<?php
$this->params['breadcrumbs'] = [
    ['label' => '营销推广', '#'],
    ['label' => '视频广告营销', '#'],
    ['label' => '夺宝奖品发布与管理', 'url' => '#']
];
?>

<div class="marketingpromotion-prizeRelease">


        <?php
        //echo Yii::$app->view->render('left.php');
        ?>

                <nav>
                    <ul>
                        <li>
                            <?= Html::a("产品及服务说明", Url::to(['marketingpromotion/info']), ['class' => ' btn-gray']) ?>
                        </li>
                        <li>
                            <?= Html::a("夺奖产品发布/管理", Url::to(['marketingpromotion/prizeRelease']), ['class' => ' btn-active']) ?>
                        </li>
                        <li>
                            <?= Html::a("兑奖订单管理", Url::to(['marketingpromotion/orderList']), ['class' => ' btn-gray']) ?>
                        </li>
                    </ul>
                </nav>

                <div class="clearfix"></div>

                <div class="release mt-dl">
                    <div>
                        <h4 class="pull-left" style="border-bottom: none;">发布活动（奖品信息）列表:</h4>
                        <span><?=Html::a("+发布奖品信息",Url::to(['/frontadmin/marketingpromotion/prizeRelease']), ['class'=>'btn btn-warning btn-xs pull-right', 'style'=>"color:#fff;"])?></span>
                    </div>


                    <div class="content">
                        <table class=" table table-bordered bordered">
                            <thead style="text-align: center">
                            <tr  >
                                <td rowspan="2" style="vertical-align: middle"> 奖品(商品信息)</td>
                                <td colspan="3"> 0元夺宝活动奖品数据管理</td>
                                <td colspan="2"> 一元即开活动状态管理</td>
                                <td rowspan="2" style="vertical-align: middle"> 删除活动</td>
                            </tr>
                            <tr>
                                <td> 已开奖数</td>
                                <td> 正在活动数</td>
                                <td> 排队数/管理</td>
                                <td> 已兑奖数</td>
                                <td> 活动状态/管理</td>
                            </tr>
                            </thead>

                            <tbody>
                            <?php
                                foreach($dataProvider as $model){

                                    $pic = null;
                                    !is_null($model->pics) && $pic = array_shift($model->pics);
                                    !is_null($pic) && $pic = getImageHost().'/'.$pic->file_dir.'/'.$pic->getAttribute('file_name').'?w=52&h=40' ;
                            ?>
                                <tr id="tr-<?=$model->prize_id?>" data-id="<?=$model->prize_id?>">
                                    <td> <div class="wrap-thumb" style="float: left">
                                            <a href="<?= Url::to(['/goods/detail?id=' . $model->prize_id]) ?>" target="_blank">
                                                <?php
                                                $picHtml = Html::img(
                                                    $pic,
                                                    ['class' => 'img-responsive']
                                                );
                                                echo $picHtml;
                                                ?>
                                            </a>
                                        </div>
                                        <a href="<?= Url::to(['/goods/detail?id=' . $model->prize_id]) ?>" target="_blank" class="goods_name">
                                            <?=truncate_utf8_string($model->prize_name,10,'... ')?>
                                        </a>
                                    </td>
                                    <td> <?=$model->kaijiangNumber?> </td>
                                    <td> <span class="number_active"><?=$model->goods_number>0?1:0?></span></td>
                                    <td> <span class="number_store"><?=$model->goods_number?></span>  <?=Html::a(Icon::show("pencil",[],Icon::BSG),'javascript:void(0)',[
                                            'class' => '  btn-xs set-goods-number-btn',
                                            'data-id'=>$model->prize_id,
                                            'data-price' => $model->market_price
                                        ])?></td>
                                    <td> <?=$model->duijiangNumber?> </td>
                                    <td>
                                        <span class="one_money_status"><?=$model->one_money_status==prize_goods::C_ONE_MONEY_STATUS_ENABLE?"开启中":"未开启"?></span>
                                        <?=Html::a(Icon::show("pencil",[],Icon::BSG),'javascript:void(0)',[
                                            'class' => 'btn  btn-xs set-one-money-status-btn',
                                            'data-id'=>$model->prize_id,
                                            'data-status' => $model->one_money_status
                                        ])?></td>
                                    <td> <?=Html::button("删除", ['class'=>'btn btn-warning btn-xs delete_btn'])?></td>
                                </tr>
                            <?php
                                }
                            ?>
                            </tbody>
                        </table>

                        <?php
                            echo LinkPager::widget([
                                'pagination' => $pages
                            ])
                        ?>

                    </div>
                </div>



</div>


<div id="goods_number_edit" style="display: none;;" >
    <div class="form-inline goods-number-edit-wrapper">
        商家可投入多个商品参加活动，一件商品完成夺宝总需求的，将自动开启第二件商品，活动继续进行；<br/>除了一件正在活动的商品，其他商品处于排队状态...为了活动的连续性，请商家提前设置好参加活动的商品总数量...<br/>
        <?php
        $minus = \kartik\icons\Icon::show('minus',[],\kartik\icons\Icon::BSG);
        $plus = \kartik\icons\Icon::show('plus',[],\kartik\icons\Icon::BSG);
        ?>
        <div style="margin-top: 20px;">
            当前奖品投入数量调整为:
            <span class="btn btn-default btn-sub"><?=$minus?></span><input type="text" style="width: 60px;" name="goods-number" class="form-control"><span class="btn btn-default btn-add"><?=$plus?></span>
        </div>

    </div>
</div>







