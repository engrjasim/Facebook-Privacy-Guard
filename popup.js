document.addEventListener("DOMContentLoaded", () => {
    const profileBlur = document.getElementById("profileBlur");
    const usernameBlur = document.getElementById("usernameBlur");
    const imageBlur = document.getElementById("imageBlur");
    const videoBlur = document.getElementById("videoBlur");

    const blurStrength = document.getElementById("blurStrength");
    const blurValue = document.getElementById("blurValue");

    const defaults = {
        profileBlur: true,
        usernameBlur: true,
        imageBlur: true,
        videoBlur: true,
        blurStrength: 15
    };

    async function loadSettings() {
        try {
            const saved = await browser.storage.local.get(defaults);

            profileBlur.checked = saved.profileBlur;
            usernameBlur.checked = saved.usernameBlur;
            imageBlur.checked = saved.imageBlur;
            videoBlur.checked = saved.videoBlur;

            const value = Number(saved.blurStrength) || 15;
            blurStrength.value = value;
            blurValue.textContent = `${value}px`;
        } catch (error) {
            console.error("Facebook Privacy Guard settings error:", error);
        }
    }

    function save(key, value) {
        browser.storage.local.set({ [key]: value }).catch(error => {
            console.error("Facebook Privacy Guard save error:", error);
        });
    }

    profileBlur.addEventListener("change", () => {
        save("profileBlur", profileBlur.checked);
    });

    usernameBlur.addEventListener("change", () => {
        save("usernameBlur", usernameBlur.checked);
    });

    imageBlur.addEventListener("change", () => {
        save("imageBlur", imageBlur.checked);
    });

    videoBlur.addEventListener("change", () => {
        save("videoBlur", videoBlur.checked);
    });

    blurStrength.addEventListener("input", () => {
        const value = Number(blurStrength.value);
        blurValue.textContent = `${value}px`;
    });

    blurStrength.addEventListener("change", () => {
        const value = Number(blurStrength.value);
        save("blurStrength", value);
    });

    loadSettings();
});
