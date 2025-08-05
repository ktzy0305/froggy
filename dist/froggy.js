/**
 * Froggy Plugin v1.0.0
 * A delightfully chaotic HTML plugin for random frog hopping
 * Inspired by the LeetCode #403 Frog Jump problem (but with zero optimization)
 */

(function(global) {
    'use strict';

    // CSS styles as a string to inject
    const CSS_STYLES = `
        .froggy-container {
            position: fixed;
            width: 230px;
            height: 210px;
            z-index: 9999;
            user-select: none;
            cursor: pointer;
            transition: left 0.3s cubic-bezier(0.5, 1.8, 0.7, 1),
                        top 0.3s cubic-bezier(0.5, 1.8, 0.7, 1);
        }

        .frog-shadow {
            position: absolute;
            left: 40px;
            top: 190px;
            width: 150px;
            height: 22px;
            background: rgba(80, 70, 30, 0.15);
            border-radius: 50%;
            z-index: 1;
            filter: blur(1px);
        }

        .frog-body {
            position: absolute;
            left: 15px;
            top: 28px;
            width: 200px;
            height: 160px;
            background: #95e481;
            border-radius: 70% 70% 50% 50% / 100% 100% 55% 55%;
            box-shadow: 0 8px 0 #7fc66b inset;
            z-index: 2;
        }

        .frog-belly {
            position: absolute;
            left: 54px;
            top: 98px;
            width: 122px;
            height: 76px;
            background: #fff;
            border-radius: 100px 100px 100px 100px / 70px 70px 70px 70px;
            z-index: 3;
            border-bottom: 4px solid #ececec;
        }

        .frog-eye {
            position: absolute;
            width: 44px;
            height: 44px;
            background: #fff;
            border: 3px solid #7fc66b;
            border-radius: 50%;
            top: 0px;
            z-index: 4;
            box-shadow: 0 0 0 3px #95e481;
        }

        .frog-eye.left {
            left: 40px;
        }

        .frog-eye.right {
            right: 40px;
        }

        .frog-iris {
            position: absolute;
            width: 22px;
            height: 22px;
            background: #2e2e2e;
            border-radius: 50%;
            top: 12px;
            left: 12px;
            z-index: 5;
        }

        .frog-eye-highlight {
            position: absolute;
            width: 8px;
            height: 8px;
            background: #fff;
            border-radius: 50%;
            left: 6px;
            top: 5px;
            opacity: 0.85;
            z-index: 6;
        }

        .frog-cheek {
            position: absolute;
            width: 26px;
            height: 18px;
            background: #ffd6e0;
            border-radius: 50%;
            top: 60px;
            z-index: 7;
            opacity: 0.85;
        }

        .frog-cheek.left {
            left: 48px;
        }

        .frog-cheek.right {
            right: 48px;
        }

        .frog-smile {
            position: absolute;
            left: 90px;
            top: 60px;
            width: 50px;
            height: 25px;
            border-bottom: 5px solid #3e3e3e;
            border-radius: 0 0 40px 40px;
            z-index: 8;
        }

        .frog-arm {
            position: absolute;
            width: 36px;
            height: 44px;
            background: #95e481;
            border: 6px solid #85cc6d;
            border-top: none;
            border-right: none;
            border-radius: 0 0 50px 50px;
            top: 110px;
            z-index: 9;
        }

        .frog-arm.left {
            left: 25px;
            transform: rotate(-16deg);
        }

        .frog-arm.right {
            right: 25px;
            transform: scaleX(-1) rotate(-16deg);
        }

        .frog-foot {
            position: absolute;
            width: 36px;
            height: 18px;
            background: #95e481;
            border: 4px solid #7fc66b;
            border-radius: 30px 30px 40px 40px / 30px 30px 40px 40px;
            top: 176px;
            z-index: 10;
        }

        .frog-foot.left {
            left: 25px;
        }

        .frog-foot.right {
            right: 25px;
        }
    `;

    // Frog HTML structure
    const FROG_HTML = `
        <div class="frog-shadow"></div>
        <div class="frog-body"></div>
        <div class="frog-belly"></div>
        <div class="frog-eye left">
            <div class="frog-iris">
                <div class="frog-eye-highlight"></div>
            </div>
        </div>
        <div class="frog-eye right">
            <div class="frog-iris">
                <div class="frog-eye-highlight"></div>
            </div>
        </div>
        <div class="frog-cheek left"></div>
        <div class="frog-cheek right"></div>
        <div class="frog-smile"></div>
        <div class="frog-arm left"></div>
        <div class="frog-arm right"></div>
        <div class="frog-foot left"></div>
        <div class="frog-foot right"></div>
    `;

    class Froggy {
        constructor(selector, options = {}) {
            this.options = {
                stepSize: options.stepSize || 120,
                maxSteps: options.maxSteps || 3,
                minSteps: options.minSteps || 1,
                initialPosition: options.initialPosition || { left: 100, top: 100 },
                ...options
            };

            this.container = typeof selector === 'string' 
                ? document.querySelector(selector) 
                : selector;

            if (!this.container) {
                throw new Error('Froggy: Container element not found');
            }

            this.init();
        }

        init() {
            // Inject CSS if not already present
            if (!document.querySelector('#froggy-styles')) {
                this.injectCSS();
            }

            // Create frog element
            this.createFrog();
            
            // Set initial position
            this.setPosition(this.options.initialPosition.left, this.options.initialPosition.top);
            
            // Add click listener
            this.addEventListeners();
        }

        injectCSS() {
            const style = document.createElement('style');
            style.id = 'froggy-styles';
            style.textContent = CSS_STYLES;
            document.head.appendChild(style);
        }

        createFrog() {
            this.container.className = 'froggy-container';
            this.container.innerHTML = FROG_HTML;
        }

        addEventListeners() {
            this.container.addEventListener('click', () => {
                this.hop();
            });
        }

        getRandomDirection() {
            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            const angle = angles[Math.floor(Math.random() * angles.length)];
            const rad = angle * (Math.PI / 180);
            return { 
                x: Math.round(Math.cos(rad)), 
                y: Math.round(Math.sin(rad)) 
            };
        }

        getRandomSteps() {
            return Math.floor(Math.random() * (this.options.maxSteps - this.options.minSteps + 1)) + this.options.minSteps;
        }

        clamp(val, min, max) {
            return Math.max(min, Math.min(max, val));
        }

        getCurrentPosition() {
            const rect = this.container.getBoundingClientRect();
            return {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY
            };
        }

        setPosition(left, top) {
            this.container.style.left = left + 'px';
            this.container.style.top = top + 'px';
        }

        hop() {
            const pageWidth = window.innerWidth;
            const pageHeight = window.innerHeight;
            const currentPos = this.getCurrentPosition();
            
            const dir = this.getRandomDirection();
            const steps = this.getRandomSteps();
            
            let newLeft = currentPos.left + dir.x * this.options.stepSize * steps;
            let newTop = currentPos.top + dir.y * this.options.stepSize * steps;
            
            // Keep frog within viewport bounds
            newLeft = this.clamp(newLeft, 0, pageWidth - this.container.offsetWidth);
            newTop = this.clamp(newTop, 0, pageHeight - this.container.offsetHeight);
            
            this.setPosition(newLeft, newTop);

            // Trigger custom event
            this.container.dispatchEvent(new CustomEvent('frogHop', {
                detail: { 
                    from: currentPos, 
                    to: { left: newLeft, top: newTop }, 
                    steps: steps,
                    direction: dir
                }
            }));
        }

        // Public methods for controlling the frog
        destroy() {
            this.container.removeEventListener('click', this.hop);
            this.container.innerHTML = '';
            this.container.className = '';
        }

        moveTo(left, top) {
            this.setPosition(left, top);
        }

        static getRandomFrogPosition(frogWidth = 230, frogHeight = 210) {
            const left = Math.floor(Math.random() * (window.innerWidth - frogWidth));
            const top = Math.floor(Math.random() * (window.innerHeight - frogHeight));
            return { left, top };
        }

        // Static method to create multiple frogs easily
        static createMultiple(selectors, options = {}) {
            return selectors.map(selector => {
                const opts = { ...options }
                if (options.randomizePosition) {
                    opts.initialPosition = Froggy.getRandomFrogPosition();
                }
                new Froggy(selector, opts)
            });
        }
    }

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Froggy;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return Froggy; });
    } else {
        global.Froggy = Froggy;
    }

})(typeof window !== 'undefined' ? window : this);