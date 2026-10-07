<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/07/2019
 * Time: 14:52
 */

namespace App\Repositories\Log;


use App\Constants\AppConst;
use App\Constants\LogsConst;
use App\Contracts\Repository\AbstractODMRepository;
use App\Documents\Log;
use App\Documents\LogsApplication;
use App\Documents\LogsTransaction;
use Carbon\Carbon;

class LogRepository extends AbstractODMRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    protected $model;

    public function __construct()
    {
        $this->setModel(Log::class); 
    }

    public function setModel($modelClass)
    {
        $this->model = new $modelClass;
    }

    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param array $data
     * @param $message
     * @param null $userId
     * @param null $idReference
     * @return \Illuminate\Database\Eloquent\Model|\Jenssegers\Mongodb\Eloquent\Builder|\Jenssegers\Mongodb\Eloquent\Model
     */
    public function insert(array $data, $message, $userId = null, $idReference = null)
    {
        return $this->getModel()
            ::create([
                'data' => $data,
                'message' => $message,
                'userId' => $userId,
                'idReference' => $idReference,
                'app' => AppConst::CENTRAL,
                'date' => now()->toDateTimeString()
            ]);
    }
    public function getCollectionLogs($type)
    {
        $data = null;
        switch ($type) {
            case 1:
                $data = $this->getModel()::where('level', "informacao")->orderBy('registered_at', 'desc')->select('message', 'data', 'registered_at')->paginate(10);
                break;
            case 2:
                $data = $this->getModel()::where('level', "aviso")->orderBy('registered_at', 'desc')->select('message', 'data', 'registered_at')->paginate(10);
                break;

            default:
            $data = $this->getModel()::orderBy('registered_at', 'desc')->select('message', 'data', 'registered_at')->paginate(10);
        }
        return $data;
    }

    public function getCollectionLogsApplications($type)
    {
        $this->setModel(LogsApplication::class);
        
        $data = null;
        switch ($type) {
            case 1:
                $data = $this->getModel()::where('message', 'regex', '/Erro ao enviar sms com o/i')
                    ->orderBy('date', 'desc')
                    ->select('message', 'data', 'date')
                    ->paginate(10);
                break;
            case 2:
                $data = $this->getModel()::where('message', 'regex', '/Action não existe/i')
                    ->orderBy('date', 'desc')
                    ->select('message', 'data', 'dir', 'date')
                    ->paginate(10);
                break;
            default:
                $data = $this->getModel()::orderBy('date', 'desc')->select('message', 'data', 'date', 'dir')->paginate(10);
        }
        return $data;
    }

    public function getTransactionLogs($request = null)
    {
        $this->setModel(LogsTransaction::class);
    
        $data = $this->getModel()::where(
            function ($query) use ($request) {
                $dateStart = $request->input('dateStart');
                $dateEnd = $request->input('dateEnd');
    
                if ($dateStart && $dateEnd) {
                    $dateStart = Carbon::parse($dateStart)->startOfDay();
                    $dateEnd = Carbon::parse($dateEnd)->endOfDay();
                    $query->whereBetween('created_at', [$dateStart, $dateEnd]);
                }
            }
        )->paginate(10);
    
        return $data;
    }
}
