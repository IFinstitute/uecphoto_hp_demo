document.querySelectorAll('img.swap').forEach(img => {
    const orig = img.getAttribute('src');
    const hover = img.dataset.hoverSrc;
    if (!hover) return;
    const pre = new Image(); pre.src = hover; // プリロード
    const enter = () => img.src = hover;
    const leave = () => img.src = orig;
    const parent = img.closest('a');
    (parent || img).addEventListener('mouseenter', enter);
    (parent || img).addEventListener('mouseleave', leave);
    (parent || img).addEventListener('focusin', enter);
    (parent || img).addEventListener('focusout', leave);
});