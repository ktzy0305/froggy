const frog = document.getElementById('frog');
const stepSize = 120;

function getRandomDirection() {
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const rad = angle * (Math.PI / 180);
    return { x: Math.round(Math.cos(rad)), y: Math.round(Math.sin(rad)) };
}

function getRandomSteps() {
    return Math.floor(Math.random() * 3) + 1;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

frog.addEventListener('click', () => {
    const frogRect = frog.getBoundingClientRect();
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;
    const dir = getRandomDirection();
    const steps = getRandomSteps();
    let newLeft = frog.offsetLeft + dir.x * stepSize * steps;
    let newTop = frog.offsetTop + dir.y * stepSize * steps;
    newLeft = clamp(newLeft, 0, pageWidth - frog.offsetWidth);
    newTop = clamp(newTop, 0, pageHeight - frog.offsetHeight);
    frog.style.left = newLeft + 'px';
    frog.style.top = newTop + 'px';
    frog.style.zIndex = 9999;
});