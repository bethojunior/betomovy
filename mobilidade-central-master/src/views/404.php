<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Não Encontrada — MOVY Central</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="/webfiles/css/google/icon.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, sans-serif;
        }

        body {
            background-color: #0f172a;
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            overflow: hidden;
            position: relative;
        }

        /* Fundo com efeito de radar/grade */
        .bg-grid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.12) 0%, transparent 60%),
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 100% 100%, 40px 40px, 40px 40px;
            pointer-events: none;
        }

        .error-card {
            position: relative;
            z-index: 2;
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 24px;
            padding: 48px 40px;
            max-width: 520px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .brand-logo {
            height: 44px;
            margin-bottom: 24px;
            object-fit: contain;
        }

        .error-code-badge {
            display: inline-block;
            padding: 6px 14px;
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border-radius: 9999px;
            margin-bottom: 16px;
        }

        .error-num {
            font-size: 72px;
            font-weight: 900;
            letter-spacing: -0.04em;
            line-height: 1;
            color: #ffffff;
            margin-bottom: 12px;
            background: linear-gradient(180deg, #ffffff 0%, #94a3b8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .error-title {
            font-size: 20px;
            font-weight: 700;
            color: #f8fafc;
            margin-bottom: 10px;
        }

        .error-desc {
            font-size: 14px;
            color: #94a3b8;
            line-height: 1.55;
            margin-bottom: 32px;
        }

        .error-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 700;
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-primary {
            background-color: #2563eb;
            color: #ffffff;
            border: 1px solid #3b82f6;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        .btn-primary:hover {
            background-color: #1d4ed8;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45);
        }

        .btn-secondary {
            background-color: rgba(255, 255, 255, 0.08);
            color: #e2e8f0;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn-secondary:hover {
            background-color: rgba(255, 255, 255, 0.14);
            color: #ffffff;
            transform: translateY(-2px);
        }

        .btn i {
            font-size: 18px;
        }

        .copyright-text {
            margin-top: 32px;
            font-size: 11px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="bg-grid"></div>

    <div class="error-card">
        <img src="/webfiles/img/logo/logo-movy-transparent.png"
             onerror="this.onerror=null; this.src='/webfiles/img/logo/logo.png';"
             alt="MOVY"
             class="brand-logo">

        <div>
            <span class="error-code-badge">Erro de Navegação</span>
            <div class="error-num">404</div>
            <h1 class="error-title">Página Não Encontrada</h1>
            <p class="error-desc">
                A rota que você tentou acessar não existe, foi desativada ou movida para outro endereço operacional.
            </p>
        </div>

        <div class="error-actions">
            <a href="/" class="btn btn-primary">
                <i class="material-icons">home</i>
                <span>Voltar ao Mapa Operacional</span>
            </a>
            <a href="/trip/list" class="btn btn-secondary">
                <i class="material-icons">directions_car</i>
                <span>Ver Viagens</span>
            </a>
        </div>

        <p class="copyright-text">&copy; MOVY Central &bull; Gestão Inteligente de Mobilidade</p>
    </div>
</body>
</html>
