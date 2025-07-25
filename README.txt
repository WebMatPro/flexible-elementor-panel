=== Flexible Elementor Panel ===
Contributors: webmatpro
Donate link: https://www.paypal.me/webmatpro
Tags: elementor, elementor addon, elementor addons, elementor widget, elementor editor
Requires at least: 5.3
Tested up to: 6.8.2
Requires PHP: 5.6
Stable tag: 2.5.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

The plugin "Flexible Elementor Panel" makes the Elementor editor panel flexible, draggable, resizable, folding and more opportunities.

== Description ==

The plugin "Flexible Elementor Panel" makes the Elementor editor panel flexible, draggable, resizable, folding and more opportunities.


= Features =
* Draggable Elementor panel and save position
* Move to right side and switch in RTL mode
* Vertical collapsible Elementor panel
* Resize Elementor panel and save size
* Multiple dark skin for Elementor editor
* Collapsible all widgets category
* Sortable widgets category and save position
* Add exit button in the footer of panel editor
* Option to close the first tab in Accordion widget
* Add more options for responsive mode

== Installation ==
From within WordPress' dashboard:

1. Go to Plugins -> Add New
2. Search for "Flexible Elementor Panel"
3. Click "Install"
4. Click "Activate"

Manually via FTP:

1. Upload the folder '/flexible-elementor-panel/' into the '/wp-content/plugins/' directory
2. Activate the plugin through the *Plugins* tab in WordPress

== Screenshots ==
1. Draggable Elementor panel anywhere
2. Exit button in editor footer
3. More skin for Elementor editor
4. Collapsible Elementor panel
5. More options for responsive mode
6. Flex and Sortable widgets category
7. First tab accordion closed
8. Simple settings in editor panel
9. User settings in editor panel v2

== Frequently Asked Questions ==

= How i cant get back the origin style of panel? =

It easy, you need just to move it in the left top corner then click on the title of panel

AND/OR

You can reset position / size in the settings FEP, side editor Elementor and in the FEP admin settings.


== Changelog ==

= 2.5.4 =
* Fix multiples issues with icon FEP in header - thanks @Lars
* Add option for save the editor panel before use exit button - thanks the request from @Lars
* Update POT/PO language

= 2.5.3 =
* Remove z-index css not needed on the editor panel - thanks @medieskolen & @robstyrrell

= 2.5.2 =
* Add css z-index to the edit panel for override the top bar - thanks @tiri17
* Fix load js/css for the editor v2 correctly with Elementor 3.30.0+
* Add compatibility tag with Elementor 3.30.0
* Add compatibility tag with Elementor Pro 3.30.0

= 2.5.1 =
* Fix mousedown jQuery fonction - thanks @neo2k23
* Fix issue to load correct files css/js for the new editor elementor

= 2.5.0 =
* The moving of FEP will work again in the new editor elementor
* Add exit button to the new Editor powered by React
* Add compatibility with Wordpress 6.8
* Add compatibility tag with Elementor 3.27.1
* Add compatibility tag with Elementor Pro 3.27.0
* Update POT/PO language
* Update the screenshots on the plugin page Wordpress

= 2.4.1 =
* Add: Compatibility with Wordpress 6.7
* Add: Compatibility tag with Elementor 3.24.7
* Add: Compatibility tag with Elementor Pro 3.24.4
* Localization: Update POT/PO language

= 2.4.0 =
* Add: Compatibility with Wordpress 6.5
* Add: Compatibility tag with Elementor 3.20
* Add: Compatibility tag with Elementor Pro 3.20
* Fix: Issue with the collapse vertical function
* Improve : Add icon collapse vertical after "notes" to the new Editor powered by React
* Improve : Add icon reset panel after "notes" to the new Editor powered by React

= 2.3.9 =
* Improve: Add nonce key for security when close the notice in admin area (thanks @Maxcom)
* Fix: Close first tab option of accordion is now working again in frontend (thanks @kv1953 / @medieskolen)

= 2.3.8 =
* Note: The update of FEP is back, sorry communauty for the delay
* Add: Compatibility with Wordpress 6.0+
* Add: Compatibility with Elementor 3.7+ and Elementor Pro
* Add: Compatibility FEP Options Responsive with the news breakpoints (thanks @momo-fr)
* Improve: The right click for collapse categories only work on title cats
* Improve: CSS on categories / elements grid

= 2.3.7 =
* Add: Compatibility with Elementor 3.4+ and Elementor Pro
* Add: Compatibility with Wordpress 5.8
* Fix: Replace all icon font awesome per native icon elementor (eicon)

= 2.3.6.1 =
* Improve: The Navigator when fixed to the right side

= 2.3.6 =
* Fix: Issues with draggle panel in rtl mode (thanks @ariya76)
* Improve: Notice admin message better display and dismissible
* Add: Option "Force RTL Mode" when the editor is on the right side (actived by default)
* Localization: Update POT/PO language

= 2.3.5.1 =
* Fix: Issues CSS (thanks @liyulin)

= 2.3.5 =
* Improve: Change Text Domain "fep" to "flexible-elementor-panel" (thanks @liyulin)
* Localization: Make compatibility with Translating WordPress - https://translate.wordpress.org/projects/wp-plugins/flexible-elementor-panel/
* Localization: Update POT/PO language

= 2.3.4 =
* Add: Compatibility with Elementor 3.2+ (3.2.0-beta1)

= 2.3.3 =
* Fix: Notice php fep_frontend_accordion_close
* Improve: Make the editor panel upper the responsive bar (elementor 3.2)
* Improve: Performance load js, any FEP javascript will load after elementor fully loaded

= 2.3.2 =
* Fix: Notice fep_frontend_accordion_close empty string
* Fix: Issue with css z-index @thanks community
* Note: With the new design responsive mode from Elementor 3.2, when click on arrow for collapse the editor panel, the panel will be under the grey bar, click on it for back the display.

= 2.3.1 =
* HotFix: Remove dependence to elementor-editor script fep

= 2.3.0 =
* Add: Compatibility with Wordpress 5.7+
* Add: Compatibility with Elementor 3.2+ (3.2.0-dev8)
* Fix: Edit css flex grid for compatibility (thanks @momo-fr)
* Improve: Change minimum editor panel min width 280px to 300px
* Add: Option for close the first tab accordion in frontend
* Localization: Update POT/PO language
* Localization: Update French language


= 2.2.2 =
* Fix: Issue with load saved settings FEP

= 2.2.1 =
* Improve: Add Controls FEP with correct action (thanks @Pixify)
* Localization: Update French language

= 2.2.O =
* Add: Compatibility with Elementor 3.0+
* Add: Minimum version Elementor 2.8.0 required
* Improve: The "Settings FEP" is move into "User Preferences" in the editor
* Improve: The options of Settings FEP is now associated with your user account (except the size/position)
* Improve: Text in admin Settings FEP (thanks @Dirk)
* Localization: Update POT/PO language
* Localization: Update French language


= 2.1.3 =
* HOTFIX: remove deprecated Manager::add_settings_manager();
* working on the issue for add the settings FEP

= 2.1.2 =
* Add: Compatibility any plugins with use the namespace php for admin
* Add: Ask confirmation before execute action in debug setting admin
* Add: Link settings into the list plugin
* Improve: Set the public/private in Class php
* Localization: Update POT/PO language
* Localization: Update French language

= 2.1.1 =
* Fix: All options working again (thanks @community)
* Fix: Css responsive mode
* Improve: The "Debug" tab in FEP admin settings
* Improve: The "How to configure" tab in FEP admin settings
* Improve: The "Informations" tab in FEP admin settings
* Improve: Updated the gif in plugin repository
* Fix: Text in Changelog
* Localization: Update POT/PO language
* Localization: Update French language

= 2.1.0 =
* Add: Debug tab in FEP admin settings
* Add: Reset options FEP Database
* Add: Check options FEP SQL / LocalStorage
* Remove: PHP Filter admin settings FEP
* Remove: Divers tab in FEP admin settings
* Localization: Update POT/PO language
* Localization: Update French language


= 2.0.3 =
* Localization: Update POT/PO language
* Localization: Update French language

= 2.0.2 =
* Add: New option "Alternative Responsive Indicator" by @Nicholas
* Improve: Clean and more comments code by @Nicholas
* Localization: Update POT/PO language
* Localization: Update French language

= 2.0.1 =
* Add: Compatibility with Elementor 2.9.0
* Fix: Css label option FEP

= 2.0.0 =
* Add: Compatibility with rtl mode
* Add: News options for responsive mode (thanks @Nicholas)
* Add: Option for display the reset panel icon
* Add: Option for display the vertical collapse icon
* Add: Option for display the exit icon
* Improve: Clean the FEP settings in panel
* Improve: Elementor Panel can be fixed to right side
* Improve: First tab closed when accordion widget is added
* Fix: Button reset panel in editor mode
* Remove: CMD + P when the vertical panel is reduced
* Note: Light skin change name for Default
* Note: All FEP options is enable by default
* Note: FEP come on Github https://github.com/WebMatPro/flexible-elementor-panel
* Localization: Update POT/PO language
* Localization: Update French language


= 1.9.7 =
* Fix: Use static function of activation fep
* Improve: Add compatibility with Wordpress 5.3

= 1.9.6 =
* Fix: First tab on all accordion widget is now correctly closed (only in editor)
* Improve: Remove useless script loaded on front end for close the first tab accordion
* Localization: Update POT/PO language

= 1.9.5 =
* Fix: Use correct link option in admin notice when first actived plugin
* Fix: Hidden elements when preview mode is enable working now (thanks to @nickdgreen)
* Improve: Better compatibility with Elementor shortcut (ctrl/cmd + p)

= 1.9.4 =
* Fix: Reset option exit point (by default "Edition")
* Fix: Compatibility with Elementor shortcut (ctrl/cmd + p)

= 1.9.3 =
* Fix: Notice PHP (thanks to @krut1 and every user)
* Fix: Some CSS
* Fix: Exit point list post type
* Fix: Freezing (thanks to @kompundi for report)
* Fix: Clean pointer event when reset panel is used
* Add: Link to admin settings in plugin list
* Improve: Full compatibility with Elementor 2.6+
* Localization: Update POT/PO language

= 1.9.2 =
* Add: Reset button position/size Panel in header panel & setting fep (admin & editor)
* Improve: Clean and reorder settings FEP (admin)
* Improve: Handle draggable panel
* Fix: Position panel when use vertical collapse
* Fix: Some css in Dark skin
* Localization: Update POT/PO language
* Note: Thanks everybody for your participation have report the bugs <3

= 1.9.1 =
* Mistake upload


= 1.9.0 =
* Add: Settings page FEP in Admin
* Add: Information page in Admin
* Add: Preview mode actived when vertical collapse is used
* Improve: Fully compatible with Elementor 2.5+
* Improve: Minimum size panel (280x360)
* Improve: Remove transition panel for more speed
* Improve: Better button exit and vertical collapse
* Improve: Clean code of JavaScript file
* Fix: back to function first accordion closed (sorry)
* Fix: Some css for dark skin
* Tweak: Clean assets /images/
* Localization: Update POT/PO language

= 1.8.4 =
* Add: Banner for future pro version in setting
* Fix: Correct writing changelog
* Localization: Update POT/PO language

= 1.8.3 =
* Improve: Better compatibility with Elementor 2.4+
* Improve: Better performance and security with cleaning plugin
* Fix: Check and correct CSS for night mode
* Tweak: Requires PHP 5.6 and Elementor 2.4 to minimum
* Localization: Update POT/PO language

= 1.8.2 =
* Fix: Display button exit
* Fix: Full compatibility with Elementor 2.4.0

= 1.8.1 =
* Add: New option for disable the right click for minimize all categories
* Add: New description for the option draggle panel
* Add: New color pink for the dark skin panel
* Fix: Performance improvements and fix minor bugs
* Fix: Update translation
* Improve: Clean code of javascript file
* Improve: Clean code of css files
* Improve: Full compatibility with Elementor 2.3.1


= 1.8.0 =
* Add: Translation French ready by a native French
* Add: Now the enqueues files will use the version of plugin
* Add: New exit point option "Front page"
* Add: Re-order all category widget's and save position
* Add: Save Elementor panel position and size when panel is draggable
* Fix: Text domain, now is 'fep' and update pot
* Fix: Collapse all categories with right click
* Fix: Performance improvements and fix minor bugs
* Improve: Clean code of JavaScript file
* Improve: Full compatibility with Elementor 2.3.0


= 1.7.0 =
* Fix: Compatibility with Elementor 2.1
* Add: Minimized UX
* Add: Exit point to Elementor library
* Fix: Small bugs


= 1.6.0 =
* Add: Plugin settings in editor


= 1.5.1 =
* Fix: Fix bug with Theme Builder

= 1.5.0 =
* New: Button for collapsible Elementor Panel in header
* New: Toggle button for collapsible all widgets
* Add: Remove overlay on content when Elementor Panel position is left:0 and top: 0
* Add: New logical function
* Fix: Small bugs


= 1.4.1 =
* Fix: Bug with 'Dynamic Content'

= 1.4.0 =
* Add: Sortable and collapsible widgets category in Elementor Panel


= 1.3.0 =
* Add: Night/Day skin switcher for Elementor Panel
* Add: Remember your last selected skin
* More compatibility with Elementor 2.0


= 1.2.0 =
* Add: 'Exit to Dashboard' button in Elementor Panel footer


= 1.1.1 =
* Fix: change stylesheet in custom CSS editor

= 1.1.0 =
* New: Added resizable function
* New: Added night skin for Elementor Panel
* Fix: small bugs


= 1.0.0 =
* Initial release.

== Upgrade Notice ==
* Nothing Yet
