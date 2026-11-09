<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        $logs = AuditLog::with('actor:id,name,email')
            ->latest('id')
            ->paginate(50)
            ->through(fn (AuditLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'subject' => $log->subject_type ? class_basename($log->subject_type)." #{$log->subject_id}" : null,
                'properties' => $log->properties,
                'actor' => $log->actor?->only(['name', 'email']),
                'created_at' => $log->created_at->toIso8601String(),
            ]);

        return Inertia::render('admin/audit-log', ['logs' => $logs]);
    }
}
