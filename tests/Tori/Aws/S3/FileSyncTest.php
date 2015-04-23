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
     * @group filesync-execute
     * @group filesync
     **/
    public function 正常な処理 ()
    {
        $this->sync->setS3Client($this->getS3Mock());
        $result = $this->sync->execute();

        $this->assertTrue($result);
    }
}

