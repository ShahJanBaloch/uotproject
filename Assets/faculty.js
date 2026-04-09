// loading each department faculty members dynamically using fetch API and JSON data
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById("faculty-grid");
    if (!grid) return;

    const deptKey = grid.getAttribute("data-department");
    if (!deptKey) return;

    // Use absolute path from root, or relative. Since we are in departments/xx/
    fetch('../../Assets/data/faculty.json')
      .then(res => res.json())
      .then(data => {
          console.log(data);
        let deptObj = data.departments[deptKey];
        if (!deptObj) {
            // Also try to match directly if format is weird
            deptObj = Object.values(data.departments).find(d => d.name.toLowerCase().includes(deptKey.toLowerCase()));
        }
          

        if (!deptObj) {
            grid.innerHTML = '<p class="text-gray-500 col-span-fulltext-center text-center">No faculty members found for this department.</p>';
            return;
        }

        // Update page title or heading if needed
        const heading = document.getElementById('dept-name');
        if (heading) heading.innerText = deptObj.name;

        grid.innerHTML = ""; // Clear existing

        deptObj.faculty.forEach(prof => {
          const imgUrl = prof.image ? prof.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.name)}&background=0F4C5C&color=fff&size=128`;
          
          const card = `
            <a href="../../profile.html?id=${prof.id}" data-dept="${deptKey}"
                class="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 text-center cursor-pointer no-underline group relative">
                <div
                    class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-2 border-transparent group-hover:border-brand-gold transition-all">
                    <img src="${imgUrl}"
                        class="w-full h-full object-cover">
                </div>
                <h3 class="font-bold text-gray-900 group-hover:text-brand-teal transition-colors">${prof.name}</h3>
                <p class="text-xs text-brand-gold uppercase font-bold tracking-wide mt-1">${prof.designation}</p>
                <p class="text-xs text-gray-400 mt-2">${deptObj.name}</p>
                <div class="mt-4 text-sm text-brand-teal font-medium hover:underline">View Profile</div>
            </a>
          `;
          grid.innerHTML += card;
        });
      })
      .catch(err => {
          console.error("Error loading faculty:", err);
          grid.innerHTML = '<p class="text-red-500 col-span-full text-center">Failed to load faculty data.</p>';
      });
});
