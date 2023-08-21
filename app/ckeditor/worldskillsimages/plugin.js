CKEDITOR.plugins.add('worldskillsimages', {
    init: function (editor) {

        // get the Angular injector.
        var injector = angular.element(document.body).injector();

        // get the services
        var auth = injector.get('auth');

        editor.on('fileUploadRequest', function(evt) {

            var fileLoader = evt.data.fileLoader,
                formData = new FormData(),
                xhr = fileLoader.xhr;

            xhr.open('POST', fileLoader.uploadUrl, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + auth.accessToken);
            formData.append('file', fileLoader.file, fileLoader.fileName);
            fileLoader.xhr.send(formData);

            // Prevented the default behavior.
            evt.stop();

        }, null, null, 4 );

        editor.on('fileUploadResponse', function(evt) {

            // Prevent the default response handler.
            evt.stop();

            // Get XHR and response.
            var data = evt.data,
                xhr = data.fileLoader.xhr,
                response = JSON.parse(xhr.responseText);

            if (typeof response.data !== 'undefined') {
                // An error occurred during upload.
                data.message = response.data.message;
                evt.cancel();
            } else {
                data.url = response.thumbnail + '_large';
            }
        } );

    }
});
