<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2015/6/24
 * Time: 14:46
 */

namespace app\widgets;


use yii\base\Widget;
use yii\bootstrap\Modal;
use yii\helpers\Html;
use yii\web\View;

class AjaxSubmitForm extends Widget{

    public $formId='';
    public $formName = '';
    public $beforeValidEvent = null;
    public $afterValidEvent = null;

    public function init()
    {
        parent::init(); // TODO: Change the autogenerated stub
    }

    public function run()
    {

        $this->_ajaxSubmitForm();


    }

    public function getSuccessEventJs(){
        if(!is_null($this->afterValidEvent) && !is_null($this->afterValidEvent['success'])){
            return $this->afterValidEvent['success'];
        }else{
            return '';
        }
    }

    public function _ajaxSubmitForm()
    {

        //$_csrf = \Yii::$app->request->csrfToken;

        $fieldWrapperClassPrefix = "field-{$this->formName}-";



        \Yii::$app->view->on(View::EVENT_END_PAGE, function () {

            $functionBeforeValid = "";
            $functionBeforeValidName = null;
            if(is_array($this->beforeValidEvent) && count($this->beforeValidEvent)){

                $functionBeforeValid = implode("\r\n", $this->beforeValidEvent);
                $functionBeforeValidName = implode("','", array_keys($this->beforeValidEvent));
                $functionBeforeValidName = "['".$functionBeforeValidName."']";
            }
            if(!is_null($functionBeforeValidName))
                $functionBeforeValidName = ','.$functionBeforeValidName;

            $strJs = <<<STD
            <script type="text/javascript">

                {$functionBeforeValid}

                $.fn.ajaxSubmitForm = {

                    form : null,
                    init : function(form,beforeValidEvents,afterValidEvent){

                        if(typeof(beforeValidEvents) != 'undefined'){
                            for(event in beforeValidEvents){
                                 (function(){
                                    eval(beforeValidEvents[event]+"()")
                                 }())
                            }
                        }
                        //    beforeValidEvent();

                        this.form = form;
                        this.ajaxSubmit()
                    },
                    ajaxSubmit : function(){
                        // return false if form still have some validation errors
                        form = this.form;
                        if (form.find('.has-error').length)
                        {
                            return false;
                        }
                        // submit form
                        $.ajax({
                            url    : form.attr('action'),
                            type   : 'post',
                            data   : form.serialize(),
                            dataType : 'json',
                            success: function (json)
                            {
                                //var getupdatedata = $(response).find('#filter_id_test');
                                // $.pjax.reload('#note_update_id'); for pjax update
                                //$('#yiiikap').html(getupdatedata);
                                //console.log(getupdatedata);

                                if(json.status != 1){

                                    $.each(json.data, function(key, val) {
                                        var id = "#"+key+"_error";
                                        $(id).html(val);
                                        $(id).closest(".form-group").addClass("has-error");
                                        $(id).closest(".form-inline").addClass("has-error");
                                    });


                                }else{
                                    //$.say({type:'success',cont: json.message});
                                    {$this->getSuccessEventJs()}
                                }


                            },
                            error  : function ()
                            {
                                console.log('internal server error');
                            }
                        });
                        return false;
                    }
                }

                $(document).ready(function () {
                    $('body').on('beforeSubmit', 'form#{$this->formId}', function () {
                        var form = $(this);
                        $.fn.ajaxSubmitForm.init(form {$functionBeforeValidName})
                        return false;
                    });
                });
            </script>
STD;
               echo $strJs;
        });

    }




}