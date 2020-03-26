var steps = [
	['/img/flow/1-homeScreen.png', [747,81], 'We prolly wanna say some shit here', true],
	['/img/flow/2-editBills.png', [130, 135], 'Page TWOOOOOO', true],
	['/img/flow/3-editBillsExpandedSettings.png', [130, 135], 'TREE fiddy', false],
	['/img/flow/4-editBills.png', [142, 257], '4 some moar', true],
	['/img/flow/5-editBillsExpandedLevels.png', [936, 629], '5 Im out of ideas', false],
	['/img/flow/6-homeScreen.png', [794, 81], 'just 6', false],
	['/img/flow/7-editParts.png', [857, 608], '7', true],
	['/img/flow/8-homeScreen.png', [767, 117], '8', false],
	['/img/flow/9-bommerTree.png', [733, 243], '9', true],
	['/img/flow/10-settingsScreen.png', [997, 705], '10', false],
	['/img/flow/11-bommerTree.png', [733, 190], '11', true],
	['/img/flow/12-exportScreen.png', [930, 705], '12', false],
	['/img/flow/13-bommerTree.png', [100, 100], '13 holy shit it works', true],
];

var step = 0;

function adjusted(length) {
	var originalHeight = 785;
	var currentHeight = $('.screenshot').height();
	var ratio = currentHeight / originalHeight;
	return length * ratio;
}

function getRadius() {
	return adjusted(40);
}

function animateCircle(circleRadius, ms, animateLabel, cb) {
	var radius = getRadius();
	var coordinates = steps[step][1];
	$('.circle')
		.animate({
			top: adjusted(coordinates[1]) - (circleRadius - radius),
			left: adjusted(coordinates[0]) - (circleRadius - radius),
			width: circleRadius * 2,
			height: circleRadius * 2,
			borderTopLeftRadius: circleRadius,
			borderTopRightRadius: circleRadius,
			borderBottomLeftRadius: circleRadius,
			borderBottomRightRadius: circleRadius
	}, {
		complete: cb,
		duration: ms,
		step: function() {
			//jquery.animate sets overflow: hidden during animation, so need to override that (otherwise label disappears)
			$('.circle').css("overflow","visible");
		 }
	});
	var labelText = steps[step][2];
	if(animateLabel) { //when the big circle shrinks, we want the label to swoop in with it
		$('.circle-label')
			.text(labelText)
			.animate({
				top: radius * 1.8 + (circleRadius - radius),
				left: radius * 1.8 + (circleRadius - radius)
			}, {
				duration: ms
			});
	}
}

var containerWidth = $('.demo-container').width();
var isMobile = containerWidth <= 480;

if(isMobile) {
	//to stop vertical overflow
	$('.demo-container').css({
		height: 400
	})
}

function updateCircle() {
	stopPulsate();
	//hide the circle
	$('.circle').hide();

	//calculate end position of zoom
	var coordinates = steps[step][1];
	var left = -1 * adjusted(coordinates[0]) + (containerWidth/2) - getRadius();
	if(left > 0) {
		left = 0;
	}

	//zoom out
	var zoomOut = steps[step][3];
	$('.image-holder').animate((!isMobile || !zoomOut ? {} : { //only zoom out if step requires it
		width: containerWidth,
		left: 0,
		top: 0
	}), 1000, function() {
		//change image
		var image = steps[step][0];
		$('.screenshot').attr('src', image);
		//zoom in
		$('.image-holder').animate((!isMobile ? {} : {
			width: containerWidth*2,
			left: left
		}), 2000, function() {
			$('.circle').show();//show the circle again
			var radius = getRadius();
			animateCircle(adjusted(2000), 0, false, function() {
				animateCircle(radius, 750, true, function() {
					startPulsate();
				})
			})
		});
	});
}

var interval = null;

function startPulsate() {
	interval = setInterval(function() {
		var radius = getRadius();
		animateCircle(radius+adjusted(20), 200, true, function() {
			animateCircle(radius, 200, true)
		})
	}, 1500);
}

function stopPulsate() {
	$('.circle').stop();//stop any running animations
	clearInterval(interval);
}

updateCircle();

$('.circle').click(function() {
	step = (step + 1) % steps.length;
	updateCircle();
})