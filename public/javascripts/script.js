$(function() {

	$("#main").click(function(){
		$("#main").animate({
			width: "100px",
			height: "100px"
		},
		500, function() {
			alert("hfsn");
		});
	});

	var canvas = document.getElementById("main");
	var ctx = canvas.getContext("2d");

    var context = new webkitAudioContext();
    var analyser = context.createAnalyser();
    navigator.webkitGetUserMedia(
        {video: false, audio: true}, 
        function(stream) {
            var microphone = context.createMediaStreamSource(stream);
            microphone.connect(analyser);     
        }
    );

	var color = "rgb(255, 145, 0)";

    drawAnimation();

    function drawAnimation() {
        window.webkitRequestAnimationFrame(drawAnimation, canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        var freqByteData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqByteData); 

        var volume = getAverageVolume(freqByteData);

//        $.drawFftBars(freqByteData);
//        $.drawCircle(volume);
//        $.drawTime();

		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.globalAlpha = 0.7;
		ctx.arc(50, 50, volume * 3, 0, Math.PI*2, false);
		ctx.fill();
		ctx.closePath();


		ctx.beginPath();
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = 'rgb(255, 245, 0)'
		ctx.arc(1000, 50, volume * 0.5, 0, Math.PI*2, false);
   		ctx.fill();
 		ctx.closePath();
		
		ctx.beginPath();
		ctx.fillStyle = 'rgb(255, 195, 0)'
		ctx.globalAlpha = 0.3;
		ctx.arc(100, 300, volume * 2, 0, Math.PI*2, false);
		ctx.fill();
 		ctx.closePath();
		
		ctx.beginPath();
		ctx.fillStyle = 'rgb(255, 100, 0)'
		ctx.arc(800, 500, volume * 1.5, 0, Math.PI*2, false);
		ctx.fill();
		ctx.fillStyle = color;
        ctx.closePath();

		ctx.globalAlpha = 1;

		var dateFormat = new DateFormat("HH:mm:ss");
		var string = dateFormat.format(new Date());

		ctx.beginPath();

		ctx.font = "300px 'Bigelow Rules'"
		ctx.fillText(string, 150, 500);
		ctx.closePath();


	}

    function getAverageVolume(array) {
        var values = 0;
        var average;
        var max = 0;
        var length = array.length;

        for (var i = 0; i < length; i++) {
            values += Math.abs(array[i]);
        }
        average = values / length;
        return average;
    }


});



$(function() {

        // ----------------------------------------
        // Example
        // ----------------------------------------

        var MAX_PARTICLES = 280;
        var COLOURS = [, '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

        var particles = [];
        var pool = [];

        var demo = Sketch.create({
            container: document.getElementById( 'container' )
        });

        demo.setup = function() {

            // Set off some initial particles.
            var i, x, y;

            for ( i = 0; i < 20; i++ ) {
                x = ( demo.width * 0.5 ) + random( -100, 100 );
                y = ( demo.height * 0.5 ) + random( -100, 100 );
                demo.spawn( x, y );
            }
        };

        demo.spawn = function( x, y ) {

            if ( particles.length >= MAX_PARTICLES )
                pool.push( particles.shift() );

            particle = pool.length ? pool.pop() : new Particle();
            particle.init( x, y, random( 5, 40 ) );

            particle.wander = random( 0.5, 2.0 );
            particle.color = random( COLOURS );
            particle.drag = random( 0.9, 0.99 );

            theta = random( TWO_PI );
            force = random( 2, 8 );

            particle.vx = sin( theta ) * force;
            particle.vy = cos( theta ) * force;

            particles.push( particle );
        };

        demo.update = function() {

            var i, particle;

            for ( i = particles.length - 1; i >= 0; i-- ) {

                particle = particles[i];

                if ( particle.alive ) particle.move();
                else pool.push( particles.splice( i, 1 )[0] );
            }
        };

        demo.draw = function() {

            demo.globalCompositeOperation  = 'lighter';

            for ( var i = particles.length - 1; i >= 0; i-- ) {
                particles[i].draw( demo );
            }
        };

        demo.mousemove = function() {

            var particle, theta, force, touch, max, i, j, n;

            for ( i = 0, n = demo.touches.length; i < n; i++ ) {

                touch = demo.touches[i], max = random( 1, 4 );
                for ( j = 0; j < max; j++ ) {
                  demo.spawn( touch.x, touch.y );
                }

            }
        };
        




      function Particle( x, y, radius ) {
            this.init( x, y, radius );
        }

        Particle.prototype = {

            init: function( x, y, radius ) {

                this.alive = true;

                this.radius = radius || 10;
                this.wander = 0.15;
                this.theta = random( TWO_PI );
                this.drag = 0.92;
                this.color = '#fff';

                this.x = x || 0.0;
                this.y = y || 0.0;

                this.vx = 0.0;
                this.vy = 0.0;
            },

            move: function() {

                this.x += this.vx;
                this.y += this.vy;

                this.vx *= this.drag;
                this.vy *= this.drag;

                this.theta += random( -0.5, 0.5 ) * this.wander;
                this.vx += sin( this.theta ) * 0.1;
                this.vy += cos( this.theta ) * 0.1;

                this.radius *= 0.96;
                this.alive = this.radius > 0.5;
            },

            draw: function( ctx ) {

                ctx.beginPath();
                ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
                ctx.fillStyle = this.color;
                //透明化
                	ctx.globalAlpha = 0.5;
                ctx.fill();
            }
        };


});
