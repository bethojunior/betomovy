var preload = status => {
    if (status)
        return document.getElementById('preload-general').classList.add('show');

    document.getElementById('preload-general').classList.remove('show');
};
