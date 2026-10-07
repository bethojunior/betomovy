<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeliveryCategoryRequest;
use App\Models\Product\DeliveryCategory;
use App\Services\Product\DeliveryCategoryService;
use Illuminate\Http\Request;

class DeliveryCategoryController extends Controller
{
    /**
     * @var DeliveryCategoryService
     */
    private $service;

    public function __construct(DeliveryCategoryService $service)
    {
        $this->service = $service;
    }

    public function store(DeliveryCategoryRequest $request)
    {
        try {
            $this->service->store($request->validated());

            toast("Categoria inserida com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

    public function destroy(DeliveryCategory $deliveryCategory)
    {
        try {
            $this->service->delete($deliveryCategory);

            toast("Categoria excluída com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

    public function update(Request $request)
    {
        try {
            $this->service->update($request->all());

            toast("Categoria atualizada com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }
}
