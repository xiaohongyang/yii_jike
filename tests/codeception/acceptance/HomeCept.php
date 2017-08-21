<?php

/* @var $scenario Codeception\Scenario */

$I = new AcceptanceTester($scenario);
$I->wantTo('ensure that home page works');
$I->amOnPage(Yii::$app->homeUrl);
$I->see('白色耳机线');
/*$I->seeLink('注册');
$I->click('About');*/
$I->see('红米4.0');
