<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 18/01/2019
 * Time: 23:21
 */

class PublicityController extends View
{
    public function actionIndex()
    {
        $this->layoutBuilder([
            "publicity/index"
        ], [

        ], [
            "publicity/index"
        ]);
    }
}