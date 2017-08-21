<?php

use app\modules\common\lib\GridView;
use app\modules\frontadmin\models\love_video\Love_video;
use app\widgets\AjaxSubmitForm;
use app\widgets\AreaPickerWidget;
use kartik\grid\SerialColumn;
use kartik\icons\Icon;
use xj\bootbox\BootboxAsset;
use yii\bootstrap\Alert;
use yii\bootstrap\Html;
use yii\bootstrap\Modal;
use yii\helpers\Url;
use yii\web\View;
use yii\widgets\ActiveForm;
use yii\widgets\LinkPager;


?>

    <button class="btn btn-active btn-primary " data-toggle="modal" data-target="#create">添加广告</button>

    <h5>
        公益公告列表:
    </h5>

    <table class="table table-bordered">

        <tr>
            <td>序号</td>
            <td>广告名称</td>
            <td>管理/修改</td>
        </tr>

        <?php
            if(is_array($models) && count($models)){

                $i = 0;
                foreach($models as $modelItem){
                    $i++;
                    if($modelItem instanceof Love_video){
                        $serialize = $pages->pageSize * $pages->page;
        ?>
                        <tr>
                            <td><?=$serialize + $i?></td>
                            <td><?=$modelItem->love_name?></td>
                            <td>
                                <?php
                                    $editBtn = Html::a("修改", 'javascript:void(0)', [
                                        'class' => 'edit-btn',
                                        'data-url' => Url::to(['/admin/lovevideo/edit','id'=>$modelItem->love_id]),

                                    ]);
                                    echo $editBtn.'&nbsp;&nbsp;';

                                    $removeBtn = Html::a("删除",'javascript:void(0)', [
                                        'class' => 'remove-btn',
                                        'data-url' => Url::to(['/admin/lovevideo/remove','id'=>$modelItem->love_id])
                                    ]);
                                    echo  $removeBtn;
                                ?>

                            </td>
                        </tr>
        <?php
                    }
                }
            }
        ?>

    </table>

    <?php
        $linkPager = LinkPager::widget(['pagination' => $pages]);
        echo $linkPager;
    ?>

<?php
Modal::begin([
    'header' => '添加广告',
    'size' => Modal::SIZE_LARGE,
    'toggleButton' => [
        'label' => '添加广告', 'class' => 'btn btn-success hide', 'tag'=>'a'
    ],
    'options' => ['id'=>'create']
]);
?>
    <div>
        <iframe id="iframe_create_video" class="actionIframe" src="<?=Url::to(['/admin/lovevideo/create'])?>"  scrolling="auto"> </iframe>
    </div>
<?php
Modal::end();
?>


<?php
Modal::begin([
    'header' => '修改广告信息',
    'size' => Modal::SIZE_LARGE,
    'toggleButton' => [
        'label' => '修改广告', 'class' => 'btn btn-success hide', 'tag'=>'a'
    ],
    'options' => ['id'=>'edit']
]);
?>
    <div>
        <iframe id="iframe_edit_video" class="actionIframe" src=""  width="1200" scrolling="auto"></iframe>
    </div>
<?php
Modal::end();
?>


<?php
Yii::$app->view->on(View::EVENT_END_PAGE, function(){

    $infoSuccess = Yii::$app->session->getFlash('info_success');
    $infoFail = Yii::$app->session->getFlash('info_fail');
    $delInfo = $infoSuccess ? : ($infoFail ? : '') ;

    $ajaxVieoStatusUrl = Url::to(['/api/video/status']);
    $ajaxRechargeUrl = Url::to(['/api/video/recharge']);
    $str = <<<STD
            <script type="text/javascript">

                //1.加价和减价

                $.fn.ajaxGetVideoStatus = {
                    init : function(){
                    }
                }

                $(function(){

                    var delInfo="{$delInfo}";
                    if(delInfo.length>0){
                        $.x_alert({
                            cont: delInfo
                        });
                    }

                })
            </script>
STD;

    echo $str;

})
?>