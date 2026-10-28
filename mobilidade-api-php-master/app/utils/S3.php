<?php

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 21/08/2018
 * Time: 09:08
 */

namespace app\utils;

use Aws\Credentials\Credentials;
use Aws\Result;
use Aws\S3\Exception\S3Exception;
use Aws\S3\S3Client;
use Exception;

class S3
{
    const PRIVATE = 'private';
    const PUBLIC_READ = 'public-read';
    const PUBLIC_READ_WRITE = 'public-read-write';
    const AUTHENTICATE_READ = 'authenticate-read';

    protected $bucketName;
    protected $s3;

    public function __construct($bucketName = null)
    {
        $this->bucketName = empty($bucketName) ? (env("S3_BUCKET_NAME") ?: getenv("S3_BUCKET_NAME") ?: 'taxireturnteste') : $bucketName;

        $region = env("S3_REGION") ?: getenv("S3_REGION") ?: 'sa-east-1';
        $accessKey = env("S3_ACCESS_KEY") ?: getenv("S3_ACCESS_KEY") ?: 'AKIAJGJRVHSXNDWEID3Q';
        $accessSecret = env("S3_ACCESS_SECRET") ?: getenv("S3_ACCESS_SECRET") ?: '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';
        $endpoint = env("S3_ENDPOINT") ?: getenv("S3_ENDPOINT") ?: null;
        $usePathStyle = env("S3_USE_PATH_STYLE_ENDPOINT") ?: getenv("S3_USE_PATH_STYLE_ENDPOINT") ?: false;

        $data = [
            'version' => 'latest',
            'region' => $region,
        ];

        if ($accessKey && $accessSecret) {
            $data['credentials'] = new Credentials($accessKey, $accessSecret);
        }

        if ($endpoint) {
            $data['endpoint'] = $endpoint;
        }

        if ($usePathStyle) {
            $data['use_path_style_endpoint'] = true;
        }

        $this->s3 = new S3Client($data);
    }

    /**
     * @param $fileName
     * @param $file
     * @param string $ACL
     * @return Result
     * @throws Exception
     */
    public function uploadSingle($fileName, $file, $ACL = self::PUBLIC_READ)
    {
        try {
            return $this->s3->putObject([
                'Bucket' => $this->bucketName,
                'Key' => $fileName,
                'Body' => file_get_contents($file),
                'ACL' => $ACL
            ]);
        } catch (S3Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    /**
     * @param $fileNameWithDir
     * @return Result
     */
    public function removeSingle($fileNameWithDir)
    {
        return $this->s3->deleteObject([
            'Bucket' => $this->bucketName,
            'Key' => $fileNameWithDir
        ]);
    }

    public function getBucketName()
    {
        return $this->bucketName . '/';
    }

    public function getRepoUrl()
    {
        $baseUrl = env("S3_URL") ?: 'https://s3-sa-east-1.amazonaws.com/';
        return rtrim($baseUrl, '/') . '/' . $this->bucketName . '/';
    }

    /**
     * Copia um arquivo dentro do bucket S3.
     *
     * @param string $sourceKey Caminho de origem (ex: 'temp/foto.jpg')
     * @param string $destKey Caminho de destino (ex: 'uploads/foto.jpg')
     * @param string $ACL Permissão do arquivo no S3 (opcional)
     * @return Result
     * @throws Exception
     */
    public function copySingle($sourceKey, $destKey, $ACL = self::PUBLIC_READ)
    {
        try {
            return $this->s3->copyObject([
                'Bucket'     => $this->bucketName,
                'CopySource' => $this->bucketName . '/' . $sourceKey,
                'Key'        => $destKey,
                'ACL'        => $ACL,
            ]);
        } catch (S3Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
}
