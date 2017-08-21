<?php
use app\widgets\AreaPickerWidget;
use app\widgets\RegionWidget;
use yii\bootstrap\Tabs;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

?>




<div class="frontadmin-usercenter-marktingAccount">


            <section class="border-b-1px">

                <div class="account-amount">
                    您的营销账户余额： <span class="money">¥<?=$marktingAccount?></span>元
                </div>
            </section>

            <section class="border-b-1px mt-row">
                <h4>
                    发票信息： <a href="javascript: void(0)" class="btn-edit-invoice" onclick="">[修改]</a>
                </h4>
                <div class="p-left">
                    <div class="default-invoice">
                        个人 &nbsp;&nbsp; 不开发票 <br/>
                        <span class="warning"> 备注：如需发票，请设置发票信息</span>
                    </div>

                    <?php
                        $formInvoice = ActiveForm::begin([

                        ]);
                    ?>
                    <div class="invoice">
                        <div class="row">
                            <div class="col-md-12">
                                <?=Html::radioList("MarAccountFlowInvoiceForm[invoice_type]", 1, [1=>'个人', 2=>'企业']) ?>
                            </div>
                        </div>

                        <?=$formInvoice->field($invoiceModel, 'title', [
                            'options' => ['class' => 'form-inline', 'style'=>'display: none;']
                        ])->textInput()?>

                        <div class="form-inline field-maraccountflowinvoiceform-city required ">
                            <label class="control-label" for="maraccountflowinvoiceform-city">所在地区</label>
                            <span style="z-index:1002" class="zn_select_area"
                                 data-name="<?=$invoiceModel->formName()?>[province],<?=$invoiceModel->formName()?>[city],<?=$invoiceModel->formName()?>[district]">选择收货地址</span>
                            <div class="help-block"></div>
                        </div>


                        <?=$formInvoice->field($invoiceModel, 'address', [
                            'options' => ['class' => 'form-inline']
                        ])->textInput()?>
                        <?=$formInvoice->field($invoiceModel, 'contacts', [
                            'options' => ['class' => 'form-inline']
                        ])->textInput()?>
                        <?=$formInvoice->field($invoiceModel, 'tel', [
                            'options' => ['class' => 'form-inline']
                        ])->textInput()?>
                        <div class="form-inline  required  ">
                            <label class="control-label"  > </label>
                            <input type="button" class="btn submit  btn-primary" value="保存">
                            <div class="help-block"></div>
                        </div>
                    </div>
                    <?php $formInvoice->end()?>


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

</div>



<?php
    $invoiceFormName = $invoiceModel->formName();
$jsStr = <<<STD


        var invoiceFormName = '{$invoiceFormName}'
        $.fn.invoice = {
            invoiceTypeEvent : function(){

                var invoiceFormName = '{$invoiceFormName}';
                $("input[name='"+invoiceFormName+"[invoice_type]']").change(function(){

                    var type=($(this).val())
                    if(type==1){
                        $("input[name='"+invoiceFormName+"[title]']").closest('.form-inline').hide()
                        $("input[name='"+invoiceFormName+"[title]']").closest('.form-inline').removeClass('has-error');
                    } else {
                        $("input[name='"+invoiceFormName+"[title]']").closest('.form-inline').show()
                        if(!$("input[name='"+invoiceFormName+"[title]']").val()){
                            $("input[name='"+invoiceFormName+"[title]']").closest('.form-inline').addClass('has-error');
                            $("input[name='"+invoiceFormName+"[title]']").closest('.form-inline').find('.help-block').html('发票抬头不能为空。');
                        }
                    }
                    $('#invoiceType').val(type);
                })
            },
            btnEditInvoice : function(){
                $('.btn-edit-invoice').click(function(){

                    var invoiceType = $("input[name='MarAccountFlowInvoiceForm[invoice_type]']:checked").val();
                    $('#invoiceType').val(invoiceType);
                    $('.invoice').show();
                    setTimeout(function(){
                         var form = $("#w0"),
                        data = form.data("yiiActiveForm");
                        $.each(data.attributes, function() {
                            this.status = 3;
                        });
                        form.yiiActiveForm("validate");
                    },300)
                })
            },
            checkCity : function(){
                var inputCity = $("input[name='"+invoiceFormName+"[city]']");

                    if( inputCity.val() == 0 ){
                        inputCity.closest('.form-inline').addClass('has-error');
                        inputCity.closest('.form-inline').find('.help-block').html('请选择所在地区城市')
                    } else {
                        inputCity.closest('.form-inline').removeClass('has-error');
                        inputCity.closest('.form-inline').find('.help-block').html('');
                    }
            },
            checkTitle : function(){
                $("input[name='"+invoiceFormName+"[title]']").keyup(function(){

                    if($(this).val().trim().length > 0){
                        $(this).closest('.form-inline').removeClass('has-error');
                        $(this).closest('.form-inline').find('.help-block').html('');
                    } else {
                        $(this).closest('.form-inline').addClass('has-error');
                        $(this).closest('.form-inline').find('.help-block').html('发票抬头不能为空。');
                    }
                })
            },
            triggerValidate : function(){

                $.fn.invoice.checkTitle();
                $("input[name='"+invoiceFormName+"[city]']").closest('.form-inline').mouseout(function(){
                    $.fn.invoice.checkCity();
                })

                $('.invoice').find('.submit').click(function(){

                    $.fn.invoice.checkCity();

                    var form = $("#w0"),
                    data = form.data("yiiActiveForm");
                    $.each(data.attributes, function() {
                        this.status = 3;
                    });
                    form.yiiActiveForm("validate");

                    if($(this).closest('.invoice').find('.has-error').length == 0){
                        var invoiceType = $('#invoiceType').val();
                        if( invoiceType == 1){
                            $('.default-invoice').html('个人');
                        } else if( invoiceType == 2){
                            $('.default-invoice').html('企业');
                        }
                        $(this).closest('.invoice').hide();
                    }
                })
            },
            init : function(){
                $.fn.invoice.btnEditInvoice();
                $.fn.invoice.invoiceTypeEvent();
                $.fn.invoice.triggerValidate();

            }
        }

        $(function(){
            $.fn.invoice.init();

            $('#w1').on('beforeSubmit', function(){

                $('#appendDiv').remove();

                if($('#w0').find('.has-error').length>0){
                    return false;
                }

                var appendDiv = $('<div style="display: none;" id="appendDiv"></div>')
                appendDiv.append($('.invoice').clone())
                $('#w1').append(appendDiv);
            })

        })

        //价格增加与减少
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

<?php
$info = Yii::$app->getSession()->getFlash('info');
if(strlen($info)){

    Yii::$app->view->registerJs('$.x_say_x({"cont": "'.$info.'"})', 3 );
}

?>

<script type="text/javascript">

</script>

