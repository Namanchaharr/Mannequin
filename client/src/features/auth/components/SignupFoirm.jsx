import { useState } from "react";

function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);
}



export default function SignupForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    <form onSubmit={handleSubmit}>

    </form>
}