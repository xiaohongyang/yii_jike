<?php
use yii\bootstrap\Tabs;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\ActiveForm;

?>


<div class="frontadmin-usercenter-frozenAccount">


            <section class="border-b-1px">
                <div class="account-amount">
                    您的保证金账户余额： <span class="money">¥<?=$frozenAccount?></span>元

                    <span><?=Html::button("申请退款", ['class'=>'btn btn-primary ml-dl btn-xs btn_bail_back'])?></span>
                </div>
            </section>

            <?php
            $form = ActiveForm::begin([
            ]);
            ?>
            <input type="hidden" id="invoiceType" value="-1" name="<?=$model->formName()?>[invoiceType]" />
            <section class="border-b-1px mt-row">
                <h4>
                    账户充值
                </h4>
                <div class="p-left">

                    <?php
                    $recharge = $this->render('margtingRecharge', ['model' => $model, 'form' =>$form]);

                    echo $recharge;
                    ?>
                </div>
            </section>
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


</div>

<?php
    $info = Yii::$app->getSession()->getFlash('info');
    if(strlen($info)){

        Yii::$app->view->registerJs('$.x_say_x({"cont": "'.$info.'"})', 3 );
    }

?>


