<?php
use rmrevin\yii\fontawesome\component\Icon;
use yii\helpers\Url;
use yii\widgets\ActiveForm;
    use yii\helpers\Html;
?>


    <section>
        <h4>
            兑现说明：
        </h4>
        <div class="p-left">
            关于兑现：满50元起况, 按50元的整数倍兑现... <br/>
            关于扣税：国家统一所得税率为20%；如兑现金额为50元，实收金额为40元...<br/>
            对于收款：提交兑现信息后，客服将在三个工作日内完成支付，请及时查收...<br/>
        </div>
    </section>


    <section>
        <h4>
            提交兑现信息：
        </h4>
        <div class="p-left">
            <?php
            $form = ActiveForm::begin([ ]);
            ?>

            <input type="hidden" name="action" value="cash" />

            <?=$form->field($model, 'account', [
                'template' => ' {input}  {error}',
                'options' => [
                    'class' => 'form-inline',
                ]])
                ->textInput([
                    'style'=>'width: 120px; text-align: left;',
                    'placeHolder' => $model->attributeLabels()['account']
                ]);
            ?>

            <?=$form->field($model, 'user', [
                'template' => ' {input}  {error}',
                'options' => [
                    'class' => 'form-inline',
                ]])
                ->textInput([
                    'style'=>'width: 150px; text-align: left;',
                    'placeHolder' => $model->attributeLabels()['user']
                ]);
            ?>

            <?=Html::submitButton("立刻提现", ['class'=>'btn  btn-xhy-yellow  '])?>

            <?php $form->end()?>
        </div>
    </section>

