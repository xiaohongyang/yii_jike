<?php
use app\assets\extend\EchartAsset;

EchartAsset::register($this);
?>

<div class="mt-row">
    <span>会员总数:</span> <?=$totalRegister?>
    <span>今日注册:</span> <?=$todayRegister?>
</div>


<div class="content">
    <div id="container" style="width:1000px;height:400px"></div>
</div>
