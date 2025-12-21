/* js/main.js */
/* ==============================
   Global Loading Screen Logic
   ============================== */
window.addEventListener('load', function() {
    // 页面所有资源（图片等）加载完毕后
    const loader = document.getElementById('loader');
    if (loader) {
        // 延迟一小会儿，让用户看清 loading，增加仪式感
        setTimeout(() => {
            document.body.classList.add('loaded');
            // 动画结束后移除元素，释放内存
            setTimeout(() => {
                loader.remove();
            }, 800); 
        }, 500); 
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // 1. 创建观察者对象
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 进入视口，添加 active 类
                entry.target.classList.add('active');
                // 动画只播放一次，停止观察
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1, // 露出10%触发
        rootMargin: "0px 0px -50px 0px" // 触发线向上偏移50px
    });

    // 2. 选取所有带有 .reveal 的元素
    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));
});
/* ==============================
   首页打字机特效 (Typewriter Effect)
   ============================== */
document.addEventListener("DOMContentLoaded", function() {
    // 检测是否有诗句容器（只在首页运行）
    const poemContainer = document.querySelector('.hero-poem');
    
    if (poemContainer) {
        const lines = poemContainer.querySelectorAll('p');
        
        // 1. 提取原文并清空
        const texts = Array.from(lines).map(p => p.innerText);
        lines.forEach(p => {
            p.innerText = '';
            p.style.opacity = '1'; // 让 p 标签可见（内容为空）
        });

        let lineIndex = 0;
        let charIndex = 0;

        function typeWriter() {
            if (lineIndex < texts.length) {
                const currentLine = lines[lineIndex];
                
                // 给当前正在打字的行加光标
                currentLine.classList.add('typing-active');

                if (charIndex < texts[lineIndex].length) {
                    currentLine.innerText += texts[lineIndex].charAt(charIndex);
                    charIndex++;
                    // 打字速度 (越小越快，建议 50-80ms)
                    setTimeout(typeWriter, 80); 
                } else {
                    //这一行打完了
                    currentLine.classList.remove('typing-active'); // 移除光标
                    lineIndex++;
                    charIndex = 0;
                    // 换行停顿 (建议 500ms)
                    setTimeout(typeWriter, 600); 
                }
            }
        }

        // 延迟 1.5秒 开始打字（等标题动画播完）
        setTimeout(typeWriter, 1500);
    }
    
    /* ==============================
       (可选) 鼠标轻微视差效果
       ============================== */
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
/* ==============================
   回响页：轮播逻辑 (Carousel Logic)
   ============================== */

let currentSlide = 0;
const slides = document.querySelectorAll('.echo-card');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

// 初始化：如果页面上有轮播，就运行一次状态更新
if (slides.length > 0) {
    updateCarousel();
}

// 切换幻灯片 (-1 是上一张, 1 是下一张)
function changeSlide(direction) {
    currentSlide += direction;
    
    // 循环逻辑：最后一张点下一张 -> 第一张
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    updateCarousel();
}

// 直接跳转到某一张
function jumpToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// 核心函数：更新所有卡片的类名 (Active / Prev / Next)
function updateCarousel() {
    slides.forEach((slide, index) => {
        // 先清除所有状态
        slide.classList.remove('active', 'prev', 'next');
        
        if (index === currentSlide) {
            slide.classList.add('active');
        } 
        else if (index < currentSlide) {
            slide.classList.add('prev'); // 在左边
        } 
        else {
            slide.classList.add('next'); // 在右边
        }
    });

    // 更新底部圆点
    dots.forEach((dot, index) => {
        if (index === currentSlide) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}