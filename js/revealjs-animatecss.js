const initAnimateCSSSupport = () => {

    const ACTION = Object.freeze({
        START: Symbol("start"),
        STOP: Symbol("stop"),
    });

    const updateAnimateClasses = (action) => (node) => {
        const classes = node.getAttribute('data-animate').split(" ");
        const fn = action === ACTION.START ? node.classList.add : node.classList.remove;
        fn.apply(node.classList, classes);
    };

    const slideAnimationHandler = e => {
        const updateStateForSlideChildren = (slide, action) => {
            [...slide.querySelectorAll("[data-animate]:not(.fragment)")]
                .filter(e => !e.closest(".fragment"))
                .forEach(updateAnimateClasses(action));
        };

        if (e.previousSlide)
            updateStateForSlideChildren(e.previousSlide, ACTION.STOP);
        
        updateStateForSlideChildren(e.currentSlide, ACTION.START);
    };

    const fragmentAnimationHandler = (action) => e => {
        e.fragments.forEach(n => {
            n.hasAttribute("data-animate") && updateAnimateClasses(action)(n);
            n.querySelectorAll("[data-animate]:not(.fragment)")
                .forEach(updateAnimateClasses(action))
        })
    };

    Reveal.addEventListener('ready', slideAnimationHandler);
    Reveal.addEventListener('slidechanged', slideAnimationHandler);
    Reveal.addEventListener('fragmentshown', fragmentAnimationHandler(ACTION.START));
    Reveal.addEventListener('fragmenthidden', fragmentAnimationHandler(ACTION.STOP));


};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimateCSSSupport);
} else {
    initAnimateCSSSupport();
}