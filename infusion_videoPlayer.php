<?php
/*
Plugin Name: Infusion Video Player for Wordpress
Plugin URI: http://github.com/inclusive-design/videoPlayer-wordpress
Description: Adds the ability to embed HTML5 videos, including captions and transcripts, using the <a href="http://github.com/fluid-project/videoPlayer/">Infusion Video Player</a>
Version: 0.w
Author: The Fluid Project
Author URI: http://fluidproject.org/
*/

add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_vp_js_to_header'));

add_action('admin_enqueue_scripts', array('infusion_video_player', 'add_vp_js_to_header'));
add_action('admin_enqueue_scripts', array('infusion_video_player', 'add_plugin_js_to_header'));

add_filter('media_upload_tabs', 'infusion_video_player::add_embed_tab');
add_action('media_upload_vp_embed_video', array('infusion_video_player', 'embed_media_handler'));


add_filter('upload_mimes', array('infusion_video_player', 'custom_upload_mimes'));
add_filter('the_content', array('infusion_video_player', 'restore_ampersands'));

class infusion_video_player {

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
	function add_vp_js_to_header() {
		// FSS-specific CSS files
		wp_enqueue_style( 'fss-layout', plugins_url('/lib/videoPlayer/lib/infusion/framework/fss/css/fss-layout.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-text', plugins_url('/lib/videoPlayer/lib/infusion/framework/fss/css/fss-text.css', __FILE__), array(), null);

/*
		// UIO-specific CSS files
		wp_enqueue_style( 'fss-theme-bw-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-bw-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-theme-wb-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-wb-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-theme-by-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-by-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-layout', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-yb-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-text-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-text-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'FatPanelUIOptions', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/FatPanelUIOptions.css', __FILE__), array(), null);
*/

		// VideoPlayer-specific CSS files
		wp_enqueue_style( 'jqueryUiCustom', plugins_url('/lib/videoPlayer/lib/jquery-ui/css/ui-lightness/jquery-ui-1.8.14.custom.css', __FILE__), array(), null);
		wp_enqueue_style( 'VideoPlayer', plugins_url('/lib/videoPlayer/css/VideoPlayer.css', __FILE__), array(), null);
		wp_enqueue_style( 'captions', plugins_url('/lib/videoPlayer/lib/captionator/css/captions.css', __FILE__), array(), null);
		wp_enqueue_style( 'localCss', plugins_url('/infusion_videoPlayer.css', __FILE__), array(), null);

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
	    wp_enqueue_script( 'infusion_video_player_script', plugins_url('/infusion_videoPlayer.js', __FILE__) );

		// make some PHP data available to the JS script
		$php_vars = array('pluginUrl' => __(plugins_url('', __FILE__)));
		$php_vars['captionList'] = infusion_video_player::get_caption_files();
		$php_vars['transcriptList'] = infusion_video_player::get_transcript_files();
		wp_localize_script( 'infusion_video_player_script', 'phpVars', $php_vars );
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
	function get_caption_files () {
		$attached_captions = array();

		$args = array( 'post_type' => 'attachment', 'numberposts' => -1, 'post_status' => 'any', 'post_parent' => null ); 
		$attachments = get_posts( $args );
		if ($attachments) {
			$index = 0;
			foreach ( $attachments as $post ) {
				if (in_array($post->post_mime_type, infusion_video_player::$supported_caption_types)) {
					$attached_captions[$index++] = $post->post_title;
				}
			}
		}
		return $attached_captions;
	}

	/**
	 * Retrieve list of currently available transcript files from the gallery
	 */
	function get_transcript_files () {
		$attached_transcripts = array();

		$args = array( 'post_type' => 'attachment', 'numberposts' => -1, 'post_status' => 'any', 'post_parent' => null ); 
		$attachments = get_posts( $args );
		if ($attachments) {
			$index = 0;
			foreach ( $attachments as $post ) {
				if (in_array($post->post_mime_type, infusion_video_player::$supported_transcript_types)) {
					$attached_transcripts[$index++] = $post->post_title;
				}
			}
		}
		return $attached_transcripts;
	}

	function restore_ampersands($content)
	{
	    return preg_replace('/\\&#038;/', '/\\&', $content);
	}
}
?>
