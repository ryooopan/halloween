$(function() {

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

    var colors = ['#E0E4CC', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423', '#E0E4CC', '#E0E4CC', '#F38630', '#FA6900' ];




    var degree = 0

    var minCircleRadius = 40;
    var maxCircleRadius = 140;
    var circleRadiusProximity = 5;
    var minCircleOpacity = .2;
    var maxCircleOpacity = .9;
    var circleOpacityProximity = 1000;


    var beamColors = {
        'beam1': '255,255,255',
        'beam2': '255,255,255',
        'beam3': '255,255,255',
        'beam4': '255,255,255',
        'beam5': '255,255,255',
        'beam6': '255,255,255',
        'beam7': '255,255,255',
        'beam8': '255,255,255',
        'beam9': '255,255,255',
    }

    var beams = [];
    i = 0;
    for (color in beamColors) {
        beams[color] = {};
        beams[color].fillColor  = colors[color];
        beams[color].shiftX = beams[color].moveX = Math.random() * 2 > 1 ? parseInt(Math.random() * canvas.width / 2) - minCircleRadius : parseInt(Math.random() * canvas.width / -2) + minCircleRadius;
        beams[color].shiftY = beams[color].moveY = Math.random() * 2 > 1 ? parseInt(Math.random() * canvas.height / 2) - minCircleRadius : parseInt(Math.random() * canvas.height / -2) + minCircleRadius;
        i++;
    }

    console.log(beams);


    drawAnimation();
    function drawAnimation() {
        window.webkitRequestAnimationFrame(drawAnimation, canvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        degree = degree + 0.1;

        var x = Math.sin(degree) * 100 + 500;
        var y = Math.cos(degree) * 100 + 500;

        var freqByteData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqByteData); 

        var volume = getAverageVolume(freqByteData);


        for (beam in beams) {
            currentBeam = beams[beam];
            if (currentBeam.shiftX > currentBeam.moveX) { currentBeam.shiftX--; }
            if (currentBeam.shiftX < currentBeam.moveX) { currentBeam.shiftX++; }
            if (currentBeam.shiftY > currentBeam.moveY) { currentBeam.shiftY--; }
            if (currentBeam.shiftY < currentBeam.moveY) { currentBeam.shiftY++; }
            if (currentBeam.shiftX == currentBeam.moveX && currentBeam.shiftY == currentBeam.moveY) {
                currentBeam.moveX       = Math.random() * 2 > 1 ? parseInt(Math.random() * canvas.width / 2) - minCircleRadius : parseInt(Math.random() * canvas.width / -2) + minCircleRadius;
                currentBeam.moveY       = Math.random() * 2 > 1 ? parseInt(Math.random() * canvas.height / 2) - minCircleRadius : parseInt(Math.random() * canvas.height / -2) + minCircleRadius;
            }
            circleRadius = maxCircleRadius - ((Math.abs(currentBeam.shiftX) + Math.abs(currentBeam.shiftY)) / circleRadiusProximity);
            if (circleRadius < minCircleRadius) { circleRadius = minCircleRadius; }

            circleOpacity = maxCircleOpacity - ((Math.abs(currentBeam.shiftX) + Math.abs(currentBeam.shiftY)) / circleOpacityProximity);
            if (circleOpacity < minCircleOpacity) { circleOpacity = minCircleOpacity; }

            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';//'rgba('+currentBeam.fillColor+', '+circleOpacity+')';
            ctx.beginPath();
            ctx.arc(canvas.width/2 + currentBeam.shiftX, canvas.height/2 + currentBeam.shiftY, circleRadius, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        var posXs = [200, 234, 800, 300, 800];
        var posYs = [200, 600, 700, 100, 200];

        for(j = 1; j < 6; j++) {
            for(i = 1; i < 10; i++) {
                var x = Math.sin(degree * (1 + 0.1 * i)) * 30 * j + posXs[j];
                var y = Math.cos(degree * (1 + 0.1 * i)) * 30 * j + posYs[j];

                var color = colors[i];

                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.7;
                ctx.arc(x , y, 10, 0, Math.PI*2, false);
                ctx.fill();
                ctx.closePath();            
            }
        }   


/*
        for(j = 1; j < 10; j++) {
            for(i = 1; i < 10; i++) {                
                var x = Math.sin(degree * (1 + 0.1 * i)) * 30 * j + Math.random() * 1000;
                var y = Math.cos(degree * (1 + 0.1 * i)) * 30 * j + Math.random() * 1000;

                var color = colors[i];

                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.7;
                ctx.arc(x , y, 10, 0, Math.PI*2, false);
                ctx.fill();
                ctx.closePath();            
            }
        }   
*/


		ctx.beginPath();
		ctx.fillStyle = color;
//		ctx.globalAlpha = 0.7;
		ctx.arc(600, 400, volume * 3, 0, Math.PI*2, false);
		ctx.fill();
		ctx.closePath();


		ctx.beginPath();
//		ctx.globalAlpha = 0.5;
		ctx.fillStyle = 'rgb(255, 245, 0)'
		ctx.arc(1000, 50, volume * 0.5, 0, Math.PI*2, false);
   		ctx.fill();
 		ctx.closePath();
		
		ctx.beginPath();
		ctx.fillStyle = 'rgb(255, 195, 0)'
//		ctx.globalAlpha = 0.3;
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
        ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillText(string, 150, 300);
		ctx.closePath();

        ctx.beginPath();
        ctx.font = "200px 'Bigelow Rules'"
        ctx.fillStyle = "rgb(77, 0, 77)";
        ctx.fillText("Happy Halloween", 500, 500);
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
