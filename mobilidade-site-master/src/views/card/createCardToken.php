<input type="text" id="codeInput" hidden />
<script src="https://sdk.mercadopago.com/js/v2"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        const url = new URL(window.location.href);

        const value = url.searchParams.get("q");

        if (value) {
            const item = JSON.parse(atob(value));

            const mp = new MercadoPago(item.key);

            mp.createCardToken(item.card).then(result => {
                document.querySelector("#codeInput").value = btoa(JSON.stringify(result));
                window.location.href = window.location.href += `#${btoa(JSON.stringify(result))}`;
            });
        }
    });
</script>