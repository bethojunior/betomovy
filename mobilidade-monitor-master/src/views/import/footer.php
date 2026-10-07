<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery-3.2.1.js?v=<?php echo Host::getVersion(); ?>"></script>
<?php
    if (file_exists(PROJECT_PUBLIC_DIR . "/config/host.js")) {
        echo '<script type="text/javascript" src="/config/host.js"></script>';
    }
?>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="<?php echo Host::getLocal(); ?>webfiles/js/libs/select2.min.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery.cookie.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery.mask.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/sweetalert.min.js?v=<?php echo Host::getVersion(); ?>"></script>
<script src="<?php echo Host::getLocal(); ?>webfiles/js/libs/picturefill.min.js"></script>
<script src="<?php echo Host::getLocal(); ?>webfiles/js/libs/lightgallery-all.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/toastr.min.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/popper.min.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/bootstrap.min.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/intro/intro.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery.inputmask.bundle.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/canvas-datagrid.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/xlsx.full.min.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/html2canvas.min.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/select2.min.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/jquery.maskMoney.min.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Host.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/ElementProperty.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Mask.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Progress.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/PermissionUser.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/ConnectionServer.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Autocomplete.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/controllers/CityController.js?"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Image.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Notification.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/SwalCustom.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Session.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/DateCustom.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Modal.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Toastr.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/ValidateForm.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/FormGroup.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/preload.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Response.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Popup.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Consts.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/controller.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/Request/Controller.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/Validate/ValidateController.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/libs/splide.min.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/controllers/NotificationController.js?v=<?php echo Host::getVersion(); ?>"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/controllers/AdminAnaController.js?v=<?php echo Host::getVersion(); ?>"></script>
<script>
    Notification.requestPermission();
</script>
<?php
foreach ($this->filesJs as $file) {
    ?>
    <script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/<?php echo $file ?>.js?v=<?php echo Host::getVersion(); ?>"></script>
    <?php
} ?>
