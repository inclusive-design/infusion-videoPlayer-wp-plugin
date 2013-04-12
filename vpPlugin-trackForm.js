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
    /*************************************************************************************
     * Root component for rendering the form that collects information about a track.
     * This component is re-used for all three types of tracks: src, caption, transcript.
     */
    fluid.defaults("fluid.vpPlugin.trackForm", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "fluid.vpPlugin.trackForm.preInit",
        model: {
            format: "text/amarajson",
            url: "Enter a valid url",
            file: "pleaseSelect",
            lang: "pleaseSelect"
        },
        events: {
            onAddTrack: null,
            afterTrackAdded: null,
            invalidField: null
        },
        listeners: {
            onAddTrack: {
                listener: "fluid.vpPlugin.trackForm.addTrack",
                args: "{trackForm}"
            },
            invalidField: "fluid.vpPlugin.trackForm.highlightField",
            afterRender: "fluid.vpPlugin.trackForm.bindDOMEvents"
        },
        selectors: {
            add: ".vppc-trackForm-add",
            source: ".vppc-trackForm-source",
            title: ".vppc-trackForm-title",
            type: ".vppc-trackForm-type",
            typeRow: ".vppc-trackForm-typeRow",
            typeInput: ".vppc-trackForm-typeInput",
            typeLabel: ".vppc-trackForm-typeLabel",
            urlTitle: ".vppc-trackForm-urlSrcTitle",
            url: ".vppc-trackForm-url",
            fileTitle: ".vppc-trackForm-fileSrcTitle",
            fileLabel: ".vppc-trackForm-fileLabel",
            file: ".vppc-trackForm-filename",
            fileHelp: ".vppc-trackForm-filenameHelp",
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
            urlSrc: "vpp-trackForm-urlSrc",
            fileSrc: "vpp-trackForm-fileSrc",
            invalid: "vpp-trackForm-invalid"
        },
        repeatingSelectors: ["typeRow"],
        selectorsToIgnore: ["add", "source", "type", "cancel", "done", "fileHelp"],
        produceTree: "fluid.vpPlugin.trackForm.produceTree",
        rendererOptions: {
            autoBind: true
        },
        resources: {
            template: {
                forceCache: true,
                href: phpVars.pluginUrl + "/trackFormTemplate.html",
                fetchClass: "template"
            }
        },
        supportedValues: {
            languageNames: ["Arabic", "Czech", "Dutch", "English", "French", "German", "Greek", "Hindi", "Japanese", "Portuguese", "Punjabi", "Russian", "Mandarin", "Spanish", "Swedish"],
            languageCodes: ["ar", "cs", "nl", "en", "fr", "de", "el", "hi", "ja", "pt", "pa", "ru", "zh", "es", "sv"],
            types: ["text/amarajson", "JSONcc"],
            typeLabels: ["Amara", "JSON"]
        },
        invokers: {
            validateNewTrackList: {
                funcName: "fluid.vpPlugin.trackForm.validateNewTrackList",
                args: ["{trackForm}", "{arguments}.0", "{arguments}.1"]
            },
            injectPrompt: {
                funcName: "fluid.vpPlugin.trackForm.injectPrompt",
                args: ["{trackForm}", "{arguments}.0", "{arguments}.1"]
            }
        }
    });
    fluid.fetchResources.primeCacheFromResources("fluid.vpPlugin.trackForm");

    /**
     * Preface the dropdowns in the interface with the 'please select' prompts (if there is
     * data in the list), or with the 'no files available' string if not. This information is
     * not in the model of the list of available files, and so must be added to the drop-down
     * after it is populated from the model.
     * 
     * @param   that    the component
     * @param   data    either a  string pathname into the model, referencing the data in the model
     *                  OR an actual array of data
     * @param   name    either a  string pathname into the model, referencing the names in the model
     *                  OR an actual array of names
     */
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
            that.refreshView();
        }, {amalgamateClasses: ["template"]});        
    };

    fluid.vpPlugin.trackForm.bindDOMEvents = function (that) {
        that.locate("add").click(function () {
            that.locate("source").toggle();
        });
// TODO: This will have to be moved into trackList
        that.applier.guards.addListener(that.options.modelPath + ".tracks", that.validateNewTrackList);
        that.applier.modelChanged.addListener("format", function (newModel, oldModel, changeRequest) {
            if (!newModel.format) {
                return;
            }
            that.refreshView();
        });

        that.locate("cancel").click(function () {
            // TODO: clear the model here, so next form is empty??
            that.locate("source").hide();
        });

        that.locate("done").click(function () {
            // TODO: should clear the model here, so next form is empty
            that.events.onAddTrack.fire(that);
        });
        that.applier.modelChanged.addListener(that.options.modelPath + ".tracks", that.events.afterTrackAdded.fire);
        that.events.afterTrackAdded.addListener(function () {
            that.locate("source").hide();
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
                selectID: fluid.allocateGuid(),
                tree: {
                    selection: "${format}",
                    optionlist: that.options.supportedValues.types,
                    optionnames: that.options.supportedValues.typeLabels
                }
            }]
        };

        if (that.model.format === "text/amarajson" || !that.options.fileUrls) {
            tree.urlTitle = that.options.strings.urlTitle;
            tree.url = "${src}";
        } else {
            tree.fileTitle = that.options.strings.fileTitle;
            tree.fileLabel = that.options.strings.fileLabel;
            tree.file = {
                selection: "${src}",
                optionlist: that.options.fileUrls,
                optionnames:  that.options.fileNames
            };
        }

        if (that.options.supportedValues.languageCodes) {
            tree.langLabel = that.options.strings.langLabel;
            tree.lang = {
                selection: "${lang}",
                optionlist: that.options.supportedValues.languageCodes,
                optionnames: that.options.supportedValues.languageNames
            };
        }

        return tree;
    };

    /**
     * Retrieves the new track data from model tied to the form, builds a new track object and
     * adds it to the list of tracks.
     */
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

    /******
     * Form validation: Checks that the src field of the new entry is valid and that a language
     * has been selected. Fires events that are used to show or hide form validation feedback.
     * Returns boolean indicating validity of data.
     */
    fluid.vpPlugin.trackForm.validateNewTrackList = function (that, model, changeRequest) {
        var newList = changeRequest.value;
        if (newList.length === 0) {
            return true;
        }
        var newEntry = newList[newList.length - 1];
        var srcInvalid = (!newEntry.src || newEntry.src === "none");
        that.events.invalidField.fire(that.locate("url"), that.options.styles.invalid, srcInvalid);
        that.events.invalidField.fire(that.locate("file"), that.options.styles.invalid, srcInvalid);

        var langInvalid = (newEntry.srclang === "");
        that.events.invalidField.fire(that.locate("lang"), that.options.styles.invalid, langInvalid);

        return (!srcInvalid && !langInvalid);
    };
    
    /**
     * Add or remove a CSS class to the specified field based on a flag.
     * 
     * @param {Object} field        jQuery object for the field to hightlight
     * @param {Object} className    the string classname to use for the highlight
     * @param {Object} flag         a boolean indicating whether or not the field should be highlighted
     *                              If false, the hightlight style will be removed
     */
    fluid.vpPlugin.trackForm.highlightField = function (field, className, flag) {
        field.toggleClass(className, flag);
    };

})(jQuery);
