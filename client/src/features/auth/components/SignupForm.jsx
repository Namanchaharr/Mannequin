import { useState } from "react";

import { Input, Button } from "@/shared/ui";
import validateSignup from "@/features/auth/utils/validateSignup";


export default function SignupForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});



    //bascailly taking the values from form and then sending it to input
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));


        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));        
    }

    function handleSubmit(event) {
        event.preventDefault();

        //getting errors 
        const validationErrors = validateSignup(formData);


        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        //setting errors to zero if there are no errors
        setErrors({});

        console.log(formData);
    }


   return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                // ===== CHANGED =====
                error={errors.username}
            />

            <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                // ===== CHANGED =====
                error={errors.email}
            />

            <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                // ===== CHANGED =====
                error={errors.password}
            />

            <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                // ===== CHANGED =====
                error={errors.confirmPassword}
            />

            <Button type="submit">
                Sign Up
            </Button>
        </form>
    );
}