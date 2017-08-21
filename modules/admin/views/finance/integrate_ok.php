<?php
use kartik\helpers\Html;
use yii\helpers\Url;
use yii\widgets\LinkPager;

?>

<div >
    <?=Html::a("待处理", Url::to(['/admin/finance/integrate']), [
        'class'=>'btn  btn-sm '.(Yii::$app->request->get('status')? ' btn-default ':' btn-primary ')
    ])?>
    &nbsp; &nbsp;
    <?=Html::a("已处理", Url::to(['/admin/finance/integrate', 'status'=>1 ]), [
        'class'=>'btn  btn-sm '.(Yii::$app->request->get('status')?' btn-primary ':' btn-default ')
    ])?>
</div>

<form action="<?=Url::to(['/admin/finance/integrate', 'status'=>1 ])?>" class=" mt-row " role="form"  method="get">

    <input type="hidden" name="status" value="1">

    <span>兑现日期：</span>
    <?=Html::textInput("created_at", Yii::$app->request->get('created_at'))?>

    <span class="ml-dl">兑现会员账号：</span>
    <?=Html::textInput('user_name', Yii::$app->request->get('user_name')) ?>

    <?=Html::submitButton("提交",['class'=>'btn btn-primary btn-xs ml-row'])?> </td>

</form>

<table class="table table-bordered mt-row">

    <thead>
        <th> 兑现日期 </th>
        <th> 会员账号 </th>
        <th> 收款支付宝账号  </th>
        <th> 支付宝认证实名  </th>
        <th> 兑现金额 </th>
        <th> 处理结果 </th>
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
                    处理成功
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
