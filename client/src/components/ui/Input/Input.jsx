import "./Input.css";

export default function Input({
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    onChange,
    className = "",
}) {
    return (
        <div className="input-container">
            <label className="input-label" htmlFor={name}>
                {label}
            </label>

            <input
                className={`input ${className}`}
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}