document.addEventListener("DOMContentLoaded", () => {
	const inscriptionForm = document.getElementById("inscription-form-element");
	const connexionForm = document.getElementById("connexion-form-element");
	const messageDiv = document.getElementById("message");

	inscriptionForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const nom = document.getElementById("nom").value;
		const email = document.getElementById("email").value;
		const role = document.getElementById("role").value;
		const motdepasse = document.getElementById("motdepasse").value;

		fetch("http://localhost:5002/api/auth/inscription", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ nom, email, role, motdepasse }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message) {
					messageDiv.textContent = data.message;
					messageDiv.style.color = "green";
				}
			})
			.catch((error) => {
				messageDiv.textContent = "Erreur lors de l'inscription.";
				messageDiv.style.color = "red";
			});
	});

	connexionForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const email = document.getElementById("connexion-email").value;
		const motdepasse = document.getElementById("connexion-motdepasse").value;

		fetch("http://localhost:5002/api/auth/connexion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, motdepasse }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.token) {
					messageDiv.textContent = "Connexion réussie !";
					messageDiv.style.color = "green";
					console.log("Token: ", data.token);

					localStorage.setItem("token", data.token);
				} else {
					messageDiv.textContent = "Erreur lors de la connexion.";
					messageDiv.style.color = "red";
				}
			})
			.catch((error) => {
				messageDiv.textContent = "Erreur lors de la connexion.";
				messageDiv.style.color = "red";
			});
	});
});
