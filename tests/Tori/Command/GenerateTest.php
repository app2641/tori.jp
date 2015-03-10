<?php


use Tori\Command\Generate;
use Tori\Console\ToriApp;
use Symfony\Component\Console\Tester\CommandTester;

class GenerateTest extends PHPUnit_Framework_TestCase
{

    /**
     * @var ToriApp
     **/
    private $app;


    /**
     * コマンドの名称

     * @var string
     **/
    private $cmd_name;


    /**
     * コマンドクラスへのパス
     *
     * @var string
     **/
    private $cmd_path;


    /**
     * コマンドのテストクラスへのパス
     *
     * @var string
     **/
    private $cmd_test_path;


    /**
     * @return void
     **/
    public function setUp ()
    {
        $this->app = new ToriApp();
        $this->app->add(new Generate());
    }


    /**
     * @return void
     **/
    public function tearDown ()
    {
        if (file_exists($this->cmd_path)) {
            unlink($this->cmd_path);
        }

        if (file_exists($this->cmd_test_path)) {
            unlink($this->cmd_test_path);
        }
    }


    /**
     * @test
     * @expectedException          RuntimeException
     * @expectedExceptionMessageRegExp   /既に[0-9a-zA-Z]{5}コマンドが存在しています/
     * @group generate-already-exists-command
     * @group generate
     **/
    public function 指定コマンドが既に存在している場合 ()
    {
        // ランダムなクラス名でファイルを作る
        $this->_generateCommandName();
        file_put_contents($this->cmd_path, '');

        $command = $this->app->find('generate');
        $tester  = new CommandTester($command);
        $tester->execute(array(
            'command' => $command->getName(),
            'command_name' => $this->cmd_name
        ));
    }


    /**
     * @test
     * @group generate-execute
     * @group generate
     **/
    public function 正常な処理 ()
    {
        $this->_generateCommandName();

        $command = $this->app->find('generate');
        $tester  = new CommandTester($command);
        $tester->execute(array(
            'command'  => $command->getName(),
            'command_name' => $this->cmd_name
        ));

        $this->assertTrue(file_exists($this->cmd_path));
        $this->assertEquals(
            sprintf('Generated %s command!'.PHP_EOL, $this->cmd_name),
            $tester->getDisplay()
        );
    }


    /**
     * テスト用のコマンドファイル名を生成する
     *
     * @return void
     **/
    private function _generateCommandName ()
    {
        $this->cmd_name = ucfirst(substr(md5(uniqid()), 0, 5));
        $this->cmd_path = sprintf(SRC.'/Tori/Command/%s.php', $this->cmd_name);
        $this->cmd_test_path = sprintf(ROOT.'/tests/Tori/Command/%sTest.php', $this->cmd_name);
    }
}

