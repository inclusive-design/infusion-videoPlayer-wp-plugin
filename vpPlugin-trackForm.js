/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global fluid, jQuery, vpPluginPHPvars*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    /*************************************************************************************
     * Root component for rendering the form that collects information about a track.
     * This component is re-used for all three types of tracks: src, caption, transcript.
     */
    fluid.defaults("fluid.vpPlugin.trackForm", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "fluid.vpPlugin.trackForm.preInit",
        model: {
            type: "text/amarajson",
            src: null,
            srclang: "none"
        },
        events: {
            onAddTrack: "preventable",
            afterTrackAdded: null,
            invalidField: null
        },
        listeners: {
            onAddTrack: {
                listener: "fluid.vpPlugin.trackForm.validateForm",
                args: "{trackForm}",
                priority: "first"
            },
            afterTrackAdded: {
                listener: "fluid.vpPlugin.trackForm.resetForm",
                args: "{trackForm}"
            },
            invalidField: "fluid.vpPlugin.trackForm.highlightField",
            afterRender: "fluid.vpPlugin.trackForm.bindEventHandlers",
            onCreate: "fluid.vpPlugin.trackForm.hideForm"

        },
        selectors: {
            add: ".vppc-trackForm-add",
            source: ".vppc-trackForm-source",
            title: ".vppc-trackForm-title",
            type: ".vppc-trackForm-type",
            typeRow: ".vppc-trackForm-typeRow",
            typeInput: ".vppc-trackForm-typeInput",
            typeLabel: ".vppc-trackForm-typeLabel",
            typeSelect: ".vppc-trackForm-typeSelect",
            urlTitle: ".vppc-trackForm-urlSrcTitle",
            urlLabel: ".vpcc-trackForm-urlLabel",
            url: ".vppc-trackForm-url",
            urlHelp: ".vpcc-trackForm-urlHelp",
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
            urlHelp: "Enter a valid URL",
            fileTitle: "Add File",
            fileLabel: "Choose File:",
            langLabel: "Language:",
            none: "No files yet",
            fileHelp: "Files must first be uploaded to the Media Library"
        },
        styles: {
            urlSrc: "vpp-trackForm-urlSrc",
            fileSrc: "vpp-trackForm-fileSrc",
            invalid: "vpp-trackForm-invalid"
        },
        repeatingSelectors: ["typeRow"],
        selectorsToIgnore: ["add", "source", "type", "cancel", "done"],
        produceTree: "fluid.vpPlugin.trackForm.produceTree",
        resources: {
            template: {
                forceCache: true,
                href: vpPluginPHPvars.pluginUrl + "/trackFormTemplate.html",
                fetchClass: "template"
            }
        },
        supportedValues: {
            languageNames: ["Select lanaguage...", "Arabic", "Czech", "Dutch", "English", "French", "German", "Greek", "Hindi", "Japanese", "Portuguese", "Punjabi", "Russian", "Mandarin", "Spanish", "Swedish"],
            languageCodes: ["none", "ar", "cs", "nl", "en", "fr", "de", "el", "hi", "ja", "pt", "pa", "ru", "zh", "es", "sv"],
            types: ["text/amarajson", "JSONcc"],
            typeLabels: ["Amara", "JSON"]
        },
        invokers: {
            resetForm: {
                funcName: "fluid.vpPlugin.trackForm.resetForm",
                args: "{trackForm}"
            }
        }
    });
    fluid.fetchResources.primeCacheFromResources("fluid.vpPlugin.trackForm");

    fluid.vpPlugin.trackForm.preInit = function (that) {
        fluid.fetchResources({}, function (resourceSpec) {
            that.refreshView();
            that.locate("source").hide();
        }, {amalgamateClasses: ["template"]});
        that.options.initialType = that.model.type;
    };

    fluid.vpPlugin.trackForm.bindEventHandlers = function (that) {
        that.locate("add").click(function () {
            that.locate("source").toggle();
        });

        that.applier.modelChanged.addListener("type", function (newModel, oldModel, changeRequest) {
            if (!newModel.type) {
                return;
            }
            that.refreshView();
        });

        that.applier.modelChanged.addListener("srclang", function (newModel, oldModel, changeRequest) {
            var langLabel = fluid.find(that.options.supportedValues.languageCodes, function (object, index) {
                if (object === newModel.srclang) {
                    return that.options.supportedValues.languageNames[index];
                }
            });
            that.applier.requestChange("langLabel", langLabel);
        });
        that.locate("cancel").click(function () {
            that.resetForm();
        });

        that.locate("done").click(function () {
            that.events.onAddTrack.fire(that.model);
        });
    };

    fluid.vpPlugin.trackForm.hideForm = function (that) {
        that.locate("source").hide();
    };

    fluid.vpPlugin.trackForm.resetForm = function (that) {
        that.applier.requestChange("type", that.options.initialType);
        that.applier.requestChange("src", null);
        that.applier.requestChange("srclang", "none");
        that.refreshView();
        that.locate("source").hide();
    };

    fluid.vpPlugin.trackForm.produceTree = function (that) {
        var tree = {
            title: that.options.strings.title
        };
        
        if (that.options.fileUrls) {
            tree.expander = [{
                type: "fluid.renderer.selection.inputs",
                rowID: "typeRow",
                labelID: "typeLabel",
                inputID: "typeInput",
                selectID: fluid.allocateGuid(),
                tree: {
                    selection: "${type}",
                    optionlist: that.options.supportedValues.types,
                    optionnames: that.options.supportedValues.typeLabels
                }
            }];
        } else {
            tree.typeSelect = {
                selection: "${type}",
                optionlist: that.options.supportedValues.types,
                optionnames:  that.options.supportedValues.typeLabels
            };
        }

        if (that.model.type === "text/amarajson" || !that.options.fileUrls) {
            tree.urlTitle = that.options.strings.urlTitle;
            tree.urlLabel = that.options.strings.urlLabel;
            tree.url = "${src}";
            tree.urlHelp = that.options.strings.urlHelp;
        } else {
            tree.fileTitle = that.options.strings.fileTitle;
            tree.fileLabel = that.options.strings.fileLabel;

            tree.file = {
                selection: "${src}",
                optionlist: that.options.fileUrls,
                optionnames:  that.options.fileNames
            };
            tree.fileHelp = that.options.strings.fileHelp;
        }

        if (that.options.supportedValues.languageCodes) {
            tree.langLabel = that.options.strings.langLabel;
            tree.lang = {
                selection: "${srclang}",
                optionlist: that.options.supportedValues.languageCodes,
                optionnames: that.options.supportedValues.languageNames
            };
        }

        return tree;
    };

    /******
     * Form validation: Checks that the src field of the new entry is valid and that a language
     * has been selected. Fires events that are used to show or hide form validation feedback.
     * Returns boolean indicating validity of data.
     */
    fluid.vpPlugin.trackForm.validateForm = function (that) {
        var srcInvalid = (!that.model.src || that.model.src === "none");
        that.events.invalidField.fire(that.locate("url"), that.options.styles.invalid, srcInvalid);
        that.events.invalidField.fire(that.locate("file"), that.options.styles.invalid, srcInvalid);

        var langInvalid = ((that.locate("lang").length > 0) && (that.model.srclang === "none"));
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
