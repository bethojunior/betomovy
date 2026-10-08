$(document).ready(function () {
    const STORAGE_KEY = "@movy:enabled_languages";

    // Carregar configurações salvas
    function loadSettings() {
        let configs = [
            { code: "en", enabled: true },
            { code: "pt", enabled: false },
            { code: "es", enabled: false },
            { code: "fr", enabled: false }
        ];

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                configs = JSON.parse(saved);
            }
        } catch (e) {
            console.error("Erro ao ler configurações:", e);
        }

        configs.forEach(function (lang) {
            const checkbox = $("#lang_" + lang.code);
            if (checkbox.length) {
                checkbox.prop("checked", lang.enabled);
                updateBadge(lang.code, lang.enabled);
            }
        });
    }

    function updateBadge(code, isChecked) {
        const badge = $("#badge_" + code);
        if (badge.length) {
            if (isChecked) {
                badge.text("ATIVO").css({
                    "background": "#dcfce7",
                    "color": "#15803d"
                });
            } else {
                badge.text("DESATIVADO").css({
                    "background": "#f1f5f9",
                    "color": "#64748b"
                });
            }
        }
    }

    // Ouvintes nos switches
    $("input[type='checkbox']").on("change", function () {
        const id = $(this).attr("id");
        if (id && id.startsWith("lang_")) {
            const code = id.replace("lang_", "");
            // Garantir que pelo menos o inglês (US) permaneça ativo
            if (code === "en" && !$(this).is(":checked")) {
                alert("O idioma Inglês (Estados Unidos) deve permanecer ativo como idioma padrão.");
                $(this).prop("checked", true);
                return;
            }
            updateBadge(code, $(this).is(":checked"));
        }
    });

    // Salvar
    $("#btnSaveLanguages").on("click", function () {
        const configs = [
            { code: "en", name: "English (United States)", country: "US", flag: "🇺🇸", enabled: $("#lang_en").is(":checked") },
            { code: "pt", name: "Português (Brasil)", country: "BR", flag: "🇧🇷", enabled: $("#lang_pt").is(":checked") },
            { code: "es", name: "Español", country: "ES", flag: "🇪🇸", enabled: $("#lang_es").is(":checked") },
            { code: "fr", name: "Français", country: "FR", flag: "🇫🇷", enabled: $("#lang_fr").is(":checked") }
        ];

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
            
            if (typeof swal !== "undefined") {
                swal("Sucesso!", "Configurações de idiomas atualizadas com sucesso!", "success");
            } else {
                alert("Configurações de idiomas atualizadas com sucesso!");
            }
        } catch (e) {
            console.error("Erro ao salvar:", e);
            alert("Erro ao salvar configurações.");
        }
    });

    loadSettings();
});
