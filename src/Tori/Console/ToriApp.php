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
        $this->add(new Command\Compass());
        /* Tori Commands List */
    }
}

