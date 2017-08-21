<?php

//获取图片参数
$basedir = dirname(__FILE__);
$nullPic = '/source/nullpic/nullpic1.jpg';
$src = (isset($_GET['src']) && $_GET['src']!='')?$_GET['src']:$nullPic;
$w = isset($_GET['w'])?$_GET['w']:200;
$h = isset($_GET['h'])?$_GET['h']:'';
$src= $basedir.$src;

//原图是否存在 
if(!is_file($src) || !file_exists($src)){
	$src = $basedir.$nullPic;
}

//缓存图片
$tempfile = dirname(__FILE__).'/temp/'.$w.'x'.$h.'_'.str_replace(array('/','\\'), '_', $src);
if(file_exists($tempfile) && filemtime($tempfile)>filemtime($src))
{
	$src = $tempfile;
}else{

	$src = createPic($src, $tempfile, $w, $h, $rate);
}

if(empty($src))
{
	//$src = 'defaultImage/no_photo01.gif';
	$src = $basedir.$nullPic;
}

downPic($src);

/**
 * @param $src 源文件
 * @param $tempfile 生成缓存文件path
 * @param $w 宽
 * @param $h 高
 * @param $rate 精度
 * @param $isCut 是否裁剪
 */
function createPic($src, $tempfile, $w, $h, $rate, $isCut=true){
	require_once 'gcImage.php';
	list($swidth,$sheight) = getimagesize($src);
	$image = new gcImage();

	$sourceSize = ['width' => $swidth, 'height' => $sheight];
	$pointSize = ['width' => $w, 'height'=>$h];
	if($isCut)
		cutMethod($sourceSize, $pointSize) == 'clearWidth' ? $w = 0 : $h = 0;

//	echo $w .'<br/>';
//	echo printf("%s <hr/>", $h);

	if(empty($h) || $h==0)
		$h = $w * $sheight/$swidth;
	if(empty($w) || $w==0)
		$w = $h * $swidth/$sheight;

//	echo $w .'<br/>';
//	echo printf("%s", $h);exit;

	return $image->imagickmakethumb($src, $tempfile, $w, $h, $rate);
}

function cutMethod($sourceSize, $pointSize){

	$sourcePercent = $sourceSize['width']/$sourceSize['height'];
	$pintPercent = $pointSize['width']/$pointSize['height'];

	//目标框是长 > 高
	if($pointSize['width'] > $pointSize['height']){

		$pointPercent = $pointSize['width'] / $pointSize['height'];
		$sourcePercent = $sourceSize['width'] / $sourceSize['height'];
		$method = $pointPercent > $sourcePercent ? 'clearWidth' : 'clearHeight';
	} else if($pointSize['width'] < $pointSize['height']){
		//目标框是长 < 高
		$pointPercent = $pointSize['width'] / $pointSize['height'];
		$sourcePercent = $sourceSize['width'] / $sourceSize['height'];
		$method = $pointPercent < $sourcePercent ? 'clearWidth' : 'clearHeight';
	} else {
		//目标框是长 = 高

		return $sourceSize['width'] > $sourceSize['height'] ? 'clearHeight' : 'clearWidth';
	}

	return $method;
}

//生成下载图片
function downPic($src){

	//下载该图片
	$file_extension = strtolower(substr(strrchr($src,'.'),1));
	switch($file_extension)
	{
		case 'gif': $file_mime='image/gif'; break;
		case 'png': $file_mime='image/png'; break;
		case 'jpg': $file_mime='image/jpg'; break;
		case 'jpeg': $file_mime='image/jpeg';break;
		default: $file_mime=mime_content_type($src);
	}
	$length = filesize($src);
	Header("Content-type: $file_mime; charset=UTF-8");
	Header('Accept-Ranges: bytes');
	Header('Accept-Length: '.$length);
//Header('Content-Disposition: attachment; filename=' . $file_name);
	$file = fopen($src,'r');
	echo fread($file,$length);
	fclose($file);

}