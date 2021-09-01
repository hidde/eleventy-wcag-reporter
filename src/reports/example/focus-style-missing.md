---
sc: 2.4.7
severity: High
difficulty: Low
title: Focus style missing
sample: all
---

<figure>

![alt text](images/default-screenshot.png) 

</figure>

#### Problem

Focus styles have been removed through the website's stylesheets:

```css
* { 
  outline: none 
}
```

This causes problems for people who use the website without a mouse, as they will not be able to see where they are.

#### Solution

Remove the `outline: none` rule, and/or add a specific style that applies on `:focus`. Make sure that it has sufficient contrast, too.

#### Read more

- [Indicating focus to improve accessibility](https://hiddedevries.nl/en/blog/2019-06-06-indicating-focus-to-improve-accessibility)
