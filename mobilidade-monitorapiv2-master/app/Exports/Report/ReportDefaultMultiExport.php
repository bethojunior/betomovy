<?php

namespace App\Exports\Report;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ReportDefaultMultiExport implements WithMultipleSheets
{
    use Exportable;

    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data ?? [];
    }

    public function sheets(): array
    {
        $sheets = [];

        if (!empty($this->data)) {
            foreach ($this->data as $item) {
                $sheets[] = new ReportDefaultExport($item);
            }
        }

        if (empty($sheets)) {
            $sheets[] = new ReportDefaultExport([]);
        }

        return $sheets;
    }
}
