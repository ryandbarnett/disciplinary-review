/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Index Page', () => {
    beforeAll(() => {
        // Simulate your current index.html structure
        const html = fs.readFileSync(
            path.resolve(__dirname, '../../public/index.html'),
            'utf8'
        );
        document.documentElement.innerHTML = html;
    });

    it('Should display the correct page title', () => {
        const title = document.title;
        expect(title).toBe('Home');
    });

    it('Should have a welcoming message', () => {
        const heading = document.querySelector('h1');
        expect(heading.textContent).toBe('Welcome to the Disciplinary Review App');
    });

    it('Should include a login link pointing to the correct location', () => {
        const loginLink = document.querySelector('a[href="html/login.html"]');
        expect(loginLink).not.toBeNull();
        expect(loginLink.textContent).toBe('Login');
    });
});
