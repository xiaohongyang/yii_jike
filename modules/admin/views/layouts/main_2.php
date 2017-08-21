<?php
use yii\helpers\Url;
?>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title> </title>
</head>

<frameset rows="50,*" cols="*" framespacing="0" frameborder="no" border="0">
    <frame src="<?=Url::to(['/admin/index/top'])?>?>" name="topFrame" scrolling="No" noresize="noresize" id="topFrame" />
    <frameset cols="200,*" rows="*" framespacing="0" frameborder="no" border="0">
        <frame src="<?=Url::to(['/admin/index/left'])?>" name="mainFrame" id="mainFrame" />
        <frame src="<?=Url::to(['/admin/index/center'])?>" name="cntFrame" id="cntFrame" />
    </frameset>
</frameset>
<noframes>
    <body>
    </body>
</noframes>
</html>
