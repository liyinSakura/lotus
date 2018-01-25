var canvas;

var delta = [ 0, 0 ];
// 舞台边界
var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];
getBrowserDimensions();

var themes = [ [ "#10222B", "#95AB63", "#BDD684", "#E2F0D6", "#F6FFE0" ],
		[ "#362C2A", "#732420", "#BF734C", "#FAD9A0", "#736859" ],
		[ "#0D1114", "#102C2E", "#695F4C", "#EBBC5E", "#FFFBB8" ],
		[ "#2E2F38", "#FFD63E", "#FFB54B", "#E88638", "#8A221C" ],
		[ "#121212", "#E6F2DA", "#C9F24B", "#4D7B85", "#23383D" ],
		[ "#343F40", "#736751", "#F2D7B6", "#BFAC95", "#8C3F3F" ],
		[ "#000000", "#2D2B2A", "#561812", "#B81111", "#FFFFFF" ],
		[ "#333B3A", "#B4BD51", "#543B38", "#61594D", "#B8925A" ] ];
var theme;
var isLanded = true;
var worldAABB, world, iterations = 1, timeStep = 1 / 200;

var walls = [];
var wall_thickness = 200;
var wallsSetted = false;

var bodies, elements, text , lotus;

var createMode = false;
var destroyMode = false;

var isMouseDown = false;
var mouseJoint;
var mouse = { x: 0, y: 0 };
// 设置重力,测试用为10，上线改成0.2
var gravity = { x: 0, y: 0.4 };

var PI2 = Math.PI * 2;

var timeOfLastTouch = 0;

var lotusPos = {
	x:$('#js-lotus').position().left,
	y:$('#js-lotus').position().top,
	width:$('#js-lotus').width(),
	height:$('#js-lotus').height(),

}

init();
play();

function init() {
	// 获取canvas
	canvas = document.getElementById( 'canvas' );

	// 重力感应
	window.addEventListener( 'deviceorientation', onWindowDeviceOrientation, false );

	// init box2d

	worldAABB = new b2AABB();
	worldAABB.minVertex.Set( -200, -200 );
	worldAABB.maxVertex.Set( window.innerWidth + 200, window.innerHeight + 200 );

	world = new b2World( worldAABB, new b2Vec2( 0, 0 ), true );

	setWalls();
	reset();
}


function play() {

	setInterval( loop, 1000 / 40 );
}

function reset() {

	var i;

	if ( bodies ) {

		for ( i = 0; i < bodies.length; i++ ) {

			var body = bodies[ i ]
			canvas.removeChild( body.GetUserData().element );
			world.DestroyBody( body );
			body = null;
		}
	}

	// color theme
	theme = themes[ Math.random() * themes.length >> 0 ];
	// document.body.style[ 'backgroundColor' ] = theme[ 0 ];

	bodies = [];
	elements = [];

	createInstructions();



}



function onWindowDeviceOrientation( event ) {

	if ( event.beta ) {

		gravity.x = Math.sin( event.gamma * Math.PI / 180 )*4;
		gravity.y = Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI / 180 ) ;

	}
	// $('#deviceorientation').html('gravity.x'+gravity.x+'<br>gravity.y'+gravity.y)

}

//

function createInstructions() {

	var size = 32;

	var element = document.createElement( 'div' );
	element.width = size;
	element.height = size;
	element.style.position = 'absolute';
	element.style.left = -0 + 'px';
	element.style.top = -0 + 'px';
	element.style.cursor = "default";

	canvas.appendChild(element);
	elements.push( element );

	var circle = document.createElement( 'canvas' );
	circle.width = size;
	circle.height = size;

	var graphics = circle.getContext( '2d' );

	graphics.fillStyle = theme[ 3 ];
	graphics.beginPath();
	graphics.arc( size * .5, size * .5, size * .5, 0, PI2, true );
	graphics.closePath();
	// graphics.fill();

	element.appendChild( circle );

	text = document.createElement( 'div' );
	text.onSelectStart = null;
	text.innerHTML = '<img src="./img/13_51.png" class="drop" alt="水滴">';
	text.style.position = 'absolute';
	text.style.left = '0px';
	text.style.top = '0px';
	element.appendChild(text);

	text.style.left = ((32 - text.clientWidth) / 2) +'px';
	text.style.top = ((32 - text.clientHeight) / 2) +'px';

	var b2body = new b2BodyDef();

	var circle = new b2CircleDef();
	circle.radius = size / 2;
	circle.density = 1;
	circle.friction = 0.3;
	circle.restitution = 0.3;
	b2body.AddShape(circle);
	b2body.userData = {element: element};

	//设置生成的位置
	b2body.position.Set( Math.random() * stage[2], Math.random() * -200 );
	b2body.linearVelocity.Set( Math.random() * 400 - 200, Math.random() * 400 - 200 );
	bodies.push( world.CreateBody(b2body) );
}

function createBall( x, y ) {

}

//

function loop() {

	if (getBrowserDimensions()) {

		setWalls();

	}

	delta[0] += (0 - delta[0]) * .5;
	delta[1] += (0 - delta[1]) * .5;

	world.m_gravity.x = gravity.x * 350 + delta[0];
	world.m_gravity.y = gravity.y * 350 + delta[1];

	mouseDrag();
	world.Step(timeStep, iterations);

	for (i = 0; i < bodies.length; i++) {

		var body = bodies[i];
		var element = elements[i];
		var elePos = {
			x:body.m_position0.x - element.width,
			y:body.m_position0.y - element.height
		}
		element.style.left = (body.m_position0.x - (element.width >> 1)) + 'px';
		element.style.top = (body.m_position0.y - (element.height >> 1)) + 'px';
		if (element.tagName == 'DIV') {

			var style = 'rotate(' + (body.m_rotation0 * 57.2957795) + 'deg) translateZ(0)';
			text.style.WebkitTransform = style;
			text.style.MozTransform = style;
			text.style.OTransform = style;
			text.style.msTransform = style;
			text.style.transform = style;

		}
		// console.log(maxtop);
		var okLeft = lotusPos.x - lotusPos.width/2 - element.width;
		var maxtop = lotusPos.y;
		var okRight = lotusPos.x + lotusPos.width/2 - element.width;
		if (elePos.y >= maxtop) {
			if (elePos.x<=okRight&&elePos.x>=okLeft) {

				landed("win")
			}else{
				landed("lose")

			}
		}

	}

}


// .. BOX2D UTILS

function createBox(world, x, y, width, height, fixed) {

	if (typeof(fixed) == 'undefined') {

		fixed = true;

	}

	var boxSd = new b2BoxDef();

	if (!fixed) {

		boxSd.density = 1.0;

	}

	boxSd.extents.Set(width, height);

	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);

	return world.CreateBody(boxBd);

}

function mouseDrag()
{
	// mouse press
	if (createMode) {

		createBall( mouse.x, mouse.y );

	} else if (isMouseDown && !mouseJoint) {

		var body = getBodyAtMouse();

		if (body) {

			var md = new b2MouseJointDef();
			md.body1 = world.m_groundBody;
			md.body2 = body;
			md.target.Set(mouse.x, mouse.y);
			md.maxForce = 30000 * body.m_mass;
			// md.timeStep = timeStep;
			mouseJoint = world.CreateJoint(md);
			body.WakeUp();

		} else {

			createMode = true;

		}

	}

	// mouse release
	if (!isMouseDown) {

		createMode = false;
		destroyMode = false;

		if (mouseJoint) {

			world.DestroyJoint(mouseJoint);
			mouseJoint = null;

		}

	}

	// mouse move
	if (mouseJoint) {

		var p2 = new b2Vec2(mouse.x, mouse.y);
		mouseJoint.SetTarget(p2);
	}
}

function getBodyAtMouse() {

	// Make a small box.
	var mousePVec = new b2Vec2();
	mousePVec.Set(mouse.x, mouse.y);

	var aabb = new b2AABB();
	aabb.minVertex.Set(mouse.x - 1, mouse.y - 1);
	aabb.maxVertex.Set(mouse.x + 1, mouse.y + 1);

	// Query the world for overlapping shapes.
	var k_maxCount = 10;
	var shapes = new Array();
	var count = world.Query(aabb, shapes, k_maxCount);
	var body = null;

	for (var i = 0; i < count; ++i) {

		if (shapes[i].m_body.IsStatic() == false) {

			if ( shapes[i].TestPoint(mousePVec) ) {

				body = shapes[i].m_body;
				break;

			}

		}

	}

	return body;

}

function setWalls() {

	if (wallsSetted) {

		world.DestroyBody(walls[0]);
		world.DestroyBody(walls[1]);
		world.DestroyBody(walls[2]);
		world.DestroyBody(walls[3]);

		walls[0] = null;
		walls[1] = null;
		walls[2] = null;
		walls[3] = null;
	}

	walls[0] = createBox(world, stage[2] / 2, - wall_thickness, stage[2], wall_thickness);
	walls[1] = createBox(world, stage[2] / 2, stage[3] + wall_thickness, stage[2], wall_thickness);
	walls[2] = createBox(world, - wall_thickness, stage[3] / 2, wall_thickness, stage[3]);
	walls[3] = createBox(world, stage[2] + wall_thickness, stage[3] / 2, wall_thickness, stage[3]);


	wallsSetted = true;

}

// BROWSER DIMENSIONS

function getBrowserDimensions() {

	var changed = false;

	if (stage[0] != window.screenX) {

		delta[0] = (window.screenX - stage[0]) * 50;
		stage[0] = window.screenX;
		changed = true;

	}

	if (stage[1] != window.screenY) {

		delta[1] = (window.screenY - stage[1]) * 50;
		stage[1] = window.screenY;
		changed = true;

	}

	if (stage[2] != window.innerWidth) {

		stage[2] = window.innerWidth;
		changed = true;

	}

	if (stage[3] != window.innerHeight) {

		stage[3] = window.innerHeight;
		changed = true;

	}

	return changed;

}
// 着陆
function landed(msg) {

	if (isLanded) {
		if (msg == "win") {
			var success = 1;
			$('.js-hana-after').fadeIn();
			$('.js-hana-before').hide	();
			var i;

			if ( bodies ) {

				for ( i = 0; i < bodies.length; i++ ) {

					var body = bodies[ i ]
					canvas.removeChild( body.GetUserData().element );
					world.DestroyBody( body );
					body = null;
				}
			}
		}else{
			var success = 0;
		}
		isLanded = false;
		setTimeout(function () {
			alert(msg);
		},2500)



	}

}
