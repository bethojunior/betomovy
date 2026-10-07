<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/01/2020
 * Time: 13:21
 */

namespace App\Repositories\User\Doc;


use App\Constants\StatusConst;
use App\Constants\Users\DocStatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Doc\DocUser;

class DocUserRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DocUser::class);
    }

    public function findByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('docUser.statusId', StatusConst::ACTIVE)
            ->join('docStatus', 'docStatusId', '=', 'docStatus.id')
            ->join('doc', 'docId', '=', 'doc.id')
            ->select(
                'docUser.id',
                'docUser.text',
                'userId',
                'docUser.image',
                'docStatus.name AS docStatus',
                'doc.label',
                'doc.description',
                'doc.text AS isText',
                'doc.image AS isImage')
            ->orderByDesc('docUser.id')
            ->get();
    }

    public function findNotApprovedByUser($userId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->where('docStatusId', '<>', DocStatusConst::APPROVED)
            ->get();
    }

    /**
     * Busca o docUser ativo mais recente para o par usuário+tipo de documento.
     * Usado para upsert em insert(): evita criar linha duplicada quando o
     * admin solicita novamente um documento já aprovado/reprovado.
     */
    public function findActiveByUserAndDoc($userId, $docId)
    {
        return $this->getModel()
            ::where('userId', $userId)
            ->where('docId', $docId)
            ->where('statusId', StatusConst::ACTIVE)
            ->orderByDesc('id')
            ->first();
    }

    public function findByUserIds($userIds)
    {
        return $this->getModel()
            ::whereIn('userId', $userIds)
            ->where('docUser.statusId', StatusConst::ACTIVE)
            ->join('docStatus', 'docStatusId', '=', 'docStatus.id')
            ->join('doc', 'docId', '=', 'doc.id')
            ->select(
                'docUser.id',
                'docUser.text',
                'docUser.docStatusId',
                'userId',
                'docUser.image',
                'docStatus.name AS docStatus',
                'doc.label',
                'doc.description',
                'doc.text AS isText',
                'doc.image AS isImage')
            ->orderByDesc('docUser.id')
            ->get();
    }
}
