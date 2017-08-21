<?php

$frontendUrl = 'http://'.(isset($_SERVER['HTTP_HOST']) && !is_null($_SERVER['HTTP_HOST'])?$_SERVER['HTTP_HOST']:'http://jike.com');
return [
    'adminEmail' => 'admin@example.com',

    'params' => [
        'thumbnail.size' => [111128, 128],

    ],

    'host' => [
        'img_host' => $frontendUrl
    ],
    'homeUrl' => $frontendUrl,
    'icon-framework' => 'fa',
    'video_service' => 'ali_video'
];
