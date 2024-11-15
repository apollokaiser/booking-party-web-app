var modeToggle = document.getElementById('modeToggle');
  modeToggle.addEventListener('change', function() {
  document.body.classList.toggle('dark-mode');
  if(document.querySelector('#mode__Light').innerHTML =="Light Mode") {
    document.querySelector('#mode__Light').innerHTML ="Dark Mode";
  } else {
    document.querySelector('#mode__Light').innerHTML ="Light Mode";
  }
});