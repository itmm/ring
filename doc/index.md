# Ring JavaScript

```
@Def(file: ../ring.js)
	'use strict';
	window.addEventListener('load',
		() => {
			@put(startup)
		}
	);
@End(file: ../ring.js)
```

```
@def(startup)
	const do_focus = $li => {
		@put(may do focus)
	};
@end(startup)
```

```
@add(startup)
	@put(needed by append in)
	const append_in =
		(name, $parent) => {
			@put(append in)
		};
@end(startup)
```

```
@add(startup)
	do_focus(append_in('Project 1'));
	append_in('Project 2');
	append_in('Project 3');
@end(startup)
```

```
@def(may do focus)
	if ($li && $li.tagName === 'LI') {
		@put(do focus)
	}
@end(may do focus)
```

```
@def(do focus)
	const $edit =
		$li.getElementsByClassName(
			'value'
		)[0];
	$edit.focus();
@end(do focus)
```

```
@add(do focus)
	const range = document.createRange();
	range.selectNodeContents($edit);
	const sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
@end(do focus)
```

```
@def(needed by append in)
	const $ = path => {
		return document.getElementById(
			path.substr(1)
		);
	};
	const $tasks = $('#tasks');
@end(needed by append in)
```

```
@def(append in)
	let $container = $parent ?
		$parent.getElementsByTagName(
			'LI'
		)[0] : $tasks;
@end(append in)
```

```
@add(append in)
	if (! $container) {
		$container =
			document.createElement('UL');
		$parent.appendChild($container);
	}
@end(append in)
```

```
@add(needed by append in)
	@put(needed by create li)
	const create_li = name => {
		@put(create li)
	};
@end(needed by append in)
```

```
@add(append in)
	const $li = create_li(name);
	$container.appendChild($li);
	return $li;
@end(append in)
```

```
@def(needed by create li)
	let last_id = 0;
@end(needed by create li)
```

```
@def(create li)
	const id = last_id++;
	const $li =
		document.createElement('LI');
	$li.id = '' + id;
@end(create li)
```

```
@add(create li)
	const $check_div =
		document.createElement('DIV');
	$check_div.classList.add('check-div');
	const $check =
		document.createElement('INPUT');
	$check.setAttribute(
		'type', 'checkbox'
	);
@end(create li)
```

```
@add(needed by create li)
	const create_tt =
		($elm, txt) => {
			@put(create tt)
		};
@end(needed by create li)
```

```
@def(create tt)
	const $tt =
		document.createElement('DIV');
	$tt.innerText = txt;
	$tt.classList.add('tooltip');
	$elm.appendChild($tt);
@end(create tt)
```

```
@add(create li)
	$check_div.appendChild($check);
	create_tt($check_div, 'ctrl-s');
	$li.appendChild($check_div);
@end(create li)
```

```
@add(create li)
	const $span =
		document.createElement('SPAN');
	$span.classList.add('value');
	$span.contentEditable = 'true';
	$span.innerText = name;
@end(create li)
```

```
@add(needed by create li)
	const keydown = evt => {
		@put(keydown)
	};
@end(needed by create li)
```

```
@add(create li)
	$span.addEventListener(
		'keydown', keydown
	);
@end(create li)
```

```
@def(keydown)
	@mul(avoid composing)
	if (evt.ctrlKey) {
		const $target =
			evt.target.parentElement;
		$target.classList.add('ctrl');
	}
@end(keydown)
```

```
@add(keydown)
	if (evt.key === 'Enter' ||
		evt.key === 'ArrowDown' ||
		evt.key === 'ArrowUp') {
		evt.preventDefault();
	}
	if (evt.ctrlKey && (
			evt.key === 'd' ||
			evt.key === 's'
	)) {
		evt.preventDefault();
	}
@end(keydown)
```

```
@def(avoid composing)
	if (evt.isComposing ||
		evt.keyCode === 229
	) {
		return;
	}
@end(avoid composing)
```

```
@add(needed by create li)
	const keyup = evt => {
		@put(keyup)
	};
@end(needed by create li)
```

```
@add(create li)
	$span.addEventListener(
		'keyup', keyup
	);
@end(create li)
```

```
@def(keyup)
	const $target =
		evt.target.parentElement;
	$target.classList.remove('ctrl');
	@mul(avoid composing)
@end(keyup)
```

```
@add(keyup)
	if (evt.key === 'Enter') {
		evt.preventDefault();
		const value = evt.target.innerText;
		if (value.length) {
			do_focus(evt.shiftKey ? append_in('', $target) : append_after('', $target));
		} else {
			$target.classList.add('flash');
			setTimeout(() => { $target.classList.remove('flash'); }, 100);
		}
	}
	if (evt.key === 'ArrowDown') {
		evt.preventDefault();
		do_focus(get_next(evt.target.parentElement, ! evt.shiftKey));
	}
	if (evt.key === 'ArrowUp') {
		evt.preventDefault();
		do_focus(get_prev(evt.target.parentElement, ! evt.shiftKey));
	}
	if (evt.ctrlKey && evt.key === 'd') {
		delete_task(evt);
	}
	if (evt.ctrlKey && evt.key === 's') {
		const $check = $target.getElementsByTagName('INPUT')[0];
		$check.checked = ! $check.checked;
		evt.preventDefault();
	}
@end(keyup)
```

```
@add(create li)
	$span.addEventListener('blur', blur);
	$li.appendChild($span);
@end(create li)
```

```
@add(create li)
	const $del = document.createElement('A');
	$del.innerText = '×';
	$del.setAttribute('href', '#');
	$del.setAttribute('draggable', 'false');
	$del.classList.add('delete');
	$del.addEventListener('click', delete_task);
	create_tt($del, 'ctrl-d');
	$li.appendChild($del);
	return $li;
@end(create li)
```

```
@add(needed by create li)
	const get_next_li_sibling = $li => {
		let $next = null;
		if ($li && $li.tagName === 'LI') {
			$next = $li.nextSibling;
			while ($next && $next.tagName !== 'LI') {
				$next = $next.nextSibling;
			}
		}
		return $next;
	};
	const get_next = ($li, with_childs) => {
		let $next = null;
		if ($li && $li.tagName === 'LI') {
			if (with_childs) {
				$next = $li.getElementsByTagName('LI')[0];
			}
			if (! $next) {
				$next = get_next_li_sibling($li);
				let $cur = $li;
				while (! $next && $cur.parentElement !== $tasks) {
					$cur = $cur.parentElement.parentElement;
					$next = get_next_li_sibling($cur);
				}
			}
		}
		return $next;
	};
	const get_prev_li_sibling = $li => {
		let $prev = null;
		if ($li && $li.tagName === 'LI') {
			$prev = $li.previousSibling;
			while ($prev && $prev.tagName !== 'LI') {
				$prev = $prev.previousSibling;
			}
		}
		return $prev;
	};
	const get_prev = ($li, with_childs) => {
		let $prev = null;
		if ($li && $li.tagName === 'LI') {
			$prev = get_prev_li_sibling($li);
			let $cur = $li;
			if (! $prev && $cur.parentElement !== $tasks) {
				$prev = $cur.parentElement.parentElement;
			} else if ($prev && with_childs) {
				const $lis = $prev.getElementsByTagName('LI');
				if ($lis.length) { $prev = $lis[$lis.length - 1]; }
			}
		}
		return $prev;
	};
	const delete_task = evt => {
		const $target = evt.target.parentElement;
		let $next = get_next($target);
		if (! $next) { $next = get_prev($target); }
		if ($next) {
			$target.parentElement.removeChild($target);
			do_focus($next);
		} else {
			$target.classList.add('flash');
			setTimeout(() => { $target.classList.remove('flash'); }, 100);
		}
		evt.preventDefault();
	};
	const blur = evt => {
		const $target = evt.target.parentElement;
		const value = evt.target.innerText;
		if (! value.length) {
			evt.target.focus();
			$target.classList.add('flash');
			setTimeout(() => { $target.classList.remove('flash'); }, 100);
		}
	};
	const append_after = (name, $after) => {
		const $before = $after.nextSibling;
		const $container = $after.parentElement;
		const $li = create_li(name);
		$container.insertBefore($li, $before);
		return $li;
	};
@end(needed by create li)
```

