function myFunction(x) {
    x.classList.toggle("change");
    toggleSidebar();
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

function showLocation() {
    var iframe = document.querySelector('.map iframe');
    var newSrc = "";
    newSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d444.9068246899738!2d14.1572471382899!3d57.78506481523093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465a6de9e8881983%3A0x38207fc20fae82a4!2sAkademien%20Nightclub!5e0!3m2!1sde!2sse!4v1709464210385!5m2!1sde!2sse";
    iframe.src = newSrc;
}