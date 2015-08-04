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
     * @var string
     **/
    private $file_path;

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
     * @param  string $file_path
     * @return void
     **/
    public function setFilePath ($file_path)
    {
        $file_path = preg_replace('/\/$/', '', ROOT.'/'.$file_path);
        $this->file_path = $file_path;
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
            if (is_null($this->file_path)) {
                foreach ($this->conf['config']['files'] as $file) {
                    $file_path = ROOT.'/public_html/'.$file;
                    $this->_parse($file_path);
                }
            } else {
                $this->_parse($this->file_path);
            }

        } catch (\Exception $e) {
            throw $e;
        }

        return true;
    }


    /**
     * @param  string $file_path
     * @return void
     **/
    private function _parse ($file_path)
    {
        if (! file_exists($file_path)) throw new \Exception('not found '.$file_path);

        if (is_dir($file_path)) {
            $this->_parseDirecotry($file_path);
        } else {
            $this->_upload($file_path);
        }
    }


    /**
     * @param  string $path
     * @return void
     **/
    private function _parseDirecotry ($path)
    {
        foreach (glob($path.'/*') as $file_path) {
            $this->_parse($file_path);
        }
    }


    /**
     * @param  string $file_path
     * @return void
     **/
    private function _upload ($file_path)
    {
        $to_path = str_replace(ROOT.'/public_html/', '', $file_path);

        $this->client->putObject([
            'Bucket' => $this->conf['config']['bucket'],
            'Key' => $to_path,
            'SourceFile' => $file_path
        ]);
    }
}

