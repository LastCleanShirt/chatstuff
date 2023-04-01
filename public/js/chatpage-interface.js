var scrollable = document.getElementById("scrollable");
var isDragging = false;
var startX, startY;

scrollable.addEventListener("mousedown", function(e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

scrollable.addEventListener("mousemove", function(e) {
  if (isDragging) {
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    scrollable.scrollBy(-dx, -dy);
    startX = e.clientX;
    startY = e.clientY;
  }
});

scrollable.addEventListener("mouseup", function(e) {
  isDragging = false;
});

scrollable.addEventListener("mouseleave", function(e) {
  isDragging = false;
});
