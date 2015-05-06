(function($){
	if (typeof smashOrbit == 'undefined') {
		var smashOrbit = {};
	}

	var win = $(window);

	smashOrbit.main = {
		header: $("header"),
		footer: $("footer"),
		isMobile: false,
		init: function () { // Initiation
			$.Android = (navigator.userAgent.match(/Android/i));
			$.iPhone = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)));
			$.iPad = ((navigator.userAgent.match(/iPad/i)));
			$.iOs4 = (/OS [1-4]_[0-9_]+ like Mac OS X/i.test(navigator.userAgent));

			if ($.iPhone || $.iPad || $.Android) {
				isMobile = true;
			}

			this.registerSections();
			smashOrbit.navigation.init();
		},
		registerSections: function() {
			if($(".angle").length) 		smashOrbit.angles.adjustElements();
			if($(".homepage").length) smashOrbit.homepage.init();
			if($(".caseStudy").length) smashOrbit.caseStudy.init();
			if($("#slider2").length) smashOrbit.featuredWorkSlider.setupSlider();
		}
	}

	smashOrbit.registerEvents = {
		resize: function() {
			win.resize(function() {
				smashOrbit.angles.adjustElements(); // for purposes of footer adjustment only
				//smashOrbit.homepage.splash.height(win.height());
				//smashOrbit.homepage.intro.css("margin-top", win.height());
				//smashOrbit.navigation.nav.height(win.height());
			});
		},
		scroll: function() {
			win.scroll(function() {
				if($("body").scrollTop() >= win.height()) {
					TweenMax.to(smashOrbit.main.header, .5, { background: "rgba(0,0,0,0.9)"});
					TweenMax.to(smashOrbit.main.header.find("a#logo"), .5, { alpha: 1 });
					if(win.width() > 768) {smashOrbit.homepagesplash.css("background", "#000");}
					smashOrbit.homepage.find("#logo").add("#slogan").hide();
					smashOrbit.homepage.downArrow.hide();
					//arrowTL.pause();
				} else {
					TweenMax.to(smashOrbit.main.header, .5, { background: "rgba(0,0,0,0.0)"});
					TweenMax.to(smashOrbit.main.header.find("a#logo"), .5, { alpha: 0 });
					if(win.width() > 768) {smashOrbit.homepage.splash.css("background", spashBackground);}
					smashOrbit.homepage.find("#logo").add("#slogan").show();
					smashOrbit.homepage.downArrow.show();
					//arrowTL.play();
				}

				if(win.width() < 768) {
					smashOrbit.navigation.colorOverlay.height(win.height() + 150);
				}
			});	
		}
	}

	smashOrbit.angles = {
		angle: $(".angle"),
		footer: $("footer"),
		calculateAngles: function() {
			return ($(window).width() * 0.1763) / 2; // 0.1763 = tan(10deg)
		},
		adjustElements: function() {
			$(".marginUp").css("margin-top", -this.calculateAngles());

			this.angle.parent().find(".container").css({
				paddingTop: this.calculateAngles(),
				paddingBottom: this.calculateAngles()
			});

			this.footer.css({
				paddingTop: (this.calculateAngles() * 2),
				marginTop: (this.calculateAngles() * -1) - 30 // 30 added for additional spacing
			});

			$("#colorOverlay").css({
				height: win.height() + (this.calculateAngles()*2) + 20,
				marginTop: 10
			});
		}
	}

	smashOrbit.navigation = {
		trigger: $(".menu-trigger"),
		nav: $("#main-navigation"),
		navOverlay: $("#colorOverlay"),
		startY: 0,
		endY: 0,
		init: function() {
			this.registerClickEvents();
		},
		registerClickEvents: function() {
			var self = this;
			this.trigger.on('click', function(e) {		
				if($(window).width() < 768) {
					self.startY = (win.height() + (smashOrbit.angles.calculateAngles()*2) + 130)
					self.endY = -40;
				} else {
					self.startY = (win.height() + (smashOrbit.angles.calculateAngles()*2) + 15);
					self.endY = 4;
				}
				if(win.height() < 340 ) {
					self.endY = -90
				}
				if(!self.nav.hasClass("open")) {
					self.openMenu();
					
				} else {
					self.closeMenu();
					
				}
				e.preventDefault();
			});

			this.nav.find("a").on('click', function(e) {
				var link = $(this).data("link");
				//console.log(link);
				self.nav.removeClass("open");
				self.nav.height(win.height()).fadeOut(300, function() {
					$("html, body").animate({
						scrollTop: $("#" + link).find("h2").first().offset().top - smashOrbit.main.header.outerHeight() - 30
					}, 1000);
				});
				e.preventDefault();
			});
		},
		openMenu: function() {
			this.nav.show();
			this.nav.addClass("open");
			this.nav.find('ul').css("perspective", "1000px");
			TweenMax.set(this.navOverlay, { transform: "translateZ(0) rotate(-10deg) translateY(-" + this.startY + "px)"});
			TweenMax.set(this.nav.find('li'), { rotationY: -264, alpha: 0});
			TweenMax.to(this.navOverlay, .6, { transform: "translateZ(0) rotate(-10deg) translateY(" + this.endY + "px)" , onComplete: function() {
				smashOrbit.navigation.nav.find('li').each(function(i) {
					TweenMax.fromTo($(this), .8, {transformPerspective: 1000, transformOrigin: "center center 100px", rotationY: -264, alpha: 0}, { delay: i*.2, rotationY: 0, alpha: 1});
				});
			}});
			this.nav.height(win.height()).show();
		},
		closeMenu: function() {
			this.nav.removeClass("open");
			TweenMax.to(this.nav.find('li'), .3, { alpha: 0, rotationY: -89, onComplete: function() {
				TweenMax.to(smashOrbit.navigation.navOverlay, .6, { transform: "translateZ(0) rotate(-10deg) translateY(-" + smashOrbit.navigation.startY + "px)", onComplete: function(){
					smashOrbit.navigation.nav.hide();
				}});
			}});
			this.nav.height(win.height());
		}
	}

	smashOrbit.homepage = {
		splash: $("#splash"),
		spashBackground: $(splash).css("background"),
		downArrow: $(".downArrow"),
		intro: $("#intro"),
		init: function() {
			this.splash.height(win.height());
			this.intro.animate({marginTop: win.height()}, 1000);
		}
	}

	smashOrbit.caseStudy = {
		splash: $("#splash"),
		spashBackground: $(splash).css("background"),
		downArrow: $(".downArrow"),
		intro: $("#intro"),
		init: function() {
			this.splash.height(win.height() * 0.75);
			this.intro.css({marginTop: win.height() * 0.6});
		}
	}

	smashOrbit.featuredWorkSlider = {
		animationSpeed: 500,
		slider: $("#slider2"),
		slidesWidth: $("#slider2").find(".slide").innerWidth(),
		currentSlide: 1,
		animating: false,
		setupSlider: function() {
			var self = this;
			this.slides = this.slider.find(".slide");
			this.slidesWidth = this.slides.width() + 2;
			var sliderHTML = this.slider.html();
			this.slider.html("").append("<div id='slidesWrapper'></div>");
			this.slidesWrapper = $("#slidesWrapper");
			this.slidesWrapper.html(sliderHTML);
			this.slidesWrapper.width((this.slider.width() + 2) * (this.slides.length + 1)).height(this.slider.height());

			this.slides = this.slidesWrapper.find(".slide");
			
			var lastSlide = this.slides.last().clone().addClass("clone");
			this.slidesWrapper.prepend(lastSlide);
			
			this.slides.width(this.slider.width() + 2);
			this.slidesWidth = this.slides.width();


			TweenMax.set(this.slidesWrapper, { x: -(this.slidesWidth), height: "100%", force3D:true })
			
			$(".bx-wrapper .bx-prev").on('click', function(e) {
				if(!self.animating) self.goToPrevSlide();				
				e.preventDefault();
			});
			$(".bx-wrapper .bx-next").on('click', function(e) {
				if(!self.animating) self.goToNextSlide()
				e.preventDefault();
			});

			$(window).resize(function() {
				self.slides.add(".clone").width(self.slider.width() + 2);
				self.slidesWidth = self.slides.width();
				self.slidesWrapper.width(self.slidesWidth * (self.slides.length + 1)).height(self.slider.height());
				TweenMax.set(self.slidesWrapper, { x: -(self.slidesWidth * self.currentSlide) })
			});
		},
		goToNextSlide: function() {
			var self = this;
			if(this.currentSlide == this.slides.length) {
				TweenMax.set(this.slidesWrapper, { x: 0 })
				this.currentSlide = 0;
			}
			++this.currentSlide;
			this.animating = true;
			TweenMax.to(this.slidesWrapper, this.animationSpeed/1000, { x: -(this.slidesWidth * this.currentSlide), onComplete: function() { self.animating = false; } })
			
		},
		goToPrevSlide: function() {
			var self = this;
			if(this.currentSlide == 0) {
				TweenMax.set(this.slidesWrapper, { x: -(this.slidesWrapper.width() - this.slidesWidth) })
				this.currentSlide = this.slides.length;
			}
			--this.currentSlide;
			this.animating = true;
			TweenMax.to(this.slidesWrapper, this.animationSpeed/1000, { x: -(this.slidesWidth * this.currentSlide), onComplete: function() { self.animating = false; } })
			
		},
		resetSlider: function() {

		}
	}

	smashOrbit.main.init();
//})(jQuery);




// function setAngleWidth() {
// 	$(".angle").each(function() {
// 		var bodyWidth = $("body").innerWidth();
// 		var cosine = 10 * (Math.PI / 180);
// 		var angleWidth = Math.ceil(bodyWidth * Math.cos(cosine)) - 1;
// 		$(this).width(angleWidth);
// 	});
// }

// function calculateAngles() {
// 	return ($(window).width() * 0.1763) / 2; // 0.1763 = tan(10deg)
// }

// function adjustElements() {
// 	$(".marginUp").css("margin-top", -calculateAngles());

// 	$(".angle .container").css({
// 		paddingTop: calculateAngles(),
// 		paddingBottom: calculateAngles()
// 	});

// 	$("#colorOverlay").css({
// 		height: $(window).height() + (calculateAngles()*2) + 20,
// 		marginTop: 10
// 	});
// }

//(function($) {
	
	

	// Resize Functionality
	 $(window).resize(function() {
	 	smashOrbit.registerEvents.resize();
	// 	$("#splash").height($(window).height());
	// 	$("#intro").css("margin-top", $(window).height());
	// 	$("#main-navigation").height($(window).height());
	 });

	// $("#main-navigation").scroll(function() {
	// 	$(this).height($(window).resize())
	// });

	// Scroll Functionality
	// $(window).scroll(function() {
		
	// 		if($("body").scrollTop() >= $(window).height()) {
	// 			TweenMax.to($("header"), .5, { background: "rgba(0,0,0,0.9)"});
	// 			TweenMax.to($("header a#logo"), .5, { alpha: 1 });
	// 			if($(window).width() > 768) {splash.css("background", "#000");}
	// 			$("#splash #logo").add("#slogan").hide();
	// 			smashOrbit.homepage.downArrow.hide();
	// 			arrowTL.pause();

	// 		} else {
	// 			TweenMax.to($("header"), .5, { background: "rgba(0,0,0,0.0)"});
	// 			TweenMax.to($("header a#logo"), .5, { alpha: 0 });
	// 			if($(window).width() > 768) {splash.css("background", spashBackground);}
	// 			$("#splash #logo").add("#slogan").show();
	// 			smashOrbit.homepage.downArrow.show();
	// 			arrowTL.play();
	// 		}
		


	// 	if($(window).width() < 768) {
	// 		$("#colorOverlay").height($(window).height() + 150)
	// 	}
	// });

	var nav = $("#main-navigation");
	var navOverlay = $("#colorOverlay");
	var startY;
	var endY;

	TweenMax.fromTo($("#splash"), 2, { backgroundSize: "200% 200%" }, { backgroundSize: "100% 100%" });
	
	// Menu Navigation Functionality
	// $(".menu-trigger").on('click', function(e) {
		
	// 	if($(window).width() < 768) {
	// 		startY = ($(window).height() + (smashOrbit.angles.calculateAngles()*2) + 130)
	// 		endY = -40;
	// 	} else {
	// 		startY = ($(window).height() + (smashOrbit.angles.calculateAngles()*2) + 15);
	// 		endY = 4;
	// 	}
	// 	if($(window).height() < 340 ) {
	// 		endY = -90
	// 	}
	// 	if(!nav.hasClass("open")) {
	// 		nav.show();
	// 		nav.addClass("open");
	// 		nav.find('ul').css("perspective", "1000px");
	// 		TweenMax.set(navOverlay, { transform: "translateZ(0) rotate(-10deg) translateY(-" + startY + "px)"});
	// 		TweenMax.to(navOverlay, .6, { transform: "translateZ(0) rotate(-10deg) translateY(" + endY + "px)" , onComplete: function() {
	// 			nav.find('li').each(function(i) {
	// 				TweenMax.fromTo($(this), .8, {transformPerspective: 1000, transformOrigin: "center center 100px", rotationY: -264, alpha: 0}, { delay: i*.2, rotationY: 0, alpha: 1});
	// 			});
	// 		}});
	// 		nav.height($(window).height()).show();
	// 	} else {
			
	// 		nav.removeClass("open");
	// 		TweenMax.to(nav.find('li'), .3, { alpha: 0, rotationY: -89, onComplete: function() {
	// 			TweenMax.to(navOverlay, .6, { transform: "translateZ(0) rotate(-10deg) translateY(-" + startY + "px)", onComplete: function(){
	// 				nav.hide();
	// 			}});
	// 		}});
	// 		nav.height($(window).height());
	// 	}
	// 	e.preventDefault();
	// });

	// nav.find("a").on('click', function(e) {
	// 	var link = $(this).data("link");
	// 	console.log(link);
	// 	nav.removeClass("open");
	// 	nav.height($(window).height()).fadeOut(300, function() {
	// 		$("html, body").animate({
	// 			scrollTop: $("#" + link).find("h2").first().offset().top - $("header").outerHeight() - 30
	// 		}, 1000);
	// 	});
	// 	e.preventDefault();
	// });

	// TweenMax.set($("#splash"), {  "transform-style": "preserve-3d"})
 // TweenMax.fromTo($("#splash"), 4, { transform: "translateZ(0px)" }, { transform: "translateZ(80px)" });

	smashOrbit.angles.adjustElements;

// 	$(".orbit").each(function() {
// 		var planet = $("<div class='planet'></div>");
// 		var pWidth = $(this).outerWidth();
// 		var pHeight = $(this).outerHeight();
// 		var percentages = [.44, .44, .25, .89, .26, .94, .26, .94];
// 		var percentages2 = [.26, .94, .26, .94, .31, .93, .60, .54];
// 		var percentages3 = [.60, .54, .79, .13, .77, .6, .77, .6];
// 		var percentages4 = [.77, .6, .77, .6, .71, .8, .44, .44];
// 		var dataLength = percentages.length;
// 		var points = [];
// 		var pointsString = "",
// 			pointsString2 = "",
// 			pointsString3 = "",
// 			pointsString4 = "";

// 		$(this).append(planet);
// 		var tl = new TimelineMax;
// 		TweenMax.set(planet, { rotation: "-40" });

// 		for (var i = 0; i < percentages.length; i+=2){
// 			var point = {};
// 			point.x = parseInt(percentages[i] * pWidth)
// 			point.y = parseInt(percentages[i+1] * pHeight)
// 			points.push(point)
// 			pointsString += "{x:" + point.x +", y:" + point.y +"},"
// 		}
// console.log(points)
// 		tl.to(planet, 1, { bezier:{type:"cubic", values:points}, scale: .75, zIndex: -10, ease: Sine.easeOut });
// 		points = [];

// 		for (var i = 0; i < percentages2.length; i+=2){
// 			var point = {};
// 			point.x = parseInt(percentages2[i] * pWidth)
// 			point.y = parseInt(percentages2[i+1] * pHeight)
// 			points.push(point)
// 			pointsString2 += "{x:" + point.x +", y:" + point.y +"},"
// 		}
// console.log(points)
// 		tl.to(planet, 1, { bezier:{type:"cubic", values:points}, scale: 1.1, zIndex: -10, ease: Sine.easeIn });
// 		points = [];

// 		for (var i = 0; i < percentages3.length; i+=2){
// 			var point = {};
// 			point.x = parseInt(percentages3[i] * pWidth)
// 			point.y = parseInt(percentages3[i+1] * pHeight)
// 			points.push(point)
// 			pointsString3 += "{x:" + point.x +", y:" + point.y +"},"
// 		}
// console.log(points)
// 		tl.to(planet, 1, { bezier:{type:"cubic", values:points}, scale: .75, zIndex: -10, ease: Sine.easeOut });
// 		points = [];

// 		for (var i = 0; i < percentages4.length; i+=2){
// 			var point = {};
// 			point.x = parseInt(percentages4[i] * pWidth)
// 			point.y = parseInt(percentages4[i+1] * pHeight)
// 			points.push(point)
// 			pointsString4 += "{x:" + point.x +", y:" + point.y +"},"
// 		}

// 		tl.to(planet, 1, { bezier:{type:"cubic", values:points}, scale: .25, zIndex: -10, ease: Sine.easeIn });

// 			console.log(points)
			
			

		// tl.to($(this), 1, { bezier:{type:"cubic", values:[{x:100, y:30}, {x:10, y:40}, {x:0, y:50}, {x:0, y:50}]}, scale: .75, zIndex: -10, ease: Sine.easeOut })
		// 	.to($(this), 1, { bezier:{type:"cubic", values:[{x:0, y:50}, {x:0, y:50}, {x:10, y:60}, {x:100, y:70}]}, scale: 1, zIndex: -10, ease: Sine.easeIn })
		// 	.to($(this), 1, { bezier:{type:"cubic", values:[{x:100, y:70}, {x:190, y:60}, {x:200, y:50}, {x:200, y:50}]}, scale: .75, zIndex: -10, ease: Sine.easeOut })
		// 	.to($(this), 1, { bezier:{type:"cubic", values:[{x:200, y:50}, {x:200, y:50}, {x:190, y:40}, {x:100, y:30}]}, scale: .5, zIndex: -10, ease: Sine.easeIn })

		// tl.to($(this), 2, { bezier:{type:"cubic", values:[{x:100, y:30}, {x:0, y:40}, {x:0, y:60}, {x:100, y:70}]}, scale: .5, zIndex: -10, ease: Linear.easeInOut })
		// 	.to($(this), 2, { bezier:{type:"cubic", values:[{x:100, y:70}, {x:200, y:60}, {x:200, y:40}, {x:100, y:30}]}, scale: 1, zIndex: 10, ease: Linear.easeInOut })

	// 		tl.repeat(-1)
	// });

// $(document).ready(function() {
// 	if($("#slider").length) {
// 		$("#slider").bxSlider({
// 			pager: false,
// 			slideWidth: 619
// 		});
// 	}
	
// });


var speed = .4;

	 $(".callout").on('click', function() {
        var calloutLeft = $(".callout").eq(0).offset().left;
        var calloutTop = $(".callout").eq(0).offset().top;
        
        if(!$(this).hasClass("active")) {
            $(".callout").removeClass("active");
            $(this).addClass("active");
            TweenMax.to($(".callout"), speed, { left: 0, top: 0 });
            if($(this).parent().index() == 0) {
                console.log("yep")
            } else if($(this).parent().index() == 1) {
                TweenMax.to($(this), speed, { left: -$(this).outerWidth(), top: $(".callout").eq(0).css("margin-top") })
            } else {
                TweenMax.to($(this), speed, { left: -$(this).outerWidth() * 2, top: parseInt($(".callout").eq(0).css("margin-top")) * 2 })
            }
        } else {
           var callout = $(this);

            TweenMax.to($(this), speed, { left: 0, top: 0, onComplete: function() {
                callout.removeClass("active");;
            }});
        }
    });

	var arrowTL = new TimelineMax;
	arrowTL.fromTo($(".animatedBorder"), 1, { scale: 1 }, { delay: .8, scale: 1.4, ease: Power2.easeInOut }, "first")
		.fromTo($(".animatedBorder"), .5, { alpha: 0 }, { alpha: 1 }, "-=1")
		.fromTo($(".animatedBorder"), .5, { alpha: 1 }, { alpha: 0 }, "-=.5").repeat(-1)

	$(".downArrow").on('click', function() {
		$("html, body").animate({
			scrollTop: $("#intro h2").offset().top - $("header").outerHeight() - 30
		}, 1000);
	});

	$("#workWithUsBtn").on('click', function(e) {
		$("html, body").animate({
			scrollTop: $("#contactUs h2").offset().top - $("header").outerHeight() - 30
		}, 1000);
		e.preventDefault();
	});

	$(".btn2").hover(function(){
		TweenMax.to(this, .3, {backgroundColor: "rgba(255,255,255,0.8)", color: "black"});
	}, function() {
		TweenMax.to(this, .3, {backgroundColor: "transparent", color:"white"});
	});


})(jQuery);