viewController.setObserver("chat-trip", () => {

    const cancelBtn = document.querySelector(".btn-cancel-audio-locked");
    const micBtn = document.querySelector("#captureAudio");

    if (!cancelBtn || !micBtn) return;

    cancelBtn.style.display = "none";

    micBtn.addEventListener("touchstart", () => {
        cancelBtn.style.display = "flex";
        cancelBtn.innerHTML = "arrow_back";
    });

    document.addEventListener("audioLocked", () => {
        cancelBtn.innerHTML = "delete";
        cancelBtn.style.display = "flex";
    });

    document.addEventListener("audioUnlocked", () => {
        cancelBtn.innerHTML = "arrow_back";
        cancelBtn.style.display = "none";   
    });

}); 