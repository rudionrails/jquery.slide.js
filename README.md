jQuery slide
============

Version 0.1.0

Rudolf Schmidt (rudionrails)


Usage 
-----

  $( '#controlId' ).slide( options );


Options
-------

	transition 					- The transition effect upon sliding: 'animate', 'fade', 'toggle' - default: 'animate'

  // controls
  controls 						- Whether to show controls in general: true, false - default: true
	
	// if `controls` is false, the following section is ignored
  nextControl					- whether to show the next control: true, false - default: true
  nextSelector				- user defined container for next control, e.g.: $('#next'); - default: null
  nextControlText 		- text for the next control (ignored when nextSelector is given) - default: 'next'
  nextControlClass 		- css class for the next control (ignored when nextSelector is given) - default: 'slide-next'

  prevControl					- whether to show the prev control: true, false - default: true
  prevSelector				- user defined container for prev control, e.g.: $('#prev'); - default: null: null
  prevControlText			- text for the prev control (ignored when prevSelector is given) - default: 'prev'
  prevControlClass		- css class for the prev control (ignored when prevSelector is given) - default: 'slide-prev'

	// randomizer
  randomizeSlides			- whether to randomly cycle through the slides: true, false - default: false
  
  // callbacks
  onBeforeSlide				- callback executed before a slide transition - default: function() {}
  onAfterSlide 				- callback executed after a slide transition - default: function() {}
  
  onBeforeLastSlide		- callback executed before a the last slide transition of a current cycle - default: function() {}
  onAfterLastSlide		- callback executed after a the last slide transition of a current cycle


Dependencies
------------

jQuery 1.2.6 or higher (http://jquery.com/)


Licensing & Terms of Use
------------------------

This plugin is dual-licensed under the GNU General Public License V2 and the MIT License and
is copyright 2011 Rudolf Schmidt.


