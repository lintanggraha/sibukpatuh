<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'SibukPatuh Frameworks')</title>

    <link rel="stylesheet" href="{{ asset('vendor/tabler/css/tabler.min.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/fontawesome-free/css/all.min.css') }}">

    <style>
        :root {
            --canvas-top: #f5efe4;
            --canvas-bottom: #eaf3f3;
            --ink: #16324b;
            --muted: #5c6776;
            --shell: rgba(255, 251, 246, 0.76);
            --active: #144e72;
            --active-soft: rgba(20, 78, 114, 0.1);
        }

        body {
            margin: 0;
            min-height: 100vh;
            color: var(--ink);
            background:
                radial-gradient(circle at top right, rgba(242, 206, 145, 0.34), transparent 26%),
                radial-gradient(circle at left center, rgba(141, 199, 203, 0.24), transparent 24%),
                linear-gradient(180deg, var(--canvas-top) 0%, var(--canvas-bottom) 100%);
        }

        .framework-shell {
            min-height: 100vh;
            padding: 1.25rem 0 2rem;
        }

        .framework-header {
            position: relative;
            z-index: 20;
            overflow: visible;
            margin-bottom: 1rem;
            padding: 1rem 1.05rem;
            border: 1px solid rgba(255, 255, 255, 0.72);
            border-radius: 28px;
            background: rgba(255, 251, 246, 0.7);
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
            backdrop-filter: blur(16px);
        }

        .framework-brand {
            display: flex;
            align-items: center;
            gap: 0.9rem;
            text-decoration: none;
            color: inherit;
        }

        .framework-brand-mark {
            width: 3rem;
            height: 3rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px;
            color: #fffaf2;
            background: linear-gradient(135deg, #16324b 0%, #1f6f78 100%);
            box-shadow: 0 12px 22px rgba(22, 50, 75, 0.18);
        }

        .framework-brand-copy small,
        .framework-helper {
            display: block;
            color: var(--muted);
            font-size: 0.78rem;
            line-height: 1.5;
        }

        .framework-brand-copy strong {
            display: block;
            font-size: 1.05rem;
            font-weight: 800;
            line-height: 1.2;
        }

        .framework-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem;
            justify-content: flex-end;
        }

        .framework-nav-group {
            position: relative;
        }

        .framework-nav-group.show {
            z-index: 30;
        }

        .framework-nav-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.55rem;
            min-width: 11rem;
            padding: 0.72rem 1.05rem;
            border-radius: 999px;
            border: 1px solid rgba(20, 78, 114, 0.08);
            color: var(--ink);
            background: rgba(255, 255, 255, 0.72);
            text-decoration: none;
            font-weight: 700;
            font-size: 0.88rem;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
            transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
        }

        .framework-nav-toggle:hover,
        .framework-nav-toggle:focus,
        .framework-nav-group.show .framework-nav-toggle {
            color: var(--active);
            border-color: rgba(20, 78, 114, 0.18);
            background: rgba(255, 255, 255, 0.85);
            box-shadow: 0 10px 20px rgba(20, 78, 114, 0.08);
            transform: translateY(-1px);
        }

        .framework-nav-toggle.is-active {
            color: var(--active);
            border-color: rgba(20, 78, 114, 0.22);
            background: var(--active-soft);
            box-shadow: 0 12px 22px rgba(20, 78, 114, 0.08);
        }

        .framework-nav-toggle::after {
            margin-left: 0.15rem;
        }

        .framework-dropdown {
            position: absolute;
            top: calc(100% + 0.65rem);
            right: 0;
            left: auto;
            z-index: 1200;
            min-width: 16.5rem;
            padding: 0.45rem;
            border: 1px solid rgba(20, 78, 114, 0.12);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 22px 42px rgba(15, 23, 42, 0.14);
            backdrop-filter: blur(16px);
        }

        .framework-dropdown.show {
            display: block;
        }

        .framework-dropdown .dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            padding: 0.82rem 0.9rem;
            border-radius: 16px;
            color: var(--ink);
            font-weight: 700;
            font-size: 0.84rem;
            white-space: normal;
        }

        .framework-dropdown .dropdown-item i {
            width: 1rem;
            color: var(--muted);
            text-align: center;
        }

        .framework-dropdown .dropdown-item:hover,
        .framework-dropdown .dropdown-item:focus {
            color: var(--active);
            background: rgba(20, 78, 114, 0.08);
        }

        .framework-dropdown .dropdown-item.is-active {
            color: var(--active);
            background: rgba(20, 78, 114, 0.12);
        }

        .framework-dropdown .dropdown-item.is-active i,
        .framework-dropdown .dropdown-item:hover i,
        .framework-dropdown .dropdown-item:focus i {
            color: var(--active);
        }

        .framework-page {
            position: relative;
            z-index: 1;
            padding: 1rem;
            border-radius: 32px;
            border: 1px solid rgba(255, 255, 255, 0.72);
            background: var(--shell);
            box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08);
            backdrop-filter: blur(16px);
        }

        .alert ul {
            margin-bottom: 0;
        }

        @media (max-width: 991.98px) {
            .framework-header {
                padding: 1rem;
            }

            .framework-header .row {
                gap: 1rem;
            }

            .framework-nav {
                justify-content: flex-start;
            }

            .framework-nav-group,
            .framework-nav-toggle {
                width: 100%;
            }

            .framework-dropdown {
                right: 0;
                left: 0;
                min-width: 100%;
            }
        }
    </style>

    @yield('css')
    @stack('styles')
</head>
<body>
@php
    $frameworkNavGroups = [
        [
            'label' => 'Nasional',
            'icon' => 'fa-landmark',
            'active' => request()->routeIs('frameworks.seojk') || request()->routeIs('frameworks.cis') || request()->routeIs('frameworks.pbi'),
            'items' => [
                ['route' => 'frameworks.seojk', 'label' => 'SEOJK 29 03/2022', 'icon' => 'fa-landmark'],
                ['route' => 'frameworks.cis', 'label' => 'Panduan Resiliensi OJK', 'icon' => 'fa-layer-group'],
                ['route' => 'frameworks.pbi', 'label' => 'PBI 02/2024', 'icon' => 'fa-university'],
            ],
        ],
        [
            'label' => 'Internasional',
            'icon' => 'fa-globe-asia',
            'active' => request()->routeIs('frameworks.iso27001') || request()->routeIs('frameworks.nist') || request()->routeIs('frameworks.cobit'),
            'items' => [
                ['route' => 'frameworks.iso27001', 'label' => 'ISO 27001', 'icon' => 'fa-shield-alt'],
                ['route' => 'frameworks.nist', 'label' => 'NIST CSF 2.0', 'icon' => 'fa-compass'],
                ['route' => 'frameworks.cobit', 'label' => 'COBIT 2019', 'icon' => 'fa-project-diagram'],
            ],
        ],
    ];
@endphp

<div class="framework-shell">
    <div class="container-xl">
        <header class="framework-header">
            <div class="row g-3 align-items-center">
                <div class="col-lg-4">
                    <a href="{{ route('frameworks.index') }}" class="framework-brand">
                        <span class="framework-brand-mark">
                            <i class="fas fa-layer-group"></i>
                        </span>
                        <span class="framework-brand-copy">
                            <small>SibukPatuh</small>
                            <strong>Sistem Informasi Biar Update Kepatuhan</strong>
                        </span>
                    </a>
                </div>
                <div class="col-lg-8">
                    <nav class="framework-nav" aria-label="Framework navigation">
                        @foreach ($frameworkNavGroups as $group)
                            <div class="dropdown framework-nav-group">
                                <button
                                    class="btn dropdown-toggle framework-nav-toggle {{ $group['active'] ? 'is-active' : '' }}"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    data-framework-group-toggle
                                    aria-expanded="false"
                                >
                                    <i class="fas {{ $group['icon'] }}"></i>
                                    <span>{{ $group['label'] }}</span>
                                </button>

                                <div class="dropdown-menu dropdown-menu-end framework-dropdown" data-framework-group-menu>
                                    @foreach ($group['items'] as $item)
                                        <a
                                            href="{{ route($item['route']) }}"
                                            class="dropdown-item {{ request()->routeIs($item['route']) ? 'is-active' : '' }}"
                                        >
                                            <i class="fas {{ $item['icon'] }}"></i>
                                            <span>{{ $item['label'] }}</span>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        @endforeach
                    </nav>
                </div>
            </div>
        </header>

        <main class="framework-page">
            @if (session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif

            @if (session('error'))
                <div class="alert alert-danger">{{ session('error') }}</div>
            @endif

            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</div>

<script src="{{ asset('vendor/jquery/jquery-3.7.1.min.js') }}"></script>
<script src="{{ asset('vendor/bootstrap5/js/bootstrap.bundle.min.js') }}"></script>
<script src="{{ asset('vendor/tabler/js/tabler.min.js') }}"></script>
<script>
    (function () {
        const groups = Array.from(document.querySelectorAll('.framework-nav-group'));

        if (!groups.length) {
            return;
        }

        function closeGroup(group) {
            const toggle = group.querySelector('[data-framework-group-toggle]');
            const menu = group.querySelector('[data-framework-group-menu]');

            group.classList.remove('show');
            toggle?.classList.remove('show');
            toggle?.setAttribute('aria-expanded', 'false');
            menu?.classList.remove('show');
        }

        function openGroup(group) {
            const toggle = group.querySelector('[data-framework-group-toggle]');
            const menu = group.querySelector('[data-framework-group-menu]');

            groups.forEach(function (item) {
                if (item !== group) {
                    closeGroup(item);
                }
            });

            group.classList.add('show');
            toggle?.classList.add('show');
            toggle?.setAttribute('aria-expanded', 'true');
            menu?.classList.add('show');
        }

        groups.forEach(function (group) {
            const toggle = group.querySelector('[data-framework-group-toggle]');
            const menu = group.querySelector('[data-framework-group-menu]');

            if (!toggle || !menu) {
                return;
            }

            toggle.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (group.classList.contains('show')) {
                    closeGroup(group);
                    return;
                }

                openGroup(group);
            });

            menu.addEventListener('click', function (event) {
                event.stopPropagation();
            });
        });

        document.addEventListener('click', function (event) {
            groups.forEach(function (group) {
                if (!group.contains(event.target)) {
                    closeGroup(group);
                }
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') {
                return;
            }

            groups.forEach(closeGroup);
        });
    })();
</script>

@yield('js')
@stack('scripts')
</body>
</html>
