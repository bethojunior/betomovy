function layoutBuild(views, js = [], css = []) {

    css.map(item => {
        Route.importStyleByName(item);
    });

    views.map((view, index) => {
        document.body.innerHTML += `<div id="includeContainer${index}"></div>`;
        renderView(view, index);
    });

    const progressJs = new Progress()
    progressJs.progressTime(300, function () {
        js.map(item => {
            Route.importScriptByName(item);
        });
        progressJs.stopProgress();
    }, 300)
}

function renderView(view, id) {

    $("#includeContainer" + id).load(`views/${view}.html`, function (response) {
        document.getElementById("includeContainer" + id).innerHTML = response;
    });
}