---
date: '2020-11-15'
tagline: 'DIY height transitions'
---

# Svelte Collapsible Card Component

There is one aspect associated with using a novel framework like Svelte for development that is both good and bad. The ecosystem is small enough that you can rarely find the component you are looking for (bad), which forces you to understand the problem well enough to do it yourself (good). This was the case for the collapsible card, a deceptively simple component that was not readily available within Svelte land. So, I created it myself and was surprised to discover how much Javascript is required to enable seemingly simple height transitions. 

<img src="https://res.cloudinary.com/docvozwpw/image/upload/v1605465244/svelte-collapsible-card.png" width="300px" style="object-fit: contain;">

## The Problem

The idea is simple: click on the top of the card component so that it smoothly expands to reveal additional information. This design is scattered throughout the web, and you might think that a simple CSS transition would do the trick. However, the height of an element can only be smoothly transitioned when it is expressed as a fixed size in pixels. Unfortunately, we rarely know the height of an element before-hand. We would like the height to adjust to its contents. So, in order to get a variable-height element to open and close smoothly, we need some Javascript, lots of it.

## The Solution

There is a nice css-tricks article that explains a technique for getting a collapsible card to work, it is linked at the bottom of the article. The strategy is to allow the element height to be variable by default `height: auto`, switch it to the corresponding pixel value before a transition, and switch it back to auto after the transition. It is shocking how much Javascript is required to enable such a seemingly simple component.

I took the logic from this article and translated it into a Svelte component with all of the awesome code-reducing features of the reactive framework. The result is demonstrated in the REPL linked below. 

[Demo REPL](https://svelte.dev/repl/17b43d9762c94ea5b5519016d0101bc6?version=3.29.7)

[Github Repo: rsdavis/svelte-collapsible-card](https://github.com/rsdavis/svelte-collapsible-card)

[CSS-Tricks Article: Using CSS Transitions on Auto Dimensions](https://css-tricks.com/using-css-transitions-auto-dimensions/#technique-3-javascript)