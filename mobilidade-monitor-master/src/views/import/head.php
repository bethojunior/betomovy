<head>
    <title id="titleHead"></title>
    <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
    />
<!--    <link rel="icon" type="image/png" sizes="16x16" href="--><?php //echo Host::getLocal(); ?><!--webfiles/img/logo/fabrica.jpeg">-->
    <meta name="theme-color" content="#F3A41D">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="<?php echo Host::getLocal(); ?>webfiles/css/google/icon.css?v=<?php echo Host::getVersion(); ?>" rel="stylesheet">
    <link href="<?php echo Host::getLocal(); ?>webfiles/css/lib/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/intro/introjs.css">
    <link rel="stylesheet" href="/config/host.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/font/bootstrap.min.css?v=<?php echo Host::getVersion(); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/font/select2.min.css?v=<?php echo Host::getVersion(); ?>">
     <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/font/select2-bootstrap4.min.css?v=<?php echo Host::getVersion(); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/default.css?v=<?php echo Host::getVersion(); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/google/Popup.css?v=<?php echo Host::getVersion(); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/monitor/point.css?v=<?php echo Host::getVersion(); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/monitor/autocomplete.css?v=<?php echo Host::getVersion(); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/font/toastr.min.css?v=<?php echo Host::getVersion(); ?>">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/config.css">
    <link rel="stylesheet" type="text/css" href="<?php echo Host::getLocal(); ?>webfiles/css/lib/splide.min.css"/>
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/intro/introjs-rtl.css">
    <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/lib/lightgallery.min.css">
    <script src="<?php echo Host::getLocal(); ?>webfiles/js/utils/favicon.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <?php
    foreach ($this->filesCss as $file) {
        ?>
        <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/<?php echo $file ?>.css?v=<?php echo Host::getVersion(); ?>">
        <?php
    } ?>
</head>

<div id="preload-general">
    <div class="content">
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
</div>
