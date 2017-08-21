<?php
use app\modules\frontadmin\models\prize_goods\prize_goods;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\LinkPager;

?>

    <div class="wrap_filter form-inline">

        <form method="get">

            <?=Html::dropDownList("prize_type_id", Yii::$app->request->get('prize_type_id')?:'0' ,$prizeTypeList, ['class'=>'form-control'])?>
        </form>

    </div>


    <table class="table table-borded mt-row">
        <tr>
            <td>发布时间</td>
            <td>奖品（商品信息）</td>
            <td>奖品设置价值</td>
            <td>外链销售地址</td>
            <td>所属分类</td>
            <td>审核</td>
        </tr>

        <?php
        if(is_array($models) && count($models)){
            foreach($models as $model){
                if($model instanceof prize_goods){
        ?>
                    <tr class="tr_id" data-prize-id="<?=$model->prize_id?>">
                        <td><?=date('Y-m-d', $model->created_at)?></td>
                        <td>
                            <div class="wrap_thumb">
                                <a href="<?=Url::to(['/jike/goods/detail','id'=>$model->prize_id])?>" target="_blank">
                                    <span>
                                        <?php
                                        if(!is_null($model->thumb)){

                                            $picHtml = Html::img(
                                                getImageHost().'/'.$model->thumb->file_dir.'/'.$model->thumb->getAttribute('file_name'),
                                                ['class' => 'img-responsive']
                                            );
                                            echo $picHtml;
                                        }
                                        ?>
                                    </span>
                                </a>
                            </div>
                            <?=truncate_utf8_string( $model->prize_name, 18, '...' )?>

                        </td>
                        <td> <span class="money"><?=$model->market_price?></span> </td>
                        <td> <?=Html::a($model->goods_link,$model->goods_link, ['target'=>'_blank'])?> </td>

                        <td> <?=$model->prizeType->type_name?> </td>
                        <td>
                            <?=Html::button("审核", ['class'=>'btn btn-xs btn-primary btn-verify'])?>
                        </td>
                    </tr>
        <?php
                }
            }
        }
        ?>
    </table>


    <?=LinkPager::widget([
        'pagination' => $pages
    ])?>


<div class="wrap_verify_form" style="display: none">
    <div class="text-left">
        <?=Html::radioList("status",prize_goods::C_STATUS_CHECKED_OK,
            [
                prize_goods::C_STATUS_CHECKED_OK=>"商品合格，通过审核   ",
                prize_goods::C_STATUS_DELETED=>"不良，不匹配或不真实，删除商品... "
            ],
            ['separator'=>'<br/>' ])
        ?>
    </div>
</div>
