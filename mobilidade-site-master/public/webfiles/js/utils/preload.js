function preload(status = true) {
    if (status){
        document.getElementById('preload-general').classList.add('show');
        return
    }
    document.getElementById('preload-general').classList.remove('show');
}