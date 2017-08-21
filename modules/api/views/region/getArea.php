<?php
/**
 * Created by PhpStorm.
 * User: xiaohongyang
 * Date: 2016/4/19
 * Time: 22:19
 */
foreach($data as $row){
        echo "<a href='javascript:void(0)' title='".$row['RegionName']."' id='{$row['ID']}' pid='{$row['ParentId']}' type='{$row['RegionType']}' >{$row['RegionName']}</a>";
}