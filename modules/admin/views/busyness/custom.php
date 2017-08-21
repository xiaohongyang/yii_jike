<?php
use kartik\helpers\Html;
use yii\helpers\Url;
use yii\widgets\LinkPager;

?>



<form class="form-horizontal" role="form"  method="get">
    <div class="form-group">
        <label class="col-sm-2 control-label" for="ds_host">所在地址:</label>
        <div class="col-sm-4">

            <?php
            $province = Yii::$app->request->get('province');
            $city = Yii::$app->request->get('city');
            $district = Yii::$app->request->get('district');
            $citySelectControl = <<<STD
        <span style="z-index:1002" class="zn_select_area"
                                  data-name="province,city,district"
                                  data-value="{$province},{$city},{$district}"
                                  >选择收货地址</span>
STD;
                echo $citySelectControl;
            ?>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label" for="ds_host">企业名称:</label>
        <div class="col-sm-4">
            <input class="form-control" name="user_name" type="text" value="<?=Yii::$app->request->get('user_name')?>"/>
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label" for="ds_host">90天内累计充值:</label>
        <div class="col-sm-4">
            <?=Html::dropDownList("money",Yii::$app->request->get('money')?:0,[0=>'选择',10000=>'1万以上',100000=>'10万以上',1000000=>'100万以上'],['class'=>'form-control','style="display:inline-block"'])?>
        </div>
    </div>

    <div class="form-group">
        <label class="col-sm-2 control-label" for="ds_host"> </label>
        <div class="col-sm-4">
            <?=Html::submitButton("提交",['class'=>'btn btn-primary btn-sm'])?> </td>
        </div>
    </div>
</form>



<table class="table table-bordered">
    <thead>
        <th> 企业名称 </th>
        <th> 所在地 </th>
        <th> 详细地址  </th>
        <th> 联系人  </th>
        <th> 联系电话  </th>
        <th> 90天内累计统计(万元) </th>
        <th> 推广账户余额(万元) </th>
        <th> 推广90天流水  </th>
    </thead>

<?php


if(is_array($models) && count($models)){
        foreach($models as $model){
?>
            <tr>
                <td> <?=$model->user_name?> </td>
                <!--最收货地址中的数据-->
                <td> <?=is_null($model->userAddress->cityModel)?'':$model->userAddress->provinceModel->RegionName.' '.$model->userAddress->cityModel->RegionName?> </td>
                <td> <?=is_null($model->userAddress)?'':$model->userAddress->address?> </td>
                <td> <?=is_null($model->userAddress)?'':$model->userAddress->consignee?> </td>
                <td> <?=is_null($model->userAddress)?'':$model->userAddress->mobile?> </td>
                <td> <?=$model->getThreeMonthMarktingPay()?></td>
                <td> <?=$model->user_account->markting_account?$model->user_account->markting_account:'0.00'?>  </td>
                <td> <?=Html::a("下载", Url::to(['/frontadmin/advideo/downAccountLog','id'=>$model->user_id]))?>
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