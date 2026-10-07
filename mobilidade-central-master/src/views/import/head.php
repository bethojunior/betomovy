<head>
    <title>Central</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <link rel="icon" type="image/jpeg" href="<?php echo htmlspecialchars(Host::getCentral() . 'default.jpg', ENT_QUOTES, 'UTF-8'); ?>">

    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/google/Popup.css?v=<?php echo Host::getVersion('css/google/Popup.css'); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/font/toastr.min.css?v=<?php echo Host::getVersion('css/font/toastr.min.css'); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/bootstrap/bootstrap.min.css?v=<?php echo Host::getVersion('css/bootstrap/bootstrap.min.css'); ?>">
    <link href="<?php echo Host::getLocal(); ?>webfiles/css/google/icon.css?v=<?php echo Host::getVersion('css/google/icon.css'); ?>" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/variables.css?v=<?php echo Host::getVersion('css/variables.css'); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/default.css?v=<?php echo Host::getVersion('css/default.css'); ?>">

    <!-- Firebase -->
    <script src="https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.10.1/firebase-firestore.js"></script>

    <!-- Moment.js (adiciona aqui) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/locale/pt-br.js"></script>
    <script>moment.locale('pt-br');</script>

    <!-- Mapbox GL JS -->
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css" rel="stylesheet">
    <!-- Mapbox GL Draw (páginas com desenho de polígono) -->
    <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.css">

    <?php
    $host = Host::getLocal();
    foreach ($this->filesCss as $file) {
        $version = Host::getVersion("css/{$file}.css");
        echo "<link rel='stylesheet' href='{$host}webfiles/css/{$file}.css?v={$version}'/>";
    }
    ?>
</head>
