<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $renderError = function (int $status, \Illuminate\Http\Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => \Symfony\Component\HttpFoundation\Response::$statusTexts[$status] ?? 'Error'], $status);
            }
            return \Inertia\Inertia::render('error', ['status' => $status])
                ->toResponse($request)
                ->setStatusCode($status);
        };

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, \Illuminate\Http\Request $request) use ($renderError) {
            return $renderError($e->getStatusCode(), $request);
        });

        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) use ($renderError) {
            if (!config('app.debug')) {
                return $renderError(500, $request);
            }
        });
    })->create();
