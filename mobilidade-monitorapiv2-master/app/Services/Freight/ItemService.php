<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 02/09/2019
 * Time: 14:00
 */

namespace App\Services\Freight;


use App\Constants\StatusConst;
use App\Models\Freight\Item;
use App\Repositories\Freight\ItemRepository;
use Illuminate\Http\UploadedFile;

class ItemService
{
    /**
     * @var ItemRepository
     */
    private $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        $results = $this->repository
            ->all();

        return $results;
    }

    /**
     * @param $request
     * @param UploadedFile $picture
     * @return Item
     * @throws \Exception
     */
    public function insert($request, UploadedFile $picture)
    {
        try {
            \DB::beginTransaction();

            $item = new Item($request);

            $pictureName = \Storage::cloud()
                ->putFile('item', $picture, 'public');

            $pictureName = explode('/', $pictureName);

            $item->picture = end($pictureName);

            $this->repository
                ->save($item);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $item;
    }

    /**
     * @param $id
     * @param $request
     * @param UploadedFile|null $picture
     * @return Item
     */
    public function update($id, $request, ?UploadedFile $picture)
    {
        /** @var Item $item */
        $item = $this->repository
            ->find($id);

        if ($picture){
            \Storage::cloud()
                ->delete('item/'.$item
                        ->getOriginal('picture'));

            $pictureName = \Storage::cloud()
                ->putFile('item', $picture, 'public');

            $pictureName = explode('/', $pictureName);

            $item->picture = end($pictureName);
        }

        $item->description = $request['description'] ?? $item->description;
        $item->weight = $request['weight'] ?? $item->weight;
        $item->height = $request['height'] ?? $item->height;
        $item->width = $request['width'] ?? $item->width;
        $item->depth = $request['depth'] ?? $item->depth;

        $this->repository
            ->save($item);

        return $item;
    }

    /**
     * @param $id
     * @return bool
     */
    public function delete($id)
    {
        /** @var Item $item */
        $item = $this->repository
            ->find($id);

        \Storage::cloud()
            ->delete('item/'.$item
                    ->getOriginal('picture'));

        $item->picture = null;
        $item->statusId = StatusConst::REMOVED;

        return $this->repository
            ->save($item);
    }
}
