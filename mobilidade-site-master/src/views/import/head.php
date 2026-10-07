<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="theme-color" content="#E18600"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <?php
    $appName = Host::getApplicationName();
    $defaultTitle = $appName . ' - O melhor app com vantagens para motoristas e passageiros';
    ?>
    <title class="name-application"><?= htmlspecialchars($this->titleGlobal ?? $defaultTitle) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="<?= Host::getLocal(); ?>webfiles/vendor/materialize/css/materialize.css">
    <link rel="icon" href="<?=Host::getPathImageDefault()?>">
    <link rel="stylesheet" href="<?= Host::getLocal(); ?>config/host.css">
    <link rel="stylesheet" href="<?= Host::getLocal(); ?>webfiles/css/default/index.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- import dynamic css in each page  -->
    <?php
    if (isset($this->filesCss)) : ?>
        <?php foreach ($this->filesCss as $css) : ?>
            <link rel="stylesheet" href="<?php echo Host::getLocal(); ?>webfiles/css/<?php echo $css ?>.css">
        <?php endforeach; ?>
    <?php endif; ?>

    <?php
    function capitalizeProjectNameInDescription($description, $projectName) {
        if (empty($description) || empty($projectName)) {
            return $description;
        }
        
        $projectNameLower = mb_strtolower($projectName, 'UTF-8');
        $descriptionLower = mb_strtolower($description, 'UTF-8');
        
        if (mb_substr($descriptionLower, 0, mb_strlen($projectNameLower, 'UTF-8'), 'UTF-8') === $projectNameLower) {
            $firstChar = mb_substr($description, 0, 1, 'UTF-8');
            if (mb_strtolower($firstChar, 'UTF-8') === $firstChar) {
                return mb_strtoupper($firstChar, 'UTF-8') . mb_substr($description, 1, null, 'UTF-8');
            }
        }
        
        return $description;
    }
    
    $title = $this->seo ? $this->seo->getTitle() : $defaultTitle;
    $description = $this->seo ? $this->seo->getDescription() : 'O melhor app com vantagens para motoristas e passageiros';
    $description = capitalizeProjectNameInDescription($description, $appName);
    
    $imageUrl = $this->seo && $this->seo->getOgImage() ? $this->seo->getOgImage() : Host::getPathImageDefault();
    
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $currentUrl = $protocol . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    ?>
    
    <meta name="description" content="<?= htmlspecialchars($description) ?>">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?= htmlspecialchars($currentUrl) ?>" />
    <meta property="og:title" content="<?= htmlspecialchars($title) ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($description) ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($imageUrl) ?>" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="<?= htmlspecialchars($currentUrl) ?>" />
    <meta property="twitter:title" content="<?= htmlspecialchars($title) ?>" />
    <meta property="twitter:description" content="<?= htmlspecialchars($description) ?>" />
    <meta property="twitter:image" content="<?= htmlspecialchars($imageUrl) ?>" />

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-130896172-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-130896172-1');
    </script>



</head>
<body>
<div id="preload-general">
    <div class="content">
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
</div>
