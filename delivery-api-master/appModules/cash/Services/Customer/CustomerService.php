<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 16:01
 */

namespace Cash\Services\Customer;


use Cash\Repositories\Customer\CustomerViewRepository;

class CustomerService
{
    /**
     * @var CustomerViewRepository
     */
    private $customerViewRepository;

    public function __construct(CustomerViewRepository $customerViewRepository)
    {
        $this->customerViewRepository = $customerViewRepository;
    }

    public function findAllByPhoneNumberList(array $request)
    {
        $formattedPhones = array_map(function ($number) {
            $number = preg_replace('/[^0-9]/', '', $number);

            return empty($number) ? null : $number;
        }, $request['list']);

        return $this->customerViewRepository
            ->findByContactNumberList(array_filter($formattedPhones));
    }
}
