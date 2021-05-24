---
sc: 2.1.1
severity: High
difficulty: High
title: Main menu does not work with keyboard
sample: blog-post
---

#### Problem

The main menu does not work with just a keyboard. The links are marked up like this:

```html
<div class="link 202034rsfd oiarjgeoi" onclick="woo()">About us</div>
```

#### Solution

Use `<a>` tags for the links, and use the `href` attribute for the location to link to, like this:

```html
<a href="/about-us">About us</a>
```

The `<a>`-tag works with keyboard out of the box, does not rely on JavaScript and makes it easier for search engines to understand what is going on.