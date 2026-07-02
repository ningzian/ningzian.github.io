/**
 * 公司官网 - 主脚本
 */

document.addEventListener('DOMContentLoaded', function () {
    // ----- 导航栏滚动效果 -----
    var navbar = document.querySelector('.navbar');
    var isHomePage = document.getElementById('home') !== null;
    var scrollHandler = function () {
        if (isHomePage) {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        } else {
            // 子页面永远保持 scrolled 状态
            navbar.classList.add('scrolled');
        }
    };
    window.addEventListener('scroll', scrollHandler);
    scrollHandler(); // 初始检查

    // ----- 移动端菜单切换 -----
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // ----- 下拉菜单交互（移动端点击打开/收起） -----
    var dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector('.dropdown-toggle');
        toggle.addEventListener('click', function (e) {
            // 仅在移动端拦截默认跳转行为
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    });

    // 点击导航链接后自动关闭移动端菜单（下拉子链接除外）
    var linkItems = document.querySelectorAll('.nav-links > li > a:not(.dropdown-toggle)');
    linkItems.forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 下拉菜单中的子链接点击后也关闭菜单
    var dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ----- Hero 视频轮播 -----
    (function() {
        var slider = document.querySelector('.hero-slider');
        if (!slider) return;
        var slides = slider.querySelector('.hero-slides');
        var dotsCtn = slider.querySelector('.hero-slider-dots');
        var prevBtn = slider.querySelector('.hero-slider-prev');
        var nextBtn = slider.querySelector('.hero-slider-next');
        var videos = slides.querySelectorAll('video');
        var total = videos.length;
        var idx = 0;

        // Create dots
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('span');
            dot.className = 'hero-slider-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', (function(n) {
                return function() { go(n); };
            })(i));
            dotsCtn.appendChild(dot);
        }
        var dots = dotsCtn.querySelectorAll('.hero-slider-dot');

        function go(n) {
            // Pause current video and reset it
            videos[idx].pause();
            videos[idx].currentTime = 0;
            idx = n;
            slides.style.transform = 'translateX(-' + (idx * 100) + 'vw)';
            dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
            // Start playing new video from beginning
            videos[idx].currentTime = 0;
            videos[idx].play();
        }

        function next() { go((idx + 1) % total); }
        function prev() { go((idx - 1 + total) % total); }

        prevBtn.addEventListener('click', function() { prev(); });
        nextBtn.addEventListener('click', function() { next(); });

        // Auto-advance when video ends
        videos.forEach(function(v) {
            v.addEventListener('ended', function() { next(); });
        });

        // Touch
        var startX = 0;
        slides.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; });
        slides.addEventListener('touchend', function(e) {
            if (Math.abs(startX - e.changedTouches[0].clientX) > 40) {
                (startX > e.changedTouches[0].clientX) ? next() : prev();
            }
        });
    })();

    // ----- 图片轮播 -----
    document.querySelectorAll('.carousel').forEach(function (carousel) {
        var track = carousel.querySelector('.carousel-track');
        var dotsContainer = carousel.querySelector('.carousel-dots');
        var prevBtn = carousel.querySelector('.carousel-prev');
        var nextBtn = carousel.querySelector('.carousel-next');
        var slides = track.querySelectorAll('img, video');
        var totalSlides = slides.length;
        var currentIndex = 0;
        var autoplayTimer;

        // 创建导览点
        for (var i = 0; i < totalSlides; i++) {
            var dot = document.createElement('span');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', function () {
                goToSlide(parseInt(this.getAttribute('data-index')));
            });
            dotsContainer.appendChild(dot);
        }

        var dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === index);
            });
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }

        prevBtn.addEventListener('click', function () {
            prevSlide();
            resetAutoplay();
        });
        nextBtn.addEventListener('click', function () {
            nextSlide();
            resetAutoplay();
        });

        // 触摸滑动
        var touchStartX = 0;
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
        });
        track.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                diff > 0 ? nextSlide() : prevSlide();
                resetAutoplay();
            }
        });

        // 自动播放
        function startAutoplay() {
            autoplayTimer = setInterval(nextSlide, 4000);
        }
        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }
        startAutoplay();
    });

    // ----- 右侧滚动进度条 -----
    var progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.height = pct + '%';
    });

    // 窗口大小变化时重置下拉状态
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            dropdowns.forEach(function (d) {
                d.classList.remove('open');
            });
        }, 250);
    });
});
