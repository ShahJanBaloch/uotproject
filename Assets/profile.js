document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        showError("No profile ID specified.");
        return;
    }

    // Relative path to faculty.json
    fetch('../Assets/data/faculty.json')
        .then(res => {
            if (!res.ok) throw new Error("Failed to load faculty data.");
            return res.json();
        })
        .then(data => {
            let found = null;
            let deptName = "";

            // Find the faculty member across all departments
            for (let dept in data.departments) {
                const prof = data.departments[dept].faculty.find(p => p.id === id);
                if (prof) {
                    found = prof;
                    deptName = data.departments[dept].name;
                    break;
                }
            }

            if (found) {
                // Populate profile data
                document.getElementById("name").innerText = found.name;
                document.getElementById("designation").innerText = found.designation;
                document.getElementById("dept-text").innerText = deptName;

                const emailEl = document.getElementById("email");
                const emailLink = document.getElementById("email-link");
                if (found.email) {
                    emailEl.innerText = found.email;
                    emailLink.href = `mailto:${found.email}`;
                } else {
                    emailLink.style.display = "none";
                }

                // Profile Image
                const imgEl = document.getElementById("image");
                if (found.image) {
                    imgEl.src = found.image;
                } else {
                    imgEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(found.name)}&background=0F4C5C&color=fff&size=128`;
                }

                // Bio
                const bioSection = document.getElementById("bio-section");
                const bioEl = document.getElementById("bio");
                if (found.bio) {
                    bioEl.innerText = found.bio;
                    bioSection.style.display = "block";
                } else {
                    bioSection.style.display = "none";
                }

                // Education
                const eduSection = document.getElementById("education-section");
                const eduEl = document.getElementById("education");
                if (found.education && found.education.trim() !== "") {
                    eduEl.innerHTML = found.education;
                    eduSection.style.display = "block";
                } else {
                    eduSection.style.display = "none";
                }

                // Publications
                const pubSection = document.getElementById("publications-section");
                const pubEl = document.getElementById("publications");
                if (found.publications && found.publications.trim() !== "") {
                    pubEl.innerHTML = found.publications;
                    pubSection.style.display = "block";
                } else {
                    pubSection.style.display = "none";
                }

                // Official Profile URL
                const urlEl = document.getElementById("profileUrl");
                if (found.profileUrl) {
                    urlEl.href = found.profileUrl;
                    urlEl.style.display = "inline-flex";
                } else {
                    urlEl.style.display = "none";
                }

                // Reveal the profile section
                const profileSection = document.querySelector(".profile-section");
                if (profileSection) {
                    profileSection.classList.add("loaded");
                }

            } else {
                showError("Faculty member not found.");
            }
        })
        .catch(err => {
            console.error("Error loading profile:", err);
            showError("Failed to load profile data.");
        });

    function showError(message) {
        const profileSection = document.querySelector(".profile-section");
        if (profileSection) {
            profileSection.innerHTML = `
                <div class="bg-white rounded-3xl shadow-xl p-12 text-center animate-fade-in-up">
                    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                        <i data-lucide="user-x" class="w-10 h-10"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${message}</h2>
                    <p class="text-gray-500 mb-8">The faculty profile you're looking for might have been moved or removed.</p>
                    <a href="faculties.html" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white rounded-full font-bold hover:bg-brand-darkTeal transition shadow-md">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>
                        Back to Faculty List
                    </a>
                </div>
            `;
            profileSection.classList.add("loaded");
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
});
