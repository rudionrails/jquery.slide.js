( function( $ ) {

  // hello Internet Explorer, if you don't know this method, then I'll teach you ;-) --R
  if( !Array.indexOf ) {
    Array.prototype.indexOf = function(idx) {
      for(var i=0; i<this.length; i++) {
        if( this[i] == idx) return i;
      }
      return -1;
    }
	}
  
  $.extend( $.fn, {
    slide: function( o ) {
      var $slides = this.children();

      var options = $.extend({
        transition: 'animate',        // 'animate', 'fade', 'toggle'

        // controls
        controls: true,

        next: null, 
        nextControl: true,
        nextSelector: null,           // user defined container for next control, not yet implemented
        nextControlText: 'next',
        nextControlClass: 'slide-next',

        prev: null, 
        prevControl: true,
        prevSelector: null,           // user defined container for prev control, not yet implemented
        prevControlText: 'prev',
        prevControlClass: 'slide-prev',

        randomizeSlides: false,       // not yet implemented
        
        // css
        wrapperClass: 'slide-wrapper',

        // callbacks
        onBeforeSlideOut: function() {},
        onAfterSlideOut:  function() {},

        onBeforeSlideIn: function() {},
        onAfterSlideIn:  function() {}, 

        // slides
        slides: $slides,
        firstSlideNumber: 0,
        lastSlideNumber: $slides.length - 1,
        currentSlideNumber: 0,
        previousSlideNumber: null,

        visited: []
      }, o );

      // apply the options as element data
      this.data( 'slide', options );
      this._resetCycleVars(); // init for cycleVisited array

      // init
      this._initWrapper( options );

      if( options.controls ) {
        this._initSlideControls( options );
        this.enableSlideControls();
      };

      // go to starting slide
      this.slideTo( options.currentSlideNumber );
    },

    /*
     * Slides to the next slide
     *
     * @example Slide to the next slide
     *   $('#slider').slideNext();
     *
     */
    slideNext: function( caller ) {
      if( this.data('slide').randomizeSlides ) {
        this.slideTo( this._randomSlideNumber(), caller );
      } else {
        this.slideTo( this._nextSlideNumber(), caller );
      }
    },

    /*
     * Slides to the previous slide
     *
     * @example Slide to the previous slide
     *   $('#slider').slidePrev();
     *
     */
    slidePrev: function( caller ) {
      if( this.data('slide').randomizeSlides ) {
        this.slideTo( this._randomSlideNumber(), caller );
      } else {
        this.slideTo( this._prevSlideNumber(), caller );
      }
    },

    /*
     * Slides to the given slide number
     *
     * @example Slide to the first slide
     *   $('#slider').slideTo( 0 );
     *
     * @example Slide to the second slide
     *   $('#slider').slideTo( 1 );
     *
     * @param [ Integer ] number  The numeric value of the slide to transition to
     * 
     */
    slideTo: function( number, caller ) {
      this.queue( 'slide', function(next) {
        $(this).disableSlideControls();
        $(this).data('slide').onBeforeSlideOut.call(this, $(this).data('slide').currentSlideNumber, number, caller );

        next();
      });

      this._queuedTransitionTo( number, function(next) {
        var $_this = $(this);

        $_this.data('slide').onAfterSlideOut.call(this, $(this).data('slide').currentSlideNumber, number, caller );

        if( $_this.isSlideCycleCompleted() ) $_this._resetCycleVars();
        
        $_this._updateVisited( number );
        $_this.data('slide').previousSlideNumber = $_this.data('slide').currentSlideNumber;
        $_this.data('slide').currentSlideNumber = number;

        $_this.data('slide').onBeforeSlideIn.call(this, number, $(this).data('slide').previousSlideNumber, caller );

        next();
      });

      this.queue( 'slide', function(next) {
        $(this).data('slide').onAfterSlideIn.call(this, number, $(this).data('slide').previousSlideNumber, caller );
        $(this).enableSlideControls();

        next();
      });

      this.dequeue( 'slide' ); // execute
    }, 

    /*
     * Enables the slider controls
     *
     * @example Enable slider controls
     *   $('#slider').enableSlideControls();
     *   
     */
    enableSlideControls: function() {
      var _this = this;
      var options = $(this).data('slide');

      if( options.next ) {
        $(options.next).bind( 'click.slideNext', function() {
          _this.slideNext(this);
          return false;
        }).removeAttr( 'disabled' );
      };

      if( options.prev ) {
        $(options.prev).bind( 'click.slidePrev', function() {
          _this.slidePrev(this);
          return false;
        }).removeAttr( 'disabled' );
      };
    },

    /*
     * Disables the slider controls
     *
     * @example Disable slider controls
     *   $('#slider').disableSlideControls();
     *
     */
    disableSlideControls: function() {
      var options = this.data('slide');

      if( options.next ) $(options.next).attr('disabled', true).unbind( 'click.slideNext' );
      if( options.prev ) $(options.prev).attr('disabled', true).unbind( 'click.slidePrev' );
    },

    /*
     * Determines whether all slides have been viewed for one cycle
     *
     * @example Check if cycle is complete
     *   $('#slider').isSlideCycleCompleted();
     *
     * @return [ true, false ]
     */
    isSlideCycleCompleted: function() {
      var cycleVisited = this.data('slide').cycleVisited;

      for( var i=0; i<=this.data('slide').lastSlideNumber; i++) {
        if( cycleVisited[i] == 0 ) return false;
      };

      return true;
    },

    /*
     * Aborts anything happening (clears the internal queue)
     *
     * @example
     *   $('#slider').abort();
     */
    abort: function() {
      $(this).clearQueue( 'slide' );
    },
    
    // private
    _initWrapper: function( options ) {
      // add wrapper
      var style = { height: this.outerHeight()+'px', width: this.outerWidth()+'px' };
      this.wrap('<div class="'+ options.wrapperClass +'" style="height: '+style.height+'; width: '+style.width+'; overflow: hidden; position: relative"></div>');

      // update parent
      this.css({
        height: '999999px',
        position: 'absolute'
      });
    },

    _initSlideControls: function( options ) {
      var $_this = this;

      // next control
      if( options.nextControl ) {
        if( options.nextSelector ) {
          options.next = $( options.nextSelector );
        } else {
          options.next = $('<a href="#" class="'+ options.nextControlClass +'"></a>');
          options.next.html( options.nextControlText );

          $_this.after( options.next );
        };
      };

      // prev control
      if( options.prevControl ) {
        if( options.prevSelector ) {
          options.prev = $( options.prevSelector );
        } else {
          options.prev = $('<a href="#" class="'+ options.prevControlClass +'"></a>');
          options.prev.html( options.prevControlText );

          $_this.after( options.prev );
        };
      }
    },

    _resetCycleVars: function() {
      this.data('slide').cycleVisited = [];
      this.data('slide').cycleNotVisited = [];

      for( var i=this.data('slide').firstSlideNumber; i<=this.data('slide').lastSlideNumber; i++ ) {
        this.data('slide').cycleVisited[i] = 0;
        this.data('slide').cycleNotVisited.push(i);
      };
    },

    _slideFor: function( number ) {
      var $slides = this.data('slide').slides;

      return $( $slides[number] );
    },

    _nextSlideNumber: function() {
      if( this.data('slide').currentSlideNumber == this.data('slide').lastSlideNumber ) {
        return this.data('slide').firstSlideNumber;
      };

      return this.data('slide').currentSlideNumber + 1;
    },

    _prevSlideNumber: function() {
      if( this.data('slide').currentSlideNumber == this.data('slide').firstSlideNumber ) {
        return this.data('slide').lastSlideNumber;
      };

      return this.data('slide').currentSlideNumber - 1;
    },

    _randomSlideNumber: function() {
      var index = Math.floor(Math.random() * this.data('slide').cycleNotVisited.length);
      return this.data('slide').cycleNotVisited[index];
    },

    _queuedTransitionTo: function( number, callback ) {
      var _this = this;
      var transition = this.data('slide').transition;

      var top = this._slideFor( number ).position().top;
      var position = { 'top': '-'+ top +'px' };
      
      this.queue( 'slide', function(next) {
//        console.log( 'fadeOut ('+ $(this).attr('class') +')' );
        $(this).animate({opacity:"hide"}, next); // fadeOut
      }).queue( 'slide', function(next) {
        callback.call(this, next);
      }).queue( 'slide', function(next) {
//        console.log( ' * css' );
        $(this).css( position ); next();
      }).queue( 'slide', function(next) {
//        console.log( ' * fadeIn ('+ $(this).attr('class') +')' );
        $(this).animate({opacity:"show"}, next); // fadeIn
      });
    }, 

    _updateVisited: function( number ) {
      // TODO: should refactor this and put it into some _init function --R
      if( this.data('slide').visited[number] == 'undefined' ) this.data('slide').visited[number] = 0;

      this.data('slide').visited[number] += 1;
      this.data('slide').cycleVisited[number] += 1;

      // remove from `not visited array`
      var index = this.data('slide').cycleNotVisited.indexOf( number );
      this.data('slide').cycleNotVisited.splice( index, 1 );
    }
    
  });
  
})( jQuery );
