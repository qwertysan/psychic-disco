// URL: http://chrisken.utacm.org/code/ :: chrisken 
// v2.0 :: 2004-01-10
d = document;
w = window;

function installTip()
{
	if (d.layers) return; // ns4 = bad
	writeTip('tipDiv');

	if (d.addEventListener)
	{
		d.addEventListener("mousemove", mouseMove, false);
		d.addEventListener("mouseover", mouseOverOut, false);
		d.addEventListener("mouseout", mouseOverOut, false);
	}
	else
	{
		d.onmousemove = mouseMove;
		d.onmouseout = mouseOverOut;
		d.onmouseover = mouseOverOut;
	}
}

function mouseMove(e)
{
	if (w.tip)
	{
		tip.mouseMove(e); 
	}
}

function mouseOverOut(e)
{
	if (!w.tip) return;
	if (typeof(e) == "undefined")
	{
		e = event;
	}

	var obj = e.srcElement? e.srcElement : e.target;
	if ((obj.tagName.toLowerCase() == "img" || obj.tagName.toLowerCase() == "span") && obj.parentNode.tagName.toLowerCase() == "a")
	{
		obj = obj.parentNode;
	}
	if (obj.tagName && obj.tagName.toLowerCase() == "a" && !obj.notip)
	{
		if (e.type == "mouseover" && obj.title)
		{
			tip.show(obj.title);
			backupTitle = obj.title;
			obj.title = '';
		}
		else if (e.type == "mouseout" && obj.title == ''
			&& typeof(backupTitle) != "undefined" && backupTitle != '')
		{
			tip.hide();
			obj.title = backupTitle;
			backupTitle = '';
		}
	}
}

function writeTip(divName)
{
	d.write( '<div id="' + divName + '" style="position: absolute; visibility: hidden; top: 0px; left: 0px; ' );
	d.write( 'filter: alpha(opacity=100); -moz-opacity: 0; z-index: 37"><div id="tipText"></div></div>' );
}

function uberToolTip(id, delay)
{
	this.id = id || "tipDiv";
	this.textId = "tipText";
	this.mouseX = 0;
	this.mouseY = 0;
	this.doit = false;
	this.obj = null;
	this.textObj = null;
	this.fader = null;
	this.delay = delay || 30;
	this.max = 92;
	
	this.getMouseX = function()
	{
		var coords = this.getScrollCoords();
		return this.mouseX + (d.all? coords[0] : 0);
	}

	this.getMouseY = function()
	{
		var coords = this.getScrollCoords();
		return this.mouseY + (d.all? coords[1] : 0);
	}

	this.show = function(html)
	{
		if (w.opera) return;
		this.doit = true;
		if (this.fader)
		{
			this.fader.setTrans(0);
			this.fader.fadeIn();
		}
		this.update();
		wdivo(this.textObj, html);
		sdivo(this.obj);
	}
	
	this.update = function()
	{
		var left = this.getMouseX() + 13;
		var top = this.getMouseY() + (d.all? 20: 15);
		if (this.obj.offsetWidth)
		{
			var w = this.getWinCoords();
			var s = this.getScrollCoords();
			var winb = w[1] + s[1];
			var winr = w[0] + s[0];
			if (top + parseInt(this.obj.offsetHeight) > winb)
			{
				top = winb - this.obj.offsetHeight;
			}

			if (left + parseInt(this.obj.offsetWidth) > winr - 10)
			{
				left = winr - this.obj.offsetWidth - 10;
			}
				
		}

		this.obj.style.left = left + "px";
		this.obj.style.top = top + "px";
	}

	this.getWinCoords = function()
	{
		var wx, hx;
		if (w.innerHeight)
		{
			wx = w.innerWidth;
			hx = w.innerHeight;
		}
		else if (d.documentElement && d.documentElement.clientHeight != 0)
		{
			wx = d.documentElement.clientWidth;
			hx = d.documentElement.clientHeight;	
		}
		else if (d.body && d.body.clientHeight)
		{
			wx = d.body.clientWidth;
			hx = d.body.clientHeight;
		}

		return [wx, hx];
	}

	this.getScrollCoords = function()
	{
  		var x = 0, y = 0;
  		if (typeof(w.pageYOffset) == "number")
		{
    		y = w.pageYOffset;
    		x = w.pageXOffset;
  		}
		else if (d.documentElement && d.documentElement.clientWidth != 0)
		{
        	y = d.documentElement.scrollTop;
        	x = d.documentElement.scrollLeft;
      	}
		else if (d.body && typeof(d.body.scrollLeft) != "undefined")
		{
      		y = d.body.scrollTop;
      		x = d.body.scrollLeft;
    	}
		return [x, y];
	}
	
	this.hide = function()
	{
		if (w.opera) return;
		hdivo(this.obj);
		this.doit = false;
		if (this.fader) this.fader.setTrans(0);
		this.obj.style.left = this.obj.style.top = 0;
		wdivo(this.textObj, "");
	}

	this.init = function()
	{
		if (d.layers || w.opera) return;
		this.obj = d.getElementById(this.id);
		this.textObj = d.getElementById(this.textId);
		if (!this.obj)
		{
			return;
		}
		this.loaded = true;
		if (w.ckapi && (d.all || (d.getElementById && d.addEventListener)))
		{
			this.fader = new ckapi(this.id, this.delay, this.max);
			this.fader.setTrans(0);
		}	
	}
	
	this.mouseMove = function(e)
	{
		var x, y;
		if (w.event)
		{
			x = event.clientX + d.body.scrollLeft;	
			y = event.clientY + d.body.scrollTop;
		}
		else
		{
			x = e.pageX;
			y = e.pageY + 10;
		}
		this.mouseX = x;
		this.mouseY = y;
		if (this.obj && this.doit) this.update();
	}
	
	return this;
}

if (!d.getElementById && d.all)
{
	d.getElementById = function(id) { return d.all[id] }
}
function sdivo(l) { l.style.visibility = "visible"; }
function hdivo(l) { l.style.visibility = "hidden"; }
function wdivo(l, html) {
	if (typeof(l.innerHTML) != "undefined")
	{
		html = html.replace(/&/,"&amp;");
		l.innerHTML = html;
	}
}

function loadTip()
{
	tip = new uberToolTip(null, 10);
	tip.init();
}

function ckapi(id, fDelay, sTrans)
{
	this.obj = "ckapiObj" + ckapi.count++; 
	eval(this.obj + " = this");
	this.layerObj = d.getElementById(id);
	this.delay = fDelay;
	this.start = sTrans;
	this.delta = 10;

	this.setTrans = function(trans)
	{
		if (trans > 100)
		{
			trans = 100;
		}

		if (this.layerObj.filters)
		{
			this.layerObj.filters.alpha.opacity = trans;
		}
		if (!d.all && this.layerObj.style.setProperty)
		{
			this.layerObj.style.setProperty("-moz-opacity", trans / 100 , "");
		}
	}	

	this.getTrans = function()
	{
		if (d.all)
		{
			if (typeof(this.layerObj.filters.alpha.opacity) != "1")
			{
				return this.layerObj.filters.alpha.opacity;
			}
		}
		else if (this.layerObj.style.getPropertyValue)
		{
				return this.layerObj.style.getPropertyValue("-moz-opacity")*100;
		}
		return 100;
	}

	this.fadeIn = function()
	{
		if (!this.layerObj) return;
		clearTimeout(this.timer);
		var trans = this.getTrans();
	    if (trans < this.start)
		{
	        this.setTrans(trans + this.delta);
	        this.timer = setTimeout(this.obj + ".fadeIn()", this.delay);
        }
	}
		
	return this;	
}
ckapi.count = 0;

installTip();
