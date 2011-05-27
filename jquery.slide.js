( function( $ ) {
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

        randomizeSlides: false,
        
        // css
        wrapperClass: 'slide-wrapper',

        // callbacks
        onBeforeSlide: function() {},
        onAfterSlide:  function() {},
        
        onBeforeLastSlide: function() {},
        onAfterLastSlide:  function() {},

        // slides
        slides: $slides,
        firstNumber: 0,
        lastNumber: $slides.length - 1,
        currentNumber: 0,

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
      this.slideTo( options.currentNumber );
    },

    // slide functions
    slideNext: function() {
      var number = this._nextSlideNumber();

      // check whether to randomize the number
      if( this.data('slide').randomizeSlides ) number = this._randomSlideNumber();

      this.slideTo( number );
    },

    slidePrev: function() {
      var number = this._prevSlideNumber();

      // check whether to randomize the number
      if( this.data('slide').randomizeSlides ) number = this._randomSlideNumber();

      this.slideTo( number );
    },
    
    slideTo: function( number ) {
      // update the cycle variables/counters
      this._updateVisited( number );

      // before callbacks
      if( this._isLastSlide() ) this.data('slide').onBeforeLastSlide();
      this.data('slide').onBeforeSlide();

      // actual slide action
      this.data('slide').currentNumber = number; //set current slide
      this._applyTransition(); // perform the transition


      // after callbacks
      this.data('slide').onAfterSlide();

      if( this._isLastSlide() ) {
        this._resetCycleVars();
        this.data('slide').onAfterLastSlide();
      };
    },

    enableSlideControls: function() {
      var _this = this;
      var options = $(this).data('slide');

      if( options.next ) {
        $(options.next).bind( 'click.slideNext', function() {
          _this.slideNext();
          return false;
        });
      };

      if( options.prev ) {
        $(options.prev).bind( 'click.slidePrev', function() {
          _this.slidePrev();
          return false;
        });
      };
    }, 

    disableSlideControls: function() {
      var options = this.data('slide');
      
      if( options.next ) $(options.next).unbind( 'click.slideNext' );
      if( options.prev ) $(options.prev).unbind( 'click.slidePrev' );
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
      this.data('slide').notCycleVisited = [];

      for( var i=this.data('slide').firstNumber; i<=this.data('slide').lastNumber; i++ ) {
        this.data('slide').cycleVisited[i] = 0;
        this.data('slide').notCycleVisited.push(i);
      };
    },

    _currentSlide: function() {
      var $slides = this.data('slide').slides;
      return $( $slides[this.data('slide').currentNumber] );
    },

    _nextSlideNumber: function() {
      if( this.data('slide').currentNumber == this.data('slide').lastNumber ) {
        return this.data('slide').firstNumber;
      };

      return this.data('slide').currentNumber + 1;
    },

    _prevSlideNumber: function() {
      if( this.data('slide').currentNumber == this.data('slide').firstNumber ) {
        return this.data('slide').lastNumber;
      };

      return this.data('slide').currentNumber - 1;
    },

    _randomSlideNumber: function() {
      var index = Math.floor(Math.random() * this.data('slide').notCycleVisited.length);
      return this.data('slide').notCycleVisited[index];
    },

    // returns true of false depending on whether all slides were visited for a current cycle
    _isLastSlide: function() {
      var cycleVisited = this.data('slide').cycleVisited;
      
      for( var i=0; i<=this.data('slide').lastNumber; i++) {
        if( cycleVisited[i] == 0 ) return false;
      };

      return true;
    },

    _applyTransition: function() {
      var transition = this.data('slide').transition;
      var position = { 'top': '-' + this._currentSlide().position().top + 'px' };

      switch( transition ) {
        case 'fade':
          this.fadeOut().
            css( position ).
            fadeIn();
          break;
        case 'toggle':
          this.hide().
            css( position ).
            show();
          break;
        default:
          this.animate( position );
      }
    },

    _updateVisited: function( number ) {
      // TODO: should refactor this and put it into some _init function --R
      if( this.data('slide').visited[number] == undefined ) this.data('slide').visited[number] = 0;

      this.data('slide').visited[number] += 1;
      this.data('slide').cycleVisited[number] += 1;

      // remove from `not visited array`
      var index = this.data('slide').notCycleVisited.indexOf( number );
      this.data('slide').notCycleVisited.splice( index, 1 );
    }
    
  });
  
})( jQuery );
