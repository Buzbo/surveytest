/* =============================================
   BUZBO SURVEY.JS
   - Step navigation + progress
   - Multi/single select card logic
   - Conditional fields (months, hybrid, size, other)
   - Validation per step
   - Tips modal
   - Country multi-select dropdown
   - Distance slider
   - Submit → redirect to Tally
   ============================================= */

// ── STATE ─────────────────────────────────────
const TOTAL_STEPS = 15;
let currentStep = 0;
const answers = {};

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    initPills();
    initCardGroups();
    initGoalGrid();
    initCountryDropdown();
    initSlider();
    initConditionals();
});

// ── PROGRESS BAR ──────────────────────────────
function updateProgress() {
    const pct = currentStep === 0 ? 0 : Math.round((currentStep / TOTAL_STEPS) * 100);
    document.getElementById('progressBar').style.width = pct + '%';
    const label = currentStep === 0 ? '00 / 15' : String(currentStep).padStart(2, '0') + ' / 15';
    document.getElementById('stepLabel').textContent = label;
}

// ── NAVIGATION ────────────────────────────────
function goNext() {
    if (!validateStep(currentStep)) return;
    saveStep(currentStep);
    showStep(currentStep + 1);
}

function goBack() {
    if (currentStep > 0) showStep(currentStep - 1);
}

function skipStep() {
    showStep(currentStep + 1);
}

function showStep(n) {
    if (n > TOTAL_STEPS || n < 0) return;
    const steps = document.querySelectorAll('.step');
    const current = steps[currentStep];

    // Animate out
    current.classList.add('exit');
    setTimeout(() => {
        current.classList.remove('active', 'exit');
        currentStep = n;
        const next = steps[currentStep];
        next.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateProgress();
    }, 200);
}

// ── SAVE ANSWERS ──────────────────────────────
function saveStep(step) {
    switch (step) {
        case 1:
            answers.name = document.getElementById('f_name')?.value?.trim();
            answers.gender = getSelectedPills('f_gender');
            answers.age = document.getElementById('f_age')?.value;
            break;
        case 2: answers.worktype = getSelectedCards('f_worktype'); break;
        case 3: answers.hours = getSelectedCards('f_hours'); break;
        case 4:
            answers.timeframe = getSelectedCards('f_timeframe');
            answers.months = document.getElementById('f_months')?.value;
            break;
        case 5: answers.country = document.getElementById('f_country_select')?.value; break;
        case 6:
            answers.city = document.getElementById('f_city')?.value?.trim();
            answers.distance = document.getElementById('f_distance')?.value;
            break;
        case 7:
            answers.workstyle = getSelectedCards('f_workstyle');
            answers.hybrid = getSelectedPills('f_hybrid');
            break;
        case 8: answers.languages = getSelectedCards('f_languages'); break;
        case 10: answers.passion = document.getElementById('f_passion')?.value?.trim(); break;
        case 11: answers.goal = getSelectedGoals(); break;
        case 12:
            answers.market = getSelectedCards('f_market');
            answers.market_other = document.getElementById('f_market_other')?.value?.trim();
            break;
        case 13:
            answers.size_important = getSelectedCards('f_size_important');
            answers.size = getSelectedCards('f_size');
            break;
        case 14:
            answers.interests = getSelectedCards('f_interests');
            answers.interests_other = document.getElementById('f_interests_other')?.value?.trim();
            answers.sports = getSelectedCards('f_sports');
            break;
    }
    console.log('Answers so far:', answers);
}

// ── VALIDATION ────────────────────────────────
function validateStep(step) {
    switch (step) {
        case 1: {
            const name = document.getElementById('f_name').value.trim();
            if (!name) { showError('Please enter your name'); highlight('f_name'); return false; }
            if (getSelectedPills('f_gender').length === 0) { showError('Please select your gender identity'); return false; }
            return true;
        }
        case 2:
            if (getSelectedCards('f_worktype').length === 0) { showError('Please select at least one option'); return false; }
            return true;
        case 3:
            if (getSelectedCards('f_hours').length === 0) { showError('Please select at least one option'); return false; }
            return true;
        case 4: {
            if (getSelectedCards('f_timeframe').length === 0) { showError('Please select your availability'); return false; }
            const tf = getSelectedCards('f_timeframe');
            if (tf.includes('In X months')) {
                const m = document.getElementById('f_months').value;
                if (!m || m < 1) { showError('Please specify how many months'); return false; }
            }
            return true;
        }
        case 5:
            if (!document.getElementById('f_country_select')?.value) { showError('Please select a country'); return false; }
            return true;
        case 7:
            if (getSelectedCards('f_workstyle').length === 0) { showError('Please select your work preference'); return false; }
            return true;
        case 8:
            if (getSelectedCards('f_languages').length === 0) { showError('Please select at least one language'); return false; }
            return true;
        case 10:
            if (!document.getElementById('f_passion').value.trim()) { showError('Please tell us your passion'); return false; }
            return true;
        case 11:
            if (getSelectedGoals().length === 0) { showError('Please select at least one company goal'); return false; }
            return true;
        case 12:
            if (getSelectedCards('f_market').length === 0) { showError('Please select at least one area'); return false; }
            return true;
        case 13:
            if (getSelectedCards('f_size_important').length === 0) { showError('Please answer this question'); return false; }
            return true;
        default:
            return true;
    }
}

// ── PILL SINGLE-SELECT ─────────────────────────
function initPills() {
    document.querySelectorAll('.pill-group').forEach(group => {
        group.querySelectorAll('.pill').forEach(pill => {
            pill.addEventListener('click', () => {
                group.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
                pill.classList.add('selected');
            });
        });
    });
}

function getSelectedPills(groupId) {
    const group = document.getElementById(groupId);
    if (!group) return [];
    return Array.from(group.querySelectorAll('.pill.selected')).map(p => p.dataset.val);
}

// ── CARD MULTI-SELECT ─────────────────────────
function initCardGroups() {
    document.querySelectorAll('.card-group').forEach(group => {
        const isSingle = group.classList.contains('card-group--single');
        group.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (isSingle) {
                    group.querySelectorAll('.card-btn').forEach(b => b.classList.remove('selected'));
                }
                btn.classList.toggle('selected');
            });
        });
    });
}

function getSelectedCards(groupId) {
    const group = document.getElementById(groupId);
    if (!group) return [];
    return Array.from(group.querySelectorAll('.card-btn.selected')).map(b => b.dataset.val);
}

// ── GOAL GRID MULTI-SELECT ────────────────────
function initGoalGrid() {
    document.querySelectorAll('.goal-grid').forEach(grid => {
        grid.querySelectorAll('.goal-btn').forEach(btn => {
            btn.addEventListener('click', () => btn.classList.toggle('selected'));
        });
    });
}

function getSelectedGoals() {
    const grid = document.getElementById('f_goal');
    if (!grid) return [];
    return Array.from(grid.querySelectorAll('.goal-btn.selected')).map(b => b.dataset.val);
}

// ── CONDITIONAL LOGIC ─────────────────────────
function initConditionals() {

    // Stap 4: "In X months" → show months input
    const timeframeGroup = document.getElementById('f_timeframe');
    if (timeframeGroup) {
        timeframeGroup.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const monthsField = document.getElementById('months-field');
                // slight delay to wait for toggle
                setTimeout(() => {
                    const selected = getSelectedCards('f_timeframe');
                    monthsField.style.display = selected.includes('In X months') ? 'block' : 'none';
                }, 50);
            });
        });
    }

    // Stap 7: "Hybrid" → show favorite location
    const workstyleGroup = document.getElementById('f_workstyle');
    if (workstyleGroup) {
        workstyleGroup.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const hybridField = document.getElementById('hybrid-field');
                setTimeout(() => {
                    const selected = getSelectedCards('f_workstyle');
                    hybridField.style.display = selected.includes('Hybrid') ? 'block' : 'none';
                }, 50);
            });
        });
    }

    // Stap 12: "Other" in market → show text input
    const marketGroup = document.getElementById('f_market');
    if (marketGroup) {
        marketGroup.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const otherField = document.getElementById('market-other-field');
                setTimeout(() => {
                    const selected = getSelectedCards('f_market');
                    otherField.style.display = selected.includes('Other') ? 'block' : 'none';
                }, 50);
            });
        });
    }

    // Stap 13: "Yes" → show company size options
    const sizeImportant = document.getElementById('f_size_important');
    if (sizeImportant) {
        sizeImportant.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sizeField = document.getElementById('size-field');
                setTimeout(() => {
                    const selected = getSelectedCards('f_size_important');
                    sizeField.style.display = selected.includes('Yes') ? 'block' : 'none';
                }, 50);
            });
        });
    }

    // Stap 14: "Other" in interests → show text input
    const interestsGroup = document.getElementById('f_interests');
    if (interestsGroup) {
        interestsGroup.querySelectorAll('.card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const otherField = document.getElementById('interests-other-field');
                setTimeout(() => {
                    const selected = getSelectedCards('f_interests');
                    otherField.style.display = selected.includes('Other') ? 'block' : 'none';
                }, 50);
            });
        });
    }
}

// ── COUNTRY MULTI-SELECT DROPDOWN ─────────────
const countrySelected = [];

function initCountryDropdown() {
    const wrap = document.querySelector('.multiselect-wrap');
    const select = document.querySelector('.multiselect');
    const dropdown = document.getElementById('countryDropdown');
    if (!select || !dropdown) return;

    // Render placeholder
    renderCountryTags();

    // Toggle dropdown
    select.addEventListener('click', (e) => {
        if (e.target.classList.contains('ms-tag-remove')) return;
        dropdown.classList.toggle('open');
        select.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!wrap?.contains(e.target)) {
            dropdown.classList.remove('open');
            select.classList.remove('open');
        }
    });

    // Option click
    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = item.dataset.val;
            if (countrySelected.includes(val)) {
                countrySelected.splice(countrySelected.indexOf(val), 1);
                item.classList.remove('selected');
            } else {
                countrySelected.push(val);
                item.classList.add('selected');
            }
            renderCountryTags();
        });
    });
}

function renderCountryTags() {
    const container = document.getElementById('countrySelected');
    if (!container) return;
    if (countrySelected.length === 0) {
        container.innerHTML = '<span class="ms-placeholder">Select countries...</span>';
        return;
    }
    container.innerHTML = countrySelected.map(c =>
        `<span class="ms-tag">${c}<button class="ms-tag-remove" onclick="removeCountry('${c}')" type="button">✕</button></span>`
    ).join('');
}

function removeCountry(val) {
    const idx = countrySelected.indexOf(val);
    if (idx > -1) countrySelected.splice(idx, 1);
    const item = document.querySelector(`.dropdown-item[data-val="${val}"]`);
    if (item) item.classList.remove('selected');
    renderCountryTags();
}

function getSelectedDropdown() { return [...countrySelected]; }

// ── SLIDER ────────────────────────────────────
function initSlider() {
    const slider = document.getElementById('f_distance');
    const val = document.getElementById('distanceVal');
    if (!slider || !val) return;
    slider.addEventListener('input', () => { val.textContent = slider.value + ' km'; });
}

// ── TIPS MODAL ────────────────────────────────
function openTips() {
    document.getElementById('tipsModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeTips(e) {
    if (e && e.target !== document.getElementById('tipsModal') && !e.target.classList.contains('modal-close')) return;
    document.getElementById('tipsModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Allow calling closeTips() from button directly
window.closeTips = function (e) {
    document.getElementById('tipsModal').style.display = 'none';
    document.body.style.overflow = '';
};

// ── ERROR TOAST ───────────────────────────────
function showError(msg) {
    const toast = document.getElementById('errorToast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function highlight(fieldId) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.classList.add('error');
    el.focus();
    setTimeout(() => el.classList.remove('error'), 2500);
}

// ── SUBMIT ────────────────────────────────────────────────────────────────────
async function submitSurvey() {
    saveStep(15);

    // Show loading state on button
    const btn = document.getElementById('submitBtn') || document.querySelector('[onclick="submitSurvey()"]');
    if (btn) { btn.textContent = 'Submitting...'; btn.disabled = true; }

    // Send to Formspree
    try {
        await fetch('https://formspree.io/f/xojkeeyk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                // Top-level fields for easy reading in Formspree dashboard
                name: answers.name || '',
                gender: (answers.gender || []).join(', '),
                age: answers.age || '',
                work_type: (answers.worktype || []).join(', '),
                hours: (answers.hours || []).join(', '),
                timeframe: (answers.timeframe || []).join(', '),
                months: answers.months || '',
                country: answers.country || '',
                city: answers.city || '',
                distance_km: answers.distance || '',
                work_style: (answers.workstyle || []).join(', '),
                hybrid_location: (answers.hybrid || []).join(', '),
                languages: (answers.languages || []).join(', '),
                passion: answers.passion || '',
                company_goal: (answers.goal || []).join(', '),
                market_expertise: (answers.market || []).join(', '),
                market_other: answers.market_other || '',
                size_important: (answers.size_important || []).join(', '),
                company_size: (answers.size || []).join(', '),
                interests: (answers.interests || []).join(', '),
                interests_other: answers.interests_other || '',
                sports: (answers.sports || []).join(', '),
                submitted_at: new Date().toISOString(),
            })
        });
    } catch (err) {
        // Non-blocking — still redirect even if submission fails
        console.warn('Formspree submission failed:', err);
    }

    // Redirect to Tally feedback survey
    window.location.href = 'https://tally.so/r/gDAJ5P';
}

// Expose globals
window.goNext = goNext;
window.goBack = goBack;
window.skipStep = skipStep;
window.openTips = openTips;
window.submitSurvey = submitSurvey;
window.removeCountry = removeCountry;
