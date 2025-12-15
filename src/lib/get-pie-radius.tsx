export function getPieRadius() {
    if (window.innerWidth < 768) {
        return 50;
    } else if (window.innerWidth < 1024) {
        return 70;
    } else if (window.innerWidth < 1280) {
        return 90;
    } else {
        return 100;
    }
}
