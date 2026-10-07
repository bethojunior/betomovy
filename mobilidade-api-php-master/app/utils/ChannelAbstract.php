<?php
/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 02/08/2018
 * Time: 15:14
 */

namespace app\utils;

use Exception;
use Pusher\Pusher;
use Pusher\PusherException;

abstract class ChannelAbstract
{
    /** @var Pusher $pusher */
    protected $pusher;
    protected $options;
    protected $data;

    protected $pusher_app_id;
    protected $pusher_app_key;
    protected $pusher_app_secret;

    protected $channel;

    /**
     * ChannelAbstract constructor.
     * @throws Exception
     */
    public function __construct()
    {
        $name = strtoupper(str_replace('Channel', '', get_class($this)));

        $this->pusher_app_id = env($name . "_PUSHER_APP_ID");
        $this->pusher_app_key = env($name . "_PUSHER_APP_KEY");
        $this->pusher_app_secret = env($name . "_PUSHER_APP_SECRET");
        $this->channel = env($name . "_PUSHER_CHANNEL");

        try {
            $this->options = array(
                'cluster' => 'us2',
                'encrypted' => true
            );

            $this->pusher = new Pusher(
                $this->pusher_app_key,
                $this->pusher_app_secret,
                $this->pusher_app_id,
                $this->options
            );

        } catch (PusherException $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function setData($index, $value)
    {
        $this->data[$index] = $value;
    }

    public function getData($index = null)
    {
        return empty($index) ? $this->data : $this->data[$index];
    }

    /**
     * @param string $event
     * @return array|bool
     * @throws Exception
     */
    public function trigger($event)
    {
        try {
            return $this->pusher->trigger($this->channel, $event, $this->data);
        } catch (PusherException $e) {
            throw new Exception($e->getMessage());
        }
    }

    /**
     * @param $batchs
     * @return array|bool
     * @throws Exception
     */
    public function trigger_batch($batchs)
    {
        try {
            $newBatchs = array_map(function ($batch) {
                $batch['channel'] = $this->channel;
                return $batch;
            }, $batchs);

            return $this->pusher->triggerBatch($newBatchs);
        } catch (PusherException $e) {
            throw new Exception($e->getMessage());
        }
    }

    /**
     * @return Pusher
     */
    public function getPusher()
    {
        return $this->pusher;
    }
}