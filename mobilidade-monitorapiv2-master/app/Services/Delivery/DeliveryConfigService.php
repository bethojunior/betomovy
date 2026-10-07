<?php

namespace App\Services\Delivery;

use App\Repositories\Config\ConfigRepository;
use Illuminate\Support\Facades\Storage;

class DeliveryConfigService
{
    private $configRepository;

    public function __construct(ConfigRepository $configRepository)
    {
        $this->configRepository = $configRepository;
    }

    public function updateImageEstablishmentSignUp(array $request)
    {
        $icon = Storage::disk('s3_global')
            ->putFile('delivery', $request['image']);

        if (!$icon) echo 'Ocorreu um erro ao fazer upload da imagem';
        $link = Storage::disk('s3_global')->url($icon);

        $this->configRepository
            ->where('key', 'url_image_registration_screen_delivery_panel')
            ->update(['value' => $link]);
    }
}
