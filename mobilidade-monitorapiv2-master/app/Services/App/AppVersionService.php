<?php


namespace App\Services\App;


use App\Constants\StatusConst;
use App\Models\App\AppVersion;
use App\Repositories\App\AppVersionRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

class AppVersionService
{
    /**
     * @var AppVersionRepository
     */
    private $repository;

    /**
     * @var Admin704Apps
     */
    private $admin704Apps;

    public function __construct(
        AppVersionRepository $repository,
        Admin704Apps $admin704Apps
        )
    {
        $this->repository = $repository;
        $this->admin704Apps = $admin704Apps;
    }

    public function store(array $data): ?Model
    {
        $data = array_merge($data, [
            'statusId' => StatusConst::ACTIVE,
        ]);
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): AppVersion
    {
        $appVersion = AppVersion::findOrFail($id);

        if (array_key_exists('active', $data)) {
            $data['statusId'] = $data['active'] ? StatusConst::ACTIVE : StatusConst::REMOVED;
        }

        $appVersion->fill($data);
        $appVersion->save();

        return $appVersion;
    }

    public function getAll(): LengthAwarePaginator
    {
        return $this->repository->getAll();
    }

    public function getVersionsFromAna(){
        return $this->admin704Apps->getAppTypes();
    }

    public function getVersionByIdAna(int $id){
        return $this->admin704Apps->getVersionById($id);
    }
}
