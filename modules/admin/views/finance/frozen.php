<?php
use kartik\helpers\Html;
use yii\helpers\Url;
use yii\widgets\LinkPager;

?>

<div >
    <?=Html::a("待处理", Url::to(['/admin/finance/frozen']), [
        'class'=>'btn  btn-sm '.(Yii::$app->request->get('status')? ' btn-default ':' btn-primary ')
    ])?>
    &nbsp; &nbsp;
    <?=Html::a("已处理", Url::to(['/admin/finance/frozen', 'status'=>1 ]), [
        'class'=>'btn  btn-sm '.(Yii::$app->request->get('status')?' btn-primary ':' btn-default ')
    ])?>
</div>



<table class="table table-bordered mt-row">

    <thead>
        <th> 兑现日期 </th>
        <th> 会员账号 </th>
        <th> 收款支付宝账号  </th>
        <th> 支付宝认证实名  </th>
        <th> 退款金额 </th>
        <th> 财务处理 </th>
    </thead>

<?php


if(is_array($models) && count($models)){
        foreach($models as $model){
?>
            <tr class="tr_data" data-id="<?=$model->id?>">
                <td><?=date('Y-m-d H:i', $model->created_at)?></td>
                <td><?=$model->user->user_name?></td>
                <td><?=$model->cashUser->account?></td>
                <td><?=$model->cashUser->user?></td>
                <td><?=$model->amount?></td>
                <td>
                    <?=Html::button("立刻付款", ['class'=>'btn btn-primary btn-xs'])?>
                </td>
            </tr>

<?php
        }
    }
?>

</table>

<?php
    $pageHtml = LinkPager::widget([
        'pagination' => $pages
    ]);
    echo $pageHtml;
?>

<div class="invoice_form" style="display: none">

    <div class="text-left" style="margin-left:70px">
        <h5>发票编号：</h5>
        <?=Html::textInput('invoice_sn', '', ['class'=>'form-control mt-row', 'style'=>'width: 160px'])?>
    </div>
</div>
