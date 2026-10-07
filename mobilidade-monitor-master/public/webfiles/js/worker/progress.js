function progress() {
    postMessage({});
    setTimeout(progress, 1000);
}

progress();