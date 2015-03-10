<?php


namespace Tori\Console;

use Symfony\Component\Console\Application;
use Tori\Command;

class ToriApp extends Application
{

    /**
     * コマンドの初期化を行う
     *
     * @return void
     **/
    public function __construct ()
    {
        parent::__construct('とりコマンド --', VERSION);

        $this->add(new Command\Generate());
        //$this->add(new Command\Zip());
        //$this->add(new Command\Unzip());
        //$this->add(new Command\HolidayCsv());
        //$this->add(new Command\UploadSumitomoIllustToS3());
        //$this->add(new Command\BuildAftamaIndexXml());
        /* Tori Commands List */
    }
}

