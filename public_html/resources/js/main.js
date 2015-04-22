window.addEventListener('resize', function(e) {
    var el = document.getElementById('v');
    el.style.width = (Math.random() * (100 - 300) + 100) + 'px';
    console.log(e);
});
