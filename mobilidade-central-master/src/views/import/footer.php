<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery-3.2.1.js?v=<?php echo Host::getVersion('js/libs/jquery-3.2.1.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery.cookie.js?v=<?php echo Host::getVersion('js/libs/jquery.cookie.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery.mask.js?v=<?php echo Host::getVersion('js/libs/jquery.mask.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/socket.io.js?v=<?php echo Host::getVersion('js/libs/socket.io.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/sweetalert.min.js?v=<?php echo Host::getVersion('js/libs/sweetalert.min.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/bs-custom-file-input.min.js?v=<?php echo Host::getVersion('js/libs/bs-custom-file-input.min.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery.inputmask.bundle.js?v=<?php echo Host::getVersion('js/libs/jquery.inputmask.bundle.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/toastr.min.js?v=<?php echo Host::getVersion('js/libs/toastr.min.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery.maskMoney.min.js?v=<?php echo Host::getVersion('js/libs/jquery.maskMoney.min.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/config/host.js?v=<?php echo Host::getVersion('js/config/host.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/ElementProperty.js?v=<?php echo Host::getVersion('js/service/ElementProperty.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Mask.js?v=<?php echo Host::getVersion('js/service/Mask.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Progress.js?v=<?php echo Host::getVersion('js/service/Progress.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/PermissionUser.js?v=<?php echo Host::getVersion('js/service/PermissionUser.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/components/index.js?v=<?php echo Host::getVersion('js/components/index.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Route.js?v=<?php echo Host::getVersion('js/service/Route.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/ConnectionServer.js?v=<?php echo Host::getVersion('js/service/ConnectionServer.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Autocomplete.js?v=<?php echo Host::getVersion('js/service/Autocomplete.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/SwalCustom.js?v=<?php echo Host::getVersion('js/utils/SwalCustom.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Session.js?v=<?php echo Host::getVersion('js/utils/Session.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/DateCustom.js?v=<?php echo Host::getVersion('js/utils/DateCustom.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Modal.js?v=<?php echo Host::getVersion('js/utils/Modal.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Toastr.js?v=<?php echo Host::getVersion('js/utils/Toastr.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Preload.js?v=<?php echo Host::getVersion('js/utils/Preload.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/TripUI.js?v=<?php echo Host::getVersion('js/utils/TripUI.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/ValidateForm.js?v=<?php echo Host::getVersion('js/utils/ValidateForm.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Image.js?v=<?php echo Host::getVersion('js/utils/Image.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/modules/firebase/init.js?v=<?php echo Host::getVersion('js/modules/firebase/init.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Popup.js?v=<?php echo Host::getVersion('js/service/Popup.js'); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/bootstrap.min.js?v=<?php echo Host::getVersion('js/libs/bootstrap.min.js'); ?>"></script>

<?php
$mapboxToken = class_exists('MapboxHelper') ? MapboxHelper::getToken() : null;
if ($mapboxToken): ?>
<script>window._mapboxToken = <?php echo json_encode($mapboxToken); ?>;</script>
<?php endif; ?>
<!-- Mapbox GL JS -->
<script src="https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.js"></script>
<!-- Turf.js — bearing/distance calculation -->
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>
<!-- @mapbox/polyline — decodePath equivalent -->
<script src="https://cdn.jsdelivr.net/npm/@mapbox/polyline@1.2.1/src/polyline.js"></script>
<!-- Mapbox GL Draw — DrawingManager equivalent -->
<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.js"></script>

<?php
$host = Host::getLocal();
foreach ($this->filesJs as $file) {
    $version = Host::getVersion("js/{$file}.js");
    echo "<script type='text/javascript' src='{$host}webfiles/js/{$file}.js?v={$version}'></script>";

} ?>
