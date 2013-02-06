<?php

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
	}	
	
	function add_section_main() { 
		/* Echo text to explain the main section */
		echo "The Infusion Video Player works well with the Infusion User Interface Options component. " .
		"This component allows visitors to your site to customize the presentation of the site, for example by enlarging the font, or using a high-contrast colour scheme.";
		echo "If you're using the FSS Wordpress Theme as your base theme, you already have User Interfac Options on your site, and the Video Player can work with it.";
		echo "If not, this plugin can add User Interface Options for you.";
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
		<label title="I'm using the FSS base theme, please configure the Video Player to work with it's UI Options.">
			<input type="radio" value="useUIO" name="infusion_vp_options[add_uio]" <?php if ($options['add_uio'] == 'useUIO') { echo "checked='checked'"; } ?>>
			<span>I'm using the FSS base theme, please configure the Video Player to work with it's UI Options.</span>
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