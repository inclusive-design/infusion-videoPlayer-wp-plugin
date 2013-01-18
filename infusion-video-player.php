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

add_filter('media_upload_tabs', array('infusion_video_player', 'add_embed_tab'));
add_action('media_upload_vp_embed_video', array('infusion_video_player', 'embed_media_handler'));


class infusion_video_player {

	/**
	 * Add to the document header all files neede by the VideoPlayer
	 */
	function add_vp_js_to_header() {
		wp_enqueue_style( 'fss-layout', plugins_url('/lib/videoPlayer/lib/infusion/framework/fss/css/fss-layout.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-text', plugins_url('/lib/videoPlayer/lib/infusion/framework/fss/css/fss-text.css', __FILE__), array(), null);

/*
		wp_enqueue_style( 'fss-theme-bw-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-bw-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-theme-wb-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-wb-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-theme-by-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-by-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-layout', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-theme-yb-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-text-uio', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/fss/fss-text-uio.css', __FILE__), array(), null);
		wp_enqueue_style( 'FatPanelUIOptions', plugins_url('/lib/videoPlayer/lib/infusion/components/uiOptions/css/FatPanelUIOptions.css', __FILE__), array(), null);
*/

		wp_enqueue_style( 'VideoPlayer', plugins_url('/lib/videoPlayer/css/VideoPlayer.css', __FILE__), array(), null);
		wp_enqueue_style( 'captions', plugins_url('/lib/videoPlayer/lib/captionator/css/captions.css', __FILE__), array(), null);

	    wp_enqueue_script('infusion', plugins_url('/lib/videoPlayer/lib/infusion/MyInfusion.js', __FILE__), array(), null);

	    wp_enqueue_script('ToggleButton', plugins_url('/lib/videoPlayer/js/ToggleButton.js', __FILE__), array(), null);
	    wp_enqueue_script('MenuButton', plugins_url('/lib/videoPlayer/js/MenuButton.js', __FILE__), array(), null);
	    wp_enqueue_script('VideoPlayer_framework', plugins_url('/lib/videoPlayer/js/VideoPlayer_framework.js', __FILE__), array(), null);
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
	    wp_enqueue_script( 'infusion_video_player_script', plugins_url('/infusion_video_player.js', __FILE__) );
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
		?>
<form class="media-upload-form type-form validate" id="video-form" enctype="multipart/form-data" method="post" action="">
	<div>
		<label for="video_url">Video URL:</label>
		<input type='text' id='video_url' />
		<label for="video_format">Format:</label>
		<select id="video_format">
			<option value="video/mp4">video/mp4</option>
			<option value="video/webm">video/webm</option>
			<option value="video/ogg">video/ogg</option>
			<option value="video/ogv">video/ogv</option>
			<option value="video/youtube">video/youtube</option>
		</select>
	</div>

	<div>
		<label for="caption_url">Caption URL:</label>
		<input type='text' id='video_url' />
		<label for="caption_format">Format:</label>
		<select id="caption_format">
			<option value="text/vtt">text/vtt</option>
			<option value="text/amarajson">text/amarajson</option>
		</select>
		<label for="caption_lang">Language:</label>
		<select id="caption_lang">
			<option value="en">English</option>
			<option value="fr">French</option>
		</select>
	</div>

	<div>
		<label for="transcript_url">Transcript URL:</label>
		<input type='text' id='video_url' />
		<label for="transcript_format">Format:</label>
		<select id="transcript_format">
			<option value="text/vtt">text/vtt</option>
			<option value="text/amarajson">text/amarajson</option>
		</select>
		<label for="transcript_lang">Language:</label>
		<select id="transcript_lang">
			<option value="en">English</option>
			<option value="fr">French</option>
		</select>
	</div>

	<div>
		<input type="button" onclick="infusion_vp.insertVideoPlayer();" name="insertonlybutton" id="insertonlybutton" class="button" value="Insert into Post"  />
	</div>

</form> 
		<?php
	}

	/**
	 * Embed our form into our tab in the media dialog
	 */
	function embed_media_handler() {
		return wp_iframe(array('infusion_video_player', 'media_upload_vp_embed_video_form'));
	}
}
?>
