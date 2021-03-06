<?php


namespace Tori\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

use Acm\Acm;
use Tori\Aws\S3\FileSync;

class Sync extends Command
{

    /**
     * @return void
     **/
    protected function configure ()
    {
        $this->setName('sync')
            ->setDescription('public_html以下のファイルをS3へ同期する');

        // 引数の記載
        $this->addArgument(
            'file_path',
            InputArgument::OPTIONAL,
            '個別でアップロードしたいファイルまたはディレクトリ'
        );

        // オプションの記載
        $this->addOption(
            'dry-run',
            'dr',
            InputOption::VALUE_NONE,
            'モックによるアップロードを有効化する'
        );
    }


    /**
     * @param  InputInterface $input
     * @param  OutputInterface $output
     * @return void
     **/
    protected function execute (InputInterface $input, OutputInterface $output)
    {
        $dry_run   = $input->getOption('dry-run');
        $file_path = $input->getArgument('file_path');

        $sync = new FileSync();
        $sync->enableDryRun($dry_run);
        $sync->setS3Client(Acm::getS3());

        if (! is_null($file_path)) {
            $sync->setFilePath($file_path);
        }
        $sync->execute();
    }
}

