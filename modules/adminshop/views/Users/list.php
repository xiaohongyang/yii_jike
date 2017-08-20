<?php

use app\modules\adminshop\models\Admin_user;
use app\modules\adminshop\models\User_rank;
use app\modules\adminshop\models\Users;

use kartik\grid\GridView;
use kartik\icons\Icon;
use yii\data\ActiveDataProvider;
use yii\grid\ActionColumn;
use yii\grid\CheckboxColumn;
use yii\grid\DataColumn;
//use yii\grid\GridView;
use yii\grid\SerialColumn;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\web\View;
use yii\widgets\ActiveForm;
use yii\widgets\Breadcrumbs;
use yii\widgets\ListView;
use yii\widgets\Pjax;

$this->title = "会员列表";
$this->params['breadcrumbs'][] = $this->title;

?>

<div class="portlet p10">

    <div class="body">
        <?$form = ActiveForm::begin([
            'method' => 'get',
            'options' => [
                'class' => 'form-inline'
            ]
        ]);
        ?>
        <div class="row">
            <div class="col-md-8 col-sm-12">
                <div class="table-group-actions pull-left margin-top-10">
                    <?php
                    $selectedRankId = Yii::$app->request->get()[$model->formName()]['user_rank'];
                    echo Html::dropDownList($model->formName()."[user_rank]",
                        $selectedRankId,
                        ArrayHelper::merge(
                            ["0"=>"选择类型"]
                            ,ArrayHelper::map($rankList,'rank_id', 'rank_name' )
                        ),
                        ['class' => 'select2 form-control input-inline input-small input-sm table-group-action-input']
                    );
                    ?>
                    &nbsp;
                    <?=Html::submitButton("", ['class'=>'btn btn-sm btn-success glyphicon glyphicon-search ','title'=>Yii::$app->params['lang']['button_search']])?>
                </div>
            </div>

            <div class="col-md-4 col-sm-12"></div>
        </div>
        <?php $form->end()?>

        <?php

            $pjaxId = "pajaxId";
            $gridId = "grid";
            $multipleDeleteButton = 'multipleDeleteButton';
            $panelAfter = Html::button('<i class="glyphicon glyphicon-remove btn-xs"></i>',
                ['type'=>'button','title'=>Yii::$app->params["delete"], 'class'=>'btn btn-success btn-xs', 'id'=>$multipleDeleteButton  ]);
            $columns = [
                ['class'=>'kartik\grid\SerialColumn'],
                [
                    'class' => \kartik\grid\CheckboxColumn::className(),
                ],
                [
                    'attribute'=>'user_name',
                    'pageSummary'=>'统计',
                    'pageSummaryOptions'=>['class'=>'text-right text-warning'],
                ],
                'email',
                [
                    'class' => CheckboxColumn::className(),
                    'class' => '\kartik\grid\DataColumn',
                    'attribute' => 'is_validated',
                    'format' => 'html',
                    'value' => function($model){
                        return $this->render('list_item.php', ['model'=>$model, 'action' => 'is_validated']);
                    }
                ],
                'user_money',
                'frozen_money',
                'rank_points',
                'pay_points',
                [
                    'attribute' => 'reg_time',
                    'value' => function($model){
                        return $model->reg_time > 0 ? date('Y-m-d', $model->reg_time) : '-' ;
                    }
                ],
                [
                    'class' => 'kartik\grid\ActionColumn',
                    'header' => '操作',
                    'width' => '120px',
                    'template' => '{update} {delete}',
                    'deleteOptions' => [
                        'label' => '<i class="glyphicon glyphicon-remove"></i>',
                        'data-toggle' => 'tooltip',
                        'data-placement' => 'top',
                        'title' => Yii::$app->params['lang']['remove']
                    ],
                    'updateOptions' => [
                        'data-toggle' => 'tooltip',
                        'data-placement' => 'top',
                        'title' => Yii::$app->params['lang']['edit'],
                    ]
                ]
            ];

            Pjax::begin(['id' => $pjaxId]);

            $panelHeadingBtn = Html::a( Icon::show("plus",[]),
                                        Url::to(["create"]),
                                        [
                                            "data-pjax" => 0,
                                            "title" => Yii::$app->params['lang']['add'],
                                            'data-toggle' => 'tooltip',
                                            'data-placement' => 'top'
                                        ]);
            $panelHeading = Yii::$app->params['lang']['03_users_list']." {$panelHeadingBtn} ";


            $gridView = \kartik\grid\GridView::widget([
                'dataProvider'=>$dataProvider,
                'filterModel'=>$model,
                'pjax'=>true,
                'showPageSummary'=>true,
                'striped'=>true,
                'hover'=>true,

                'options' => [
                    'class' => 'margin-top-10',
                    'id' => $gridId
                ],

                'panel'=>[
                    'type'=>'primary',
                    'heading' => $panelHeading,
                    'after' => $panelAfter
                ],
                'toolbar' => [
                    ''
                ],

                'columns' => $columns
            ]);
        echo $gridView;

        Pjax::end();

        $multipleDeleteUrl = Url::to(["deletemultiple"]);
        $multipleDeleteJs = <<<STD
            $.fn.multipleDelete = {
                init : function(){
                    $("#{$multipleDeleteButton}").click(function(){
                        var pk = $("#{$gridId}").yiiGridView("getSelectedRows");
                        if(!pk || 0 !== pk.length){

                            var message = "真的要删除吗?";
                            bootbox.confirm(message, function(result){
                                if(result){
                                    alert(result);
                                    return false;
                                   $.ajax({
                                        url : "{$multipleDeleteUrl}",
                                        data : {pk : pk},
                                        type : 'post',
                                        success : function( json ){
                                            $.pjax.reload({container:'#{$gridId}'});
                                        }
                                   });
                                }else{
                                }
                            });
                        } else {
                            bootbox.alert("请先选中要操作的记录!");
                            return false;
                        }
                    })
                }
            }
            $(document).ready(function(){
                $.fn.multipleDelete.init()
                $('#{$pjaxId}').on('pjax:success', function () {
                    $.fn.multipleDelete.init()
                });
            });
STD;
        $this->registerJs("
            {$multipleDeleteJs}
        ", View::POS_READY);
 ?>
    </div>

</div>

