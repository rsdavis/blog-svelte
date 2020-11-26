---
date: "2020-11-27"
tagline: "A pattern you can't find in the docs"
---

# Combo context with stores in Svelte

## The Problem

In Svelte, as in most Javascript frameworks, a parent component can pass down data to child components in the form of properties. However, in some situations, there is a lot of data that needs to be passed down, and the child components may be nested several layers deep in the tree. To mitigate this issue, Svelte offers the Context API, which allows parent components to make data accessible to any component within the parent's subtree. But, the documentation does not make clear that there is a strict limitation around this API.

> The Context API can only be invoked during component initialization

In other words, a parent component can only call `setContext` when it is initially rendered, and the same is true for child components calling `getContext`. This effectively makes the context read-only and attempting to modify the context after the initial render will result in the following error 

> Function called outside of component initialization

So, if a component needs to mutate the data in the Context, it is likely that we should be using a Store instead. The parent component can create the store, write some data to the store, and then the children can access and modify the data as needed. Then there is the question of how the children will access the store just created by its parent ... a Context!

## Example

For example, take a reusable accordion component that I recently created (linked below).  The element is created with a top-level `Accordion` component, and then a `slot` is used to nest as many `AccordionItem` components as needed.

```html
<Accordion>
	<AccordionItem>
	<AccordionItem>
</Accordion>
```

I needed a way for the parent component to create some state that could be shared with its descendants. Keep in mind that there may be multiple `Accordion` components within the app, each with its own state.

## The Solution

As made obvious by the title, we can combine the mutability of the Svelte Store with the localized nature of a Svelte Context to create a system where a parent component shares mutable state with a slotted subtree of descendants. The basic technique is for the parent to create a store and share it with descendants by putting it in a context. In code, this pattern will look like the example given below. It is important to note that the key used to identify the context should be unique within the subtree and could potentially collide with the same key being used by another library. 

```html
// Parent.svelte
<script>
	import { writable } from 'svelte/store'
	import { setContext } from 'svelte'
	
	const store = writable({ count: 1 })
	const context = setContext('mykey', store) 
</script>

<div class='parent'>
	<slot/>
</div>
```

```html
// Child.svelte
<script>
	import { getContext } from 'svelte'
	const store = getContext('mykey')
	function handleIncrement () {
		store.update(s => ({ count: s.count + 1 }))
	}
</script>

<div class='child'>
	<button on:click={handleIncrement}>Increment</button>
</div>
 ```
This pattern can be very useful to create some state that is unique and localized to a subtree of the DOM. However, I caution you against overusing this approach. Below are a few tips to help you decide on the best approach to similar situations.

* If you only have a few props, and you have access to the child components, pass the props directly
* If the state will be mutable and accessed by the entire application, then use a store
* If the state is read-only and difficult to pass to all descendants, use a context
* If the state is mutable, unique to a subtree, and not easily passed to descendants, then combo the store with a context 


[Repo for the accordion component referenced in the article](https://github.com/rsdavis/svelte-collapsible)