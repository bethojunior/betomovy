document.addEventListener('DOMContentLoaded', function () {
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.sizes = '16x16';
    faviconLink.href = environment.hosts.hostImageDefault;

    const head = document.querySelector('head');
    head.appendChild(faviconLink);

    const titleHead = document.querySelector('#titleHead');
    const titleHeadTextSuffix = environment.hosts.hostSite;

    const match = titleHeadTextSuffix.match(/\/\/([^\.]+)\./);

    const siteName = match[1];

    const capitalizedText = siteName.charAt(0).toUpperCase() + siteName.slice(1);

    titleHead.innerHTML = 'Monitor - ' + capitalizedText;

});
