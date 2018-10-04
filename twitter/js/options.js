$(window).load(function(){
  var openas = localStorage.getItem('openas');
  if(!openas) openas = "popup";
  document.getElementById("openas").value = openas;
});

$(document).on('change', "select", function() {
  var openas = document.getElementById("openas").value;
  localStorage.setItem('openas', openas);
  var status = document.getElementById('status');
  status.textContent = 'Option saved.';
  setTimeout(function() { status.textContent = ''; }, 750);
});
