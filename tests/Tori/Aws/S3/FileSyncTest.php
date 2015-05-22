<?php


use Tori\Mock\MockTestCase;
use Tori\Aws\S3\FileSync;

class FileSyncTest extends MockTestCase
{

    /**
     * @var FileSync
     **/
    private $sync;


    /**
     * @return void
     **/
    public function setUp ()
    {
        $this->sync = new FileSync();
    }


    /**
     * @test
     * @group filesync-dryrun
     * @group filesync
     **/
    public function DryRunを設定した場合 ()
    {
        $this->sync->setS3Client($this->getS3Mock());
        $this->sync->enableDryRun(true);
        $result = $this->sync->execute();

        $this->assertFalse($result);
    }


    /**
     * @test
     * @group filesync-all
     * @group filesync
     **/
    public function すべてのファイルを同期する場合 ()
    {
        $this->sync->setS3Client($this->getS3Mock());
        $result = $this->sync->execute();

        $this->assertTrue($result);
    }


    /**
     * @test
     * @group filesync-file
     * @group filesync
     **/
    public function 個別のファイルを同期する場合 ()
    {
        $this->sync->setS3Client($this->getS3Mock());
        $this->sync->setFilePath('public_html/resources/images/');
        $result = $this->sync->execute();

        $this->assertTrue($result);
    }
}

