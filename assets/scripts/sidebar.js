/*
*   @Params: isActive - a bool for if sidebar is active.
*   @Description: A simple function used to change the visibility of the
* */
function handleSidebarVisibility(isActive) {
    if(isActive) {
        $("#sidebarBackdrop").css("display", "block");
    }
    else {
        $("#sidebarBackdrop").css("display", "none");
    }
}

$(document).ready(function() {

    // Default hide sidebar
    handleSidebarVisibility(false);

    // Unhide sidebar
    $("#sidebarOpen").click(function() {
        handleSidebarVisibility(true);
    });

    // Hide sidebar
    $("#sidebarClose").click(function() {
        handleSidebarVisibility(false);
    });
});