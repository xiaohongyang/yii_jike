<?php

//$list = D('TbRegion')->select(array('RegionType'=>0));
//$list = list_to_tree($list,'ID', 'ParentId','_child',0)

use app\modules\common\models\Region;
use yii\web\View;

$list = Region::find()->where(['>','ID',0])->asArray()->all();
$list = list_to_tree($list,'ID', 'ParentId','_child',0);
$listAll = $list;
?>

<?php
        if(is_array($regions) && count($regions)){

            $regionsString = '';
            foreach($regions as $region){
                $regionsString .= ($regionsString=='') ? $region->toFormatString() : ','.$region->toFormatString();
            }
            if( $regionsString != '' )
                echo '<input type="hidden" name="ids" value="'.$regionsString.'" />';
        }
?>


    <div class="rel dib AreaPickerWrapper" >
        <div id="area_picker" >
            <div class="area_picker_header fix">
                <div id="area_picker_dispaly" class="r"></div>
                <button class="area_picker_btn l rel" style="line-height:16px;">选择地区</button>
            </div>
            <div class="area_picker_content rel dn">
                <a href="javascript:;" class="uncheck root" id="r1">全国</a>
                <?php foreach ($listAll as $root){ ?>
                    <ul>
                        <?php
                        foreach ($root['_child'] as $area){
                            switch($area['RegionType']){
                                case '0':

                                    ?>
                                    <li class="area">
                                        <dl class="fix">
                                            <dd class="l area_item">
                                                <a href="javascript:;" id="a<?=$area['ID']?>" class="area_name uncheck"><?=$area['RegionName']?></a>
                                            </dd>
                                            <?php if(!is_array($area['_child']) || !count($area['_child'])) continue; foreach($area['_child'] as $province) { ?>

                                                <dd class="l province rel">
                                                    <a href="javascript:;" id="p<?=$province['ID']?>" class="province_name uncheck"><?=$province['RegionName']?></a>
                                                    <span class="checkedNum"></span>
                                                    <a href="javascript:;" class="unfile dib"></a>
                                                    <ul class="dn city abs fix">
                                                        <li class="line abs"></li>
                                                        <?php foreach($province['_child'] as $city){ ?>
                                                            <li class="l rel city_item">
                                                                <a href="javascript:;" id="c<?=$city['ID']?>"
                                                                   class="city_name uncheck"><?=$city['RegionName']?></a>
                                                                <?php if (!is_array($city['_child']) || !count($city['_child'])) continue; ?>

                                                                <span class="checkedNum"></span>
                                                                <a href="javascript:;" class="unfile dib"></a>
                                                                <ul class="country dn abs">
                                                                    <li class="line abs"></li>
                                                                    <?php
                                                                    foreach ($city['_child'] as $country) {?>
                                                                        <li class="l country_item">
                                                                            <a href="javascript:;" id="t<?=$country['ID']?>"
                                                                               class="country_name uncheck"><?=$country['RegionName']?></a>
                                                                        </li>
                                                                    <?php }?>
                                                                </ul>
                                                            </li>
                                                        <?php } ?>
                                                    </ul>
                                                </dd>
                                            <?php }?>
                                        </dl>
                                    </li>
                                    <?php
                                    break;
                            }
                            ?>

                            <?php
                        }
                        ?>
                    </ul>
                    <?php
                }
                ?>
            </div>
        </div>
    </div>

<?php
$str = <<<STD

        $.fn.area_picker = {
            init : function(){
                var p = new MultiRegionPicker({
                    picker 		: $('.area_picker_content')[0],
                    displayer 	: $('#area_picker_dispaly')[0],
                    regionName	: 'regions',
                    btn			: $('.area_picker_btn')[0]
                });

                //初始化
                if($('input[name="ids"]').length){

                    var ids = (','+$('input[name="ids"]').val()).replace(/,(\w+)/g,'#$1,').replace(/(.*),$/,'$1');
                    if(ids){
                        $(ids).trigger('click');
                    }else{
                        $('.root').trigger('click');
                    }
                }
            }
        }

        $.fn.area_picker.init();
STD;

Yii::$app->view->registerJs($str, View::POS_READY);

?>