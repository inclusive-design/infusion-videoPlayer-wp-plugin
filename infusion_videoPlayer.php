<?php
/*
Plugin Name: Infusion Video Player for Wordpress
Plugin URI: http://github.com/inclusive-design/videoPlayer-wordpress
Description: Adds the ability to embed HTML5 videos, including captions and transcripts, using the <a href="http://github.com/fluid-project/videoPlayer/">Infusion Video Player</a>
Version: 0.w
Author: The Fluid Project
Author URI: http://fluidproject.org/
*/

include_once dirname( __FILE__ ) .'/infusion_videoPlayer_admin.php';

add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_vp_files_to_header'));

$vpPlugin_options = get_option('infusion_vp_options');
if ($vpPlugin_options['add_uio'] == 'useUIO') {
	add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_uio_plugin_files_to_header'));
}
if ($vpPlugin_options['add_uio'] == 'addUIO') {
	add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_uio_plugin_files_to_header'));
	add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_uio_files_to_header'));
}

add_action('admin_enqueue_scripts', array('infusion_video_player', 'add_vp_files_to_header'));
add_action('admin_enqueue_scripts', array('infusion_video_player', 'add_plugin_js_to_header'));

add_filter('media_upload_tabs', 'infusion_video_player::add_embed_tab');
add_action('media_upload_vp_embed_video', array('infusion_video_player', 'embed_media_handler'));


add_filter('upload_mimes', array('infusion_video_player', 'custom_upload_mimes'));
add_filter('the_content', array('infusion_video_player', 'restore_ampersands'));

add_shortcode( 'videoPlayer', array('infusion_video_player', 'process_shortcode') );

infusion_video_player::get_caption_transcript_files();

class infusion_video_player {

	public static $caption_file_names = array();
	public static $caption_file_urls = array();
	public static $transcript_file_names = array();
	public static $transcript_file_urls = array();

	public static $supported_caption_types = array(
	    'vtt'  => 'text/vtt'
	);
	public static $supported_transcript_types = array(
	    'json' => 'application/json'
	);

	/**
	 * Add support for our caption and transcript file types
	 */
	function custom_upload_mimes ( $existing_mimes=array() ) {
		foreach (infusion_video_player::$supported_caption_types as $i => $value) {
			$existing_mimes[$i] = $value;
		}
		foreach (infusion_video_player::$supported_transcript_types as $i => $value) {
			$existing_mimes[$i] = $value;
		}
		return $existing_mimes;
	}

	/**
	 * Add to the document header all files needed by the VideoPlayer
	 */
	function add_vp_files_to_header() {
		// FSS-specific CSS files
		wp_enqueue_style( 'fss-layout', plugins_url('/lib/videoPlayer/lib/infusion/framework/fss/css/fss-layout.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-text', plugins_url('/lib/videoPlayer/lib/infusion/framework/fss/css/fss-text.css', __FILE__), array(), null);

		// VideoPlayer-specific CSS files
		wp_enqueue_style( 'jqueryUiCustom', plugins_url('/lib/videoPlayer/lib/jquery-ui/css/ui-lightness/jquery-ui-1.8.14.custom.css', __FILE__), array(), null);
		wp_enqueue_style( 'VideoPlayer', plugins_url('/lib/videoPlayer/css/VideoPlayer.css', __FILE__), array(), null);
		wp_enqueue_style( 'captions', plugins_url('/lib/videoPlayer/lib/captionator/css/captions.css', __FILE__), array(), null);
		wp_enqueue_style( 'localCss', plugins_url('/vpPlugin.css', __FILE__), array(), null);

		// Infusion
	    wp_enqueue_script('infusion', plugins_url('/lib/videoPlayer/lib/infusion/MyInfusion.js', __FILE__), array(), null);

		// VideoPlayer-specific JS files
	    wp_enqueue_script('jqueryUiButton', plugins_url('/lib/videoPlayer/lib/jquery-ui/js/jquery.ui.button.js', __FILE__), array(), null);
	    wp_enqueue_script('captionator', plugins_url('/lib/videoPlayer/lib/captionator/js/captionator.js', __FILE__), array(), null);
	    wp_enqueue_script('mediaelement', plugins_url('/lib/videoPlayer/lib/mediaelement/js/mediaelement.js', __FILE__), array(), null);

	    wp_enqueue_script('VideoPlayer_framework', plugins_url('/lib/videoPlayer/js/VideoPlayer_framework.js', __FILE__), array(), null);
	    wp_enqueue_script('ToggleButton', plugins_url('/lib/videoPlayer/js/ToggleButton.js', __FILE__), array(), null);
	    wp_enqueue_script('MenuButton', plugins_url('/lib/videoPlayer/js/MenuButton.js', __FILE__), array(), null);
	    wp_enqueue_script('VideoPlayer_html5Captionator', plugins_url('/lib/videoPlayer/js/VideoPlayer_html5Captionator.js', __FILE__), array(), null);
	    wp_enqueue_script('VideoPlayer_media', plugins_url('/lib/videoPlayer/js/VideoPlayer_media.js', __FILE__), array(), null);
	    wp_enqueue_script('VideoPlayer_transcript', plugins_url('/lib/videoPlayer/js/VideoPlayer_transcript.js', __FILE__), array(), null);
	    wp_enqueue_script('VideoPlayer_intervalEventsConductor', plugins_url('/lib/videoPlayer/js/VideoPlayer_intervalEventsConductor.js', __FILE__), array(), null);
	    wp_enqueue_script('VideoPlayer_controllers', plugins_url('/lib/videoPlayer/js/VideoPlayer_controllers.js', __FILE__), array(), null);
	    wp_enqueue_script('VideoPlayer', plugins_url('/lib/videoPlayer/js/VideoPlayer.js', __FILE__), array(), null);
	    wp_enqueue_script('VideoPlayer_uiOptions', plugins_url('/lib/videoPlayer/js/VideoPlayer_uiOptions.js', __FILE__), array(), null);
	}
 
	/**
	 * Add to the document header files needed by the plugin
	 */
	function add_plugin_js_to_header() { //loads plugin-related javascripts
	    wp_enqueue_script( 'vpPlugin_trackForm', plugins_url('/vpPlugin-trackForm.js', __FILE__) );
	    wp_enqueue_script( 'vpPlugin_trackList', plugins_url('/vpPlugin-trackList.js', __FILE__) );
	    wp_enqueue_script( 'vpPlugin_mainScript', plugins_url('/vpPlugin.js', __FILE__) );

	    $options = get_option('infusion_vp_options');

		// make some information available to the Javascript files
		$php_vars = array('pluginUrl' => __(plugins_url('', __FILE__)));
		$php_vars['addUIOsetting'] = $options['add_uio'];
		$php_vars['captions']['fileNames'] = infusion_video_player::$caption_file_names;
		$php_vars['captions']['fileUrls'] = infusion_video_player::$caption_file_urls;
		$php_vars['transcripts']['fileNames'] = infusion_video_player::$transcript_file_names;
		$php_vars['transcripts']['fileUrls'] = infusion_video_player::$transcript_file_urls;

		wp_localize_script( 'vpPlugin_mainScript', 'phpVars', $php_vars );
		wp_localize_script( 'vpPlugin_trackList', 'phpVars', $php_vars );
		wp_localize_script( 'vpPlugin_trackForm', 'phpVars', $php_vars );
		if ($options['add_uio'] == 'addUIO') {
			wp_localize_script( 'infusion_uio_script', 'phpVars', $php_vars );
		}
	}

	/**
	 * Add our tab to the media dialog
	 */
	function add_embed_tab($tabs) {
		$tabs['vp_embed_video']='Embed Video';
		return $tabs;
	}

	/**
	 * Create the form for the tab
	 */
	// need to have 'media_' as prefix, for styling purposes
	function media_upload_vp_embed_video_form () {
		media_upload_header();
		include_once('videoEmbedForm.php');
	}

	/**
	 * Embed our form into our tab in the media dialog
	 */
	function embed_media_handler() {
		return wp_iframe(array('infusion_video_player', 'media_upload_vp_embed_video_form'));
	}

	/**
	 * Retrieve list of currently available caption files from the gallery
	 */
	function get_caption_transcript_files() {
		// get files of types supported by captions
		$args = array( 'post_type' => 'attachment', 'numberposts' => -1, 'post_status' => 'any', 'post_parent' => null ); 
		$attachments = get_posts( $args );
		if ($attachments) {
			$index = 0;
			foreach ( $attachments as $post ) {
				if (in_array($post->post_mime_type, infusion_video_player::$supported_caption_types)) {
					infusion_video_player::$caption_file_names[$index] = $post->post_title;
					infusion_video_player::$caption_file_urls[$index] = $post->guid;
					$index++;
				}
			}
		}

		// get files of types supported by transcript
		$args = array( 'post_type' => 'attachment', 'numberposts' => -1, 'post_status' => 'any', 'post_parent' => null ); 
		$attachments = get_posts( $args );
		if ($attachments) {
			$index = 0;
			foreach ( $attachments as $post ) {
				if (in_array($post->post_mime_type, infusion_video_player::$supported_transcript_types)) {
					infusion_video_player::$transcript_file_names[$index] = $post->post_title;
					infusion_video_player::$transcript_file_urls[$index] = $post->guid;
					$index++;
				}
			}
		}
	}

	function restore_ampersands($content)
	{
	    return preg_replace('/\\&#038;/', '/\\&', $content);
	}

	/**
	 * Add to the document header all files needed for UI Options
	 */
	function add_uio_files_to_header() {

		// UIO-specific CSS files
		wp_enqueue_style( 'fss-theme-bw-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-bw-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-theme-wb-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-wb-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-theme-by-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-by-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-layout', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-yb-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-text-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-text-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'FatPanelUIOptions', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/FatPanelUIOptions.css', __FILE__), array(), null);
	}

	/**
	 * Add to the document header all files needed for UI Options
	 */
	function add_uio_plugin_files_to_header() {

		// Plugin+UIO-specific JS files
		wp_enqueue_script( 'infusion_uio_script', plugins_url('/infusion_uio.js', __FILE__) );

		// make plugin path and options available to the JS script
		$options = get_option('infusion_vp_options');
		$php_vars = array('pluginUrl' => __(plugins_url('', __FILE__)));
		$php_vars['showText'] = $options['show_text'];
		$php_vars['hideText'] = $options['hide_text'];
		wp_localize_script( 'infusion_uio_script', 'phpVars', $php_vars );
	}

	// [videoPlayer src="foo-value"]
	function process_shortcode( $atts ) {
		extract( shortcode_atts( array(
			// these are the defaults, if nothing is provded in the shorcode
			'title' => '',
			'sourcessrc' => '',
			'sourcestype' => '',
			'captionssrc' => '',
			'captionstype' => '',
			'captionssrclang' => '',
			'captionslanglabel' => 'default',
			'transcriptssrc' => '',
			'transcriptstype' => '',
			'transcriptssrclang' => '',
			'transcriptslanglabel' => '',
			'uiosetting' => ''
		), $atts ) );

		$result = '<div class="infvpc-video-player"></div>
		<script>
		fluid.registerNamespace("fluid.vpPlugin");
		';
		$result .= 'var vidPlayerOpts = {
		video: {
			';

		// add the sources array to the opts
		$sourcessrc = explode(',', $sourcessrc);
		$sourcestype = explode(',', $sourcestype);
		$srccount = count($sourcessrc);
		$result .= '    sources: [';
		for ($i = 0; $i < $srccount - 1; $i++) {
			$result .= '{src: "' . $sourcessrc[$i] . '", type: "' . $sourcestype[$i] . '"},';
		}
		$result .= '{src: "' . $sourcessrc[$i] . '", type: "' . $sourcestype[$i] . '"}';
		$result .= ']'; // end sources

		// add the captions array to the opts, if there are any
		$captionssrc = explode(',', $captionssrc);
		$capcount = count($captionssrc);

		if ($capcount > 0) {
			$captionstype = explode(',', $captionstype);
			$captionssrclang = explode(',', $captionssrclang);
			$captionslanglabel = explode(',', $captionslanglabel);
			$result .= ',
			captions: [';
			for ($i = 0; $i < $capcount - 1; $i++) {
				$result .= '{src: "' . $captionssrc[$i] . '", type: "' . $captionstype[$i] . '", srclang: "' . $captionssrclang[$i] . '", label: "' . $captionslanglabel[$i] . '"},';
			}
			$result .= '{src: "' . $captionssrc[$i] . '", type: "' . $captionstype[$i] . '", srclang: "' . $captionssrclang[$i] . '", label: "' . $captionslanglabel[$i] . '"}';
			$result .= ']'; // end captions
		}

		// add the transcripts array to the opts, if there are any
		$transcriptssrc = explode(',', $transcriptssrc);
		$trancount = count($transcriptssrc);
		if ($trancount > 0) {
			$transcriptstype = explode(',', $transcriptstype);
			$transcriptssrclang = explode(',', $transcriptssrclang);
			$transcriptslanglabel = explode(',', $transcriptslanglabel);
			$result .= ',
			transcripts: [';
			for ($i = 0; $i < $trancount - 1; $i++) {
				$result .= '{src: "' . $transcriptssrc[$i] . '", type: "' . $transcriptstype[$i] . '", srclang: "' . $transcriptssrclang[$i] . '", label: "' . $transcriptslanglabel[$i] . '"},';
			}
			$result .= '{src: "' . $transcriptssrc[$i] . '", type: "' . $transcriptstype[$i] . '", srclang: "' . $transcriptssrclang[$i] . '", label: "' . $transcriptslanglabel[$i] . '"}';
			$result .= ']'; // end transcripts
		}
		$result .= '
		}'; // end video:

		// add the title, if there is one
		if ($title) {
			$result .= ',
			videoTitle: "' . $title . '"';
		}

		// add the mechanical stuff
		$result .= ',
        templates: {
            videoPlayer: {href: "' . __(plugins_url('', __FILE__)) . '/lib/videoPlayer/html/videoPlayer_template.html"},
            menuButton: {href: "' . __(plugins_url('', __FILE__)) . '/lib/videoPlayer/html/menuButton_template.html"}
        }';
		$result .= '
		};'; // end var vidPlayerOpts

		$options = get_option('infusion_vp_options');
		if ($options['add_uio'] == "noUIO") {
			$result .= '
			fluid.videoPlayer(".infvpc-video-player", vidPlayerOpts);';
		} else {
			$result .= '
			if (!fluid.staticEnvironment.UIOAnnouncer) { fluid.merge(null, fluid.staticEnvironment, {UIOAnnouncer: fluid.vpPlugin.UIOAnnouncer()}); }';
			$result .= '
			var videoOptions = {container: ".infvpc-video-player", options: vidPlayerOpts};';
			$result .= '
			fluid.staticEnvironment.UIOAnnouncer.events.UIOReady.addListener(function () {
			    fluid.videoPlayer.makeEnhancedInstances(videoOptions, fluid.staticEnvironment.uiOpionsInstance.relay);
			});';
		}
		$result .= '</script>';
		return $result;
	}

}
?>
