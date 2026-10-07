function progress() {
    postMessage({});
    setTimeout(progress, 5000);
}

progress();