function myFunction(x) {
    x.classList.toggle("change");
    toggleSidebar();
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}