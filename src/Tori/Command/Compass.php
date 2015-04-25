<?php


namespace Tori\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Compass extends Command
{

    /**
     * @var string
     */
    private $sass_file;


    /**
     * @var string
     */
    private $sass_path = 'public_html/resources/sass';


    /**
     * @return void
     **/
    protected function configure ()
    {
        $this->setName('compass')
            ->setDescription('sassファイルをコンパイルします');

        // 引数の記載
        $this->addArgument(
            'sass file',
            InputArgument::REQUIRED,
            'Compassでコンパイルするsassファイル名'
        );

        // オプションの記載
        /*$this->addOption(
            'option_name',
            null,
            InputerOption::VALUE_REQUIRED
        );*/
    }


    /**
     * @param  InputInterface $input
     * @param  OutputInterface $output
     * @return void
     **/
    protected function execute (InputInterface $input, OutputInterface $output)
    {
        try {
            // sassファイル名を整形してパスを生成する
            $this->sass_file = strtolower($input->getArgument('sass file'));
            $this->_formatSassFile();

            $command = sprintf('compass compile %s', escapeshellarg($this->sass_path));

            chdir(ROOT.'/public_html/resources/sass');
            passthru($command);

        } catch (\Exception $e) {
            throw $e;
        }
    }


    /**
     * @return string
     */
    private function _formatSassFile ()
    {
        $info = pathinfo($this->sass_file);
        if (! isset($info['extension'])) {
            $this->sass_file .= '.scss';
        } else {
            if ($info['extension'] != 'scss') throw new \Exception('sassファイルを指定してください');
        }

        $this->sass_path = ROOT.'/'.$this->sass_path.'/'.$this->sass_file;
        if (! file_exists($this->sass_path)) throw new \Exception('sassファイルが存在しません');
    }
}

