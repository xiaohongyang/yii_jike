<?php
use yii\helpers\Html;
use app\assets\admin\ToFrameAsset;

//    ToFrameAsset::register($this);
?>

<div class="header">

    <div class="dl-title">
        <a href="/" title="" target="_blank">
            <span class="lp-title-port"> </span><span class="dl-title-text"><?=Yii::getAlias('@webName')?></span>
        </a>
    </div>

    <div class="dl-log">欢迎您，
        <span class="dl-log-user"><?= \Yii::$app->user->identity->user_name ?></span><a
            href="<?= Yii::$app->urlManager->createUrl('/admin/public/logout') ?>" title="退出系统"
            class="dl-log-quit">[退出]</a>

    </div>
</div>
<div class="content">
    <div class="dl-main-nav">
        <div class="dl-inform">
            <div class="dl-inform-title">贴心小秘书<s class="dl-inform-icon dl-up"></s></div>
        </div>
        <ul id="J_Nav" class="nav-list ks-clear">
            <li class="nav-item dl-selected">
                <div class="nav-item-inner nav-setup">业务管理</div>
            </li>
            <li class="nav-item">
                <div class="nav-item-inner nav-order">网站管理</div>
            </li>
            <li class="nav-item">
                <div class="nav-item-inner nav-inventory">客服管理</div>
            </li>
            <li class="nav-item">
                <div class="nav-item-inner nav-supplier">财务管理</div>
            </li>
            <li class="nav-item">
                <div class="nav-item-inner nav-marketing">管理员管理</div>
            </li>
        </ul>
    </div>
    <ul id="J_NavContent" class="dl-tab-conten">

    </ul>
</div>



<?= Html::cssFile('@web/assets/css/dpl-min.css') ?>
<?= Html::cssFile('@web/assets/css/bui-min.css') ?>
<?= Html::cssFile('@web/assets/css/main-min.css') ?>
<?= Html::cssFile('@web/css/site.css') ?>
<?= Html::jsFile('@web/assets/js/jquery-1.8.1.min.js') ?>
<?= Html::jsFile('@web/assets/js/bui-min.js') ?>
<?= Html::jsFile('@web/assets/js/common/main-min.js') ?>
<?= Html::jsFile('@web/assets/js/config-min.js') ?>


<script>
    BUI.use('common/main', function () {
        var config = [{
            id: 'menu',
            menu: [{
                text: '业务管理',
                items: [
                    {
                        id: 'ywgl',
                        text: '客户信息管理',
                        href: '<?=\Yii::$app->urlManager->createUrl('/admin/busyness/custom')?>',
                        closeable: false
                    }
                ]
            } ]
        }, {
            id: 'user',
            menu: [{
                text: '网站管理',
                items: [
                    {id: 'list', text: '1.公益广告管理', href: '<?=\Yii::$app->urlManager->createUrl('/admin/lovevideo/list')?>'},
                    {id: 'fushuxinxi', text: '2.附属信息管理', href: '<?=\Yii::$app->urlManager->createUrl('/admin/articletype/channel')?>'},
                    /*{id: 'typeList', text: '3.文章类别管理', href: '<?=\Yii::$app->urlManager->createUrl('/admin/articleType/list')?>'},*/
                ]
            }]
        }, {
            id: 'rbac',
            menu: [{
                text: '客服管理',
                items: [
                    {id: 'verify', text: '0元夺宝奖品信息审核', href: '<?=Yii::$app->urlManager->createUrl('/admin/zeroprize/verify')?>'},
                    {id: 'cashprize', text: '0元夺宝兑奖管理', href: '<?=Yii::$app->urlManager->createUrl('/admin/zeroprize/cashprize')?>'},
                    {id: 'activity', text: '集客狂欢活动信息管理', href: '<?=Yii::$app->urlManager->createUrl('/admin/activity/release')?>'},
                ]
            }]
        }, {
            id: 'category',
            menu: [{
                text: '财务管理',
                items: [
                    {id: 'invoice', text: '营销账户充值及发票管理', href: '<?=Yii::$app->urlManager->createUrl('/admin/finance/invoice')?>'},
                    {id: 'integrate', text: '积分兑现管理', href: '<?=Yii::$app->urlManager->createUrl('/admin/finance/integrate')?>'},
                    {id: 'frozen', text: '保证金退款管理', href: '<?=Yii::$app->urlManager->createUrl('/admin/finance/frozen')?>'},
                ]
            }]
        }, {
            id: 'glygl',
            menu: [{
                text: '管理员管理',
                items: [
                    {id: 'users', text: '管理员管理', href: '<?=Yii::$app->urlManager->createUrl('/admin/user/list')?>'},
                    {id: 'users', text: '数据统计', href: '<?=Yii::$app->urlManager->createUrl('/admin/user/count')?>'},
                ]
            }]
        }];
        new PageUtil.MainPage({
            modulesConfig: config
        });
    });
</script>