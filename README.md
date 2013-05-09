Infusion HTML5 VideoPlayer WordPress Plugin
===========================================

A WordPress plugin that allows users to embed video into posts using the Infusion HTML5 Video Player.

Overview
--------

This plugin adds a tab called "Embed Video" to the "Upload/Insert" dialog of the WordPress editor
interface.

When the fields of the tab are properly filled in, a shortcode is inserted into the document
specifying all the information the plugin needs to add a Video Player to the published page.

When the page is rendered for viewing, the information in the shortcode is used to compose JavaScript
that is embedded in the page, instantiating the Video Player.

To configure the plugin
-----------------------

Visit the plugin's Settings panel to indicate how the plugin should work with UI Options.

- If the WordPress site is already using the [FSS base theme](https://github.com/inclusive-design/wordpress-fss-theme/),
choose "I'm using the FSS base theme, please configure the Video Player to work with its UI Options."
The Video Player will override the base theme's UIO with a version that will connect with the Video Player,
but will maintain the original styling of the component.

- Otherwise, choose "Please add UI Options to my site, and configure the Video Player to work with it."

The "UI Button Strings" define the text that will appear in the UI Options tab at the top
right of the page. If left blank, the default strings will be used.

To use the plugin
-----------------

1) If you have WebVTT caption files or JSON-formatted transcript files, upload them to the
Media Library before using the plugin.

2) Position the cursor in the post where you want the video to appear, open the "Upload/Insert"
dialog and choose the "Embed Video" tab.

3) Provide a title for the video.

4) Specify at least one video source (ideally, two: MP4 and Webm):
* Click on the "+" button in the upper right corner of the Video Source section.
* In the dialog that appears, choose the appropriate video format and enter a valid URL in the
      text field.
* Click "Done."

5) Specify caption files. For each file:
* Click on the "+" button in the upper right corner of the Captions section.
* In the dialog that appears, first choose the appropriate format.
* If the captions are to be retrieved from Amara, enter the video URL that is associated with
      the captions in the text field.
* If the captions are WebVTT files that were uploaded to the Media Library, choose the appropriate
      file from the drop-down.
* Choose the language of the captions from the Language drop-down.
* Click "Done."

6) Specify transcript files. For each file:
* Click on the "+" button in the upper right corner of the Transcripts section.
* In the dialog that appears, first choose the appropriate format.
* If the transcript is to be retrieved from Amara, enter the video URL that is associated with
      the captions in the text field.
* If the transcripts are JSON files that were uploaded to the Media Library, choose the appropriate
      file from the drop-down.
* Choose the language of the transcript from the Language drop-down.
* Click "Done."

7) Once all video formats, captions and transcripts have been specified, click the "Insert Into Post"
   button. Note that the information cannot be edited later. If you need to make changes, you must
   remove the shortcode and start over.

Known Issues
------------

- Only one Video Player instance can be added to a page.
- The dialog does not verify that at least one video source has been specified.