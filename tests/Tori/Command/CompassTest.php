<?php


use Tori\Command\Compass;
use Tori\Console\ToriApp;
use Symfony\Component\Console\Tester\CommandTester;

class CompassTest extends PHPUnit_Framework_TestCase
{

    /**
     * @var ToriApp
     **/
    private $app;


    /**
     * @var string
     */
    private $scss_file = 'public_html/resources/sass/test.scss';


    /**
     * @var string
     */
    private $css_file = 'public_html/resources/css/test.css';


    /**
     * @return void
     **/
    public function setUp ()
    {
        $this->app = new ToriApp();
        $this->app->add(new Compass());

        if (! file_exists(ROOT.'/'.$this->scss_file)) {
            $scss = 'html {margin:0;padding:0;}';
            file_put_contents(ROOT.'/'.$this->scss_file, $scss);
        }
    }


    /**
     * @return void
     **/
    public function tearDown ()
    {
        if (file_exists(ROOT.'/'.$this->scss_file)) {
            unlink(ROOT.'/'.$this->scss_file);
        }

        if (file_exists(ROOT.'/'.$this->css_file)) {
            unlink(ROOT.'/'.$this->css_file);
        }
    }


    /**
     * @test
     * @expectedException         Exception
     * @expectedExceptionMessage  sassファイルが存在しません
     * @group compass-not-exists-sass
     * @group compass
     */
    public function sassファイルが見つからない場合 ()
    {
        $command = $this->app->find('compass');
        $tester  = new CommandTester($command);
        $tester->execute([
            'command' => $command->getName(),
            'sass file' => 'hoge'
        ]);
    }


    /**
     * @test
     * @expectedException           Exception
     * @expectedExceptionMessage    sassファイルを指定してください
     * @group compass-not-sass-file
     * @group compass
     */
    public function sassファイル以外を指定した場合 ()
    {
        $command = $this->app->find('compass');
        $tester  = new CommandTester($command);
        $tester->execute([
            'command' => $command->getName(),
            'sass file' => 'config.rb'
        ]);
    }


    /**
     * @test
     * @group compass-execute
     * @group compass
     **/
    public function 正常な処理 ()
    {
        $command = $this->app->find('compass');
        $tester  = new CommandTester($command);
        $tester->execute(array(
            'command'  => $command->getName(),
            'sass file' => 'test'
        ));

        // cssが正常に生成されたかどうか
        $this->assertTrue(file_exists(ROOT.'/'.$this->css_file));
    }
}

