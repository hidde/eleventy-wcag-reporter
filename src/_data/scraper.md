Open WCAG in the browsers and drop this in the console 
to get WCAG in the format used in sc_to_slug JSON.

This may need tweaks and updates depending on the 
version of WCAG and may or may not work in translations.

```js
var scs = document.querySelectorAll('.sc');
var sc_to_slug = {};

scs = Array.from(scs);

scs.forEach(sc => {
	var id = sc.id;
  var num = sc.querySelector('.secno').textContent.replace('Success Criterion ', '').replace(' ', '');
  var nameHolder = sc.querySelector('h4');
  var nameHolderSC = nameHolder.querySelector('span');
  nameHolderSC.remove();
  var name = nameHolder.childNodes[0].data;   
  var level = sc.querySelector('.conformance-level').textContent.replace('(Level ','').replace(')', '');
  sc_to_slug[num] = {
		id: id,
    name: name,
    level: level
	};
});

console.log(sc_to_slug);
```