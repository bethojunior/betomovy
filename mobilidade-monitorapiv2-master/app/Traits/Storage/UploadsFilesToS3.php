<?php

namespace App\Traits\Storage;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait UploadsFilesToS3
{
    protected function generateFileName(UploadedFile $file): string
    {
        return time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
    }

    protected function putFile(UploadedFile $file, string $directory, string $fileName): void
    {
        Storage::disk('s3')->putFileAs($directory, $file, $fileName);
    }

    protected function deleteFile(string $directory, string $fileName): void
    {
        Storage::disk('s3')->delete(rtrim($directory, '/') . '/' . $fileName);
    }

    protected function replaceFile(UploadedFile $file, string $directory, ?string $oldFileName = null): string
    {
        $fileName = $this->generateFileName($file);

        if ($oldFileName)
            $this->deleteFile($directory, $oldFileName);

        $this->putFile($file, $directory, $fileName);

        return $fileName;
    }
}
