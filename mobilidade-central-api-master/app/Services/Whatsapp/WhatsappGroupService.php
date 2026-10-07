<?php

namespace App\Services\Whatsapp;

use App\Models\CentralWpp\CentralWpp;
use App\Models\CentralWpp\CentralNotificationConfigWpp;

class WhatsappGroupService
{

  public function findConfigByParams(array $params)
  {
    $items = CentralWpp::query()
      ->when($params['centralId'] ?? null, fn($q, $v) => $q->where('centralId', $v))
      ->when($params['sessionName'] ?? null, fn($q, $v) => $q->where('sessionName', 'LIKE', "%$v%"))
      ->first();

    return response()->json([
      'success' => true,
      'data' => $items
    ], 200);
  }

  public function findNotificationConfigByParams(array $params)
  {
    $items = CentralNotificationConfigWpp::query()
      ->when($params['centralId'] ?? null, fn($q, $v) => $q->where('centralId', $v))
      ->first();

    return response()->json([
      'success' => true,
      'data' => $items
    ], 200);
  }

  // public function storeConfig(array $data)
  // {
  //   $exists = CentralWpp::where('centralId', $data['centralId'])->exists();

  //   if ($exists) {
  //     return response()->json([
  //       'success' => false,
  //       'message' => 'Já existe uma configuração para essa central.',
  //       'error_code' => 'CENTRAL_CONFIG_ALREADY_EXISTS'
  //     ], 409);
  //   }

  //   $wpp = CentralWpp::create($data);

  //   return response()->json([
  //     'success' => true,
  //     'data' => $wpp
  //   ], 201);
  // }

  public function storeConfig(array $data)
  {
    $wpp = CentralWpp::updateOrCreate(
      ['centralId' => $data['centralId']],
      $data
    );

    return response()->json([
      'success' => true,
      'data'    => $wpp,
      'message' => $wpp->wasRecentlyCreated
        ? 'Configuração criada com sucesso.'
        : 'Configuração atualizada com sucesso.'
    ], $wpp->wasRecentlyCreated ? 201 : 200);
  }

  public function storeNotificationsConfig(array $data)
  {
    $wpp = CentralNotificationConfigWpp::updateOrCreate(
      [
        'centralId' => $data['centralId'],
      ],
      $data
    );

    return response()->json([
      'success' => true,
      'data' => $wpp
    ], $wpp->wasRecentlyCreated ? 201 : 200);
  }


  public function updateConfig($id, $data)
  {
    $item = CentralWpp::updateOrCreate(
      ['centralId' => $id],
      $data
    );

    return response()->json([
      'success' => true,
      'data' => $item,
      'created' => $item->wasRecentlyCreated
    ]);
  }
}
