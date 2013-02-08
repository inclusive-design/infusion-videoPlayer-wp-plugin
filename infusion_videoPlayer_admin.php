<?php

/**
 * This file sets up the plug-in admin page available through the WordPress 'Settings' admin section.
 * It allows the administrator to specify how the plugin should work with UIO: either add it to the page,
 * work with an existing UIO offered by the FSS base theme, or leave UIO out of the picture.
 * 
 * It also allows the administrator to specify the show/hide string to be displayed in the UIO fat panel button.
 */

add_action( 'admin_menu', array('infusion_video_player_admin', 'add_options_to_menu'));
add_action( 'admin_init', array('infusion_video_player_admin', 'register_options') );

class infusion_video_player_admin {
	/**
	 * Add an admin options page 
	 */	 
	function add_options_to_menu() {
		add_options_page( 'Infusion Video Player Options', 'Infusion Video Player', 'manage_options', 'infusion-vp-options-page', array('infusion_video_player_admin', 'add_options_page') );
	}
	
	function register_options() { 
		register_setting( 'infusion_vp_options', 'infusion_vp_options' );
		add_settings_section('infusion_vp_options_main', 'Video Player Plugin Settings', array('infusion_video_player_admin','add_section_main'), 'infusion-vp-options-page');
		add_settings_field('uio_radio', 'UI Options', array('infusion_video_player_admin','add_option_uio'), 'infusion-vp-options-page', 'infusion_vp_options_main');
		add_settings_field('uio_strings', 'UI Button Strings', array('infusion_video_player_admin','add_option_uio_strings'), 'infusion-vp-options-page', 'infusion_vp_options_main');
	}	
	
	function add_section_main() { 
		/* Echo text to explain the main section */
		?>
		<p>The Infusion Video Player is designed to work with another Infusion component: User Interface Options.
			 This component allows visitors to your site to customize the presentation of the site, for example by enlarging the font, or using a high-contrast colour scheme.</p>
		<p>If you're using the <a href="https://github.com/inclusive-design/wordpress-fss-theme/">FSS Wordpress Theme</a> as your base theme, you already have User Interface Options on your site, and the Video Player can work with it.</p>
		<p>If you're not using the FSS Wordpress Theme, this plugin can add User Interface Options to your site for you.</p>
		<?php
	}
	
	function add_option_uio() { 
		$options = get_option('infusion_vp_options');
		?>
		<div>
			<label title="Add UI Options">
				<input type="radio" value="addUIO" name="infusion_vp_options[add_uio]" <?php if ($options['add_uio'] == 'addUIO') { echo "checked='checked'"; } ?>>
				<span>Please add UI Options to my site, and configure the Video Player to work with it.</span>
			</label>
		</div>
		<div>
		<label title="I'm using the FSS base theme, please configure the Video Player to work with its UI Options.">
			<input type="radio" value="useUIO" name="infusion_vp_options[add_uio]" <?php if ($options['add_uio'] == 'useUIO') { echo "checked='checked'"; } ?>>
			<span>I'm using the FSS base theme, please configure the Video Player to work with its UI Options.</span>
		</label> 
		</div>
		<div>
		<label title="Do not add UI Options">
			<input type="radio" value="noUIO" name="infusion_vp_options[add_uio]" <?php if ($options['add_uio'] == 'noUIO') { echo "checked='checked'"; } ?>>
			<span>Do not add UI Options to my site</span>
		</label> 
		</div>
		<?php
	}
	
	function add_option_uio_strings() {
		$options = get_option('infusion_vp_options');
		?>
		<div>
			<label>Show:</label>
			<input name="infusion_vp_options[show_text]" type="text" value="<?php if ($options['show_text']) { echo $options['show_text']; } ?>" />
			<p class="help">This text will be used to label the UI Options button while the panel is closed.</p>
		</div>
		<div>
			<label>Hide:</label>
			<input name="infusion_vp_options[hide_text]" type="text" value="<?php if ($options['hide_text']) { echo $options['hide_text']; } ?>"  />
			<p class="help">This text will be used to label the UI Options button while the panel is open.</p>
		</div>
		<?php
	}

	function add_options_page() {
		if ( !current_user_can( 'manage_options' ) )  {
			wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		} ?>		
		<div class="wrap">
		<?php screen_icon(); ?>
		<h2>Infusion Video Player Options</h2>		
		
			<form action="options.php" method="post">
				<?php
				settings_fields( 'infusion_vp_options' );
				do_settings_sections( 'infusion-vp-options-page' );

				submit_button();
				?>
			</form>
		</div>

		<?php
	}
}
?>