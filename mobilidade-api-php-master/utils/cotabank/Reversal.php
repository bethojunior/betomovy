<?php


class Reversal
{
    public $connection;

    public function __construct(ConnectionCotaBank $connection)
    {
        $this->connection = $connection;
    }

    public function reversal(string $chargeId)
    {
        $this->connection->authorization();
        $data = array(
            "tid" => $chargeId
        );
        return $this->connection->post('/v1/cancellation', $data);
    }
}
