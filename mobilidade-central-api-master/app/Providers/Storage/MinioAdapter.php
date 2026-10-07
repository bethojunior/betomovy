<?php

namespace App\Providers\Storage;

use League\Flysystem\AdapterInterface;
use League\Flysystem\Config;

class MinioAdapter implements AdapterInterface
{
    private $config;

    public function __construct($config)
    {
        $this->config = $config;
    }

    public function write($path, $contents, Config $config)
    {
        return $this->upload($path, $contents);
    }

    public function writeStream($path, $resource, Config $config)
    {
        return $this->upload($path, stream_get_contents($resource));
    }

    private function upload($path, $contents)
    {
        $endpoint = rtrim($this->config['endpoint'], '/');
        $url = $endpoint . '/' . $this->config['bucket'] . '/' . $path;
        $date = gmdate('D, d M Y H:i:s T');

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $contents);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/octet-stream',
            'Date: ' . $date,
            'Authorization: AWS ' . $this->config['key'] . ':' . $this->sign($path, $date)
        ]);

        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return ($httpCode >= 200 && $httpCode < 300) ? ['type' => 'file', 'path' => $path, 'visibility' => 'public'] : false;
    }

    private function sign($path, $date)
    {
        $stringToSign = "PUT\n\napplication/octet-stream\n" . $date . "\n/" . $this->config['bucket'] . '/' . $path;
        return base64_encode(hash_hmac('sha1', $stringToSign, $this->config['secret'], true));
    }

    // Métodos obrigatórios da interface
    public function read($path) { return false; }
    public function readStream($path) { return false; }
    public function rename($path, $newpath) { return false; }
    public function copy($path, $newpath) { return false; }
    public function delete($path) { return false; }
    public function deleteDir($dirname) { return false; }
    public function createDir($dirname, Config $config) { return ['path' => $dirname, 'type' => 'dir']; }
    public function setVisibility($path, $visibility) { return false; }
    public function has($path) { return false; }
    public function getSize($path) { return false; }
    public function getMimetype($path) { return false; }
    public function getTimestamp($path) { return false; }
    public function getVisibility($path) { return false; }
    public function listContents($directory = '', $recursive = false) { return []; }
    public function update($path, $contents, Config $config) { return $this->write($path, $contents, $config); }
    public function updateStream($path, $resource, Config $config) { return $this->writeStream($path, $resource, $config); }
    public function getMetadata($path) { return false; }
}
