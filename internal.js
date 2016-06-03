var visibilityChanger = function(element_id) {
  return function(visible) {
    document.getElementById(element_id).style.display = visible ? 'block' : 'none';
  }
}

var showLoadingIndicator = visibilityChanger("running")
var showOpenButton = visibilityChanger("tab_open_pdf")

var appendOutput = function(msg) {
  var content = document.getElementById("output").textContent;

  var output = document.getElementById("output");
  output.textContent = content + "\r\n" + msg;

  output.scrollTop = 999999;
  console.log(msg);
}

var pdf_dataurl = undefined;
var compile = function(source_code) {
  document.getElementById("output").textContent = "";
  showLoadingIndicator(true);
  window.location.href = "#running";

  var pdftex = new PDFTeX();
  pdftex.set_TOTAL_MEMORY(80*1024*1024).then(function() {
    pdftex.FS_createLazyFile('/', 'snowden.jpg', 'snowden.jpg', true, true);

    pdftex.on_stdout = appendOutput;
    pdftex.on_stderr = appendOutput;

    var start_time = new Date().getTime();

    pdftex.compile(source_code).then(function(pdf_dataurl) {
      var end_time = new Date().getTime();
      console.info("Execution time: " + (end_time-start_time)/1000+' sec');

      showLoadingIndicator(false);

      if(pdf_dataurl === false)
        return;
      showOpenButton(true);
      window.location.href = "#open_pdf";
      document.getElementById("open_pdf_btn").focus();
    });
  });
}

document.getElementById("compile").addEventListener("click", function(e) {
  var source_code = document.getElementById("input").value;
  compile(source_code);
});

document.getElementById("open_pdf_btn").addEventListener("click", function(e) {
  window.open(pdf_dataurl);
  e.preventDefault();
});

var pdftex_preload = new PDFTeX("pdftex-worker.js");
pdftex_preload = undefined;
