<?php
    use yii\helpers\Url;
use yii\web\View;

?>
<style type="text/css">
body{
}
</style>
<iframe name="main" id="main_frame" src="<?=Url::to(['/admin/lovevideo/list'])?>" frameborder="false" allowtransparency="true" style="border: medium none;  "  width="100%" height="100%">
    浏览器不支持嵌入式框架，或被配置为不显示嵌入式框架。</iframe>



<script type="text/javascript">
//    $(function(){
//        $('#main_frame').css('height',$('body').height())
//    })
</script>

<?php
    $jsString = <<<STD
        $(function(){
            $('#main_frame').css('height',$(document).height())
        })
STD;

    echo Yii::$app->view->registerJs($jsString, View::POS_END);
?>