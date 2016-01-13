<?php
/*
Plugin Name: Infusion Video Player for Wordpress
Plugin URI: http://github.com/inclusive-design/videoPlayer-wordpress
Description: Adds the ability to embed HTML5 videos, including captions and transcripts, using the <a href="http://github.com/fluid-project/videoPlayer/">Infusion Video Player</a>
Version: 0.1
Author: The Fluid Project
Author URI: http://fluidproject.org/
*/

include_once dirname( __FILE__ ) .'/infusion_videoPlayer_admin.php';

add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_infusion_css_to_header'));
add_action('admin_enqueue_scripts', array('infusion_video_player', 'add_infusion_css_to_header'));
add_action('admin_enqueue_scripts', array('infusion_video_player', 'add_plugin_files_to_header'));

add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_vp_files_to_header'));

$vpPlugin_options = get_option('infusion_vp_options');
if ($vpPlugin_options['add_uio'] == 'useUIO') {
	add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_uio_plugin_files_to_header'));
}
if ($vpPlugin_options['add_uio'] == 'addUIO') {
	add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_uio_files_to_header'));
	add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_uio_plugin_files_to_header'));
}
add_action('wp_enqueue_scripts', array('infusion_video_player', 'add_noConflict_to_header'));
add_action('admin_enqueue_scripts', array('infusion_video_player', 'add_noConflict_to_header'));

add_filter('media_upload_tabs', array('infusion_video_player', 'add_embed_tab'));
add_action('media_upload_vp_embed_video', array('infusion_video_player', 'embed_media_handler'));

add_filter('upload_mimes', array('infusion_video_player', 'custom_upload_mimes'));
add_filter('the_content', array('infusion_video_player', 'restore_ampersands'));

add_shortcode( 'videoPlayer', array('infusion_video_player', 'process_shortcode') );

infusion_video_player::get_caption_transcript_files();

/**
 * This plugin adds a tab to the 'upload/insert' dialog allowing an author to specify the details
 * necessary to embed a video into a post using the Infusion VideoPlayer.
 * The plugin embeds a shortcode with the information into the post, then when the page is displayed,
 * converst that shortcode into the necessary JavaScript to instantiate the VideoPlayer.
 */
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
	 * Add a tab to the media dialog
	 */
	function add_embed_tab($tabs) {
		$tabs['vp_embed_video']='Embed Video';
		return $tabs;
	}

	/**
	 * Embed the form into the tab in the media dialog.
	 * The JavaScript in the form will generate the shortcode and embed it into the post.
	 */
	function embed_media_handler() {
		return wp_iframe(array('infusion_video_player', 'media_upload_vp_embed_video_form'));
	}

	/**
	 * Create the form
	 */
	// need to have 'media_' as prefix, for styling purposes
	function media_upload_vp_embed_video_form () {
		media_upload_header();
		include_once('videoEmbedForm.php');
	}

	/**
	 * Add support for our caption and transcript file types to WordPress's media upload
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
	 * Add to the document header all basic Infusion files, neede by both the plugin interface
	 * and the Video Player.
	 */
	 function add_infusion_css_to_header() {
		// FSS-specific CSS files
		wp_enqueue_style( 'fss-layout', plugins_url('/lib/videoPlayer/lib/infusion/framework/fss/css/fss-layout.css', __FILE__), array(), null);
		wp_enqueue_style( 'fss-text', plugins_url('/lib/videoPlayer/lib/infusion/framework/fss/css/fss-text.css', __FILE__), array(), null);
	 }

	/**
	 * Add to the document header all files needed by the VideoPlayer
	 */
	function add_vp_files_to_header() {
		global $wp_styles;

		// VideoPlayer-specific CSS files
		wp_enqueue_style( 'jqueryUiCustom', plugins_url('/lib/videoPlayer/lib/jquery-ui/css/ui-lightness/jquery-ui-1.8.14.custom.css', __FILE__), array(), null);
		wp_enqueue_style( 'VideoPlayer', plugins_url('/lib/videoPlayer/css/VideoPlayer.css', __FILE__), array(), null);
		wp_enqueue_style( 'captions', plugins_url('/lib/videoPlayer/lib/captionator/css/captions.css', __FILE__), array(), null);

		wp_register_style('ie-only', plugins_url('/lib/videoPlayer/css/ltie9.css',__FILE__));
		$wp_styles->add_data('ie-only', 'conditional', 'lt IE 9');
		wp_enqueue_style('ie-only');

		// VideoPlayer-specific JS files (Infusion included in -all file)
		wp_enqueue_script('infusion', plugins_url('/lib/videoPlayer/videoPlayer-all-min.js', __FILE__), array(), null);
	}

	/**
	 * Add to the document header files needed by the plugin
	 */
	function add_plugin_files_to_header() { //loads plugin-related javascripts
		global $vpPlugin_options;

        wp_enqueue_script('infusion', plugins_url('/lib/videoPlayer/lib/infusion/MyInfusion.js', __FILE__), array(), null);
   		wp_enqueue_script( 'vpPlugin_trackForm', plugins_url('/vpPlugin-trackForm.js', __FILE__) );
		wp_enqueue_script( 'vpPlugin_trackList', plugins_url('/vpPlugin-trackList.js', __FILE__) );
		wp_enqueue_script( 'vpPlugin_mainScript', plugins_url('/vpPlugin.js', __FILE__) );
		wp_enqueue_style( 'localCss', plugins_url('/vpPlugin.css', __FILE__), array(), null);

		// make some information available to the Javascript files
		$php_vars = array('pluginUrl' => __(plugins_url('', __FILE__)));
		$php_vars['addUIOsetting'] = $vpPlugin_options['add_uio'];
		$php_vars['captions']['fileNames'] = infusion_video_player::$caption_file_names;
		$php_vars['captions']['fileUrls'] = infusion_video_player::$caption_file_urls;
		$php_vars['transcripts']['fileNames'] = infusion_video_player::$transcript_file_names;
		$php_vars['transcripts']['fileUrls'] = infusion_video_player::$transcript_file_urls;

		if (count($php_vars['captions']['fileNames']) == 0) {
			$php_vars['captions']['fileUrls'] = array("none");
			$php_vars['captions']['fileNames'] = array("No files yet");
		} else {
			array_splice($php_vars['captions']['fileUrls'], 0, 0, "none");
			array_splice($php_vars['captions']['fileNames'], 0, 0, "Select file...");
		}
		if (count($php_vars['transcripts']['fileNames']) == 0) {
			$php_vars['transcripts']['fileUrls'] = array("none");
			$php_vars['transcripts']['fileNames'] = array("No files yet");
		} else {
			array_splice($php_vars['transcripts']['fileUrls'], 0, 0, "none");
			array_splice($php_vars['transcripts']['fileNames'], 0, 0, "Select file...");
		}

		wp_localize_script( 'vpPlugin_mainScript', 'vpPluginPHPvars', $php_vars );
		wp_localize_script( 'vpPlugin_trackList', 'vpPluginPHPvars', $php_vars );
		wp_localize_script( 'vpPlugin_trackForm', 'vpPluginPHPvars', $php_vars );
		if ($vpPlugin_options['add_uio'] == 'addUIO') {
			wp_localize_script( 'infusion_uio_script', 'vpPluginPHPvars', $php_vars );
		}
	}

	/**
	 * Add to the document header all files needed by UI Options
	 * This will only be done if the plugin itself is adding UIO to the site (not if it's working
	 * with an existing instance of UIO)
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
	 * Add to the document header the UIO setup script
	 */
	function add_uio_plugin_files_to_header() {
		global $vpPlugin_options;

		// Plugin+UIO-specific JS files
		wp_enqueue_script( 'infusion_uio_script', plugins_url('/infusion_uio.js', __FILE__) );

		// make plugin path and options available to the JS script
		$php_vars = array('pluginUrl' => __(plugins_url('', __FILE__)));
		$php_vars['addUIOsetting'] = $vpPlugin_options['add_uio'];
		$php_vars['showText'] = $vpPlugin_options['show_text'];
		$php_vars['hideText'] = $vpPlugin_options['hide_text'];
		$php_vars['tocTemplate'] = $vpPlugin_options['toc_template'];
		$php_vars['prefix'] = $vpPlugin_options['prefix'];
		$php_vars['mediaTemplate'] = $vpPlugin_options['media_template'];
		$php_vars['fatPanelTemplate'] = $vpPlugin_options['fatpanel_template'];
		wp_localize_script( 'infusion_uio_script', 'vpPluginPHPvars', $php_vars );
	}

	function add_noConflict_to_header() {
		wp_enqueue_script( 'no_conflict_script', plugins_url('/vpPlugin-noConflict.js', __FILE__) );
	}

	/**
	 * Convert the shortcode in the document into the JS necessary to instantiate the VideoPlayer.
	 * This code runs when the post/page is served up.
	 */
	function process_shortcode( $atts ) {
		global $vpPlugin_options;

		extract( shortcode_atts( array(
			// these are the defaults, if nothing is provded in the shorcode
			'id' => '',
			'title' => '',
			'sourcessrc' => '',
			'sourcestype' => '',
			'captionssrc' => '',
			'captionstype' => '',
			'captionssrclang' => '',
			'captionslanglabel' => '',
			'transcriptssrc' => '',
			'transcriptstype' => '',
			'transcriptssrclang' => '',
			'transcriptslanglabel' => '',
			'uiosetting' => ''
		), $atts ) );

		$result = '<div id="' . $id . '"></div>
		<script>fluid.registerNamespace("fluid.vpPlugin");';
		$result .= 'var vidPlayerOpts = {video: {';

		$result .= infusion_video_player::process_tracklist('sources', $sourcessrc, $sourcestype);
		$result .= infusion_video_player::process_tracklist(',captions', $captionssrc, $captionstype, $captionssrclang, $captionslanglabel);
		$result .= infusion_video_player::process_tracklist(',transcripts', $transcriptssrc, $transcriptstype, $transcriptssrclang, $transcriptslanglabel);

		$result .= '}'; // end video:

		// add the title, if there is one
		if ($title) {
			$result .= ',videoTitle: "' . $title . '"';
		}

		// add the mechanical stuff
		$result .= ',templates: {
			videoPlayer: {href: "' . __(plugins_url('', __FILE__)) . '/lib/videoPlayer/html/videoPlayer_template.html"},
			menuButton: {href: "' . __(plugins_url('', __FILE__)) . '/lib/videoPlayer/html/menuButton_template.html"}
		}';
		$result .= '};'; // end var vidPlayerOpts

		if ($vpPlugin_options['add_uio'] == "noUIO") {
			$result .= 'fluid.videoPlayer("#' . $id . '", vidPlayerOpts);';
		} else {
			$result .= 'if (!fluid.staticEnvironment.UIOAnnouncer) { fluid.staticEnvironment.UIOAnnouncer = fluid.vpPlugin.UIOAnnouncer(); }';
			$result .= 'var videoOptions = {container: "#' . $id . '", options: vidPlayerOpts};';
			// We can't access the uiOptionsInstance until we're sure it's in the environment,
			// so we wait for UIAnnouncer to tell us it's there
			$result .= 'fluid.staticEnvironment.UIOAnnouncer.events.UIOReady.addListener(function () {
			    fluid.videoPlayer.makeEnhancedInstances(videoOptions, fluid.staticEnvironment.uiOptionsInstance.relay);
			});';
		}

		$result .= 'fluid.demands("fluid.videoPlayer.controllers", "fluid.videoPlayer", {
			options: {
				templates: {
					controllers: {
						href: "' . __(plugins_url('', __FILE__)) . '/lib/videoPlayer/html/videoPlayer_controllers_template.html"
					}
				}
			}
		});';
		$result .= '</script>';
		return $result;
	}

	/**
	 * Convert the shortcode attributes specific to one track type onto the relevant VideoPlayer args
	 */
	function process_tracklist($name, $srcs, $types, $langs=null, $labels=null) {
		$str = '';
		$srcs = explode(',', $srcs);
		$count = count($srcs);
		if ($count > 0) {
			$types = explode(',', $types);
			$langs = explode(',', $langs);
			$labels = explode(',', $labels);
			$str .= $name . ': [';
			for ($i = 0; $i < $count; $i++) {
				if ($srcs[$i]) {
					$str .= '{src: "' . $srcs[$i] . '", type: "' . $types[$i] . '"';
					if ($name != 'sources') {
						$str .= ', srclang: "' . $langs[$i] . '", label: "' . $labels[$i] . '"';
					}
					$str .= '}';
				}
				$str .= ",";
			}
			// strip the final ',' off
			$str = substr($str, 0, (strlen($str) - 1));
			$str .= ']'; // end captions
		}
		return $str;
	}

	/**
	 * Retrieve list of currently available caption files (i.e. previously uploaded files) from the gallery
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

	/**
	 * WordPress normally sanitizes '&', but we need to leave them intact for youtube urls.
	 */
	function restore_ampersands($content)
	{
	    return preg_replace('/\\&#038;/', '/\\&', $content);
	}
}
?>
