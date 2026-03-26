
const btn = document.getElementById("btn");
const jokeBox = document.getElementById("joke");
const status = document.getElementById("status");

const esc = (s) => s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

async function getJoke() {
    btn.disabled = true;
    status.textContent = "Fetching";
    jokeBox.textContent = "Thinking of something good...";

    try {
    const res = await fetch("/joke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    });

    if (!res.ok) throw new Error("Request failed");

    const data = await res.json();
    if (!data || typeof data.joke !== "string") {
        throw new Error("Invalid payload");
    }

    jokeBox.innerHTML = esc(data.joke);
    status.textContent = "Fresh joke served";
    } catch {
    jokeBox.textContent = "Could not fetch a joke right now. Try again soon.";
    status.textContent = "Temporarily unavailable";
    } finally {
    btn.disabled = false;
    }
}

btn.addEventListener("click", getJoke);