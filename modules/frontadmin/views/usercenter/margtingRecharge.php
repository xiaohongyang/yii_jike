<?php
use rmrevin\yii\fontawesome\component\Icon;
use yii\helpers\Url;
use yii\widgets\ActiveForm;
    use yii\helpers\Html;
?>


                <input type="hidden" name="action" value="recharge" />
                <?php
//                $minus = \kartik\icons\Icon::show('minus',[],\kartik\icons\Icon::BSG);
//                $plus = \kartik\icons\Icon::show('plus',[],\kartik\icons\Icon::BSG);
                $minus = '-';
                $plus = '+';
                ?>

                <?=$form->field($model, 'amount', [
                        'template' => '{label} <span class="btn btn-default btn-xs btn-sub">'.$minus.'</span>{input}<span class="btn btn-default btn-xs btn-add">'.$plus.'</span> {error}',
                        'options' => [
                            'class' => 'form-inline',
                        ]])
                    ->textInput(['style'=>'width: 120px; text-align: right;'])
                    ->label('选择充值金额：');
                ?>

                <div class=" field-integraterechargemodel-amount required">
                    <label class="control-label" for="integraterechargemodel-amount">选择支付方式：</label>

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
