<?php
use rmrevin\yii\fontawesome\component\Icon;
use yii\helpers\Url;
use yii\widgets\ActiveForm;
    use yii\helpers\Html;
?>
<?php
$form = ActiveForm::begin([ ]);
?>

<input type="hidden" name="action" value="recharge" />
<?php
//$minus = \kartik\icons\Icon::show('minus',[],\kartik\icons\Icon::BSG);
//$plus = \kartik\icons\Icon::show('plus',[],\kartik\icons\Icon::BSG);

$minus = '-';
$plus = '+';
?>

<?=$form->field($model, 'amount', [
        'template' => '{label} <span class="btn btn-default btn-sub btn-xs">'.$minus.'</span>{input}<span class="btn btn-default btn-add btn-xs">'.$plus.'</span> {error}',
        'options' => [
            'class' => 'form-inline ',
        ]])
    ->textInput(['style'=>'text-align: right;'])
    ->label('选择充值金额：');
?>

<div class=" field-integraterechargemodel-amount required">
    <label class="control-label" for="integraterechargemodel-amount">选择充值金额：</label>

    <div class="wrap-pay-way">
        <div class="head">
            <ul>
                <li>
                    快捷支付
                </li>
            </ul>
        </div>
        <div class="body">
            <a href="#"><img src="<?=Url::to(['/css/images/zhifubao.jpg'])?>" /></a>
        </div>
    </div>
</div>

<?=Html::submitButton("立刻充值", ['class'=>'btn  btn-xhy-yellow   mt-dl'])?>

<?php $form->end()?>

<script type="text/javascript">

</script>

<?php
    $jsStr = <<<STD
        $('.btn-sub').click(function(){
            var value = $(this).next('input').val();
            value = parseFloat(value);
            if(isNaN(value)){
                $(this).next('input').val(0);
                return false;
            }

            value = value - 10;
            if( value<0 ){
                return false;
            }
            $(this).next('input').val(value);
        })

        $('.btn-add').click(function(){
            var value = $(this).prev('input').val();
            value = parseFloat(value);
            if(isNaN(value)){
                $(this).prev('input').val(0);
                return false;
            }

            value = value + 10;
            $(this).prev('input').val(value);
        })
STD;
    Yii::$app->view->registerJs($jsStr, 3);
?>

<script type="text/javascript">

</script>