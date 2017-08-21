<?php
use kartik\helpers\Html;
use yii\helpers\Url;
use yii\widgets\LinkPager;

?>

<div >
    <?=Html::a("待开发票", Url::to(['/admin/finance/invoice']), [
        'class'=>'btn  btn-sm '.(Yii::$app->request->get('status')? ' btn-default ':' btn-primary ')
    ])?>
    &nbsp; &nbsp;
    <?=Html::a("已开发票", Url::to(['/admin/finance/invoice', 'status'=>1 ]), [
        'class'=>'btn  btn-sm '.(Yii::$app->request->get('status')?' btn-primary ':' btn-default ')
    ])?>
</div>



<table class="table table-bordered mt-row">

    <thead>
        <th> 充值日期 </th>
        <th> 用户账号 </th>
        <th> 企业名称(发票抬头)  </th>
        <th> 所在区域  </th>
        <th> 详细地址(发票邮递地址)  </th>
        <th> 联系人 </th>
        <th> 联系电话 </th>
        <th> 充值金额  </th>
        <th> 发票设置  </th>
    </thead>

<?php


if(is_array($models) && count($models)){
        foreach($models as $model){
?>
            <tr class="tr_data" data-id="<?=$model->invoice_id?>">
                <td> <?=date('Y-m-d H:i', $model->flow->created_at)?>   </td>
                <!--最收货地址中的数据-->
                <td> <?=$model->flow->user->user_name?>  </td>
                <td> <?=$model['title']?$model['title']:$model->contacts?>  </td>
                <td> <?=$model->provinceModel->RegionName?>
                    <?=$model->cityModel->RegionName?>
                    <?=$model->districtModel->RegionName?>
                </td>
                <td> <?=$model['address']?>  </td>
                <td> <?=$model->contacts?> </td>
                <td>  <?=$model->tel?>  </td>
                <td>  <?=$model->flow->amount?>  </td>
                <td> <?=Html::button("设置", ['data-url'=>Url::to(['/admin/finance/setInvoiceSn' ]), 'class'=>'btn btn-primary btn-xs set_invoice'])?>
                    <br/>
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
