function preload(isActive) {
    if (isActive)
        return viewController.elementProperty.addClass(".container-preload-main", "active");
    viewController.elementProperty.removeClass(".container-preload-main", "active")
}