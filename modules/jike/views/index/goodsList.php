<?php
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\LinkPager;

?>

    <table class="table table-bordered text-center">

        <tr>
            <?php

            $i=1;

            $leftNumber = count($goodsList)%4;
            if($leftNumber > 0)
                $leftNumber = 4-$leftNumber;

            if(is_array($goodsList) && count($goodsList)){
                foreach($goodsList as $goods){
                    if(($i-1)%4==0 && $i!=1)
                        echo "</tr><tr>";
                    ?>

                    <td class="goods-wrapper">
                        <div class="pic">
                            <a href="<?=Url::to(['/jike/goods/detail','id'=>$goods->prize_id])?>" target="_blank">
                                <img src="<?=getImage($goods->thumb->getAttribute('file_dir').'/'.$goods->thumb->getAttribute('file_name'),240,240)?>"
                                />
                            </a>
                        </div>
                        <div class="title">
                            <a href="<?=Url::to(['/jike/goods/detail','id'=>$goods->prize_id])?>" target="_blank"><?=$goods->prize_name?></a>
                        </div>
                        <div class="btn-wrp">

                            <span class="clock">
                            </span>
                            <span>剩</span><span class="data-ajax-update-html" id="left_number"
                                  data-url="<?= Url::to(['/api/zeroprize/prizeLeftTimes']) ?>"
                                  data-data='{"id":"<?= $goods->prize_id ?>"}'></span>人次
                            <a href="javascript:void(0);" class="btn btn-warning zero-popup-lucky btn-buy" id="zero-prize-btn"
                               data-prize-id="<?=$goods->prize_id?>" data-title="开始抽奖" data-url="<?=Url::to(['index/luckydraw'])?>">
                            </a>

                        </div>
                    </td>
                    <?php
                    $i++;
                }

                for($left=0; $left < $leftNumber; $left++){
                ?>
                    <td class="goods-wrapper no-border">
                        <div class="pic ">
                        </div>
                        <div class="title ">
                        </div>
                        <div class="btn-wrp no-background">
                        </div>
                    </td>
                <?php
                }

            } else {
                echo '<td>抱歉,无相关数据...</td>';
            }

            ?>
        </tr>
    </table>

    <?php
        echo LinkPager::widget([
            'pagination' => $pages,
            'nextPageLabel' => '加载更多'
        ])
    ?>



<script type="text/javascript">
    $(function(){
        $('.pagination').on('click','a',function(){
            var url = $(this).attr('href');
            $.fn.getGoodsListByLink(url)
            return false;
        })

        $.fn.ajax_update_html();
    })
</script>