- Built on CSS3 flexbox, the layout system is based upon element's attributes/directives rather than CSS classes.
- At runtime the layout directives dynamically generate class selectors predefined in angular-material.css. 

Breakpoint | MediaQuery | Activates when device
--- | --- | ---
None | None	| Sets default API value unless overridden
xs | (max-width: 599px) | width < 600px
gt-xs | (min-width: 600px) | width >= 600px
sm | (min-width: 600px) and (max-width: 959px) | 600px <= width < 960px
gt-sm | (min-width: 960px) | width >= 960px
md | (min-width: 960px) and (max-width: 1279px) | 960px <= width < 1280px
gt-md | (min-width: 1280px) | width >= 1280px
lg | (min-width: 1280px) and (max-width: 1919px) | 1280px <= width < 1920px
gt-lg | (min-width: 1920px) | width >= 1920px
xl | (min-width: 1920px) | width >= 1920px

HTML Markup API | Allowed values (raw or interpolated)
--- | ---
layout[-xs] | Specify layout direction for children. row \| column
layout-align[-xs]	| Sets child alignments within the layout container
| | InLayoutDirection - none \| start(\*) \| center \| end \| space-around \| space-between
| | PerpendicularToLayoutDirection - none \| start \| center \| end \| stretch(\*)
layout-wrap |	Allows flex children to wrap within the container if the elements use more than 100%
layout-nowrap |
layout-fill | Forces the layout element to fill its parent container
layout-margin | Adds margin around each flex child. It also adds a margin to the layout container itself.
layout-padding | Adds padding inside each flex child. It also adds padding to the layout container itself.
flex[-xs] | integer (increments of 5 for 0%->100%, 33 or 66)
flex-order[-xs] | Sets child's order position within the layout container
| | integer values from -20 to 20
flex-offset[-xs] | Sets child's offset (margin-left) percentage within the layout container
| | integer (increments of 5 for 0%->100%, 33 for 100%/3, 66 for 200%/3)
show[-xs] | Responsively show elements
hide[-xs] | Responsively hide elements

HTML Markup API | Allowed values (raw or interpolated)
--- | ---
flex | Will grow and shrink as needed. Starts with a size of 0%. Same as flex="0".
flex="none" | Will not grow or shrink. Sized based on its width and height values.
flex="initial" | Will shrink as needed. Starts with a size based on its width and height values.
flex="auto"| Will grow and shrink as needed. Starts with a size based on its width and height values.
flex="grow" | Will grow and shrink as needed. Starts with a size of 100%. Same as flex="100".
flex="nogrow" | Will shrink as needed, but won't grow. Starts with a size based on its width and height values.
flex="noshrink" | Will grow as needed, but won't shrink. Starts with a size based on its width and height values.

```html
<div layout="row" layout-sm="column" layout-wrap layout-align="space-around stretch" layout-padding layout-margin layout-fill>
  <div flex="66" flex-offset="15">
  <div flex flex-order="-1">
  <div flex="none" hide show-gt-sm>
  <div flex-gt-sm="66" flex="33">
```

**General Tips:**
- Use MOBILE first approach.
- In case of difficulty with a specific element/component, but not others, try applying the flex attributes to a parent or child \<div\> of the element instead.
- Some Flexbox properties cannot be animated.
- Flexbox can behave differently on different browsers.

**Troubleshooting:**
- In some scenarios layout="column" and breakpoints (xs, gt-xs, sm, gt-sm, etc.) may not work as expected due to CSS specificity rules.
  - Try inverting the layout logic so that the default is layout='row'
  - Use \<div layout='row' layout-xs="column"\> instead of \<div layout="column" layout-gt-xs="row"\>
- Some browsers will determine size of the flex containers based on the size of their content.
  - Specify the height of the outer flex item or container to 100%.
- Typography CSS Classes: use for visual consistency across the application

**Heading Styles:**
.md-display - 4 to 1, .md-headline, .md-title, .md-subhead

**Body Copy Styles:**
.md-body-1, .md-body-2, .md-button, .md-caption
