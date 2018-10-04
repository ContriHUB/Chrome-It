function saveOptions() {
    chrome.storage.sync.set({
        difficulty: $("#difficulty_select").val()
    }, function() {
        $("#options_modal").show();
    });
}

function loadOptions() {
    chrome.storage.sync.get("difficulty", function (settings) {
        // If the difficulty is not yet set, set it to difficult
        if (!settings.difficulty) {
            chrome.storage.sync.set({
                difficulty: "difficult"
            });
            settings.difficulty = "difficult";
        }
        $("#difficulty_select").val(settings.difficulty);
    });
}

// Run on eval
loadOptions();

$("#btn_options_return").on('click',  function() {
    $("#options_modal").hide();
    document.location.href = "popup.html";
});

$("#btn_options_stay").on('click', function() {
    $("#options_modal").hide();
});

$("#options_save").on('click', saveOptions);

$("#btn_options_back").on('click', function() {
    document.location.href = "popup.html";
});