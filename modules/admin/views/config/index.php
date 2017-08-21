<?php
use app\widgets\ModalWidget;
use yii\helpers\Url;
?>
<div class="wrapper">

    <div>
        <a href="<?=Url::to(['/admin/config/create'])?>" class="btn btn-primary">创建</a>
    </div>


    <table class="table table-bordered mt-row">
        <thead>
            <tr>
                <th>配置名称</th>
                <th>值</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
        <?php
            foreach($list as $row){
        ?>
                <tr>
                    <td><?=$row['name']?></td>
                    <td><?=$row['value']?></td>
                    <td>
                        <a href="<?=Url::to(['/admin/config/create', 'id'=>$row['config_id']])?>"> 编辑 </a>
                        <a href="<?=Url::to(['/admin/config/remove','id'=>$row['config_id']])?>" > 删除 </a>
                    </td>
                </tr>
        <?php
            }
        ?>
        </tbody>
    </table>


</div>


<input type="hidden" id="info" value="<?=Yii::$app->session->getFlash("info")?>" show="1" />