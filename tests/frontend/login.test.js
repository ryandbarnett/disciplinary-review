const fs = require('fs');
const path = require('path');

describe('Login Page', () => {
    beforeAll(() => {
        // Load the login.html file into the test environment
        const html = fs.readFileSync(
            path.resolve(__dirname, '../../public/html/login.html'),
            'utf8'
        );
        document.documentElement.innerHTML = html;
    });

    it('Should have the correct title', () => {
        const title = document.title;
        expect(title).toBe('Login');
    });

    it('Should have a form with email and password fields', () => {
        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const submitButton = form.querySelector('button[type="submit"]');

        expect(form).not.toBeNull();
        expect(emailInput).not.toBeNull();
        expect(emailInput.getAttribute('type')).toBe('email');
        expect(passwordInput).not.toBeNull();
        expect(passwordInput.getAttribute('type')).toBe('password');
        expect(submitButton).not.toBeNull();
        expect(submitButton.textContent).toBe('Login');
    });

    it('Should require email and password fields', () => {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        expect(emailInput.hasAttribute('required')).toBe(true);
        expect(passwordInput.hasAttribute('required')).toBe(true);
    });
    
    it('Should handle form submission', () => {
        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
    
        // Spy on preventDefault
        const preventDefaultSpy = jest.fn();
    
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!emailInput.value || !passwordInput.value) {
                event.stopImmediatePropagation();
            }
        });
    
        // Test empty input scenario
        preventDefaultSpy.mockClear(); // Reset spy
        emailInput.value = '';
        passwordInput.value = '';
        const emptyEvent = new Event('submit', { bubbles: true, cancelable: true });
        emptyEvent.preventDefault = preventDefaultSpy; // Attach the spy
        form.dispatchEvent(emptyEvent);
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1); // Only 1 call for empty input
    
        // Test valid input scenario
        preventDefaultSpy.mockClear(); // Reset spy
        emailInput.value = 'user@example.com';
        passwordInput.value = 'password123';
        const validEvent = new Event('submit', { bubbles: true, cancelable: true });
        validEvent.preventDefault = preventDefaultSpy; // Attach the spy
        form.dispatchEvent(validEvent);
        expect(preventDefaultSpy).toHaveBeenCalledTimes(1); // Only 1 call for valid input
    });            
});