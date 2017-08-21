<style type="text/css">
    body{
    /*    text-align: center;
        background: #ccc;*/

        padding: 0;
        margin: 0;
    }

  /*  .wrapper{
        background: #330;

        width: 960px;
        height: 540px;
        padding: 10px 0;
        margin: 0 auto;
    }*/
</style>

<body>

    <div class="wrapper" >
        <script type="text/javascript">
//            var user_unique='z1gnphhdjk';
//            var secret_key='c247f61e7929b8ac1ce120a86e8fbace';
            var user_unique='<?=$uu?>';
            var secret_key= '<?=$key?>';
            var letvcloud_player_conf =
            {"uu": "<?=$uu?>", "vu": "<?=$vu?>",   "auto_play": 1, "width": 940, "height": 540};
        </script>
        <script type="text/javascript" src="http://cloud.letv.com/bcloud.js"></script>
    </div>

    <?php
/*    use kartik\helpers\Html;

    echo Html::jsFile(Yii::getAlias('@web'.'/source/jquery/jquery.js'));
    echo Html::jsFile(Yii::getAlias('@web'.'/js/common_xhy.js'));
    */?>



</body>
