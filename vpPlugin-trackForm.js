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
    fluid.defaults("fluid.vpPlugin.trackForm", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "fluid.vpPlugin.trackForm.preInit",
        finalInitFunction: "fluid.vpPlugin.trackForm.finalInit",
        mergePolicy: {
            selectors: "replace"
        },
        model: {
            mediaType: {
                url: "test url",
                file: "pleaseSelect",
                lang: "pleaseSelect"
            }
        },
        events: {
            onAddTrack: null,
            afterTrackAdded: null
        },
        listeners: {
            onAddTrack: {
                listener: "fluid.vpPlugin.trackForm.addTrack",
                args: "{trackForm}"
            }
        },
        selectors: {
            add: ".vppc-trackForm-add",
            source: ".vppc-trackForm-source",
            title: ".vppc-trackForm-title",
            type: ".vppc-trackForm-type",
            typeRow: ".vppc-trackForm-typeRow",
            typeInput: ".vppc-trackForm-typeInput   ",
            typeLabel: ".vppc-trackForm-typeLabel",
            urlTitle: ".vppc-trackForm-urlSrcTitle",
            url: ".vppc-trackForm-url",
            fileTitle: ".vppc-trackForm-fileSrcTitle",
            fileLabel: ".vppc-trackForm-fileLabel",
            file: ".vppc-trackForm-filename",
            langLabel: ".vppc-trackForm-langLabel",
            lang: ".vppc-trackForm-lang",
            cancel: ".vppc-trackForm-cancel",
            done: ".vppc-trackForm-done"
        },
        strings: {
            urlTitle: "Add Amara File",
            fileTitle: "Add File",
            fileLabel: "Choose File:",
            langLabel: "Language:",
            pleaseSelect: "Please select...",
            none: "No files yet"
        },
        styles: {
            amara: "vpp-trackForm-urlSrc",
            nonAmara: "vpp-trackForm-fileSrc"
        },
        repeatingSelectors: ["typeRow"],
        selectorsToIgnore: ["add", "source", "type", "cancel", "done"],
        produceTree: "fluid.vpPlugin.trackForm.produceTree",
        rendererOptions: {
//            debugMode: true,
            autoBind: true
        },
        resources: {
            template: {
                forceCache: true,
                href: phpVars.pluginUrl + "/trackFormTemplate.html",
                fetchClass: "template"
            }
        },
        modelPath: "mediaType",
        supportedValues: {
            languageCodes: ["en", "fr", "es"],
            languageNames: ["English", "French", "Spanish"],
            types: ["text/amarajson", "JSONcc"],
            typeLabels: ["Amara", "JSON"]
        },
        stylesForTypes: {
            "text/amarajson": "amara",
            "JSONcc": "nonAmara"
        },
        invokers: {
            addUploadedFiles: {
                funcName: "fluid.vpPlugin.trackForm.addUploadedFiles",
                args: ["{trackForm}"]
            },
            addFileSubtree: "fluid.vpPlugin.trackForm.addFileSubtree",
            addLangSubtree: "fluid.vpPlugin.trackForm.addLangSubtree",
            validateNewTrackList: "fluid.vpPlugin.trackForm.validateNewTrackList",
            injectPrompt: {
                funcName: "fluid.vpPlugin.trackForm.injectPrompt",
                args: ["{trackForm}", "{arguments}.0", "{arguments}.1"]
            }
        }
    });
    fluid.fetchResources.primeCacheFromResources("fluid.vpPlugin.trackForm");

    fluid.vpPlugin.trackForm.injectPrompt = function (that, data, name) {
        var dataArray = typeof data === "string" ? that.model[that.options.modelPath][data] : data;
        var namesArray = typeof name === "string" ? that.model[that.options.modelPath][name] : name;

        if (dataArray.length > 0) {
            dataArray.splice(0, 0, "pleaseSelect");
            namesArray.splice(0, 0, that.options.strings.pleaseSelect);
        } else {
            dataArray.splice(0, 0, "none");
            namesArray.splice(0, 0, that.options.strings.none);
        }
    };

    fluid.vpPlugin.trackForm.preInit = function (that) {
        fluid.fetchResources({}, function (resourceSpec) {
            that.resetForm();
        }, {amalgamateClasses: ["template"]});        
    };

    fluid.vpPlugin.trackForm.finalInit = function (that) {
        // add list of uploaded files to model
        that.addUploadedFiles();

        // add Please Select to dropdowns
        that.injectPrompt("fileUrls", "fileNames");
        that.injectPrompt(that.options.supportedValues.languageCodes, that.options.supportedValues.languageNames);

        that.resetForm = function () {
            fluid.each(that.model[that.options.modelPath].fields, function (entry) {
                that.applier.requestChange(that.options.modelPath + "." + entry, "");
            });
            that.refreshView();
            that.locate("type").hide();
            that.locate("source").hide();
        };

        that.events.afterRender.addListener(fluid.vpPlugin.trackForm.bindDOMEvents);
        that.applier.guards.addListener(that.options.modelPath + ".tracks", that.validateNewTrackList);
    };

    fluid.vpPlugin.trackForm.bindDOMEvents = function (that) {
        that.locate("add").click(function () {
            that.locate("type").toggle();
            that.locate("source").hide();
        });
        that.applier.modelChanged.addListener(that.options.modelPath + ".type", function (newModel, oldModel, changeRequest) {
            if (!newModel[that.options.modelPath].type) {
                return;
            }
            that.locate("type").hide();
            var sourceForm = that.locate("source");
            fluid.each(that.options.stylesForTypes, function (value, key) {
                sourceForm.removeClass(that.options.styles[value]);
            });
            sourceForm.addClass(that.options.styles[that.options.stylesForTypes[newModel[that.options.modelPath].type]]);
            sourceForm.show();
        });

        that.locate("cancel").click(function () {
            that.resetForm();
        });

        that.locate("done").click(function () {
            that.events.onAddTrack.fire(that);
        });
        that.applier.modelChanged.addListener(that.options.modelPath + ".tracks", that.events.afterTrackAdded.fire);
        that.events.afterTrackAdded.addListener(function () {
            that.resetForm();
        });
    };

    fluid.vpPlugin.trackForm.produceTree = function (that) {
        var tree = {
            title: that.options.strings.title,
            expander: [{
                type: "fluid.renderer.selection.inputs",
                rowID: "typeRow",
                labelID: "typeLabel",
                inputID: "typeInput",
                selectID: that.options.modelPath + "Type",
                tree: {
                    selection: "${" + that.options.modelPath + ".type}",
                    optionlist: that.options.supportedValues.types,
                    optionnames: that.options.supportedValues.typeLabels
                }
            }],
            urlTitle: that.options.strings.urlTitle,
            url: "${" + that.options.modelPath + ".src}"
        };

        that.addFileSubtree(that, tree);
        that.addLangSubtree(that, tree);
        return tree;
    };

    fluid.vpPlugin.trackForm.addTrack = function (that) {
        var media = that.model[that.options.modelPath];
        media.langLabel = $("option:selected", that.locate("lang")).text().trim();
        var trackList = fluid.copy(media.tracks);
        var newEntry = {};
        fluid.each(media.fields, function (entry) {
            newEntry[entry] = media[entry];
        });
        trackList.push(newEntry);
        that.applier.requestChange(that.options.modelPath + ".tracks", trackList);
    };

    fluid.vpPlugin.trackForm.addUploadedFiles = function (that) {
        that.applier.requestChange(that.options.modelPath + ".fileUrls", phpVars[that.options.modelPath].fileUrls);
        that.applier.requestChange(that.options.modelPath + ".fileNames", phpVars[that.options.modelPath].fileNames);
    };

    fluid.vpPlugin.trackForm.addFileSubtree = function (that, tree) {
        tree.fileTitle = that.options.strings.fileTitle;
        tree.fileLabel = that.options.strings.fileLabel;
        tree.file = {
            selection: "${" + that.options.modelPath + ".src}",
            optionlist: "${" + that.options.modelPath + ".fileUrls}",
            optionnames:  "${" + that.options.modelPath + ".fileNames}"
        };
    };

    fluid.vpPlugin.trackForm.addLangSubtree = function (that, tree) {
        tree.langLabel = that.options.strings.langLabel;
        tree.lang = {
            selection: "${" + that.options.modelPath + ".srclang}",
            optionlist: that.options.supportedValues.languageCodes,
            optionnames: that.options.supportedValues.languageNames
        };
    };

    /******
     * Form validation. These functions should fire events an event, and the event should
     * trigger a class change on the relevant fields to add an 'invalid' indication.
     */
    fluid.vpPlugin.trackForm.validateNewTrackList = function (model, changeRequest) {
        var newList = changeRequest.value;
        if (newList.length === 0) {
            return true;
        }
        var newEntry = newList[newList.length - 1];
        if (!newEntry.src || newEntry.src === "none") {
            console.log("sorry, you need to specify an valid entry for this");
            return false;
        }
        if (newEntry.srclang === "") {
            console.log("sorry, you need to choose a language");
            return false;
        }
    };

})(jQuery);
