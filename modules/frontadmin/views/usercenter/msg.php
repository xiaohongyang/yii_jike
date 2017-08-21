<?php
use app\modules\frontadmin\models\message\Message;
use app\modules\frontadmin\service\MessageService;
use kartik\grid\CheckboxColumn;
use kartik\grid\GridView;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\web\View;

?>

    <div class="frontadmin-usercenter-msg">

                <header class="head">
                    <button class="btn btn-xs btn-default btn-del">&nbsp;&nbsp;删除&nbsp;&nbsp;</button>

                    <span class="pull-right">
                    <?=Html::a("未读", Url::to(['/frontadmin/usercenter/msg','status'=>Message::STATUS_NOT_READ]), ['class'=>'blue']) ?>
                    /
                    <?=Html::a("全部", Url::to(['/frontadmin/usercenter/msg']), ['class'=>'blue']) ?>
                    </span>
                </header>

    <?php
    /*    if(is_array($msgProvider->getModels()) && count($msgProvider->getModels())){
            foreach($msgProvider->getModels() as $model){
                echo $model->rec_id;
                echo $model->message_text->msg;
            }
        }
    */?>

    <?php

    echo GridView::widget([
        'bordered' => false,
        'striped'=>false,
        'dataProvider' => $msgProvider,
        'columns' => [
            [
                'class' => CheckboxColumn::className(),
            ],
            [
                'attribute' => 'msg',
                'format' => 'html',
                'value' => function($model){
                    return
                        '<span class="msg_type_'.$model->message_text->group_id.'">【'.MessageService::getGroupName($model->message_text->group_id).'】 </span>'
                        . '<a href="javascript:void(0)"  class="btn_read " >'.(truncate_utf8_string($model->message_text->msg, 40)). '</a>'
                        . '<br/>'
                        . '<div class="desc  hide" style="padding:5px;   ">'.$model->message_text->msg.'</div>';
                },
                'header' => '站内信内容'
            ],
            [
                'attribute' => 'created_at',
                'format' => 'html',
                'header' => '时间',
                'value' => function($model){
                    return date('Y.m.d H i s', $model->message_text->created_at);
                },
                'options' => [
                  'style' => 'width: 140px;'
                ]
            ]
        ]
    ]);
    ?>

    </div>



    <?php

        $delUrl = Url::to(['/api/msg/remove']);
        $jsString = <<<STD
            $(function(){


                $('.btn-del').click(function(){
                    var ids = [];
                    $('input[name="selection[]"]:checked').each(function(){
                        ids.push($(this).val());
                    })

                    $.ajax({
                        url : '{$delUrl}',
                        data : {ids : ids, _csrf : $.fn.csrf_xhy},
                        type : 'post',
                        dataType : 'json',
                        success : function(result){
                            $.x_say_x({cont : result.message, callback : function(){

                                if(result.status==1)
                                    document.location.href = document.location.href;
                            }})
                        }
                    })
                })
            })
STD;

        Yii::$app->view->registerJs($jsString, View::POS_END)
    ?>