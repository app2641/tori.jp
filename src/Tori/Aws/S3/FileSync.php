<?php


namespace Tori\Aws\S3;

use Symfony\Component\Yaml\Yaml;

class FileSync
{

    /**
     * @var boolean
     **/
    private $dry_run = false;

    /**
     * @var string
     **/
    private $conf_path = 'data/config/sync.yml';

    /**
     * @var array
     **/
    private $conf;

    /**
     * S3Client
     **/
    private $client;


    /**
     * @return void
     **/
    public function __construct ()
    {
        $this->conf = Yaml::parse(ROOT.'/'.$this->conf_path);
    }


    /**
     * @param  boolean $dry_run
     * @return void
     **/
    public function enableDryRun ($dry_run)
    {
        $this->dry_run = $dry_run;
    }

    /**
     * @param  S3Client $client
     * @return void
     **/
    public function setS3Client ($client)
    {
        $this->client = $client;
    }

    /**
     * @return void
     **/
    public function execute ()
    {
        if ($this->dry_run) return false;

        try {
            foreach ($this->conf['config']['files'] as $file) {
                $path = ROOT.'/public_html/'.$file;
                if (! file_exists($path)) throw new \Exception('not found '.$file);

                if (is_dir($path)) {
                    $this->_parseDirecotry($path);
                } else {
                    $this->_upload($file);
                }
            }

        } catch (\Exception $e) {
            throw $e;
        }

        return true;
    }


    /**
     * @param  string $path
     * @return void
     **/
    private function _parseDirecotry ($path)
    {
        foreach (glob($path.'/*') as $file) {
            $path = ROOT.'/public_html/'.$file;

            if (is_dir($path)) {
                $this->_parseDirecotry($path);
            } else {
                $this->_upload(str_replace(ROOT.'/public_html/', '', $file));
            }
        }
    }


    /**
     * @param  string $file
     * @return void
     **/
    private function _upload ($file)
    {
        $this->client->putObject([
            'Bucket' => $this->conf['config']['bucket'],
            'Key'  => $file,
            'SourceFile' => ROOT.'/public_html/'.$file
        ]);
    }
}

