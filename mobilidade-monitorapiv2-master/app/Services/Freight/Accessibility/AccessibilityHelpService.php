<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/09/2019
 * Time: 13:42
 */

namespace App\Services\Freight\Accessibility;


use App\Constants\StatusConst;
use App\Models\Freight\AccessibilityHelp;
use App\Repositories\Freight\Accessibility\AccessibilityHelpRepository;

class AccessibilityHelpService
{
    /**
     * @var AccessibilityHelpRepository
     */
    private $repository;

    public function __construct(AccessibilityHelpRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert($request)
    {
        $accessibilityHelp = new AccessibilityHelp;

        $accessibilityHelp->name = $request['name'];

        $pictureName = \Storage::cloud()
            ->putFile('accessibility', $request['picture']);

        $accessibilityHelp
            ->picture = $this->generateStorageUrl($pictureName);

        $this->repository
            ->save($accessibilityHelp);

        return $accessibilityHelp;
    }

    public function findAll()
    {
        return $this->repository
            ->findAll();
    }

    public function delete($id)
    {
        $accessibilityHelp = $this->repository
            ->find($id);

        if (!$accessibilityHelp)
            return null;

        $accessibilityHelp
            ->statusId = StatusConst::REMOVED;

        $this->repository->save($accessibilityHelp);

        return true;
    }

    private function generateStorageUrl(string $fileName): string
    {
        $bucket = env('STORAGE_BUCKET') ?? env('AWS_BUCKET');
        $endpoint = env('STORAGE_ENDPOINT') ?? env('AWS_ENDPOINT');

        return "{$endpoint}/{$bucket}/{$fileName}";
    }
}
