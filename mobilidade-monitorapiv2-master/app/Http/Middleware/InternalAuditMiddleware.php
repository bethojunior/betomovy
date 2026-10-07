<?php

namespace App\Http\Middleware;

use App\Audit\InternalAudit;
use App\Documents\Log;
use App\Repositories\RouteAudit\RouteNotInternalAuditRepository;
use Closure;
use Illuminate\Support\Facades\Cache;

class InternalAuditMiddleware
{
    /**
     * @var RouteNotInternalAuditRepository
     */
    private $repository;

    public function __construct(RouteNotInternalAuditRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $route = Cache::remember('route:audit:' . $request->getRequestUri(), 3600, function () use ($request) {
            return $this->repository
                ->findPluckedByRoute($request->getRequestUri());
        });

        if (!$route) {
            $this->saveInternalAudit($request);
        }

        return $next($request);
    }

    private function saveInternalAudit(\Illuminate\Http\Request $request)
    {
        $internalAudit = new InternalAudit;
        $internalAudit->userId = $request->user()->idUser ?? null;
        $internalAudit->browser = $_SERVER['HTTP_USER_AGENT'] ?? 'N/A';
        $internalAudit->method = $request->method();
        $internalAudit->url_path = $request->getRequestUri();
        $internalAudit->post_fields = json_encode($request->request->all());
        $internalAudit->query_params = json_encode($request->query->all());
        $internalAudit->ip = $request->ip();
        $internalAudit->content = null;

        if ($request->getContent()) {
            $contentArray = json_encode(['content' => $request->getContent()]);
            $content = json_decode($request->getContent());
            $internalAudit->content = $content ? json_encode($content) : null;

            if (!$content && $contentArray) {
                $internalAudit->content = $contentArray;
            }
        }

        $internalAudit->save();
    }
}
