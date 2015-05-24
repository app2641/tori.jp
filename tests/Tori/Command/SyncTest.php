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
     * @group sync-all
     * @group sync
     **/
    public function すべてのファイルを同期する場合 ()
    {
        $command = $this->app->find('sync');
        $tester  = new CommandTester($command);
        $tester->execute([
            'command'  => $command->getName(),
            '--dry-run' => true
        ]);
    }


    /**
     * @test
     * @group sync-file
     * @group sync
     **/
    public function 個別で同期する場合 ()
    {
        $command = $this->app->find('sync');
        $tester  = new CommandTester($command);
        $tester->execute([
            'command' => $command->getName(),
            'file_path' => 'public_html/resources/images/',
            '--dry-run' => true
        ]);
    }
}

