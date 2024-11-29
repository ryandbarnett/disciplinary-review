/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Dashboard Page', () => {
    beforeAll(() => {
        // Load the dashboard.html file into the test environment
        const html = fs.readFileSync(
            path.resolve(__dirname, '../../public/html/dashboard.html'),
            'utf8'
        );
        document.documentElement.innerHTML = html;
    });

    it('Should have the correct title', () => {
        const title = document.title;
        expect(title).toBe('Dashboard');
    });

    it('Should display the header with the title and logout button', () => {
        const header = document.querySelector('header');
        const headerTitle = header.querySelector('h1');
        const logoutButton = header.querySelector('#logoutButton');

        expect(header).not.toBeNull();
        expect(headerTitle.textContent).toBe('Disciplinary Review Dashboard');
        expect(logoutButton).not.toBeNull();
        expect(logoutButton.textContent).toBe('Logout');
    });

    it('Should have admin tools section hidden by default', () => {
        const adminTools = document.getElementById('adminTools');
        expect(adminTools).not.toBeNull();
        expect(adminTools.style.display).toBe('none');
    });

    it('Should have user tools section hidden by default', () => {
        const userTools = document.getElementById('userTools');
        expect(userTools).not.toBeNull();
        expect(userTools.style.display).toBe('none');
    });

    it('Should include a button to create a new infraction in admin tools', () => {
        const createInfractionButton = document.getElementById('createInfraction');
        expect(createInfractionButton).not.toBeNull();
        expect(createInfractionButton.textContent).toBe('Create New Infraction');
    });

    it('Should include a container for infractions list in admin tools', () => {
        const infractionsList = document.getElementById('infractionsList');
        expect(infractionsList).not.toBeNull();
    });

    it('Should include a container for user-assigned infractions in user tools', () => {
        const userInfractions = document.getElementById('userInfractions');
        expect(userInfractions).not.toBeNull();
    });
});