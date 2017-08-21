<?php
use yii\helpers\Url;
?>

<?php
    $controllerId = Yii::$app->controller->id;
    $action = Yii::$app->controller->action->id;
?>

    <div class="side-left">

        <?php
            $isWdJike = $isYxGuanli = $isSpGuangao = false;
            if($controllerId=='usercenter' && in_array($action,['index','integrateAccount','cashPrize','msg'])){
                $isWdjike = true;
            } else if($controllerId == 'usercenter' && in_array($action, ['marktingAccountRecharge','frozenAccount']))
                $isYxGuanli = true;
            else if(
                ($controllerId ==  'advideo' && $action == 'index')
                || ($controllerId=='marketingpromotion' && $action=='prizeRelease')
                || ($controllerId=='advideo' && $action=='info')
                || ($controllerId=='marketingpromotion' && $action=='prizegoodslist')
                || ($controllerId=='marketingpromotion' && $action=='info')
                || ($controllerId=='marketingpromotion' && $action=='orderList')
            ){

                $isSpGuangao = true;
            }

        ?>
                <ul class="<?=$isWdjike ? '' : 'hide'?>">
                    <li style="border-top: none;">
                        <div class="title">
                            <span class="icon"></span><a href="" >我的集客</a>
                        </div>
                        <ul>
                            <li>
                                <a href="<?=Url::to(['/frontadmin/usercenter/index'])?>" <?= $controllerId=='usercenter' && $action=='index'?'class="active"':''?>>会员账户设置 <span></span></a>
                            </li>
                            <li>
                                <a href="<?=Url::to(['/frontadmin/usercenter/integrateAccount'])?>" <?=$controllerId=='usercenter' && $action=='integrateAccount'?'class="active"':''?>>积分管理 <span></span></a>
                            </li>
                            <li>
                                <a href="<?=Url::to(['/frontadmin/usercenter/cashPrize'])?>" <?=$controllerId=='usercenter' && $action=='cashPrize'?'class="active"':''?>>0元夺宝兑奖 <span></span></a>
                            </li>
                            <li>
                                <a href="<?=Url::to(['/frontadmin/usercenter/msg'])?>" <?=$controllerId=='usercenter' && $action=='msg'?'class="active"':''?>>站内信息 <span></span></a>
                            </li>
                        </ul>
                    </li>
                </ul>


            <ul class=" yxzh <?=$isYxGuanli || $isSpGuangao ? '' : 'hide'?>">
                <li style="border-top: none;">
                    <div class="title">
                        <span class="icon"></span><a href="" >营销账户管理</a>
                    </div>
                    <ul>


                        <li>
                            <a href="<?= Url::to(['/frontadmin/usercenter/marktingAccountRecharge']) ?>" <?=$controllerId=='usercenter' && $action=='marktingAccountRecharge'?'class="active"':''?>>营销账户管理 <span></span></a>
                        </li>
                        <li>
                            <a href="<?= Url::to(['/frontadmin/usercenter/frozenAccount']) ?>" <?=$controllerId=='usercenter' && $action=='frozenAccount'?'class="active"':''?>>保证金账户管理 <span></span></a>
                        </li>

                        <li>
                            <a href="<?=Url::to(['advideo/index'])?>" <?=$controllerId=='advideo' ?'class="active"':''?>>爱心抽奖品牌视频广告 <span></span></a>
                        </li>
                        <li>
                            <a href="<?=Url::to(['marketingpromotion/prizeRelease'])?>" <?=$controllerId=='marketingpromotion' ?'class="active"':''?>>0元夺宝电商品牌视频广告 <span></span></a>
                        </li>
                    </ul>
                </li>


            </ul>




    </div>
