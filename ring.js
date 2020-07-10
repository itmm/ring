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
			let $container = evt.target.parentElement.parentElement;
			let $next = evt.target.parentElement.nextSibling;
			if (evt.shiftKey) {
				const $li = evt.target.parentElement.getElementsByTagName('li')[0];
				if ($li) {
					$next = $li;
				}
			}
			while (! $next && $container != $tasks) {
				$next = $container.parentElement.nextSibling;
				$container = $container.parentElement.parentElement;
			}
			do_focus($next);
		}
		if (evt.key === 'ArrowUp') {
			evt.preventDefault();
			let $container = evt.target.parentElement.parentElement;
			let $next = evt.target.parentElement.previousSibling;
			while (! $next && $container != $tasks) {
				$next = $container.parentElement.previousSibling;
				$container = $container.parentElement.parentElement;
			}
			do_focus($next);
		}
		if (evt.ctrlKey && evt.key === 'd') {
			const $target = evt.target.parentElement;
			const $parent = $target.parentElement;
			let $next = $target.nextSibling;
			if (! $next) { $next = $parent.parentElement };
			$parent.removeChild($target);
			do_focus($next);
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
