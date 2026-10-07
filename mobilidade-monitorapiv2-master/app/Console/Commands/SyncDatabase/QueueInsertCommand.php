<?php

namespace App\Console\Commands\SyncDatabase;

use App\Repositories\Log\QueueInsertRepository;
use Illuminate\Console\Command;

class QueueInsertCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue-insert:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description =
        'Sync queue_insert mongodb collection with the respective tableToInsert in the mysql database.';
    private QueueInsertRepository $queueInsertRepository;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(QueueInsertRepository $queueInsertRepository)
    {
        parent::__construct();
        $this->queueInsertRepository = $queueInsertRepository;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $inserts = $this->queueInsertRepository->all();
        $this->info('Inserts to sync: ' . count($inserts));

        foreach ($inserts as $insert) {
            $tableToInsert = $insert->tableToInsert;
            $data = $insert->data;

            $this->info('Inserting rows into ' . $tableToInsert . '...');

            \DB::table($tableToInsert)->insert($data);

            $this->info('Rows inserted into ' . $tableToInsert . '...');

            $this->info('Deleting insert from queue...');
            $this->queueInsertRepository->delete($insert);

            $this->info('Insert deleted from queue...');
        }

        return 0;
    }
}
