<?php

use yii\helpers\Url;

$uploadUrl = Url::to(['/common/file/upload'], true);
$delIcon = \kartik\icons\Icon::show("remove-circle",[],\kartik\icons\Icon::BSG);

$loadSrc= !is_null($loadSrc) ? $loadSrc : '/images/default-headpic.png';
$ajaxParamId = is_null($ajaxParamId)?"ajax_param_id" : $ajaxParamId;
$dataId = is_null($dataId) ? "ajax_data_id" : $dataId;
$fileDesc = is_null($fileDesc)?'':$fileDesc;
$fileType = is_null($fileType) ? '' : $fileType;
$uploadIdValue = !is_null($uploadIdValue)? $uploadIdValue :'0';

$delBtnClass = $isShowDelBtn? '' : 'hide';

$str = <<<STD
                                            <input id="{$ajaxParamId}"
                                                    name="UploadForm[{$ajaxParamId}]"
                                                    point-class="UploadForm-{$ajaxParamId}" type="file"
                                                    point-img="img-UploadForm-{$ajaxParamId}"
                                                    point-valueId-class = "value-{$ajaxParamId}"
                                                    data-url="{$uploadUrl}"
                                                    data-id ="{$dataId}"
                                                    class="ajax_upload form-control"
                                                    />

                                            <input type='hidden' class="file_desc" value="{$fileDesc}" />

                                            <input type='hidden' name="UploadForm[]" value="{$uploadIdValue}" class="value-{$ajaxParamId}"  />
                                            <img src="{$loadSrc}"
                                                id="img-UploadForm-{$ajaxParamId}"
                                                class="none ajax_upload_img"
                                                point-file-input="{$ajaxParamId}"
                                                load-src="{$loadSrc}" />

                                            <a class='del {$delBtnClass}'>{$delIcon}</a>
STD;
?>
<div class="btn-wrap">
                                <span class="btn">
                                    <?=$str?>
                                </span>
</div>