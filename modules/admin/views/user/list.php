<?php

use \yii\helpers\Html;
use yii\widgets\ActiveForm;

?>

<div class="">

    <?=Html::button("+添加管理员", ['class'=>'btn btn-primary btn-sm btn_add_admin_user'])?>

    <form action="" method="get" class="mt-row">
        管理员姓名:
        <input type="text" name="user_name"  value="<?=Yii::$app->request->get('user_name')?:''?>" /> &nbsp;&nbsp;
        <span >管理员性质/权限:</span>
        <?=Html::dropDownList('item_name',Yii::$app->request->get('item_name')?:0,[
            0 =>'全部',
            '超级管理员'=>'超级管理员',
            '业务管理员'=>'业务管理员',
            '网站管理员'=>'网站管理员',
            '客服管理员'=>'客服管理员',
            '财务管理员'=>'财务管理员',
            '内容审核员'=>'内容审核员',
        ]) ?>
        &nbsp;&nbsp;
        <?=Html::submitButton("查找", ['class'=>'btn btn-primary btn-xs'])?>
    </form>

    <table class="table table-bordered mt-row">
        <thead>
            <th>
                管理员姓名
            </th>
            <th>
                管理员手机号
            </th>
            <th>
                管理员性质/权限
            </th>
            <th>
                管理员管理
            </th>
        </thead>

        <?php

            if(is_array($models) && count($models)){
                foreach($models as $model){
        ?>
                    <tr data-id="<?=$model['user_id']?>">
                        <td><?=$model['user_name']?></td>
                        <td><?=$model['user_mobile']?></td>
                        <td><?=$model['item_name']?></td>
                        <td>
                            <?=Html::a("删除","javascript:void(0)",[
                                'class' => 'btn_del'
                            ])?>

                            <?=Html::a("修改权限","javascript:void(0)",[
                                'class' => 'btn_edit',
                                'data-id' => $model['user_id'],
                                'data-item-name' => $model['item_name']
                            ])?>
                        </td>
                    </tr>
        <?php
                }
            }
        ?>
    </table>

</div>


<div class="wrap_create" style="display: none">

    <div class="text-left">
        <table class="table table-bordered">
            <tr>
                <td>管理员性质/权限：</td>
                <td>
                    <?= Html::dropDownList('item_name', Yii::$app->request->get('item_name') ?: 0, [
                        0 => '全部',
                        '超级管理员' => '超级管理员',
                        '业务管理员' => '业务管理员',
                        '网站管理员' => '网站管理员',
                        '客服管理员' => '客服管理员',
                        '财务管理员' => '财务管理员',
                        '内容审核员' => '内容审核员',
                    ]) ?>
                </td>
            </tr>
            <tr class="mt-row">
                <td>管理员姓名：</td>
                <td>
                    <?= Html::textInput("user_name", null, ['class' => 'input-sm']) ?>
                </td>
            </tr>
            <tr class="mt-row">
                <td>管理员手机号：</td>
                <td>
                    <?= Html::textInput("user_mobile", null, ['class' => 'input-sm']) ?>
                </td>
            </tr>
        </table>
    </div>
</div>

<div class="wrap_edit" style="display: none">

    <div class="text-left">
        <table>
            <tr>
                <td>管理员性质/权限：</td>
                <td>
                    <?= Html::dropDownList('item_name', Yii::$app->request->get('item_name') ?: 0, [
                        0 => '全部',
                        '超级管理员' => '超级管理员',
                        '业务管理员' => '业务管理员',
                        '网站管理员' => '网站管理员',
                        '客服管理员' => '客服管理员',
                        '财务管理员' => '财务管理员',
                        '内容审核员' => '内容审核员',
                    ]) ?>
                </td>
            </tr>

        </table>
    </div>

</div>