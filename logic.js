var key, aKey = 65, dKey = 68, wKey = 87, sKey = 83, vKey = 86, nKey = 78, left = 37, right = 39, up = 38, down = 40, escape = 27, space = 32, num6 = 102, num4 = 100, num5 = 101, num8 = 104, uKey = 85, hKey = 72, jKey = 74, kKey = 75, num1 = 49, num2 = 50;
var canvas, c;
var player, players;

function main() {
    canvas = document.getElementById("canvas");
    c = canvas.getContext("2d");
    canvas.width = 1280;
    canvas.height = 720;    
    canvas.focus();
    
    init();
    
    key = [];
    window.addEventListener("keydown", function(e) {key[e.keyCode] = true; e.preventDefault();});
    window.addEventListener("keyup", function(e) {key[e.keyCode] = false; e.preventDefault();});
    
    var gameLoop = function() {
        update();
        render();
        window.requestAnimationFrame(gameLoop, canvas);
    }
    window.requestAnimationFrame(gameLoop, canvas);
}

players = {
    playersArray: [],
    update: function() {
        for (var i = 0; i < this.playersArray.length; i++) {
            this.playersArray[i].update();
        }
    },
    render: function() {
        for (var i = 0; i < this.playersArray.length; i++) {
            this.playersArray[i].render();
        }
    }
}

player = function(x, y, spd, color, heightOfBody, lengthOfArms, lengthOfLegs, radiusOfHead, thickness) {
    players.playersArray.push(this);
    this.x = x;
    this.y = y;
    this.color = color;
    this.spd = spd;
    this.velX = 0;
    this.velY = 0;
    this.friction = 0.84;
    this.swayValue = 0;
    this.swayAngle = 0;
    this.bodyAngle = 0;
    this.heightOfBody = heightOfBody;
    this.lengthOfArms = lengthOfArms;
    this.lengthOfLegs = lengthOfLegs;
    this.radiusOfHead = radiusOfHead;
    this.thickness = thickness;
    this.lift = 0;
    this.limbs = {
        body: [0, 0],
        arm1: {p1: [0, 0], p2: [0, 0]},
        arm2: {p1: [0, 0], p2: [0, 0]},
        leg1: {p1: [0, 0], p2: [0, 0]},
        leg2: {p1: [0, 0], p2: [0, 0]}
    };
    this.updateLimbs = function() {
        var p = Math.PI * 3 / 2;
        var a = Math.abs(this.velX) * this.spd / 40;
        
        this.limbs.body[0] = this.x + Math.cos(this.bodyAngle) * this.heightOfBody;
        this.limbs.body[1] = this.y + Math.sin(this.bodyAngle) * this.heightOfBody;
        
        this.limbs.arm1.p1[0] = this.limbs.body[0] - this.velX * 3 + Math.cos(this.swayAngle - p) * this.lengthOfArms / 2;
        this.limbs.arm1.p1[1] = this.limbs.body[1] + Math.sin(this.swayAngle - p) * this.lengthOfArms / 2;
        this.limbs.arm1.p2[0] = this.limbs.body[0] + Math.cos(this.swayAngle - p) * this.lengthOfArms; 
        this.limbs.arm1.p2[1] = this.limbs.body[1] + Math.sin(this.swayAngle - p) * this.lengthOfArms;
        
        this.limbs.arm2.p1[0] = this.limbs.body[0] - this.velX * 3 + Math.cos(-this.swayAngle - p) * this.lengthOfArms / 2;
        this.limbs.arm2.p1[1] = this.limbs.body[1] + Math.sin(-this.swayAngle - p) * this.lengthOfArms / 2;
        this.limbs.arm2.p2[0] = this.limbs.body[0] + Math.cos(-this.swayAngle - p) * this.lengthOfArms;
        this.limbs.arm2.p2[1] = this.limbs.body[1] + Math.sin(-this.swayAngle - p) * this.lengthOfArms;
        
        this.limbs.leg1.p1[0] = this.x + this.velX * 2 + Math.cos(this.swayAngle * a - p) * this.lengthOfLegs / 2; 
        this.limbs.leg1.p1[1] = this.y + Math.sin(this.swayAngle * a - p) * this.lengthOfLegs / 2;
        this.limbs.leg1.p2[0] = this.x + Math.cos(this.swayAngle * a - p) * this.lengthOfLegs;
        this.limbs.leg1.p2[1] = this.y + Math.sin(this.swayAngle * a - p) * this.lengthOfLegs;
        
        this.limbs.leg2.p1[0] = this.x + this.velX * 2 + Math.cos(-this.swayAngle * a - p) * this.lengthOfLegs / 2;
        this.limbs.leg2.p1[1] = this.y + Math.sin(-this.swayAngle * a - p) * this.lengthOfLegs / 2;
        this.limbs.leg2.p2[0] = this.x + Math.cos(-this.swayAngle * a - p) * this.lengthOfLegs;
        this.limbs.leg2.p2[1] = this.y + Math.sin(-this.swayAngle * a - p) * this.lengthOfLegs;
    };
    this.getLowestPoint = function() {
        var lowest = 0;
        for (var key in this.limbs) {
            if (this.limbs.hasOwnProperty(key)) {
                if (key === 'leg1' || key === 'leg2') {
                    for (var k in this.limbs[key]) {
                        if (this.limbs[key].hasOwnProperty(k)) {
                            if (this.limbs[key][k][1] > lowest) {
                                lowest = this.limbs[key][k][1];
                            }
                        }
                    }
                }
            }
        }
        return lowest;
    };
    this.update = function() {
        if (this.velX <= 0.02 && this.velX >= -0.02) {
            this.velX = 0;
            this.swayValue = 0;
        }
        this.swayValue += Math.abs(this.velX) / 40;
        this.swayAngle = (Math.sin(this.swayValue) * Math.abs(this.velX / this.spd));
        this.bodyAngle = (Math.PI * 3 / 2) + this.velX / 20;
        if (key[up]) {
            if (this.velY > -this.spd) this.velY -= this.friction / 2;
        }
        if (key[down]) {
            if (this.velY < this.spd) this.velY += this.friction / 2;
        }
        if (key[left]) {
            if (this.velX > -this.spd) this.velX -= this.friction / 2;
        }
        if (key[right]) {
            if (this.velX < this.spd) this.velX += this.friction / 2;
        }
        if ((!key[right] && !key[left]) || (key[right] && key[left])) {
            this.velX *= this.friction;
        }
        this.velX = Math.min(this.spd, Math.max(this.velX, -this.spd));
        this.velY *= this.friction;
        this.x += this.velX;
        this.y += this.velY;	
        this.x = Math.min(canvas.width, Math.max(this.x, 0));
        this.y = Math.min(canvas.height, Math.max(this.y, 0));
        this.y = canvas.height - (this.getLowestPoint() - this.y) - this.thickness / 2;
        this.updateLimbs();
        document.getElementById("data").innerHTML = 
            "Coordinates : (" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ")" + '<br/>' +
            "X Velocity : " + this.velX + '<br/>' +
            "Sway Value : " + this.swayValue + '<br/>' +
            "Sway Angle : " + this.swayAngle + '<br/>' +
            "leg1 X position : " + (this.limbs.leg1['p2'][0] - this.x) + '<br/>' +
            "leg1 Y position : " + (this.limbs.leg1['p2'][1] - this.y);
    };
    this.render = function() {
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.lineWidth = this.thickness;
        c.lineCap = "round";
        
        c.beginPath();
        c.arc(this.limbs.body[0] + Math.cos(this.bodyAngle) * this.radiusOfHead, this.limbs.body[1] + Math.sin(this.bodyAngle) * this.radiusOfHead, this.radiusOfHead, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
        
        for (var key in this.limbs) {
            if (this.limbs.hasOwnProperty(key)) {
                c.beginPath();
                if (key !== 'leg1' && key !== 'leg2' && key !== 'body' && key !== 'arm1' && key !== 'arm2') {
                    c.moveTo(this.limbs.body[0], this.limbs.body[1]);
                } else if (key === 'body') {
                    c.moveTo(this.x, this.y);
                } else if (key === 'arm1' || key === 'arm2') {
                    c.moveTo(this.limbs.body[0], this.limbs.body[1]);
                    c.lineTo(this.limbs[key].p1[0], this.limbs[key].p1[1]);
                    c.lineTo(this.limbs[key].p2[0], this.limbs[key].p2[1]);
                    c.stroke();
                    c.closePath();
                    continue;
                } else if (key === 'leg1' || key === 'leg2') {
                    c.moveTo(this.x, this.y);
                    c.lineTo(this.limbs[key].p1[0], this.limbs[key].p1[1]);
                    c.lineTo(this.limbs[key].p2[0], this.limbs[key].p2[1]);
                    c.stroke();
                    c.closePath();
                    continue;
                }
                c.lineTo(this.limbs[key][0], this.limbs[key][1]);
                c.stroke();
                c.closePath();
            }
        }
    };
}

function init() {
    new player(110, 100, 4, "rgba(172, 0, 0, 1)", 90, 90, 100, 30, 15);
    new player(100, 100, 4, "black", 90, 90, 100, 30, 15);
}

function sign(num) {
    return num === 0? 0:num / Math.abs(num);
}

function diff(num1, num2) {
    return num1 - num2;
}

function drawBackground(color) {
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function update() {
    players.update();
}

function render() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground("red");
    players.render();
    
}