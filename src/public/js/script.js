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
    const newDiv = document.createElement('div');
    newDiv.className = 'flex items-center mb-2';
    newDiv.innerHTML = `
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="dosen_pengampu[]" type="text" required>
        <button type="button" class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="removeElement(this)">-</button>
    `;
    container.appendChild(newDiv);
}

function addPustakaUtama() {
    const container = document.getElementById('pustaka-utama-list');
    const newDiv = document.createElement('div');
    newDiv.className = 'flex items-center mb-2';
    newDiv.innerHTML = `
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="pustaka_utama[]" type="text" required>
        <button type="button" class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="removeElement(this)">-</button>
    `;
    container.appendChild(newDiv);
}

function addPustakaPendukung() {
    const container = document.getElementById('pustaka-pendukung-list');
    const newDiv = document.createElement('div');
    newDiv.className = 'flex items-center mb-2';
    newDiv.innerHTML = `
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="pustaka_pendukung[]" type="text" required>
        <button type="button" class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="removeElement(this)">-</button>
    `;
    container.appendChild(newDiv);
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
    cpmkCounter++;
    const cpmkId = `CPMK${String(cpmkCounter).padStart(2, '0')}`;
    const cpmkList = document.getElementById(`cpmk-list-${cplValue}`);

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
    subCpmkCounter++;
    const subCpmkList = document.getElementById(`sub-cpmk-list-${cpmkId}`);

    const newSubCpmkDiv = document.createElement('div');
    newSubCpmkDiv.className = 'mt-2 p-2 border-l-4 border-green-500 grid grid-cols-1 md:grid-cols-2 gap-4';
    newSubCpmkDiv.innerHTML = `
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Deskripsi Sub-CPMK</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${subCpmkCounter}][deskripsi]" rows="2" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Pekan ke-</label>
            <input type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${subCpmkCounter}][pekan]" required>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Penilaian Indikator</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${subCpmkCounter}][indikator]" rows="2" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Penilaian Teknik & Kriteria</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${subCpmkCounter}][teknik_kriteria]" rows="2" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Metode Pembelajaran Luring</label>
            <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${subCpmkCounter}][metode_luring]" required>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Metode Pembelajaran Daring</label>
            <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${subCpmkCounter}][metode_daring]" required>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Materi Pembelajaran</label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${subCpmkCounter}][materi]" rows="2" required></textarea>
        </div>
        <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Bobot Penilaian (%)</label>
            <input type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" name="sub_cpmk[${cpmkId}][${subCpmkCounter}][bobot]" required>
        </div>
        <div class="md:col-span-2 text-right">
            <button type="button" class="text-red-500 font-bold" onclick="removeElement(this.parentElement.parentElement)">Remove Sub-CPMK</button>
        </div>
    `;
    subCpmkList.appendChild(newSubCpmkDiv);
}