- Angular Material Layout is built on CSS3 flexbox which grows or shrinks as needed.
- The layout system is based upon element's attributes/directives rather than CSS classes.
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
layout[-xs] | row \| column
layout-align[-xs]	| InLayoutDirection - none \| start(\*) \| center \| end \| space-around \| space-between
| | PerpendicularToLayoutDirection - none \| start \| center \| end \| stretch(\*)
layout-wrap |	Allows flex children to wrap within the container if the elements use more than 100%
layout-nowrap |
layout-fill | Forces the layout element to fill its parent container
layout-margin | Adds margin around each flex child. It also adds a margin to the layout container itself.
layout-padding | Adds padding inside each flex child. It also adds padding to the layout container itself.
flex[-xs] | integer (increments of 5 for 0%->100%, 33 or 66)
flex-order[-xs] | integer values from -20 to 20
flex-offset[-xs] | integer (increments of 5 for 0%->100%, 100%/3, 200%/3) added as margin-left
show[-xs] | Responsively show elements
hide[-xs] | Responsively hide elements

** Additional Flex Values: **
flex | Will grow and shrink as needed. Starts with a size of 0%. Same as flex="0".
flex="none" | Will not grow or shrink. Sized based on its width and height values.
flex="initial" | Will shrink as needed. Starts with a size based on its width and height values.
flex="auto"| Will grow and shrink as needed. Starts with a size based on its width and height values.
flex="grow" | Will grow and shrink as needed. Starts with a size of 100%. Same as flex="100".
flex="nogrow" | Will shrink as needed, but won't grow. Starts with a size based on its width and height values.
flex="noshrink" | Will grow as needed, but won't shrink. Starts with a size based on its width and height values.
