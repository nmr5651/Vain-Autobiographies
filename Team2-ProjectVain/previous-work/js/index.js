
 Vue.config.errorHandler = function (err, vm, info) {
  console.error("TRACE: "+err+"\nCOMPONENET: "+vm+" INFO: "+info);
}

// Testing purpose
var dbTable = new Vue({
  el: '.dbTable',
  data: {
    isHidden: false
  }
})

var loading = new Vue({
  el: '#LastAction',
  data: {
    message: 'Loading'
  }
})

// Search Book (My attempt to use Vue to open and display)
function searchBook() {
  // Display loading prior to the success/fail content
  dbTable;
  loading;

  // Vue & Node functionality here
}