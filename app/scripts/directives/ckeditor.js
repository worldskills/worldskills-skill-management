(function () {
    'use strict';

    CKEDITOR.disableAutoInline = true;

    CKEDITOR.plugins.addExternal('worldskillsimages', '/ckeditor/worldskillsimages/', 'plugin.js');

    CKEDITOR.stylesSet.add('worldskillsstyles', [
        { name: 'Green Background', element: 'tr', attributes: { 'class': 'green-background' } },
        { name: 'Bordered Table', element: 'table', attributes: { 'class': 'table-bordered' } }
    ]);

    angular.module('skillMgmtApp').directive('ckEditor', function(WORLDSKILLS_API_IMAGES) {
        return {
            require: '?ngModel',
            link: function ($scope, elm, attr, ngModel) {

                var isReady = false;
                var data = [];
                var options = {
                    height: 400,
                    contentsCss: 'ckeditor/contents.css',
                    removePlugins : 'elementspath,specialchar,image',
                    removeButtons : 'Underline',
                    extraPlugins : 'worldskillsimages,uploadimage,image2',
                    filebrowserUploadUrl: WORLDSKILLS_API_IMAGES,
                    uploadUrl: WORLDSKILLS_API_IMAGES,
                    toolbarGroups : [
                        {name : 'basicstyles', groups : [ 'basicstyles', 'cleanup' ]},
                        {name : 'paragraph',   groups: [ 'list', 'indent' ] },
                        {name : 'styles'},
                        {name : 'links' },
                        {name : 'insert'},
                        {name : 'tools'},
                        {name : 'document', groups : [ 'mode' ]}
                    ],
                    clipboard_handleImages: false,
                    image2_prefillDimensions: false,
                    uiColor: '#e8e8e8',
                    stylesSet: 'worldskillsstyles',
                    disallowedContent: '*{*}'
                };
                var ck = CKEDITOR.replace(elm[0], options);

                function setData() {
                    if (!data.length) {
                        return;
                    }

                    var d = data.splice(0, 1);
                    ck.setData(d[0] || '<span></span>', function () {
                        setData();
                        isReady = true;
                    });
                }

                ck.on('instanceReady', function (e) {
                    if (ngModel) {
                        setData();
                    }
                });
                
                elm.bind('$destroy', function () {
                    ck.destroy(false);
                });

                if (ngModel) {
                    ck.on('change', function () {
                        $scope.$apply(function () {
                            var data = ck.getData();
                            if (data == '<span></span>') {
                                data = null;
                            }
                            ngModel.$setViewValue(data);
                        });
                    });

                    ngModel.$render = function (value) {
                        if (ngModel.$viewValue === undefined) {
                            ngModel.$setViewValue(null);
                            ngModel.$viewValue = null;
                        }

                        data.push(ngModel.$viewValue);

                        if (isReady) {
                            isReady = false;
                            setData();
                        }
                    };
                }
            }
        };
    });

})();
