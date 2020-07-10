'use strict';
window.addEventListener('load', () => {
	const $ = path => {
		return document.getElementById(path.substr(1));
	};
	const $tasks = $('#tasks');
	let last_id = 0;
	const do_focus = $li => {
		if ($li && $li.tagName === 'LI') {
			$li.getElementsByTagName('SPAN')[0].focus();
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
			while (! $prev && $cur.parentElement !== $tasks) {
				$cur = $cur.parentElement.parentElement;
				$prev = get_prev_li_sibling($cur);
			}
			if ($prev && with_childs) {
				const $lis = $prev.getElementsByTagName('LI');
				if ($lis.length) { $prev = $lis[$lis.length - 1]; }
			}
		}
		return $prev;
	};
	const keydown = evt => {
		if (evt.isComposing || evt.keyCode === 229) {
			return;
		}
		if (evt.key === 'Enter' || evt.key === 'ArrowDown' || evt.key === 'ArrowUp') {
			evt.preventDefault();
		}
		if (evt.ctrlKey && evt.key === 'd') {
			evt.preventDefault();
		}
	};
	const keyup = evt => {
		if (evt.isComposing || evt.keyCode === 229) {
			return;
		}
		if (evt.key === 'Enter') {
			evt.preventDefault();
			const $target = evt.target.parentElement;
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
		}
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
	const create_li = name => {
		const id = last_id++;
		const $li = document.createElement('LI');
		$li.id = '' + id;
		const $span = document.createElement('SPAN');
		$span.contentEditable = 'true';
		$span.innerText = name;
		$span.addEventListener('keydown', keydown);
		$span.addEventListener('keyup', keyup);
		$span.addEventListener('blur', blur);
		$li.appendChild($span);
		return $li;
	};
	const append_in = (name, $parent) => {
		let $container = $parent ? $parent.getElementsByTagName('LI')[0] : $tasks;
		if (! $container) {
			$container = document.createElement('UL');
			$parent.appendChild($container);
		}
		const $li = create_li(name);
		$container.appendChild($li);
		return $li;
	};
	const append_after = (name, $after) => {
		const $before = $after.nextSibling;
		const $container = $after.parentElement;
		const $li = create_li(name);
		$container.insertBefore($li, $before);
		return $li;
	};
	do_focus(append_in('Project 1'));
	append_in('Project 2');
	append_in('Project 3');
});
