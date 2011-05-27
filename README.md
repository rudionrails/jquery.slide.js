# jQuery slide


Version 0.1.0

Rudolf Schmidt (rudionrails)


## Usage 

    $( '#controlId' ).slide({
    	transition: 'animate', 						// 'animate', 'fade', 'toggle'

      // controls
      controls: true, 									// whether to show controls in general

      nextControl: true, 								// whether to show the next control: true, false
      nextSelector: null,       				// user defined container for next control, e.g.: $('#next')
      nextControlText: 'next',  				// text for the next control (ignored when nextSelector is given)
      nextControlClass: 'slide-next', 	// css class for the next control (ignored when nextSelector is given) 

      prevControl: true, 								// whether to show the prev control: true, false
      prevSelector: null,           		// user defined container for prev control, e.g.: $('#prev')
      prevControlText: 'prev', 					// text for the prev control (ignored when prevSelector is given)
      prevControlClass: 'slide-prev', 	// css class for the prev control (ignored when prevSelector is given)
			
			// randomizer
      randomizeSlides: false, 					// whether to randomly cycle through the slides

      // callbacks
      onBeforeSlide: function() {}, 		// callback executed before a slide transition
      onAfterSlide:  function() {}, 		// callback executed after a slide transition
      
      onBeforeLastSlide: function() {}, // callback executed before a the last slide transition of a current cycle
      onAfterLastSlide:  function() {}, // callback executed before a the last slide transition of a current cycle
    });
    
## Dependencies

jQuery 1.2.6 or higher (http://jquery.com/)


## Licensing & Terms of Use

This plugin is dual-licensed under the GNU General Public License V2 and the MIT License and
is copyright 2011 Rudolf Schmidt.


