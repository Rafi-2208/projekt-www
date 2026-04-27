
document.addEventListener('DOMContentLoaded', () => {
    // SŁOWNIK TŁUMACZEŃ
    const translations = {
        pl: {
            nav_home: "Start", nav_about: "O biegu", nav_gallery: "Podopieczni", nav_register: "Rejestracja", nav_contact: "Kontakt",
            hero_badge: "Łódź • 2025", hero_title: "Biegnij dla łódzkiego schroniska!", hero_desc: "Ulica Piotrkowska zamieni się w trasę pełną serca. Każdy kilometr to realna pomoc.",
            hero_btn_reg: "Zapisz się na bieg", hero_btn_details: "Szczegóły trasy",
            stat_fee: "Opłata startowa", stat_dist: "Dystans trasy", stat_charity: "Na schronisko",
            about_title: "O wydarzeniu", about_desc: "Projekt zakłada organizację biegu wspierającego łódzkie schronisko.",
            about_li1: "Profesjonalny pomiar czasu.", about_li2: "Medal dla każdego.", about_li3: "Start z psem.", about_li4: "Woda na mecie.",
            gallery_title: "Nasi podopieczni", gallery_desc: "Poznaj zwierzaki, dla których biegniemy.",
            animal_burek: "Wesoły psiak, uwielbia ludzi.", animal_luna: "Spokojna kotka do mieszkania.", animal_max: "Energiczny terrier, kocha biegać.",
            reg_title: "Zarejestruj się", form_fname: "Imię", form_lname: "Nazwisko", form_email: "E-mail", form_phone: "Telefon", form_pesel: "PESEL",
            form_agree: "Akceptuję regulamin (20 zł).", form_submit: "Wyślij zgłoszenie",
            cont_title: "Kontakt", cont_office: "Biuro Organizatora", cont_write: "Napisz do nas", cont_call: "Zadzwoń", cont_hours: "+48 123 456 789 (pn-pt 9-17)",
            cont_social: "Obserwuj nas:", foot_authors: "Autorzy:",
            err_msg: "Błędne dane.", form_err: "Popraw błędy.", form_success: "Sukces! Zgłoszenie wysłane.", form_sending: "Wysyłanie...", server_err: "Błąd serwera."
        },
        en: {
            nav_home: "Home", nav_about: "About", nav_gallery: "Pets", nav_register: "Register", nav_contact: "Contact",
            hero_badge: "Łódź • 2025", hero_title: "Run for the Łódź Shelter!", hero_desc: "Piotrkowska Street turns into a route full of heart. Every kilometer is real help.",
            hero_btn_reg: "Sign up for the run", hero_btn_details: "Route details",
            stat_fee: "Entry fee", stat_dist: "Route distance", stat_charity: "For the shelter",
            about_title: "About the event", about_desc: "This project aims to support the local animal shelter through a charity run.",
            about_li1: "Professional time measurement.", about_li2: "Medal for everyone.", about_li3: "Run with your dog.", about_li4: "Water at the finish line.",
            gallery_title: "Our Pets", gallery_desc: "Meet the animals we are running for.",
            animal_burek: "Cheerful dog who loves people.", animal_luna: "Calm cat, perfect for an apartment.", animal_max: "Energetic terrier, loves running.",
            reg_title: "Register Now", form_fname: "First Name", form_lname: "Last Name", form_email: "Email", form_phone: "Phone", form_pesel: "PESEL (ID)",
            form_agree: "I accept terms & conditions (20 PLN).", form_submit: "Send Application",
            cont_title: "Contact", cont_office: "Organizer Office", cont_write: "Email us", cont_call: "Call us", cont_hours: "+48 123 456 789 (Mon-Fri 9-5)",
            cont_social: "Follow us:", foot_authors: "Authors:",
            err_msg: "Invalid data.", form_err: "Please fix the errors.", form_success: "Success! Application sent.", form_sending: "Sending...", server_err: "Server error."
        }
    };

    let currentLang = localStorage.getItem('lang') || 'pl';

    const updateLanguage = () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });
        // Update placeholders
        document.getElementById('firstName').placeholder = currentLang === 'pl' ? 'np. Jan' : 'e.g. John';
        document.getElementById('lastName').placeholder = currentLang === 'pl' ? 'np. Kowalski' : 'e.g. Smith';
    };

    // Obsługa przełącznika języka
    document.getElementById('lang-toggle').addEventListener('click', () => {
        currentLang = currentLang === 'pl' ? 'en' : 'pl';
        localStorage.setItem('lang', currentLang);
        updateLanguage();
    });

    // 1. Motyw Dark/Light (istniejąca logika)
    const themeToggle = document.getElementById('theme-toggle');
    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
    themeToggle.addEventListener('click', toggleTheme);
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = "☀️";
    }

    // Inicializacja języka
    updateLanguage();

    // 2. Walidacja i Wysyłka (zmodyfikowane pod i18n)
    const form = document.getElementById('registrationForm');
    const statusBox = document.getElementById('form-status');
    const submitBtn = document.getElementById('submitBtn');

    const validateField = (id) => {
        const input = document.getElementById(id);
        const errorSpan = document.getElementById(`error-${id}`);
        const rules = {
            firstName: /^[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]{3,}$/,
            lastName: /^[a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż]{3,}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[0-9]{9}$/,
            pesel: /^[0-9]{11}$/
        };

        let isValid = id === 'agreement' ? input.checked : rules[id]?.test(input.value.trim());

        if (!isValid) {
            input.style.borderColor = 'var(--error)';
            if (errorSpan) errorSpan.textContent = translations[currentLang].err_msg;
        } else {
            input.style.borderColor = 'var(--accent)';
            if (errorSpan) errorSpan.textContent = "";
        }
        return isValid;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fields = ['firstName', 'lastName', 'email', 'phone', 'pesel', 'agreement'];
        const isFormValid = fields.every(field => validateField(field));

        if (!isFormValid) {
            statusBox.textContent = translations[currentLang].form_err;
            statusBox.className = "alert alert-error";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = translations[currentLang].form_sending;

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
                headers: { 'Content-type': 'application/json' }
            });
            if (response.ok) {
                statusBox.textContent = translations[currentLang].form_success;
                statusBox.className = "alert alert-success";
                form.reset();
            } else throw new Error();
        } catch {
            statusBox.textContent = translations[currentLang].server_err;
            statusBox.className = "alert alert-error";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = translations[currentLang].form_submit;
        }
    });
});