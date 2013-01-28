/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid, phpVars*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var infusion_vp = infusion_vp || {};

(function ($) {

    $("document").ready(function () {
        $.ajax(phpVars.pluginUrl + "/uioFatPanelTemplate.html", {
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                $("body").prepend(data);

                fluid.pageEnhancer({
                    tocTemplate: phpVars.pluginUrl + "/lib/videoPlayer/lib/infusion/components/tableOfContents/html/TableOfContents.html"
                });

                fluid.uiOptions.fatPanel(".flc-uiOptions-fatPanel", {
                    prefix: phpVars.pluginUrl + "/lib/videoPlayer/lib/infusion/components/uiOptions/html/"
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });

    });
})(jQuery);
