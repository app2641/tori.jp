<?php

/**
 * モック生成に特化したユニットテスト用クラス
 *
 * @package Tori
 * @subpackage Mock
 **/
namespace Tori\Mock;

abstract class MockTestCase extends \PHPUnit_Framework_TestCase
{

    /**
     * インターフェイス
     *
     * @var array
     **/
    private $methods = array(
        'getAccessKeyId',
        'getSecretKey',
        'getSecurityToken',
        'getExpiration',
        'setAccessKeyId',
        'setSecretKey',
        'setSecurityToken',
        'setExpiration',
        'isExpired'
    );


    /**
     * コンストラクタ引数のモックを取得する
     *
     * @return array
     **/
    private function _getConstructArguments ()
    {
        $arguments = array(
            $this->_getCredentialsInterfaceMock(),
            $this->_getSignatureInterfaceMock(),
            $this->_getCollectionMock()
        );

        return $arguments;
    }


    /**
     * @return Collection
     **/
    private function _getCollectionMock ()
    {
        return $this->getMock('Guzzle\Common\Collection');
    }


    /**
     * @return CredentialsInterface
     **/
    private function _getCredentialsInterfaceMock ()
    {
        return $this->getMock('Aws\Common\Credentials\CredentialsInterface');
    }


    /**
     * @return SignatureInterface
     **/
    private function _getSignatureInterfaceMock ()
    {
        return $this->getMock('Aws\Common\Signature\SignatureInterface');
    }


    /**
     * @return S3Client_Mock
     **/
    public function getS3Mock ()
    {
        $arguments = $this->_getConstructArguments();
        $methods   = array_merge($this->methods, [
            'putObject'
        ]);

        return $this->getMock('Aws\S3\S3Client', $methods, $arguments);
    }
}
