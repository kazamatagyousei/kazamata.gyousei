/* js/main.js */

/* ==========================================================================
   1. 全局开场动画 (Global Entrance Animation)
   ========================================================================== */
window.addEventListener('load', function() {
    // 等待页面所有资源（图片等）加载完毕
    const loader = document.getElementById('loader');
    
    if (loader) {
        // 延迟 500ms 让用户看一眼 Loading 界面，更有仪式感
        setTimeout(() => {
            // 1. 添加 .loaded 类 -> 触发 CSS 的 opacity: 0 动画 (淡出)
            document.body.classList.add('loaded');
            
            // 2. 等待 CSS 动画播完 (0.8s) 后，把 loader 从网页里彻底删掉
            // 回归最稳妥的做法，防止它挡住页面或造成闪烁
            setTimeout(() => {
                loader.remove();
            }, 800); 
            
        }, 500); 
    }
});


/* ==========================================================================
   2. 滚动显现动画 (Scroll Reveal)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口，添加 active 类触发 CSS 动画
                entry.target.classList.add('active');
                // 动画只播一次，不再观察
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1, // 露出 10% 时触发
        rootMargin: "0px 0px -50px 0px" // 触发线向上偏移 50px
    });

    // 选取所有带有 .reveal 的元素
    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));
});


/* ==========================================================================
   3. 首页专属特效 (Home Only)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    
    // --- A. 打字机特效 ---
    const poemContainer = document.querySelector('.hero-poem');
    
    if (poemContainer) {
        const lines = poemContainer.querySelectorAll('p');
        // 提取文字内容
        const texts = Array.from(lines).map(p => p.innerText);
        
        // 清空内容，准备打字
        lines.forEach(p => {
            p.innerText = '';
            p.style.opacity = '1';
        });

        let lineIndex = 0;
        let charIndex = 0;

        function typeWriter() {
            if (lineIndex < texts.length) {
                const currentLine = lines[lineIndex];
                currentLine.classList.add('typing-active'); // 加光标

                if (charIndex < texts[lineIndex].length) {
                    currentLine.innerText += texts[lineIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWriter, 80); // 打字速度
                } else {
                    //这一行打完了
                    currentLine.classList.remove('typing-active'); // 移光标
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeWriter, 600); // 换行停顿
                }
            }
        }

        // 延迟 1.5秒 开始打字（等开场动画播完）
        setTimeout(typeWriter, 1500);
    }
    
    // --- B. 鼠标视差特效 (Parallax) ---
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            // 让背景图轻微反向移动
            heroBg.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
        });
    }
});


/* ==========================================================================
   4. 回响页轮播系统 (Carousel System)
   ========================================================================== */
let currentSlide = 0;
const slides = document.querySelectorAll('.echo-card');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

// 如果当前页面有轮播组件，才运行逻辑
if (slides.length > 0) {
    updateCarousel();
}

// 切换幻灯片 (-1: 上一张, 1: 下一张)
function changeSlide(direction) {
    currentSlide += direction;
    // 循环逻辑
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    updateCarousel();
}

// 点击圆点跳转
function jumpToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// 更新视图状态 (Active / Prev / Next)
function updateCarousel() {
    slides.forEach((slide, index) => {
        // 先清除所有状态
        slide.classList.remove('active', 'prev', 'next');
        
        if (index === currentSlide) {
            slide.classList.add('active');
        } 
        else if (index < currentSlide) {
            slide.classList.add('prev');
        } 
        else {
            slide.classList.add('next');
        }
    });

    // 更新底部圆点
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            if (index === currentSlide) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }
}