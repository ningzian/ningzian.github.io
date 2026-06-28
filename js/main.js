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
