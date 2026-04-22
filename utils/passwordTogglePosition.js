export function positionPasswordToggleButtons({ form, inputSelectors = [], rightOffset = 10 }) {
    if (!form || !inputSelectors.length) {
        return;
    }

    const formRect = form.getBoundingClientRect();
    const inputs = inputSelectors
        .map(selector => form.querySelector(selector))
        .filter(Boolean);
    const buttons = Array.from(form.querySelectorAll('.toggle-password-visibility-ext'));

    inputs.forEach((input, index) => {
        const toggleButton = buttons[index];

        if (!toggleButton) {
            return;
        }

        const inputRect = input.getBoundingClientRect();
        const buttonRect = toggleButton.getBoundingClientRect();
        const topPosition = inputRect.top - formRect.top + ((inputRect.height - buttonRect.height) / 2);

        toggleButton.style.top = `${topPosition}px`;
        toggleButton.style.right = `${rightOffset}px`;
        toggleButton.style.transform = 'none';
    });
}