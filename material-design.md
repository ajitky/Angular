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
" | PerpendicularToLayoutDir - none \| start \| center \| end \| stretch(\*)
                    
