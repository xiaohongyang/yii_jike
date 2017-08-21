<?php
    $height = Yii::$app->request->get('h', '100%');
    $vedio = Yii::$app->request->get('vu');
?>
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

    .prism-player{
        height: <?=$height?>;
    }
</style>


<script type="text/javascript" src="http://g.alicdn.com/de/prismplayer/1.4.7/skins/default/index-min.css" ></script>
<script type="text/javascript" src="http://g.alicdn.com/de/prismplayer/1.4.7/prism-min.js" ></script>

<body>

    <div class="wrapper"  style="height: <?=$height?>" >

        <div id='J_prismPlayer' class='prism-player'  style="height: <?=$height?>"></div>


        <script>
            var player = new prismplayer({
                id: "J_prismPlayer", // 容器id
                source: "http://jike001.oss-cn-hangzhou.aliyuncs.com/<?=$vedio?>",  // 视频url 支持互联网可直接访问的视频地址
                autoplay: true,      // 自动播放
                width: "100%",       // 播放器宽度
                height: "<?=$height?>",      // 播放器高度
                skinLayout: [
                    {
                        "align":"blabs",
                        "x":30,
                        "y":80,
                        "name":"bigPlayButton"
                    },{
                        "align":"tlabs",
                        "x":0,
                        "y":0,
                        "name":"fullControlBar",
                        "children":[
                            {
                                "align":"tl",
                                "x":25,
                                "y":6,
                                "name":"fullTitle"
                            },{
                                "align":"tr",
                                "x":24,
                                "y":13,
                                "name":"fullNormalScreenButton"
                            },{
                                "align":"tr",
                                "x":10,
                                "y":12,
                                "name":"fullTimeDisplay"
                            },{
                                "align":"cc",
                                "name":"fullZoom"
                            }
                        ]
                    }
                ]
            });
        </script>
    </div>

</body>
