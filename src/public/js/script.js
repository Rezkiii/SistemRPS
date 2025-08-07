let currentStep = 1;
const steps = document.querySelectorAll('.step');
let cpmkCounter = 0;
let subCpmkCounter = 0;


function showStep(step) {
    steps.forEach((s, index) => {
        if (index + 1 === step) {
            s.classList.remove('hidden');
        } else {
            s.classList.add('hidden');
        }
    });
}

function nextStep() {
    if (currentStep < steps.length) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function addDosenPengampu() {
    const container = document.getElementById('dosen-pengampu-container');
    // Ambil input terakhir (yang ada tombol +)
    const inputs = container.querySelectorAll('input[name="dosen_pengampu[]"]');

    // Tambahkan event sebelum submit form untuk mengisi cpl_deskripsi[]
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Hapus input cpl_deskripsi[] lama
            document.querySelectorAll('input[name="cpl_deskripsi[]"]').forEach(el => el.remove());
            // Ambil semua CPL yang dicek
            cplCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const desc = checkbox.getAttribute('data-description');
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'cpl_deskripsi[]';
                    input.value = desc;
                    form.appendChild(input);
                }
            });
        });
    }
    const lastInput = inputs[inputs.length - 1];
    const value = lastInput.value;
    if (value.trim() !== "") {
        // Buat input baru di bawah, isi dengan value lama
        const newDiv = document.createElement('div');
        newDiv.className = 'flex items-center mb-2';
        newDiv.innerHTML = `
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="dosen_pengampu[]" type="text" value="${value}" required>
            <button type="button" class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="removeElement(this)">-</button>
        `;
        container.appendChild(newDiv);
        lastInput.value = "";
    } else {
        lastInput.focus();
    }
}

function addPustakaUtama() {
    const container = document.getElementById('pustaka-utama-list');
    const inputs = container.querySelectorAll('input[name="pustaka_utama[]"]');
    const lastInput = inputs[inputs.length - 1];
    const value = lastInput.value;
    if (value.trim() !== "") {
        const newDiv = document.createElement('div');
        newDiv.className = 'flex items-center mb-2';
        newDiv.innerHTML = `
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="pustaka_utama[]" type="text" value="${value}" required>
            <button type="button" class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="removeElement(this)">-</button>
        `;
        container.appendChild(newDiv);
        lastInput.value = "";
    } else {
        lastInput.focus();
    }
}

function addPustakaPendukung() {
    const container = document.getElementById('pustaka-pendukung-list');
    const inputs = container.querySelectorAll('input[name="pustaka_pendukung[]"]');
    const lastInput = inputs[inputs.length - 1];
    const value = lastInput.value;
    if (value.trim() !== "") {
        const newDiv = document.createElement('div');
        newDiv.className = 'flex items-center mb-2';
        newDiv.innerHTML = `
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="pustaka_pendukung[]" type="text" value="${value}" required>
            <button type="button" class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="removeElement(this)">-</button>
        `;
        container.appendChild(newDiv);
        lastInput.value = "";
    } else {
        lastInput.focus();
    }
}

function removeElement(button) {
    button.parentElement.remove();
}

document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);

    const cplCheckboxes = document.querySelectorAll('input[name="cpl[]"]');
    const cpmkContainer = document.getElementById('cpmk-container');
    const subCpmkContainer = document.getElementById('sub-cpmk-container');

    cplCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const cplValue = checkbox.value;
            const cplDescription = checkbox.getAttribute('data-description');
            const cpmkSectionId = `cpmk-section-${cplValue}`;

            if (checkbox.checked) {
                const newCpmkSection = document.createElement('div');
                newCpmkSection.id = cpmkSectionId;
                newCpmkSection.className = 'mb-4 p-4 border rounded';
                newCpmkSection.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold">${cplValue}: ${cplDescription}</h3>
                        <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onclick="addCPMK('${cplValue}', '${cplDescription}')">Add CPMK</button>
                    </div>
                    <div id="cpmk-list-${cplValue}"></div>
                `;
                cpmkContainer.appendChild(newCpmkSection);
            } else {
                const cpmkSection = document.getElementById(cpmkSectionId);
                if (cpmkSection) {
                    cpmkSection.remove();
                }
                const subCpmkSections = subCpmkContainer.querySelectorAll(`[data-cpl="${cplValue}"]`);
                subCpmkSections.forEach(section => section.remove());
            }
        });
    });
});


function addCPMK(cplValue, cplDescription) {
    const cpmkList = document.getElementById(`cpmk-list-${cplValue}`);
    // Cari nomor urut terbesar dari id CPMK yang sudah ada
    const allCpmk = document.querySelectorAll('div[id^="CPMK"]');
    let maxNum = 0;
    allCpmk.forEach(div => {
        const match = div.id.match(/^CPMK(\d{2})$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
        }
    });
    const nextNum = maxNum + 1;
    const cpmkId = `CPMK${String(nextNum).padStart(2, '0')}`;

    const newCpmkDiv = document.createElement('div');
    newCpmkDiv.id = cpmkId;
    newCpmkDiv.className = 'mt-2 p-2 border-l-4 border-blue-500';
    newCpmkDiv.innerHTML = `
        <div class="flex justify-between items-center">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="deskripsi_cpmk_${cpmkId}">${cpmkId}</label>
            <button type="button" class="text-red-500 font-bold" onclick="removeCPMK('${cpmkId}', '${cplValue}')">Remove CPMK</button>
        </div>
        <div id="${cpmkId}-content">
            <input type="hidden" name="cpmk[${cpmkId}][cpl_code]" value="${cplValue}">
            <input type="hidden" name="cpmk[${cpmkId}][cpl_description]" value="${cplDescription}">
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="cpmk[${cpmkId}][deskripsi]" rows="2" required></textarea>
        </div>
    `;
    cpmkList.appendChild(newCpmkDiv);

    const subCpmkContainer = document.getElementById('sub-cpmk-container');
    const newSubCpmkSection = document.createElement('div');
    newSubCpmkSection.id = `sub-cpmk-section-${cpmkId}`;
    newSubCpmkSection.setAttribute('data-cpl', cplValue);
    newSubCpmkSection.className = 'mb-4 p-4 border rounded';
    newSubCpmkSection.innerHTML = `
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold cursor-pointer" style="cursor:pointer;" onclick="toggleCollapse('sub-cpmk-list-${cpmkId}', this)">Sub-CPMK for ${cpmkId}</h3>
            <button type="button" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" onclick="addSubCPMK('${cpmkId}')">Add Sub-CPMK</button>
        </div>
        <div id="sub-cpmk-list-${cpmkId}"></div>
    `;
    subCpmkContainer.appendChild(newSubCpmkSection);
// Collapse/Expand logic
function toggleCollapse(contentId, headerEl) {
    const content = document.getElementById(contentId);
    if (!content) return;
    if (content.style.display === 'none') {
        content.style.display = '';
        if(headerEl) headerEl.classList.remove('text-gray-400');
    } else {
        content.style.display = 'none';
        if(headerEl) headerEl.classList.add('text-gray-400');
    }
}
}

function removeCPMK(cpmkId, cplValue) {
    const cpmkDiv = document.getElementById(cpmkId);
    if (cpmkDiv) {
        cpmkDiv.remove();
    }
    const subCpmkSection = document.getElementById(`sub-cpmk-section-${cpmkId}`);
    if (subCpmkSection) {
        subCpmkSection.remove();
    }
}

function addSubCPMK(cpmkId) {
    const subCpmkList = document.getElementById(`sub-cpmk-list-${cpmkId}`);
    if (!subCpmkList) {
        alert('Gagal menambah Sub-CPMK: container tidak ditemukan. Silakan refresh halaman atau pastikan CPMK sudah ditambahkan.');
        return;
    }
    // Cari index terkecil yang belum dipakai
    let usedIndexes = Array.from(subCpmkList.querySelectorAll('[data-subcpmk-index]')).map(e => parseInt(e.getAttribute('data-subcpmk-index')));
    let nextIndex = 1;
    while (usedIndexes.includes(nextIndex)) {
        nextIndex++;
    }

    const newSubCpmkDiv = document.createElement('div');
    newSubCpmkDiv.className = 'mt-2 p-2 border-l-4 border-green-500 grid grid-cols-1 md:grid-cols-2 gap-4';
    newSubCpmkDiv.setAttribute('data-subcpmk-index', nextIndex);
    newSubCpmkDiv.innerHTML = `
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Deskripsi Sub-CPMK</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][deskripsi]" rows="2" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Pekan ke-</label>
            <div style="display: flex; gap: 8px; align-items: center;">
                <input type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][pekan_awal]" min="1" required placeholder="Awal">
                <span>-</span>
                <input type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][pekan_akhir]" min="1" required placeholder="Akhir">
            </div>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Penilaian Indikator</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][indikator]" rows="2" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Penilaian Teknik & Kriteria</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][teknik_kriteria]" rows="2" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Metode Pembelajaran Luring</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][metode_luring]" rows="2" required placeholder="Contoh: Tatap Muka, Praktikum, dll"></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Metode Pembelajaran Daring</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][metode_daring]" rows="2" required placeholder="Contoh: Zoom, Google Meet, dll"></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Materi Pembelajaran</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][materi]" rows="2" required></textarea>
        </div>

        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Modalitas</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][modalitas]" rows="2" placeholder="Contoh: Luring/Daring" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Bentuk Pembelajaran</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][bentuk_pembelajaran]" rows="2" placeholder="Contoh: Praktikum, Diskusi, dll" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Strategi Pembelajaran</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][strategi_pembelajaran]" rows="2" placeholder="Contoh: Kolaboratif, Mandiri, dll" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Metode</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][metode]" rows="2" placeholder="Contoh: Ceramah, Diskusi, dll" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Media</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][media]" rows="2" placeholder="Contoh: PPT, Video, dll" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Sumber Belajar</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][sumber_belajar]" rows="2" placeholder="Contoh: Buku, Jurnal, dll" required></textarea>
        </div>
        
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Bobot Penilaian (%)</label>
            <input type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${nextIndex}][bobot]" required>
        </div>
        <div class="md:col-span-2 text-right">
            <button type="button" class="text-red-500 font-bold" onclick="removeElement(this.parentElement.parentElement)">Remove Sub-CPMK</button>
        </div>
    `;
    subCpmkList.appendChild(newSubCpmkDiv);
}