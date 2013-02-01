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
    
    /**************************************************************************************
     * Track List subcomponent
     **************************************************************************************/
    fluid.defaults("infusion_vp.videoPlayerPlugin.trackList", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        renderOnInit: true,
        rendererOptions: {
//debugMode: true,
            autoBind: true
        },

        model: {
            tracks: [], // actual list of track data adde by user
            src: "", // url or filename
            type: "", // format
            srclang: "", // language
            label: "", // ??
        },

        events: {
            onDeleteRow: null,
        },
        
        listeners: {
            afterRender: {
                listener: "infusion_vp.videoPlayerPlugin.trackList.bindDOMEvents",
                args: ["{trackList}"]
            }
        },

        selectors: {
            // list of tracks
            trackList: ".infvpc-trackList",
            trackRow: ".infvpc-trackList-trackRow",
            trackDelete: ".infvpc-trackList-trackDelete",
            trackSrc: ".infvpc-trackList-trackSrc",
            trackLang: ".infvpc-trackList-trackLang",
            trackFormat: ".infvpc-trackList-trackFormat",

            // track format selection radio buttons
            formatRow: ".infvpc-trackList-formatRow",
            formatLabel: ".infvpc-trackList-formatLabel",
            formatInput: "#infvpc-trackList-formatInput",

            // type-specific forms
            formatForm: ".infvpc-trackList-formatform",

            // track specifics
            srcInputUrl: ".infvpc-trackList-srcInputUrl",
            srcInputFile: ".infvpc-trackList-srcInputFile",
            srcLangInput: ".infvpc-trackList-srcLangInput",

            // buttons
            addTrack: ".infvpc-trackList-addTrack"
        },
        repeatingSelectors: ["formatRow", "trackRow"],
        selectorsToIgnore: ["trackList", "formatForm", "addTrack"],

        styles: {},

        preInitFunction:  "infusion_vp.videoPlayerPlugin.trackList.preInit",
        produceTree: "infusion_vp.videoPlayerPlugin.trackList.produceTree"

        // options that will need to be provided or overridden by parent component:
        // supportedValues: {
            // languageCodes
            // languageLabels
            // types
            // typeLabels
        // }
        // styles: one per supported type, key must equal type value
        // styles: {
            // urlForm: "infvp-trackList-urlForm",
            // uploadedFileForm: "infvp-trackList-uploadedFileForm"
        // },

    });

    infusion_vp.videoPlayerPlugin.trackList.preInit = function (that) {
        that.model.type = that.options.supportedValues.types[0];
        // need to also fill in any vars from the PHP data - how to know which ones?
    };

    infusion_vp.videoPlayerPlugin.trackList.addTrackToList = function (that, modelPathsToReset) {
        var trackList = fluid.copy(that.model.tracks);
        trackList.push({
            lang: that.model.srclang,
            langLabel: $("option:selected", that.locate("srcLangInput")).text().trim(),
            format: that.model.type,
            src: that.model.src
        });
        that.applier.requestChange("tracks", trackList);

        // reset the form
        fluid.each(modelPathsToReset, function (value, key) {
            that.applier.requestChange(key, value);
        });

        // redraw the interface
        that.refreshView();
    };

    infusion_vp.videoPlayerPlugin.trackList.bindDOMEvents = function (that) {
        that.applier.modelChanged.addListener("type", function (model, oldModel, changeRequest) {
            that.locate("formatForm").removeClass(that.options.styles[oldModel.type]).addClass(that.options.styles[model.type]);
        });

        that.locate("addTrack").click(function () {
            infusion_vp.videoPlayerPlugin.trackList.addTrackToList(that, {
                src: "",
                type: that.options.supportedValues.types[0],
                srclang: that.options.supportedValues.languageCodes[0],
                label: "this is the label" // what the heck is this??
            });
        });

        that.locate("trackDelete").click(function (evt) {
            var row = $(evt.target).parents(that.options.selectors.trackRow);
            var rowUrl = that.locate("trackSrc", row).text();


            // TODO: Maybe the right solution is to render the delete button and
            // attach a handler as part of the rendering process?

        });
    };

    infusion_vp.videoPlayerPlugin.trackList.produceTree = function (that) {
        var tree = {
            srcInputUrl: "${src}", // used for Amara url
            srcInputFile: { // used for uploaded file name
                selection: "${src}",
                optionlist: ["file1", "file2"],
                optionnames: ["File 1 Name", "File 2 Name"]
            },
            srcLangInput: {
                selection: "${srclang}",
                optionlist: that.options.supportedValues.languageCodes,
                optionnames: that.options.supportedValues.languageNames
            },
            expander: [{
                type: "fluid.renderer.selection.inputs", // format selector radio buttons
                rowID: "formatRow",
                labelID: "formatLabel",
                inputID: "formatInput",
                selectID: "format",
                tree: {
                    selection: "${type}",
                    optionlist: that.options.supportedValues.types,
                    optionnames: that.options.supportedValues.typeLabels
                }
            }, {
                type: "fluid.renderer.repeat", // list of tracks
                repeatID: "trackRow",
                controlledBy: "tracks",
                pathAs: "track",
                tree: {
                    trackDelete: {
                        decorators: [{
                             type: "fluid",
                             func: "infusion_vp.videoPlayerPlugin.trackList.deleteButton",
                             options: {
                                 idPrefix:  "${{track}}",
                                 listeners: {
                                     onDeleteRow: that.events.onDeleteRow.fire
                                 }
                             }
                         }]
                    },
                    trackSrc: "${{track}.src}",
                    trackLang: "${{track}.langLabel}",
                    trackFormat: "${{track}.format}"
                }
            }]
        };
        return tree;
    };

    infusion_vp.videoPlayerPlugin.trackList.deleteRow = function (that, rowIndex) {
        var newList = fluid.copy(that.model.tracks);
        newList.splice(rowIndex, 1);
        that.applier.requestChange("tracks", newList);
        that.refreshView();
    };

    /********************************************
     * Decorator for delete button
     * Adds index information and click handling
     ********************************************/
    fluid.defaults("infusion_vp.videoPlayerPlugin.trackList.deleteButton", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "infusion_vp.videoPlayerPlugin.trackList.deleteButton.finalInit",
        events: {
            onDeleteRow: null
        }
    });

    infusion_vp.videoPlayerPlugin.trackList.deleteButton.finalInit = function (that) {
        that.container.attr("value", that.options.idPrefix.substring(that.options.idPrefix.length-1));
        that.container.click(function (evt) {
            that.events.onDeleteRow.fire($(evt.target).attr("value"));
        });
    };

})(jQuery);
