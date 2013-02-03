/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, phpVars*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid = fluid || {};

(function ($) {
    /**************************************************************
     * 
     */
    fluid.defaults("fluid.vpPlugin.trackList", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "fluid.vpPlugin.trackList.preInit",
        finalInitFunction: "fluid.vpPlugin.trackList.finalInit",
        mergePolicy: {
            selectors: "replace"
        },
        model: {
            mediaType: {
                tracks: []
            }
        },
        events: {
            onDeleteRow: null
        },
        listeners: {
            onDeleteRow: {
                listener: "fluid.vpPlugin.trackList.deleteRow",
                args: ["{trackList}", "{arguments}.0"]
            }
        },
        selectors: {
            row: ".vppc-trackList-trackRow",
            deleteButton: ".vppc-trackList-trackDelete",
            src: ".vppc-trackList-trackSrc",
            langLabel: ".vppc-trackList-trackLang",
            type: ".vppc-trackList-trackType"
        },
        repeatingSelectors: ["row"],
        selectorsToIgnore: [],
        produceTree: "fluid.vpPlugin.trackList.produceTree",
        rendererOptions: {
//            debugMode: true,
            autoBind: true
        },
        resources: {
            template: {
                forceCache: true,
                href: phpVars.pluginUrl + "/trackListTemplate.html",
                fetchClass: "template"
            }
        },
        modelPath: "mediaType"
    });
    fluid.fetchResources.primeCacheFromResources("fluid.vpPlugin.trackList");

    fluid.vpPlugin.trackList.preInit = function (that) {
        fluid.fetchResources({}, function (resourceSpec) {
            that.refreshView();
        }, {amalgamateClasses: ["template"]});        
    };

    fluid.vpPlugin.trackList.finalInit = function (that) {
        that.applier.modelChanged.addListener(that.options.modelPath + ".tracks", that.refreshView);
    };

    fluid.vpPlugin.trackList.deleteRow = function (that, index) {
        var newList = fluid.copy(that.model[that.options.modelPath].tracks);
        newList.splice(index, 1);
        that.applier.requestChange(that.options.modelPath + ".tracks", newList);
    };

    fluid.vpPlugin.trackList.produceTree = function (that) {
        var listExpander = {
            type: "fluid.renderer.repeat",
            repeatID: "row",
            controlledBy: that.options.modelPath + ".tracks",
            pathAs: "track",
            tree: {
                deleteButton: {
                    decorators: [{
                        type: "fluid",
                        func: "fluid.vpPlugin.trackList.deleteButton",
                        options: {
                            idPrefix:  "${{track}}",
                            listeners: {
                                onDeleteRow: that.events.onDeleteRow.fire
                            }
                        }
                    }]
                }
            }
        };
        // Only render columns for fields in the model
        fluid.each(that.model[that.options.modelPath].fields, function (entry) {
            listExpander.tree[entry] = "${{track}." + entry + "}";
        });
        var tree = {
            expander: [listExpander]
        };
        return tree;
    };

    /********************************************
     * Decorator for delete button
     * Adds index information and click handling
     ********************************************/
    fluid.defaults("fluid.vpPlugin.trackList.deleteButton", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "fluid.vpPlugin.trackList.deleteButton.finalInit",
        events: {
            onDeleteRow: null
        }
    });

    fluid.vpPlugin.trackList.deleteButton.finalInit = function (that) {
        that.container.attr("value", that.options.idPrefix.substring(that.options.idPrefix.length - 1));
        that.container.click(function (evt) {
            that.events.onDeleteRow.fire($(evt.target).attr("value"));
        });
    };

})(jQuery);
