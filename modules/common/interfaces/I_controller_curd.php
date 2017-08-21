<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/5/8
 * Time: 9:05
 */

namespace app\modules\common\interfaces;


interface I_controller_curd
{
    /**
     * 创建
     */
    public function actionCreate();

    /**
     * 编辑/更新
     */
    public function actionEdit();

    /**
     * 删除
     * @return mixed
     */
    public function actionRemove();
}