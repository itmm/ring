
	'use strict';
	window.addEventListener('load',
		() => {
			
	const do_focus = $li => {
		
	if ($li && $li.tagName === 'LI') {
		
	const $edit =
		$li.getElementsByClassName(
			'value'
		)[0];
	$edit.focus();

	const range = document.createRange();
	range.selectNodeContents($edit);
	const sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);

	}

	};

	
	const $ = path => {
		return document.getElementById(
			path.substr(1)
		);
	};
	const $tasks = $('#tasks');

	
	let last_id = 0;

	const create_tt =
		($elm, txt) => {
			
	const $tt =
		document.createElement('DIV');
	$tt.innerText = txt;
	$tt.classList.add('tooltip');
	$elm.appendChild($tt);

		};

	const keydown = evt => {
		
	
	if (evt.isComposing ||
		evt.keyCode === 229
	) {
		return;
	}

	if (evt.ctrlKey) {
		const $target =
			evt.target.parentElement;
		$target.classList.add('ctrl');
	}

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

	};

	const keyup = evt => {
		
	const $target =
		evt.target.parentElement;
	$target.classList.remove('ctrl');
	
	if (evt.isComposing ||
		evt.keyCode === 229
	) {
		return;
	}


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

	};

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

	const create_li = name => {
		
	const id = last_id++;
	const $li =
		document.createElement('LI');
	$li.id = '' + id;

	const $check_div =
		document.createElement('DIV');
	$check_div.classList.add('check-div');
	const $check =
		document.createElement('INPUT');
	$check.setAttribute(
		'type', 'checkbox'
	);

	$check_div.appendChild($check);
	create_tt($check_div, 'ctrl-s');
	$li.appendChild($check_div);

	const $span =
		document.createElement('SPAN');
	$span.classList.add('value');
	$span.contentEditable = 'true';
	$span.innerText = name;

	$span.addEventListener(
		'keydown', keydown
	);

	$span.addEventListener(
		'keyup', keyup
	);

	$span.addEventListener('blur', blur);
	$li.appendChild($span);

	const $del = document.createElement('A');
	$del.innerText = '×';
	$del.setAttribute('href', '#');
	$del.setAttribute('draggable', 'false');
	$del.classList.add('delete');
	$del.addEventListener('click', delete_task);
	create_tt($del, 'ctrl-d');
	$li.appendChild($del);
	return $li;

	};

	const append_in =
		(name, $parent) => {
			
	let $container = $parent ?
		$parent.getElementsByTagName(
			'LI'
		)[0] : $tasks;

	if (! $container) {
		$container =
			document.createElement('UL');
		$parent.appendChild($container);
	}

	const $li = create_li(name);
	$container.appendChild($li);
	return $li;

		};

	do_focus(append_in('Project 1'));
	append_in('Project 2');
	append_in('Project 3');

		}
	);
