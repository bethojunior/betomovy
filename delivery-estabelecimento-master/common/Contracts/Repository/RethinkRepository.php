<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 15/06/2020
 * Time: 10:09
 */

namespace Common\Contracts\Repository;


use TBolier\RethinkQL\Connection\Registry;
use TBolier\RethinkQL\Rethink;

abstract class RethinkRepository
{
    /**
     * @var string $table
     */
    protected $table;

    /**
     * RethinkRepository constructor.
     * Esse método deve alimentar o atributo $table com o nome da tabela
     */
    public abstract function __construct();

    protected function getConnection()
    {
        $connections = [
            'default_connection' => new \TBolier\RethinkQL\Connection\Options(
                [
                    'hostname' => env('RETHINK_DB_HOST'),
                    'port' => (int) env('RETHINK_DB_PORT') ?? 28015,
                    'dbname' => env('RETHINK_DB_NAME'),
                    'user' => env('RETHINK_DB_USER'),
                    'password' => env('RETHINK_DB_PASS'),
                    'timeout' => 5,
                    'timeout_stream' => 10,
                ]
            ),
        ];

        $registry = new Registry($connections);

        $r = new Rethink($registry->getConnection('default_connection'));

        // Now you can connect to RethinkDB.
        try {
            $r->connection()
                ->connect();
        } catch (\Exception $e) {
            die("rethink: " . $e->getMessage() . PHP_EOL);
        }

        return $r;
    }

    /**
     * @param array $data
     * @return \TBolier\RethinkQL\Response\Cursor|\TBolier\RethinkQL\Response\ResponseInterface
     */
    public function insert($data = [])
    {
        $r = $this->getConnection();

        return $r
            ->table($this->table)
            ->insert($data)
            ->run();
    }

    public function update(array $filter = [], array $data = [])
    {
        $r = $this->getConnection();

        return $r
            ->table($this->table)
            ->filter($filter)
            ->update($data)
            ->run();
    }
}
