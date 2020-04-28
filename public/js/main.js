var app = app || {};

app = {
  'data': {

  },

  init: function(){

  },

  ajax: function(url, data, dataType, callback, errorCallback){
    var promise = $.ajax({
      'url' : url,
      'data' : data,
      'dataType': dataType,
      'method': 'POST'
    })

    .done(function(data, textStatus, jqXHR){
      callback(data);
    })

    .fail(function(promise, textStatus, errorThrown){
      console.error('AJAX: ' + errorThrown + ': ' + url, promise);

      // DON'T STOP PROCESSING JUST BECAUSE THERE WAS AN ERROR!!!
      if(errorCallback){
        errorCallback(data);
      }
    })

    .always(function(){

    });
  }
}

$(document).ready(function(){
  app.init();
});