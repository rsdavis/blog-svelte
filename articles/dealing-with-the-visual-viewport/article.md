---
date: '2020-07-03'
tagline: Viewports within viewports
---

# Dealing with the visual viewport

You're familiar with the viewport, the Javascript API that enables client code to access the dimensions of the browser window. But, inside of that viewport, there is another viewport! It goes undetected most of the time. You don't even think about it until you test your site on a mobile device, and the virtual keyboard starts moving content everywhere. Then its time to start thinking about nested viewports.

## A bit of history

First, there was the "layout viewport." This viewport decides the layout of the page content so that every time the viewport changes, the content of the page gets moved and possibly rerendered.
You have likely noticed this by resizing the browser window and watching content jump around the page.
Its not a great user experience, but then again, desktop users are not constantly resizing their browsers.
With a mobile device, on the other hand, taskbars and the keyboard are constantly transitioning in and out of view.
If the browser were to alter the layout viewport during each keyboard or taskbar animation frame, it would be a horrible experience.

At some point during mobile browser development, it was decided that triggering a layout change is simply too costly for a smooth mobile experience. Instead of changing the dimensions of the page, components native to the mobile environment will either appear over the page content or simply move it off the screen. Of course, allowing the browser to shift and cover content without giving the page creator any opportunity to run adjustments is great for performance, but creates a nightmare developer experience and limits application design.

## The visual viewport

To provide some structure around the behavior of web content on mobile devices, the concept of the "visual viewport" (or mobile viewport) was introduced. This is a viewport that floats inside of the layout viewport and outlines only the area of the layout viewport that is visible to the user. On the desktop, the visual viewport usually has the same dimension as the layout viewport. On the other hand, the visual viewport might be altered due to the virtual keyboard, taskbars, pinch zooming, or scrolling.

Without any detectable changes to the layout viewport, the developer has no way of adjusting to an altered visual view. To solve this, the Visual Viewport API was created as a mechanism for the developer to be notified of changes to the visual viewport and react accordingly. This API now has widespread support across browsers, excepting for IE, and it is disabled by default on Firefox. It provides two events and a handful of useful properties.

```
// events
window.visualViewport.addEventListener('resize', listener)
window.visualViewport.addEventListener('scroll', listener)

// properties
window.visualViewport.width
window.visualViewport.height
window.visualViewport.scale
window.visualViewport.offsetLeft
window.visualViewport.offsetTop
window.visualViewport.pageLeft
window.visualViewport.pageTop
```

## Simulating { position: device-fixed }

An immediate use case for the Visual Viewport API is to position content so that it is fixed relative to the viewport. This task is routinely accomplished within the *layout viewport* using CSS.

```css
.container {
	position: relative;
	height: 100vh;
}
header {
	position: fixed;
	top: 0;
}
footer {
	position: fixed;
	bottom: 0;
}
```

Unfortunately, **this will not work for mobile**. To be specific, this approach will not keep content fixed within the visual viewport. If a taskbar pops up on the top of the device window, it will cover the header. If a taskbar or virtual keyboard pops up from the bottom, it will push content off the screen. In both of these cases, the visual viewport has become smaller and only shows a fraction of the layout viewport.

![Visual viewport](https://res.cloudinary.com/docvozwpw/image/upload/v1593383374/vv.png)

Ideally, we would have a nice CSS directive such as `{ position: device-fixed }` to achieve this common design pattern. Unfortunately, this does not yet exist, so we fall back on the Visual Viewport API. We can attach a listener to the `window` to notify us whenever the visual viewport is resized and then alter the styling of the content within the layout viewport such that it remains visible and fixed. Now, if this sounds to you like a heavy-handed, CPU-intensive workaround to an API design that was originally intended as a performance enhancement ... I would agree. Even the documentation warns against using this approach to simulate content that is "fixed" on any device. Nevertheless, below is some Javascript to get you started.

```javascript
const handleResize = () => {
	document.getElementById('header').style.top = window.visualViewport.offsetTop.toString() + 'px'
}

if (window && window.visualViewport) visualViewport.addEventListener('resize', handleResize)
```

Despite the complexity of dealing with nested views, the code is relatively simple. We are simply adjusting the positioning of the header within the layout viewport so that it remains fixed within the visual viewport. Now, you may experience some symptoms with this approach that may include content flickering, layout jumping, and overall poor user experience.

 ## Two cents for two views

If you made it this far in the article, you have probably picked up on my frustration around this topic. Let me try to summarize it as clearly as I can. The primary reason why we have a viewport is to change the content and style when the view changes. Rather than making this as performant as possible, we decide not to use the viewport when the view changes. Instead, we introduce *another* viewport that behaves differently. And then give the new viewport an API so that developers can accomplish the things they wanted to achieve within the original viewport. Except that even the documentation says that developers should not use the new API for those purposes. In the end, we end up with an increasingly complex developer environment, slow Javascript-shimmed styling, and limited web experiences.

## Related Links

[The Eccentric Ways of iOS Safari with the Keyboard](https://blog.opendigerati.com/the-eccentric-ways-of-ios-safari-with-the-keyboard-b5aa3f34228d)

This is an older article written without reference to the Visual Viewport API, but it clearly articulates the odd behavior of mobile browsers.

[Introducing visualViewport](https://developers.google.com/web/updates/2017/09/visual-viewport-api)

A nice introduction to the Visual Viewport API by Jake Archibald with a demo on how to simulate `{ position: device-fixed }`