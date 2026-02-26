function loadHeader(){
	fetch('header.html', { cache: 'no-store' })
		.then(function(res){ if(!res.ok) throw new Error(res.statusText); return res.text(); })
		.then(function(html){
			var container = document.getElementById('site-header');
			if(!container) return;
			container.innerHTML = html;

			// Execute any scripts that were inside header.html
			var scripts = container.querySelectorAll('script');
			scripts.forEach(function(old){
				var s = document.createElement('script');
				if(old.src){
					s.src = old.src;
					s.async = false;
				} else {
					s.textContent = old.textContent;
				}
				// copy type attribute if present
				if(old.type) s.type = old.type;
				document.head.appendChild(s);
				old.parentNode.removeChild(old);
			});
		})
		.catch(function(err){
			console.error('Failed to load header.html:', err);
		});
}
function loadFooter(){
	fetch('footer.html', { cache: 'no-store' })
		.then(function(res){ if(!res.ok) throw new Error(res.statusText); return res.text(); })
		.then(function(html){
			var container = document.getElementById('site-footer');
			if(!container) return;
			container.innerHTML = html;

			// Execute any scripts that were inside footer.html
			var scripts = container.querySelectorAll('script');
			scripts.forEach(function(old){
				var s = document.createElement('script');
				if(old.src){
					s.src = old.src;
					s.async = false;
				} else {
					s.textContent = old.textContent;
				}
				// copy type attribute if present
				if(old.type) s.type = old.type;
				document.head.appendChild(s);
				old.parentNode.removeChild(old);
			});
		})
		.catch(function(err){
			console.error('Failed to load footer.html:', err);
		});
}

if(document.readyState === 'loading'){
	document.addEventListener('DOMContentLoaded', function(){
		loadHeader();
		loadFooter();
	});
} else {
		loadHeader();
		loadFooter();
}
