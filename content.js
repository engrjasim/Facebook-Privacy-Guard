(function () {
    "use strict";

    const CLASSES = {
        profile: "fpg-blur-profile",
        username: "fpg-blur-username",
        image: "fpg-blur-image",
        video: "fpg-blur-video"
    };

    const DEFAULT_SETTINGS = {
        profileBlur: true,
        usernameBlur: true,
        imageBlur: true,
        videoBlur: true,
        blurStrength: 15
    };

    let settings = { ...DEFAULT_SETTINGS };

    function updateBlurStrength() {
        const value = Math.max(5, Math.min(30, Number(settings.blurStrength) || 15));
        document.documentElement.style.setProperty("--fpg-blur-strength", `${value}px`);
    }

    function removeBlur(className) {
        document.querySelectorAll("." + className).forEach(element => {
            element.classList.remove(className);
        });
    }

    function processProfilePictures() {
        if (!settings.profileBlur) {
            removeBlur(CLASSES.profile);
            return;
        }

        document.querySelectorAll("img").forEach(img => {
            const width = img.width;
            const height = img.height;

            if (
                width >= 30 &&
                width <= 150 &&
                height >= 30 &&
                height <= 150 &&
                Math.abs(width - height) < 15
            ) {
                img.classList.add(CLASSES.profile);
            }
        });
    }

    function processImages() {
        if (!settings.imageBlur) {
            removeBlur(CLASSES.image);
            return;
        }

        document.querySelectorAll("img").forEach(img => {
            const width = img.width;
            const height = img.height;

            if (width > 150 && height > 150) {
                img.classList.add(CLASSES.image);
            }
        });
    }

    function processVideos() {
        if (!settings.videoBlur) {
            removeBlur(CLASSES.video);
            return;
        }

        document.querySelectorAll("video").forEach(video => {
            video.classList.add(CLASSES.video);
        });
    }

    function processUsernames() {
        if (!settings.usernameBlur) {
            removeBlur(CLASSES.username);
            return;
        }

        document.querySelectorAll("a").forEach(link => {
            const text = link.innerText.trim();

            if (!text) return;

            if (
                text.length >= 2 &&
                text.length <= 80 &&
                link.href.includes("facebook.com")
            ) {
                const rect = link.getBoundingClientRect();

                if (
                    rect.width > 20 &&
                    rect.width < 400 &&
                    rect.height > 10 &&
                    rect.height < 80
                ) {
                    link.classList.add(CLASSES.username);
                }
            }
        });
    }

    function scanPage() {
        processProfilePictures();
        processImages();
        processVideos();
        processUsernames();
    }

    async function loadSettings() {
        try {
            const saved = await browser.storage.local.get(DEFAULT_SETTINGS);

            settings = {
                profileBlur: saved.profileBlur,
                usernameBlur: saved.usernameBlur,
                imageBlur: saved.imageBlur,
                videoBlur: saved.videoBlur,
                blurStrength: saved.blurStrength
            };

            updateBlurStrength();
            scanPage();
        } catch (error) {
            console.error("Facebook Privacy Guard content error:", error);
        }
    }

    const observer = new MutationObserver(() => {
        scanPage();
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    browser.storage.onChanged.addListener(() => {
        loadSettings();
    });

    loadSettings();
})();
