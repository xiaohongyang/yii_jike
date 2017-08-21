<?php
/**
 * 上传视频到优酷
 * e.g:
    $sdk = new YouKuUploadSdk();
    $rs = $sdk->upload();
 */

/*****YoukuUpload SDK*****/
header('Content-type: text/html; charset=utf-8');
include("include/YoukuUploader.class.php");

set_time_limit(0);
ini_set('memory_limit', '128M');

class YouKuUploadSdk {

    private $clientId = "33ea623d75a10f6a";
    private $clientSecret = "0108c7b6ef44fc3a6177d6454e79f3d7";
    private $access_token = "5fc10ee055dd911466c0ca11b182db0c";
    private $refresh_token = "cf12fdb878b763aca52b449fe60f6718";
    private $username = "258082291@qq.com";
    private $password = "321321abc";
    private $youkuUploader = null;
    private $params ;

    public $videoId;

    /**
     * @return mixed
     */
    public function getParams()
    {
        return $this->params;
    }

    /**
     * @param mixed $params
     */
    public function setParams($access_token='', $refresh_token='', $username='', $password='')
    {
        $params = [];
        $params['access_token'] = $access_token;
        $params['refresh_token'] = $refresh_token;
        $params['username'] = $username;
        $params['password'] = $password;
        $this->params = $params;
    }

    public function __construct()
    {
        $this->password = md5($this->password);
        $this->setParams($this->access_token, $this->refresh_token, $this->username, $this->password);

        $this->youkuUploader = new YoukuUploader($this->clientId, $this->clientSecret);
    }

    public function upload($file = ''){
        $file = $file ? : $_FILES['video']['tmp_name'];
        $file_name = $file; //video file
        try {
            $file_md5 = @md5_file($file_name);
            if (!$file_md5) {
                throw new Exception("Could not open the file!\n");
            }
        }catch (Exception $e) {
            echo "(File: ".$e->getFile().", line ".$e->getLine()."): ".$e->getMessage();
            return;
        }
        $file_size = filesize($file_name);
        $uploadInfo = array(
            "title" => date("Ymd", time()), //video title
            "tags" => "集客365", //tags, split by space
            "file_name" => $file_name, //video file name
            "file_md5" => $file_md5, //video file's md5sum
            "file_size" => $file_size //video file size
        );
        $progress = true; //if true,show the uploading progress
        $result = $this->youkuUploader->upload($progress, $this->getParams(),$uploadInfo);
       // $this->videoId = $result['']
        return $result;
    }

}


