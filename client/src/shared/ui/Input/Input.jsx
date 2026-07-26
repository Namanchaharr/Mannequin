import "./Input.css";

export default function Input({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange,
    error,
    className = "",
}) {
    return (
        <div className={`input-container ${className}`}>
            <div className="input-wrapper">
                <input
                    className="input"
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder || " "}                    value={value}
                    onChange={onChange}
                />

                <label className="input-label" htmlFor={name}>
                    {label}
                </label>
            </div>

            {error && (
                <p className="input-error">
                    {error}
                </p>
            )}


        </div>
    );
}