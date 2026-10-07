<?php


namespace App\Services\Config;


use App\Models\Config\TermsUsePolicy;

class TermsUsePolicyService
{
    public function all()
    {
        return TermsUsePolicy::all();
    }

    public function findByType(string $type)
    {
        return TermsUsePolicy::where('type', $type)
            ->first();
    }

    public function store(array $data)
    {
        return TermsUsePolicy::create($data);
    }

    public function update(array $data)
    {
        $termsUsePolicy = TermsUsePolicy::where('type', '=', $data['type'])
            ->first();

        $termsUsePolicy->description = $data['description'];
        $termsUsePolicy->save();

        return $termsUsePolicy;
    }
}
