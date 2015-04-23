<?php


use Tori\Command\Sync;
use Tori\Console\ToriApp;
use Symfony\Component\Console\Tester\CommandTester;

class SyncTest extends PHPUnit_Framework_TestCase
{

    /**
     * @var ToriApp
     **/
    private $app;


    /**
     * @return void
     **/
    public function setUp ()
    {
        $this->app = new ToriApp();
        $this->app->add(new Sync());
    }


    /**
     * @return void
     **/
    public function tearDown ()
    {
    }


    /**
     * @test
     * @group sync-execute
     * @group sync
     **/
    public function 正常な処理 ()
    {
        $command = $this->app->find('sync');
        $tester  = new CommandTester($command);
        $tester->execute(array(
            'command'  => $command->getName(),
            '--dry-run' => true
        ));
    }
}

