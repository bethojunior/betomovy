<?php

namespace App\Http\Controllers\Product;

use App\Exceptions\Delivery\DeliveryProductException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\DeliveryProductRequest;
use Api\Http\Responses\ApiResponse;
use App\Models\Product\DeliveryProduct;
use App\Services\Product\DeliveryProductService;
use Illuminate\Http\Request;

class DeliveryProductController extends Controller
{
    /**
     * @var DeliveryProductService
     */
    private $service;

    public function __construct(DeliveryProductService $service)
    {
        $this->service = $service;
    }

    public function store(DeliveryProductRequest $request)
    {
        try {
            $this->service
                ->store($request->all());

            toast("Produto inserido com sucesso", 'success');
        } catch (\Exception $e) {

            toast($e->getMessage(), 'error');
        }
        return redirect()
            ->back();
    }

    /**
     * @param DeliveryProduct $deliveryProduct
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete(DeliveryProduct $deliveryProduct)
    {
        try {
            $this->service
                ->delete($deliveryProduct);

            toast("Produto excluído com sucesso", 'success');
        } catch (\Exception $e) {
            toast($e->getMessage(), "error");
        }

        return redirect()
            ->back();
    }

    public function show($id, Request $request)
    {
        try {
            $deliveryProduct = $this->service
                ->findOne($id);
        } catch (\Exception $e) {
            return ApiResponse::error($e, "Erro ao encontrar o produto");
        }

        return ApiResponse::success($deliveryProduct);
    }

    public function update(DeliveryProduct $deliveryProduct, Request $request)
    {
        try {
            $this->service
                ->update($deliveryProduct, $request->all());

            toast("Produto atualizado com sucesso", 'success');
        } catch (\Exception $e) {

            toast($e->getMessage(), 'error');
        }

        return redirect()
            ->back();
    }
}
