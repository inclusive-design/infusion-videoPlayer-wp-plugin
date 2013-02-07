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

    fluid.registerNamespace("fluid.vpPlugin");

    fluid.defaults("fluid.vpPlugin.UIOAnnouncer", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        events: {
            UIOReady: null
        }
    });

    if (!fluid.staticEnvironment.UIOAnnouncer) {
        fluid.merge(null, fluid.staticEnvironment, {UIOAnnouncer: fluid.vpPlugin.UIOAnnouncer()});
    }

    $("document").ready(function () {
        fluid.vpPlugin.initUIO = function () {
            fluid.pageEnhancer({
                tocTemplate: phpVars.pluginUrl + "/lib/videoPlayer/lib/infusion/components/tableOfContents/html/TableOfContents.html"
            });

            var opts = {
                prefix: phpVars.pluginUrl + "/lib/videoPlayer/lib/infusion/components/uiOptions/html/",
                components: {
                    relay: {
                        type: "fluid.videoPlayer.relay"
                    }
                },
                templateLoader: {
                    options: {
                        templates: {
                            mediaControls: phpVars.pluginUrl + "/lib/videoPlayer/html/UIOptionsTemplate-media.html"
                        }
                    }
                }
            };
            if (phpVars.showText) {
              // Custom strings for slidingPanel button are specified through the plugin admin panel
                opts.slidingPanel = {
                    options: {
                        strings: {
                            showText: phpVars.showText,
                            hideText: phpVars.hideText
                        }
                    }
                };
            }

            var uiOptions = fluid.uiOptions.fatPanel.withMediaPanel(".flc-uiOptions-fatPanel", opts);
            fluid.merge(null, fluid.staticEnvironment, {uiOpionsInstance: uiOptions});
            fluid.staticEnvironment.UIOAnnouncer.events.UIOReady.fire();
        };

        if ($(".flc-uiOptions-fatPanel").length > 0) {
            // document already has UIO markup in it, we don't need to load a template
            fluid.vpPlugin.initUIO();
        } else {
            $.ajax(phpVars.pluginUrl + "/uioFatPanelTemplate.html", {
                type: "GET",
                success: function (data, textStatus, jqXHR) {
                    $("body").prepend(data);
                    fluid.vpPlugin.initUIO();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
    });
})(jQuery);
