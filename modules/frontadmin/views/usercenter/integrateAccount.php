<?php
use yii\bootstrap\Tabs;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

?>


<div class="frontadmin-usercenter-integrateAccount">


            <div class="account-amount">
                您的积分账户余额: <span class="money">￥<?=$integrateAccount?></span>
            </div>

            <?php
                $tabs = Tabs::widget([
                    'items' => [
                        [
                            'label' => '积分兑现',
                            'content' => $this->render('integrateCash', ['model'=>$modelCash]),
                            'active' => true
                        ]/*,
                        [
                            'label' => '积分充值',
                            'content' => $this->render('integrateRecharge', ['model' => $model]),
                        ]*/
                    ],
                    'options' => [
                        'class' => 'mt-dl'
                    ]
                ]);

                echo $tabs;
            ?>
        </div>

<?php
    $info = Yii::$app->getSession()->getFlash('info');
    if(strlen($info)){

        Yii::$app->view->registerJs('$.x_say_x({"cont": "'.$info.'"})', 3 );
    }

?>


