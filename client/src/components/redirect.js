export function redirectToRegister() {
    document.getElementById("register").addEventListener("click", function() {
        window.location.href="register.tsx";
    })
};
