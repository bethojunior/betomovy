<?php

declare(strict_types=1);

namespace App\Services\Zafira;

use App\Helpers\CpfHelper;

class ZafiraValidateRequest
{
    public $name;
    public $phone;
    public $document;
    public $email;

    public function __construct(string $name, string $phone, string $document, string $email)
    {
        $this->name = $name;
        $this->phone = $phone;
        $this->document = $document;
        $this->email = $email;
    }

    /**
     * @param object $data
     *
     * @throws \InvalidArgumentException
     */
    public static function from(object $data): self
    {
        $name = trim((string) ($data->name ?? ''));
        $documentRaw = trim((string) ($data->document ?? ''));
        $phone = trim((string) ($data->phone ?? ''));
        $email = trim((string) ($data->email ?? ''));

        if ($name === '' || $documentRaw === '' || $phone === '' || $email === '') {
            throw new \InvalidArgumentException('Nome, documento, telefone e e-mail são obrigatórios para validar o cadastro.');
        }

        $document = CpfHelper::maskCpf($documentRaw);

        return new self($name, $phone, $document, $email);
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'phone' => $this->phone,
            'document' => $this->document,
            'email' => $this->email,
        ];
    }
}
