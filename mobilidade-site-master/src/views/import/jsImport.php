<!-- defaults js -->
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>config/host.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/lib/jquery-3.2.1.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/lib/jquery.cookie.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/lib/axios.min.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/lib/jquery.mask.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/lib/jquery.inputmask.bundle.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/lib/load-image.all.min.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/lib/socket.io.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/plugins/sweetalert.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
<script type="text/javascript"
        src="<?php echo Host::getLocal(); ?>webfiles/vendor/materialize/js/materialize.js"></script>

<!-- utils -->
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Host.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/ConnectAPI.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/ConnectionServer.js"></script>

<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/navbarMobile.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/SimpleSwall.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/ElementProperty.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/validateData.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/SwalCustom.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/preload.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/windowResize.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Mask.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/FormGroup.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/Session.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/service/Autocomplete.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/utils/ImageUpload.js"></script>


<!--controllers-->
<script type="text/javascript"
        src="<?php echo Host::getLocal(); ?>webfiles/js/controllers/MailchimpController.js"></script>
<script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/modulos/mailchimp.js"></script>

<!-- import dynamic js in each page  -->
<?php if (isset($this->filesJs)) : ?>
    <?php foreach ($this->filesJs as $file) : ?>
        <script type="text/javascript" src="<?php echo Host::getLocal(); ?>webfiles/js/<?php echo $file ?>.js"></script>
    <?php endforeach; ?>
<?php endif; ?>
</body>
